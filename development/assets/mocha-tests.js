;(function(){


describe("$().tempura Properties", function(){
  it("Plugin definition", function(){
    expect($().tempura).to.be.a("function");
  });

  it("VERSION", function(){
    expect($().tempura.VERSION).to.match(/^\d+\.\d+.\d+(?:\.\d+)?$/);
  });
});


describe("Inner Functions", function(){
  var tempura = $().tempura;

  it("_isJQuery", function(){
    expect(tempura._isJQuery($("div"))).to.ok();
    expect(tempura._isJQuery({})).not.to.ok();
  });

  it("_createBindedNodesMap", function(){
    var html = '<div><p data-bind="foo">FOO</p><p></p><p data-bind="bar">BAR</p><p></p><p data-notbinding="baz"></p></div>';
    var $container = $(html);
    var map = tempura._createBindedNodesMap($container, tempura._config.bindingKey);
    expect(map.foo).to.be.a("object");
    expect(map.foo.text()).to.be("FOO");
    expect(map.bar).to.be.a("object");
    expect(map.bar.text()).to.be("BAR");
    expect(map.baz).to.be(undefined);
  });
});


describe("APIs", function(){

  // Helpers
  var createDocument = function(){
    var html = '';
    html += '<div>';
    html +=   '<h1 data-bind="title">Default Title</h1>';
    html +=   '<p>Hello, ';
    html +=     'Hello, <span id="guest_name" data-bind="isGuest">Guest</span>';
    html +=     '<span id="user_name" data-bind="isUser" style="display:none;">Taro</span>';
    html +=   '</p>';
    html +=   '<div id="contents" data-bind="contents">Default contents</div>';
    html +=   '<a data-bind="link" href="#">Link</a>';
    html += '</div>';
    return $(html);
  };

  var defaultConfig = $.extend({}, $().tempura._config);
  var resetConfig = function(){
    $().tempura("config", defaultConfig);
  };

  var defaultFilters = $.extend({}, $().tempura._filters);
  var resetFilters = function(){
    $().tempura._filters = $.extend({}, defaultFilters);
  };


  describe("API Common", function(){

    it("Throw a error when it is assigned not-existed API", function(){
      expect(function(){
        $().tempura("notexistedapi");
      }).throwException(/^Not .+notexistedapi/);
    });

    it("Method Chain", function(){
      expect(createDocument().tempura({})).to.be.a($);
    });

  });


  describe("\"render\" and \"config\" APIs", function(){

    afterEach(function(){
      $("#sandbox").empty();
      resetConfig();
    });

    it("Render text", function(){
      var $doc = createDocument();
      $doc.tempura("render", {
        "title": "Title"
      });

      expect($doc.find("h1").text()).to.be("Title");

      // Not changed if data is not assigned
      expect($doc.find("#contents").text()).to.be("Default contents");

      // Set multi data
      $doc.tempura("render", {
        "title": "Title2",
        "contents": 9999
      });
      expect($doc.find("h1").text()).to.be("Title2");
      expect($doc.find("#contents").text()).to.be("9999");  // Number is to text
    });

    it("Render value by function", function(){
      var $doc = createDocument();
      $doc.tempura("render", {
        "title": function(){ return "Welcome"; }
      });
      expect($doc.find("h1").text()).to.be("Welcome");
    });

    it("Function value is binded to $node", function(){
      var $doc = createDocument();
      $doc.tempura("render", {
        "title": function(){ return this.text().toLowerCase(); }
      });
      expect($doc.find("h1").text()).to.be("default title");
    });

    it("Function value is passed misc infos at evaluation", function(){
      var $doc = createDocument();
      $doc.tempura("render", {
        "title": function(misc){
          expect(misc.$node).to.be(this);
          expect(misc.$container).to.be($doc);
        }
      });
    });

    it("Render by jQuery object", function(){
      var $doc = createDocument();
      $doc.tempura("render", {
        "title": $('<strong>Strong Title</strong>')
      });
      expect($doc.find("h1 strong").text()).to.be("Strong Title");

      // Is empty before value?
      $doc.tempura("render", {
        "title": $('<b>Strong Title</b>')
      });
      expect($doc.find("h1 strong").length).to.be(0);
    });

    it("Render by jQuery query set", function(){
      var $doc = createDocument();
      $doc.tempura("render", {
        "contents": $('<p>A</p><p>B</p><p>C</p>').filter('*')
      });
      expect($doc.find("div").html()).to.be("<p>A</p><p>B</p><p>C</p>");
    });

    it("Render by Array", function(){
      var $doc = createDocument();
      $doc.tempura("render", {
        "contents": [
          $('<p>').text('AA'),
          $('<p>').text('BB'),
          $('<p>').text('CC')
        ]
      });
      expect($doc.find("div").html()).to.be("<p>AA</p><p>BB</p><p>CC</p>");

      // Working empty()?
      $doc.tempura("render", {
        "contents": [
          $('<p>').text('DD')
        ]
      });
      expect($doc.find("div").html()).to.be("<p>DD</p>");
    });

    it("Show node if value is true", function(){
      var $doc = createDocument();
      $("#sandbox").append($doc);  // For visible count
      expect($doc.find("p span:visible").length).to.be(1);
      $doc.tempura("render", {
        "isUser": true
      });
      expect($doc.find("p span:visible").length).to.be(2);
    });

    it("Hide node if value is false", function(){
      var $doc = createDocument();
      $("#sandbox").append($doc);
      $doc.tempura("render", {
        "isGuest": false
      });
      expect($doc.find("p span:visible").length).to.be(0);
    });

    it("No process if value is undefined or null", function(){
      var $doc = createDocument();
      $("#sandbox").append($doc);
      $doc.tempura("render", {
        "title": undefined,
        "contents": null
      });
      expect($doc.find("h1").text()).to.be("Default Title");
      expect($doc.find("#contents").text()).to.be("Default contents");
    });

    it("Control the $node directly if value is plain object", function(){
      var $doc = createDocument();
      $doc.tempura("render", {
        link: {
          // Notice: If you set `color:"red"` as test case,
          //           then Firefox just only returns "rgb(255, 0, 0)".
          css: { fontSize:12, width:200 },
          attr: ["href", "/foo"],
          addClass: "your-link"
        }
      });
      expect($doc.find("a").css("fontSize")).to.be("12px");
      expect($doc.find("a").width()).to.be(200);
      expect($doc.find("a").attr("href")).to.be("/foo");
      expect($doc.find("a").hasClass("your-link")).to.ok();
    });

    it("Throw errors if you set not implemented value types", function(){
      var $doc = createDocument();
      // Function
      expect(function(){
        $doc.tempura("render", {
          "title": function(){ return function(){}; }
        });
      }).to.throwException(/^Function/);
    });

    it("`tempura(\"render\", {})` is aliased to `tempura({})`", function(){
      var $doc = createDocument();
      $doc.tempura({
        "title": "Title"
      });
      expect($doc.find("h1").text()).to.be("Title");
    });

    it("Change `bindingKey` config", function(){
      $().tempura("config", { bindingKey:"data-my-value" });

      var $doc = createDocument();
      $doc.tempura({ title: "Title" });
      expect($doc.find("h1").text()).not.to.be("Title");

      $doc.find("h1").attr("data-my-value", "title");
      $doc.tempura({ title: "Title2" });
      expect($doc.find("h1").text()).to.be("Title2");
    });

    it("Change `quiet` config", function(){
      var $doc = createDocument();
      // Not throw a error
      $doc.tempura({ notExisted: "NotExisted" });
      $doc.tempura({ title: { notExisted:"" } });

      $().tempura("config", { quiet:false });
      // Throw errors
      expect(function(){
        $doc.tempura({ notExisted: "NotExisted" });
      }).throwException(/^Superfluous /);
      expect(function(){
        $doc.tempura({ title: { notExisted:"" } });
      }).throwException(/notExisted/);
    });

  });


  describe("Special Binding Values", function(){

    it("\":ignored\"", function(){
      var h = '';
      h += '<div>';
      h +=   '<b data-bind="foo" id="foo">1</b>';
      h +=   '<div data-bind=":ignored" id="ignored">';
      h +=     '<b data-bind="bar" id="bar">2</b>';
      h +=     '<div data-bind=":ignored" id="ignored2">';
      h +=       '<b data-bind="baz" id="baz">3</b>';
      h +=     '</div>';
      h +=   '</div>';
      h += '</div>';
      var $doc = $(h);

      // Don't update under #ignored
      $doc.tempura({
        "foo": "123",
        "bar": "456",
        "baz": "789"
      });
      expect($doc.find("#foo").text()).to.be("123");
      expect($doc.find("#bar").text()).to.be("2");
      expect($doc.find("#baz").text()).to.be("3");

      // Don't update under #ignored2
      $doc.find("#ignored").tempura({
        "foo": "123",
        "bar": "456",
        "baz": "789"
      });
      expect($doc.find("#foo").text()).to.be("123");
      expect($doc.find("#bar").text()).to.be("456");
      expect($doc.find("#baz").text()).to.be("3");

      // Delete ignore settings
      $doc.find("#ignored").removeAttr("data-bind");
      $doc.find("#ignored2").removeAttr("data-bind");
      $doc.tempura({
        "foo": "abc",
        "bar": "def",
        "baz": "ghi"
      });
      expect($doc.find("#foo").text()).to.be("abc");
      expect($doc.find("#bar").text()).to.be("def");
      expect($doc.find("#baz").text()).to.be("ghi");
    });

  });


  describe("\"filter\" API", function(){

    afterEach(function(){
      resetFilters();
    });

    it("Use in function value / formatNumber", function(){
      var $doc = createDocument();
      $doc.tempura({
        contents: function(misc, filters){
          return filters.formatNumber(1234567.89);
        }
      });
      expect($doc.find("#contents").text()).to.be("1,234,567.89");
    });

    it("Register a custom filter", function(){
      $().tempura("filter", "myUpper", function(str){
        return str.toUpperCase();
      });

      var $doc = createDocument();
      $doc.tempura({
        title: function(misc, filters){
          return filters.myUpper(this.text());
        }
      });
      expect($doc.find("h1").text()).to.be("DEFAULT TITLE");
    });

  });


});


}());
