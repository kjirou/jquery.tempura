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
    html += '</div>';
    return $(html);
  };

  var defaultConfig = $.extend({}, $().tempura._config);
  var resetConfig = function(){
    $().tempura("config", defaultConfig);
  };


  describe("API Common", function(){

    it("Throw a error when it is assigned not-existed API", function(){
      expect(function(){
        $().tempura("notexistedapi");
      }).throwException(/^Not .+notexistedapi/);
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

    it("Render jQuery object value", function(){
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

    it("`tempura(\"render\", {})` is aliased to `tempura({})`", function(){
      var $doc = createDocument();
      $doc.tempura({
        "title": "Title"
      });
      expect($doc.find("h1").text()).to.be("Title");
    });

    it("Change `bindingKey` config", function(){
      $().tempura("config", { bindingKey:"data-my-value" })

      var $doc = createDocument();
      $doc.tempura({ title: "Title" });
      expect($doc.find("h1").text()).not.to.be("Title");

      $doc.find("h1").attr("data-my-value", "title")
      $doc.tempura({ title: "Title2" });
      expect($doc.find("h1").text()).to.be("Title2");
    });

    it("Change `quiet` config", function(){
      var $doc = createDocument();
      // Not throw a error
      $doc.tempura({ notExisted: "NotExisted" });

      $().tempura("config", { quiet:false });
      // Throw a error
      expect(function(){
        $doc.tempura({ notExisted: "NotExisted" });
      }).throwException(/^Superfluous /);
    });

  });

});


}());
