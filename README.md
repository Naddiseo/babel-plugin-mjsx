# babel-plugin-mjsx

[![Build Status](https://travis-ci.org/Naddiseo/babel-plugin-mjsx.svg?branch=master)](https://travis-ci.org/Naddiseo/babel-plugin-mjsx)

Mithril precompilation JSX plugin for babel.

Installation
============

    $ npm i babel-plugin-mjsx

Usage
=====

Add `babel-plugin-mjsx` to your plugins config:

    $ cat .babelrc
    {
         "plugins": [ "mjsx" ]
    }

More information on setting up Babel is available in [Babel's documentation](https://babeljs.io/docs/setup/)

Example output:
```javascript
let a = {t: 1};
let KK = <div style="1" {...a}><Component foo="bar">Component children</Component></div>;
```
Transpiled:
```javascript
var a = { t: 1 };
var KK = {
	tag: 'div',
	children: [m.component(Component, {
		foo: 'bar'
	}, ['Component children'])],
	attrs: babelHelpers._extends({
		style: '1'
	}, a)
};
```

Change Log
==========

v4.0.0
* Changed output to trim whitespace similar to how v1.x did.

v3.0.0

* Removed forcing of tags to be "valid" html tags
* Print warning instead of erroring for deprecated html tags 

