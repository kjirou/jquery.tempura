;(function($){

if ($.fn.tempura !== undefined) return;


var Tempura = {

  VERSION: "0.9.3",

  // Use "config" API if you want to overwrite them.
  _config: {

    // A HTML attribute name for data binding.
    // e.g. <div data-bind="yourDataKey"></div>
    bindingKey: "data-bind",

    // A on/off flag for throwing a error
    //   when you have a misuse probably.
    quiet: true
  },

  _apis: {},
  _filters: {}
};


//
// Inner functions
//

Tempura._isJQuery = function(obj){
  return obj instanceof $ && obj.jquery !== undefined;
};

/*
 * e.g.
 *
 *   <div>
 *    <p data-bind="foo"></p>
 *    <div data-bind="bar"></div>
 *   </div>
 *
 *   -> {foo:$p, bar:$div}
 */
Tempura._createBindedNodesMap = function($container, bindingKey){
  var bindedNodes = $container.find("[" + bindingKey + "]");
  var bindedNodesMap = {};
  $.each(bindedNodes, function(i, node){
    var $node = $(node);
    var attrValue = $node.attr(bindingKey);
    if (attrValue !== undefined && attrValue !== false) {
      bindedNodesMap[attrValue] = $node;
    }
  });
  return bindedNodesMap;
};

/*
 * e.g.
 *
 *   dict={
 *     css: { fontSize:12, textAlign:"center" },
 *     attr: ["href", "/foo"],
 *     addClass: "your-link"
 *   }
 *  -> $el.css({ fontSize:12, textAlign:"center" })
 *       .attr("href", "/foo")
 *       .addClass("your-link");
 *
 * Notice: Excecution order is not guaranteed.
 */
Tempura._controlJQueryObjectByDict = function($el, dict){
  $.each(dict, function(methodName, params){
    if (methodName in $el === false) {
      if ($el.tempura._config.quiet) {
        return true;
      } else {
        throw new Error("jQuery object dosen't have the method=" + methodName);
      }
    }

    if ($.isArray(params) === false) {
      params = [params];
    }

    $el[methodName].apply($el, params);
  });
};


//
// APIs
//
// These are able to call like this:
//
//   $jqObj.tempura("api_name", apiArg1, apiArg2, ..)
//

/*
 * Render binded nodes by dictionary data
 *
 * e.g.
 *   $('<h1 data-bind="foo"></h1><p data-bind="bar"></p>')
 *     .tempura("render", { foo:"Title", bar:"Text" })
 */
Tempura._apis.render = function(data){
  var $that = this;
  var bindedNodesMap =
    Tempura._createBindedNodesMap(this, this.tempura._config.bindingKey);

  $.each(data, function(dataKey, dataValue){
    var $node = bindedNodesMap[dataKey];

    // If superfluous data existed
    if ($node === undefined) {
      // Ignore in default
      if ($that.tempura._config.quiet) {
        return true;
      } else {
        throw new Error("Superfluous data existed");
      }
    }

    if ($.isFunction(dataValue)) {
      dataValue = dataValue.call(
        $node,
        {
          "$node": $node,
          "$container": $that
        },
        $that.tempura._filters
      );
    }

    // Change action by type of value

    // jQuery object
    if (Tempura._isJQuery(dataValue)) {
      $node.empty().append(dataValue);
    // True
    } else if (dataValue === true) {
      $node.show();
    // False
    } else if (dataValue === false) {
      $node.hide();
    // Undefined, Null
    } else if (dataValue === undefined || dataValue === null) {
      /* Pass processing, silence is gold */
    // Function
    } else if ($.isFunction(dataValue)) {
      throw new Error("Not implemented");
    // Array
    } else if ($.isArray(dataValue)) {
      throw new Error("Not implemented");
    // Plain object
    } else if ($.isPlainObject(dataValue)) {
      Tempura._controlJQueryObjectByDict($node, dataValue);
    // String, Number, and so on
    } else {
      $node.text(dataValue);
    }
  });
};

/*
 * Register a custom filter that is usable in function values
 *
 * e.g.
 *   $().tempura("filter", "lower",
 *     function(str){ return str.toLowercase(); })
 */
Tempura._apis.filter = function(filterName, filterFunc){
  this.tempura._filters[filterName] = filterFunc;
};

/*
 * Change configs
 *
 * e.g.
 *   $().tempura("config", { bindingKey:"data-value" })
 */
Tempura._apis.config = function(configs){
  $.extend(this.tempura._config, configs);
};


//
// Filter presets
//
// These are able to call in function value like this:
//
//   $jqObj.tempura({
//     amount: function(misc, filters){
//       return filters.formatNumber(100000);
//     }
//   });
//

/* e.g. '1234567.89' -> '1,234,567.89' */
Tempura._filters.formatNumber = function(numOrNumStr){
    var numStr = numOrNumStr + '';
    while (true) {
      var replaced = numStr.replace(/(\d)(\d{3})(,|\.|$)/, '$1,$2$3');
      if (numStr === replaced) return numStr;
      numStr = replaced;
    }
};


/*
 * Typical uses:
 *
 *   $jqObj.tempura({ foo:"FOO", bar:"BAR" })
 *   $().tempura("config", { bindingKey:"data-your-custom-key" })
 *
 * Please look each API comment for details.
 */
$.fn.tempura = function(){

  var args = Array.prototype.slice.call(arguments);
  var apiName = args[0];

  // Basic pattern is `(apiName, apiArgs...)`.
  // But if you omit the first `apiName` argument,
  //   then it changes meaning to `(apiArgs...)`.
  var api, apiArgs;
  if ($.type(apiName) === "string") {
    api = Tempura._apis[apiName];
    apiArgs = args.slice(1);
  } else {
    api = Tempura._apis.render;
    apiArgs = args;
  }

  if (api === undefined) {
    throw new Error("Not defined API=" + apiName);
  }

  api.apply(this, apiArgs);

  return this;
};

$.extend($.fn.tempura, Tempura);


})(jQuery);
