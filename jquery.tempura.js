;(function($){

if ($.fn.tempura !== undefined) return;


var Tempura = {
  VERSION: "0.0.1",
  bindingKey: "data-bind",
  _filters: {},
  _apis: {}//,
};


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
 * Render binded nodes by dictionary data
 *
 * e.g.
 *
 *  this=$('<h1 data-bind="foo"></h1><p data-bind="bar"></p>')
 *  data={ foo:"Title", bar:"Text" }
 *  -> $('<h1 data-bind="foo">Title</h1><p data-bind="bar">Text</p>')
 */
Tempura._apis.render = function(data){
  var $that = this;
  var bindedNodesMap =
    Tempura._createBindedNodesMap(this, this.tempura.bindingKey);

  $.each(data, function(dataKey, dataValue){
    var $node = bindedNodesMap[dataKey];
    if ($node === undefined) return true;

    if ($.isFunction(dataValue)) {
      dataValue = dataValue(
        { node: $node, container: $that },
        $that.tempura._filters
      );
    }

    // jQuery object
    if (Tempura._isJQuery(dataValue)) {
      $node.empty().append(dataValue);
    // true
    } else if (dataValue === true) {
      $node.show();
    // false
    } else if (dataValue === false) {
      $node.hide();
    // undefined, null
    } else if (dataValue === undefined || dataValue === null) {
      // pass
    // Others
    } else {
      $node.text(dataValue);
    }
  });
};

/* Register a filter */
Tempura._apis.filter = function(filterName, filterFunc){
  this.tempura._filters[filterName] = filterFunc;
};


/* e.g. '1234567.89' -> '1,234,567.89' */
Tempura._filters.formatNumber = function(numOrNumStr){
    var numStr = numOrNumStr + '';
    while (true) {
      var replaced = numStr.replace(/(\d)(\d{3})(,|\.|$)/, '$1,$2$3');
      if (numStr === replaced) return numStr;
      numStr = replaced;
    }
};


$.fn.tempura = function(){

  var args = Array.prototype.slice.call(arguments);
  var apiName = args[0];
  // Basic pattern is `(apiName, apiArgs...)`.
  // But if you omit the first argument `apiName`,
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
    throw new Error("Not defined api-name=" + apiName);
  }

  return api.apply(this, apiArgs);
};

$.extend($.fn.tempura, Tempura);


})(jQuery);
