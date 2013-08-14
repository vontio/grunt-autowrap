# grunt-autowrap

> grunt task plugin auto wrap and exports for js or coffee

## usage
### js example

```js
//A.js
function A1()
{
  //this is A
}
var A2 = function()
{

};
var _notExport = function()
{

};
//B.js
function B()
{
  //this is B
}
//output.js
(function(exports){
function A1()
{
  //this is A
}
var A2 = function()
{

};
var _notExport = function()
{

};
function B()
{
  //this is B
}
exports.A2=A2;
exports.A1=A1;
exports.B=B;
})(exports);
```

### coffee example

```coffee
# C.coffee
class C1
  constructor: () ->
    console.log 'This is C1'
  sayHello:()->
    console.log 'Hello from C1'

class C2 extends C1
  constructor: () ->
    console.log 'This is C2'
  sayHello:()->
    console.log 'Hello from C2'
# D.coffee
class D
  constructor: () ->
    console.log 'This is D'
```


```js
// output.js
(function(exports){
var C1, C2, D,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

C1 = (function() {
  function C1() {
    console.log('This is C1');
  }

  C1.prototype.sayHello = function() {
    return console.log('Hello from C1');
  };

  return C1;

})();

C2 = (function(_super) {
  __extends(C2, _super);

  function C2() {
    console.log('This is C2');
  }

  C2.prototype.sayHello = function() {
    return console.log('Hello from C2');
  };

  return C2;

})(C1);

D = (function() {
  function D() {
    console.log('This is D');
  }

  return D;

})();
exports.C1=C1;
exports.C2=C2;
exports.D=D;
})(exports);
```
## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-autowrap --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-autowrap');
```

## The "autowrap" task

### Overview
In your project's Gruntfile, add a section named `autowrap` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  autowrap: {
      testJs:{
        options: {
          ext: 'js',
        },
        files: {
          'tmp/testJs.js': ['test/fixtures/A.js', 'test/fixtures/B.js'],
        },
      },
      testCoffee:{
        options: {
          ext: 'coffee',
        },
        files: {
          'tmp/testCoffee.js': ['test/fixtures/*.coffee'],
        },
      },
    },
})
```

### Options

#### options.exports
Type: `boolean`
Default value: `true`

exports symbol.

#### options.exportsType
Type: `String`
Default value: `all`

- `var` exports variable in global scope
- `function` exports function in global scope
- `all` exports variable and function in global scope
- `filename` exports by filename

#### options.ignoreStartsWith_
Type: `boolean`
Default value: `true`

do not export name starts with _

#### options.join
Type: `boolean`
Default value: `true`

concatenate files before processing.

#### options.wrap
Type: `boolean`
Default value: `true`

add a wrapper function.

#### options.ext
Type: `String`
Default value: `js`

- `js`      treat as javascript
- `coffee`  compile as coffeescript

#### options.coffee
Type: `object`
Default value: `{}`

params passed to coffee compiler

#### options.separator
Type: `String`
Default value: `"\n"`

separator used to join files.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
- 0.2.0
exports by parse source code
- 0.1.0
exports based on filename
