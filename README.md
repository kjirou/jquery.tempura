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
