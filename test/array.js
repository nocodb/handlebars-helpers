'use strict';

require('mocha');
var assert = require('assert');
var hbs = require('handlebars').create();
var helpers = require('../dist');

// Register array helpers
for (var name in helpers.array) {
  hbs.registerHelper(name, helpers.array[name]);
}

// Register some string helpers needed for tests
for (var name in helpers.string) {
  if (['split', 'reverse', 'stringify'].includes(name)) {
    hbs.registerHelper(name, helpers.string[name]);
  }
}

var context = {array: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'], duplicate: [ 'a', 'b', 'b', 'c', 'd', 'b', 'f', 'a', 'g']};

describe('array', function() {
  describe('after', function() {
    it('should return an empty string when undefined', function() {
      assert.equal(hbs.compile('{{after}}')(), '');
    });

    it('should return all of the items in an array after the given index', function() {
      var fn = hbs.compile('{{after array 5}}');
      assert.equal(fn(context), 'f,g,h');
    });

    it('should return all of the items in an array after the specified count', function() {
      var fn = hbs.compile('{{after array 5}}');
      assert.equal(fn(context), 'f,g,h');
    });
  });

  describe('arrayify', function() {
    it('should arrayify a value', function() {
      assert.equal(hbs.compile('{{#each (arrayify .)}}{{.}}{{/each}}')('foo'), 'foo');
      assert.equal(hbs.compile('{{#each (arrayify .)}}{{.}}{{/each}}')(['foo']), 'foo');
    });
  });

  describe('before', function() {
    it('should return an empty string when undefined', function() {
      assert.equal(hbs.compile('{{before}}')(), '');
    });
    it('should return all of the items in an array before the given index', function() {
      var fn = hbs.compile('{{before array 5}}');
      assert.equal(fn(context), 'a,b,c');
    });

    it('should return all of the items in an array before the specified count', function() {
      var fn = hbs.compile('{{before array 5}}');
      assert.equal(fn(context), 'a,b,c');
    });
  });

  describe('each', function() {
    it('should use the key and value of each property in an object inside a block', function() {
      var fn = hbs.compile('{{#each obj}}{{@key}}: {{this}} {{/each}}');
      assert.equal(fn({obj: {fry: 3, bender: 120 }}), 'fry: 3 bender: 120 ');
    });
  });

  describe('eachIndex', function() {
    it('should render the block using the array and each item\'s index', function() {
      var fn = hbs.compile('{{#eachIndex array}} {{item}} is {{index}} {{/eachIndex}}');
      assert.equal(fn(context), ' a is 0  b is 1  c is 2  d is 3  e is 4  f is 5  g is 6  h is 7 ');
    });
  });

  describe('first', function() {
    it('should return the first item in a collection', function() {
      var fn = hbs.compile('{{first foo}}');
      assert.equal(fn({foo: ['a', 'b', 'c']}), 'a');
    });

    it('should return an array with the first two items in a collection', function() {
      var fn = hbs.compile('{{first foo 2}}');
      assert.equal(fn({foo: ['a', 'b', 'c']}), 'a,b');
    });

    it('should return an empty string when undefined', function() {
      assert.equal(hbs.compile('{{first}}')(), '');
    });

    it('should return the first item in an array', function() {
      var fn = hbs.compile('{{first foo}}');
      assert.equal(fn({foo: ['a', 'b', 'c']}), 'a');
    });

    it('should return an array with the first two items in an array', function() {
      var fn = hbs.compile('{{first foo 2}}');
      assert.equal(fn({foo: ['a', 'b', 'c']}), 'a,b');
    });
  });

  describe('filter', function() {
    it('should render the block if the given string is in the array', function() {
      var source = '{{#filter array "d"}}AAA{{else}}BBB{{/filter}}';
      assert.equal(hbs.compile(source)(context), 'AAA');
    });

    it('should render the inverse block if the string is not in the array:', function() {
      var source = '{{#filter array "foo"}}AAA{{else}}BBB{{/filter}}';
      assert.equal(hbs.compile(source)(context), 'BBB');
    });

    it('should render a block for each object that has a "first" property with the value "d"', function() {

      var ctx = {
        collection: [
          {first: 'aaa', last: 'bbb'},
          {first: 'b'},
          {title: 'ccc', last: 'ddd'},
          {first: 'd'},
          {first: 'eee', last: 'fff'},
          {first: 'f'},
          {title: 'ggg', last: 'hhh'},
          {first: 'h'}
        ]
      };

      var source = '{{#filter collection "d" property="first"}}{{this.first}}{{else}}ZZZ{{/filter}}';
      var fn = hbs.compile(source);
      assert.equal(fn(ctx), 'd');
    });
  });

  describe('forEach', function() {
    it('should iterate over an array, exposing objects as context', function() {
      var arr = [{name: 'a'}, {name: 'b'}, {name: 'c'}];

      var fn = hbs.compile('{{#forEach arr}}{{name}}{{/forEach}}');
      assert.equal(fn({arr: arr}), 'abc');
    });

    it('should expose `index`', function() {
      var arr = [{name: 'a'}, {name: 'b'}, {name: 'c'}];

      var fn = hbs.compile('{{#forEach arr}}{{index}}{{/forEach}}');
      assert.equal(fn({arr: arr}), '123');
    });

    it('should expose `total`', function() {
      var arr = [{name: 'a'}, {name: 'b'}, {name: 'c'}];

      var fn = hbs.compile('{{#forEach arr}}{{total}}{{/forEach}}');
      assert.equal(fn({arr: arr}), '333');
    });

    it('should expose `isFirst`', function() {
      var arr = [{name: 'a'}, {name: 'b'}, {name: 'c'}];

      var fn = hbs.compile('{{#forEach arr}}{{isFirst}}{{/forEach}}');
      assert.equal(fn({arr: arr}), 'truefalsefalse');
    });

    it('should expose `isLast`', function() {
      var arr = [{name: 'a'}, {name: 'b'}, {name: 'c'}];

      var fn = hbs.compile('{{#forEach arr}}{{isLast}}{{/forEach}}');
      assert.equal(fn({arr: arr}), 'falsefalsetrue');
    });
  });

  describe('inArray', function() {
    it('should render the first block when a value exists in the array', function() {
      var fn = hbs.compile('{{#inArray array "d"}}AAA{{else}}BBB{{/inArray}}');
      assert.equal(fn(context), 'AAA');
    });

    it('should render the inverse block when a value does not exist', function() {
      var fn = hbs.compile('{{#inArray array "foo"}}AAA{{else}}BBB{{/inArray}}');
      assert.equal(fn(context), 'BBB');
    });
  });

  describe('isArray', function() {
    it('should return true if the value is an array', function() {
      assert.equal(hbs.compile('{{isArray "foo"}}')(), 'false');
      assert.equal(hbs.compile('{{isArray \'["foo"]\'}}')(), 'false');
      assert.equal(hbs.compile('{{isArray foo}}')({foo: ['foo']}), 'true');
      assert.equal(hbs.compile('{{isArray (arrayify "foo")}}')(), 'true');
      assert.equal(hbs.compile('{{isArray (arrayify ["foo"])}}')(), 'true');
    });
  });

  describe('itemAt', function() {
    var ctx = {array: ['foo', 'bar', 'baz']};

    it('should return a null value for undefined array', function() {
      assert.equal(hbs.compile('{{#if (itemAt)}}exists{{else}}notfound{{/if}}')(), 'notfound');
    });

    it('should return a null value for empty array', function() {
      var fn = hbs.compile('{{#if (itemAt array)}}exists{{else}}notfound{{/if}}');
      assert.equal(fn({array: []}), 'notfound');
    });

    it('should return a null value for exceed bound', function() {
      var fn = hbs.compile('{{#if (itemAt array 999)}}exists{{else}}notfound{{/if}}');
      assert.equal(fn(ctx), 'notfound');
    });

    it('should return a first value of array for undefined index', function() {
      var fn = hbs.compile('{{itemAt array}}');
      assert.equal(fn(ctx), 'foo');
    });

    it('should return a first value of array for zero index', function() {
      var fn = hbs.compile('{{itemAt array 0}}');
      assert.equal(fn(ctx), 'foo');
    });

    it('should return a second value of array', function() {
      var fn = hbs.compile('{{itemAt array 1}}');
      assert.equal(fn(ctx), 'bar');
    });

    it('should return a last value of array', function() {
      var fn = hbs.compile('{{itemAt array -1}}');
      assert.equal(fn(ctx), 'baz');
    });

    it('should return a last before value of array', function() {
      var fn = hbs.compile('{{itemAt array -2}}');
      assert.equal(fn(ctx), 'bar');
    });
  });

  describe('join', function() {
    it('should return an empty string when undefined', function() {
      assert.equal(hbs.compile('{{join}}')(), '');
    });

    it('should join items by the default separator', function() {
      assert.equal(hbs.compile('{{join array}}')(context), 'a, b, c, d, e, f, g, h');
    });

    it('should join by a custom separator', function() {
      var fn = hbs.compile('{{join array " | "}}');
      assert.equal(fn(context), 'a | b | c | d | e | f | g | h');
    });
  });

  describe('last', function() {
    it('should return an empty string when undefined', function() {
      assert.equal(hbs.compile('{{last}}')(), '');
    });

    it('should return the last item in an array', function() {
      assert.equal(hbs.compile('{{last array}}')(context), 'h');
    });

    it('should return an array with the last two items in an array', function() {
      assert.equal(hbs.compile('{{last array 2}}')(context), 'g,h');
    });
  });

  describe('lengthEqual', function() {
    it('should render the first block if length is the given number', function() {
      var fn = hbs.compile('{{#lengthEqual array 8}}AAA{{else}}BBB{{/lengthEqual}}');
      assert.equal(fn(context), 'AAA');
    });

    it('should render the inverse block if length is not the given number', function() {
      var fn = hbs.compile('{{#lengthEqual array 3}}AAA{{else}}BBB{{/lengthEqual}}');
      assert.equal(fn(context), 'BBB');
    });
  });

  describe('map', function() {
    it('should return an empty string when undefined', function() {
      assert.equal(hbs.compile('{{map}}')(), '');
    });

    it('should map the items in the array and return new values', function() {
      var locals = {array: ['a', 'b', 'c']};
      locals.double = function(str) {
        return str + str;
      };
      var fn = hbs.compile('{{map array double}}');
      assert.equal(fn(locals), 'aa,bb,cc');
    });

    it('should work with subexpressions:', function() {
      var locals = {};
      locals.double = function(str) {
        return str + str;
      };
      var fn = hbs.compile('{{map (split "a,b,c" ",") double}}');
      assert.equal(fn(locals), 'aa,bb,cc');
    });

    it('should return the value when not an array', function() {
      var fn = hbs.compile('{{map (split "b,c,a" ",") reverse}}');
      assert.equal(fn(context), 'b,c,a');
    });

    it('should return the value when no function is passed', function() {
      var fn = hbs.compile('{{map (split "b,c,a" ",")}}');
      assert.equal(fn(context), 'b,c,a');
    });
  });

  describe('pluck', function() {
    it('should get the given value from objects on an array', function() {
      var ctx = {array: [{a: 'x'}, {a: 'y'}, {a: 'z'}]};
      var fn = hbs.compile('{{pluck array "a"}}');
      assert.equal(fn(ctx), 'x,y,z');
    });
  });

  describe('some', function() {
    it('should render the first block if the callback returns true', function() {
      var ctx = {array: ['a', 'b', 'c']};
      ctx.isString = function(val) {
        return typeof val === 'string';
      };
      var fn = hbs.compile('{{#some array isString}}AAA{{else}}BBB{{/some}}');
      assert.equal(fn(ctx), 'AAA');
    });

    it('should render the inverse block if the array is undefined', function() {
      var fn = hbs.compile('{{#some array isString}}AAA{{else}}BBB{{/some}}');
      assert.equal(fn(), 'BBB');
    });

    it('should render the inverse block if falsey', function() {
      var ctx = {array: [['a'], ['b'], ['c']]};
      ctx.isString = function(val) {
        return typeof val === 'string';
      };
      var fn = hbs.compile('{{#some array isString}}AAA{{else}}BBB{{/some}}');
      assert.equal(fn(ctx), 'BBB');
    });
  });

  describe('sort', function() {
    it('should return an empty string when an invalid value is passed:', function() {
      var fn = hbs.compile('{{sort}}');
      var res = fn();
      assert.equal(res, '');
    });

    it('should sort the items in the array', function() {
      var fn = hbs.compile('{{sort array}}');
      var res = fn({array: ['c', 'a', 'b']});
      assert.equal(res, 'a,b,c');
    });

    it('should return all items in an array sorted in lexicographical order', function() {
      var fn = hbs.compile('{{sort array}}');
      assert.equal(fn(context), 'a,b,c,d,e,f,g,h');
    });

    it('should sort the items in the array in reverse order:', function() {
      var fn = hbs.compile('{{sort array reverse="true"}}');
      var res = fn({array: ['c', 'a', 'b']});
      assert.equal(res, 'c,b,a');
    });
  });

  describe('sortBy', function() {
    it('should return an empty string when undefined', function() {
      assert.equal(hbs.compile('{{sortBy}}')(), '');
    });

    it('should sort the items in an array', function() {
      var fn = hbs.compile('{{sortBy array}}');
      assert.equal(fn({array: ['b', 'c', 'a']}), 'a,b,c');
    });

    it('should return an empty string when the array is invalid:', function() {
      var fn = hbs.compile('{{sortBy foo}}');
      assert.equal(fn(context), '');
    });

    it('should take a compare function', function() {
      var locals = {array: ['b', 'c', 'a']};
      locals.compare = function(a, b) {
        return b.localeCompare(a);
      };
      var fn = hbs.compile('{{sortBy array compare}}');
      assert.equal(fn(locals), 'c,b,a');
    });

    it('should sort based on object key:', function() {
      var ctx = {arr: [{a: 'zzz'}, {a: 'aaa'}]};
      // Register a simple stringify helper for this test
      hbs.registerHelper('stringify', function(obj) {
        return JSON.stringify(obj);
      });
      var fn = hbs.compile('{{{stringify (sortBy arr "a")}}}');
      assert.equal(fn(ctx), '[{"a":"aaa"},{"a":"zzz"}]');
    });
  });

  describe('withAfter', function() {
    it('should use all of the items in an array after the specified count', function() {
      var fn = hbs.compile('{{#withAfter array 5}}<{{this}}>{{/withAfter}}');
      assert.equal(fn(context), '<f><g><h>');
    });
  });

  describe('withBefore', function() {
    it('should use all of the items in an array before the specified count', function() {
      var fn = hbs.compile('{{#withBefore array 5}}<{{this}}>{{/withBefore}}');
      assert.equal(fn(context), '<a><b><c>');
    });
  });

  describe('withFirst', function() {
    it('should use the first item in an array', function() {
      var fn = hbs.compile('{{#withFirst array}}{{this}} is smart.{{/withFirst}}');
      assert.equal(fn(context), 'a is smart.');
    });
    it('should return an empty string when no array is passed:', function() {
      assert.equal(hbs.compile('{{#withFirst}}{{/withFirst}}')(), '');
    });
    it('should use the first two items in an array', function() {
      var fn = hbs.compile('{{#withFirst array 2}}{{this}} is smart.{{/withFirst}}');
      assert.equal(fn(context), 'a is smart.b is smart.');
    });
  });

  describe('withGroup', function() {
    it('should iterate over an array grouping elements by a given number', function() {
      var fn = hbs.compile('{{#withGroup collection 4}}{{#each this}}{{name}}{{/each}}<br>{{/withGroup}}');
      var res = fn({
        collection: [ {name: 'a'}, {name: 'b'}, {name: 'c'}, {name: 'd'}, {name: 'e'}, {name: 'f'}, {name: 'g'}, {name: 'h'}]
      });
      assert.equal(res, 'abcd<br>efgh<br>');
    });
  });

  describe('withLast', function() {
    it('should return an empty string when undefined', function() {
      assert.equal(hbs.compile('{{withLast}}')(), '');
    });
    it('should use the last item in an array', function() {
      var fn = hbs.compile('{{#withLast array}}{{this}} is dumb.{{/withLast}}');
      assert.equal(fn(context), 'h is dumb.');
    });
    it('should use the last two items in an array', function() {
      var fn = hbs.compile('{{#withLast array 2}}{{this}} is dumb.{{/withLast}}');
      assert.equal(fn(context), 'g is dumb.h is dumb.');
    });
  });

  describe('withSort', function() {
    it('should return an empty string when array is undefined', function() {
      var fn = hbs.compile('{{#withSort}}{{this}}{{/withSort}}');
      assert.equal(fn(context), '');
    });

    it('should sort the array in lexicographical order', function() {
      var fn = hbs.compile('{{#withSort array}}{{this}}{{/withSort}}');
      assert.equal(fn(context), 'abcdefgh');
    });

    it('should sort the array in reverse order', function() {
      var fn = hbs.compile('{{#withSort array reverse="true"}}{{this}}{{/withSort}}');
      assert.equal(fn(context), 'hgfedcba');
    });

    it('should sort the array by deliveries', function() {
      var fn = hbs.compile('{{#withSort collection "deliveries"}}{{name}}: {{deliveries}} <br>{{/withSort}}');
      var res = fn({
        collection: [
          {name: 'f', deliveries: 8021 },
          {name: 'b', deliveries: 239 },
          {name: 'd', deliveries: -12 }
        ]
      });
      assert.equal(res, 'd: -12 <br>b: 239 <br>f: 8021 <br>');
    });

    it('should sort the array by deliveries in reverse order', function() {
      var fn = hbs.compile('{{#withSort collection "deliveries" reverse="true"}}{{name}}: {{deliveries}} <br>{{/withSort}}');
      var res = fn({
        collection: [
          {name: 'f', deliveries: 8021 },
          {name: 'b', deliveries: 239 },
          {name: 'd', deliveries: -12 }
        ]
      });
      assert.equal(res, 'f: 8021 <br>b: 239 <br>d: -12 <br>');
    });
  });

  describe('unique', function() {
    it('should return empty string when the array is null', function() {
      var fn = hbs.compile('{{#unique}}{{this}}{{/unique}}');
      assert.equal(fn(context), '');
    });
    it('should return array with unique items', function() {
      var fn = hbs.compile('{{#unique duplicate}}{{this}}{{/unique}}');
      assert.equal(fn(context).toString(), 'a,b,c,d,f,g');
    });
  });
  
});
