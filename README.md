jQuery Tempura [![Build Status](https://travis-ci.org/kjirou/jquery.tempura.png)](https://travis-ci.org/kjirou/jquery.tempura)
==============

A jQuery plugin for templating static HTML.  
It thinks important the templating that is utilizing the characteristic of the HTML material.

In the same way you would make a delicious :fried_shrimp: Tempura :fried_shrimp:


## Features

- Can use with keeping original HTML
  - It also means to be able to use something together with other templating engines.
- Can overwrite only a necessary part of the whole
  - Not destroy event handlers.
  - It's high speed compared with to overwrite template wholly in many cases.
- Easy to use
  - Can write easily processing that is used commonly.
  - .. but, I am giving up it in complex case. In this case, you must write by using raw jQuery.


## Download

- [Stable production version](https://raw.github.com/kjirou/jquery.tempura/master/jquery.tempura.min.js)
- [Stable development version](https://raw.github.com/kjirou/jquery.tempura/master/jquery.tempura.js)
- [Old releases](https://github.com/kjirou/jquery.tempura/releases)

Or, if you can use `bower`:
```
$ bower install jquery.tempura
```


## Supported browsers

- `IE10`, `IE9`, `IE8`, `IE7`
- `Chrome`
- `Firefox`
- `Safari`
- `Mobile Safari`
- `PhantomJS`


## Supported jQuery versions

- `1.10.2`
- `1.9.1`
- `1.8.3`
- `2.0.3`


## License

[MIT License](http://opensource.org/licenses/mit-license.php)


## Installation

```
<script src="path/to/jquery.js"></script>
<script src="path/to/jquery.tempura.js"></script>
```


## Examples

### 1. Basic rendering

Before:
```
<div class="welcome-page">
  <h1 data-bind="title">Title</h1>
  <p data-bind="contents">Contents</p>
  <p data-bind="footer">Footer</p>
</div>

<script>
$(".welcome-page").tempura({
  title: "Changed Title",
  contents: "Changed contents"
});
</script>
```

After:
```
<div class="welcome-page">
  <h1 data-bind="title">Changed Title</h1>
  <p data-bind="contents">Changed contents</p>
  <p data-bind="footer">Footer</p>
</div>
```

- The setting `data-bind="dataKey"` node is rendered by `$(selector).tempura({ dataKey:".." })`.
- `string` or `number` values changes node by `$node.text(value)`.
- If you don't assign data to binded node, then the node is not effected.

### 2. Change visiblity

Before:
```
<div class="welcome-page">
  <h1 data-bind="title">Title</h1>
  <p data-bind="contents">Contents</p>
</div>

<script>
$(".welcome-page").tempura({
  contents: false
});
</script>
```

After:
```
<div class="welcome-page">
  <h1 data-bind="title">Title</h1>
  <p data-bind="contents" style="display:none;">Contents</p>
</div>
```

- `true` means `$node.show()`, `false` means `$node.hide()`.

### 3. Change node as a jQuery object

Before:
```
<div class="login-page">
  <a data-bind="loginLink" href="#">Logged in</a>
</div>

<script>
$(".login-page").tempura({
  loginLink: {
    css: { fontSize:12, textAlign:"center" },
    attr: ["href", "/login"],
    addClass: "link-style",
    text: "Logged in, hurry!"
  }
});
</script>
```

After:
```
<div class="login-page">
  <a data-bind="login-link" href="/login"
    style="font-size:12px; text-align:center;"
    class="link-style">Logged in, hurry!</a>
</div>
```

- A `{}`(Plain Object) changes the node as a jQeury object.
- The format is `{ methodName: args, methodName2: args2, .. }`.
  - The args besides `Array` is passed to method as a single arg.
  - If args is `Array`, then they are passed to method as plural args.

### 4. Render HTML

Before:
```
<div class="some-page">
  <div data-bind="parent"><p>Child</p></div>
</div>

<script>
$(".some-page").tempura({
  parent: $('<p>').text("New child")
});
</script>
```

After:
```
<div class="some-page">
  <div data-bind="parent"><p>New child</p></div>
</div>
```

- `$jQueryObject` replaces child nodes.
  - It works to equal `$node.empty().append($jQueryObject)`.
- To be exact, there is no way to write the HTML.

### 5. Append nodes

Before:
```
<div class="some-page">
  <div data-bind="byJQuery"></div>
  <div data-bind="byArray"></div>
</div>

<script>
$(".some-page").tempura({
  byJQuery: $('<p>1</p><p>2</p>').filter('*'),
  byArray: [
    $('<p>').text("A"),
    $('<p>').text("B")
  ]
});
</script>
```

After:
```
<div class="some-page">
  <div data-bind="byJQuery"><p>A</p><p>B</p></div>
  <div data-bind="byArray"><p>1</p><p>2</p></div>
</div>
```

- `$jQueryQuerySet` replaces child nodes the same as the rendering HTML.
  - The "QuerySet" is jQuery object to be return by `$el.find()`, `$el.filter()` and so on.
  - Ref) [jQuery API Documentation - Traversing](http://api.jquery.com/category/traversing/)
- Also `Array` is parsed like it.

### 6. Dynamic evaluation

Before:
```
<div class="some-page">
  <span data-bind="timer"></span>
</div>

<script>
$(".some-page").tempura({
  timer: function(){
    return new Date();
  }
});
</script>
```

After:
```
<div class="some-page">
  <span data-bind="timer">Fri Aug 02 2013 21:55:40 GMT+0900 (JST)</span>
</div>
```

- `Function` is evaluated every rendering.
- `this` in the function is binded to `$node`.


### 7. Not rendering

Before:
```
<div class="some-page">
  <span data-bind="greeting">Hello, guest!</span>
</div>

<script>
$(".some-page").tempura({
  greeting: function(){
    if (!isLoggedIn) return;
    return "Hello, member!";
  }
});
</script>
```

- `undefined` or `null` are passing through the rendering.

### 8. Complex cases

Before:
```
<div class="some-page">
  <ul data-bind="members"></ul>
</div>

<script>
var members = [
  { id: 1, name: "Taro" },
  { id: 2, name: "Jiro" },
  { id: 3, name: "Saburo" }
];
$(".some-page").tempura({
  members: function(){
    if (members.length === 0) return false;

    this.empty();
    $that = this;
    $.each(members, function(i, member){
      $that.append(
        $('<li>').text(member.name + ":" + member.id);
      );
    });
  }
});
</script>
```

After:
```
<div class="some-page">
  <ul data-bind="members">
    <li>Taro:1</li>
    <li>Jiro:2</li>
    <li>Saburo:3</li>
  </ul>
</div>
```

- Sorry, this is a weak case :persevere:
- How the custom filter might help you.

### 9. `:ignored` built-in value

```
<div class="layout">
  <span data-bind="foo">1</span>
  <div class="partial" data-bind=":ignored">
    <span data-bind="bar">2</span>
  </div>
</div>

<script>
$(".layout").tempura({
  foo: 11,  // Update
  bar: 22   // Not update
});
$(".partial").tempura({
  bar: 22 // Update
});
</script>
```

- `:ignored` protects childrens from unwanted update by outside.

### 10. Register a custom filter

Before:
```
<script>
$().tempura("filter", "lower", function(str){
  return str.toLowerCase();
});
</script>

<div class="some-page">
  <h1 data-bind="title">TITLE</h1>
</div>

<script>
$(".some-page").tempura({
  title: function(misc, filters){
    return filters.lower(this.text());
  }
});
</script>
```

After:
```
<div class="some-page">
  <h1 data-bind="title">title</h1>
</div>
```

- There are already some built-in filters.
- By the way, the `misc` variable contains some informations too.

### 11. Change configrations

```
$().tempura("config", {
  bindingKey: "data-value",
  quiet: false
});
```

- `bindingKey` (default=`"data-bind"`): A HTML attribute name for data binding.
- `quiet` (default=`true`): A on/off flag for throwing a error when you have a misuse probably.


## Development

### Dependencies

- `node.js` >= `0.11.0`, e.g. `brew install node`
- `PhantomJS`, e.g. `brew install phantomjs`

```
$ npm install -g grunt-cli testem
```

### Deploy

```
$ git clone git@github.com:kjirou/jquery.tempura.git
$ cd jquery.tempura
$ npm install
```

### Util commands

- `grunt jshint` validates codes by JSHint.
- `grunt release` generates JavaScript files for release.

### Testing

- Open [development/index.html](development/index.html)
- Or, execute `testem` or `testem server`, after that, open [http://localhost:7357/](http://localhost:7357/)
- `grunt test` is CI test by PhantomJS only.
- `grunt testem:xb` is CI test by PhantomJS, Chrome, Firefox and Safari.
- `grunt testall` executes XB test for each all supported jQuery versions.


## Related Links

- [The jQuery Plugin Registry - jQuery Tempura](http://plugins.jquery.com/tempura/)
- [日本語紹介記事](http://blog.kjirou.net/p/3505)
