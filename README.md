# babel-plugin-mjsx
Mithril precompilation JSX plugin for babel

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
