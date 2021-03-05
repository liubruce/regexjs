# regexjs

[![Build Status](https://github.com/deniskyashif/regexjs/workflows/Node%20CI/badge.svg)](https://github.com/deniskyashif/ssfst/actions?query=workflow%3A%22Node+CI%22)

This is a good regular expression engine. I refer this to finish my course work.

I add the wildcard feature using the char ".".

Other functions are simliar the original one.

Original one is below:

__________

A regular expression engine implementation in JavaScript. It supports concatenation, union (|), zero-or-more (\*), one-or-more (+), and zero-or-one (?) operations as well as grouping. It follows Ken Thompson's algorithm for constructing an NFA from a regular expression.

Check out my [blog post](https://deniskyashif.com/2019/02/17/implementing-a-regular-expression-engine/) for the complete implementation details.

### Example
```javascript
const { createMatcher } = require('./regex');
const match = createMatcher('(a|b)*c');

match('ac'); // true
match('abc'); // true
match('aabababbbc'); // true
match('aaaab'); // false
```
const { createMatcher } = require('./regex');
const match = createMatcher('a.');

match('ab'); // true
match('ac'); // true



### Try It
```
git clone https://github.com/liubruce/regexjs.git
cd regexjs
npm i
npm start
```
