'use strict';

var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.autowrap = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },
  testJs: function(test) {
    test.expect(1);

    test.doesNotThrow(function(){
      var lib = require('../tmp/testJs.js');
      var a1 = new lib.A1();
      var a2 = new lib.A2();
      var b = new lib.B();
    });

    test.done();
  },
  testCoffee: function(test) {
    test.expect(1);

    test.doesNotThrow(function(){
      var lib = require('../tmp/testCoffee.js');
      var c1 = new lib.C1();
      c1.sayHello();
      var c2 = new lib.C2();
      c2.sayHello();
      var d = new lib.D();
    });
    test.done();
  },
};
