/* global require, module */
var isString = require('lodash/lang/isString');
 
var htmlTags = (
	'^(' + [
		'a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b',
		'base', 'bdi', 'bdo', 'blockquote', 'body', 'br', 'button', 'canvas',
		'caption', 'cite', 'code', 'col', 'colgroup', 'content', 'data',
		'datalist', 'dd', 'decorator', 'del', 'details', 'dfn', 'dialog',
		'div', 'dl', 'dt', 'element', 'em', 'embed', 'fieldset', 'figcaption',
		'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head',
		'header', 'hgroup', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins',
		'kbd', 'keygen', 'label', 'legend', 'li', 'link', 'main', 'map',
		'mark', 'menu', 'menuitem', 'meta', 'meter', 'nav', 'noscript',
		'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param',
		'pre', 'progress', 'q', 'rp', 'rt', 'rtc', 'ruby', 's', 'samp',
		'script', 'section', 'select', 'shadow', 'small', 'source', 'span',
		'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td',
		'template', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr',
		'track', 'u', 'ul', 'var', 'video', 'wbr'
	].join('|') + ')$'

);
 
var deprecatedHTML = (
	'^(acronym|applet|basefont|big|blink|center|dir|frame|frameset|isindex|listings|noembed|plaintext|spacer|strike|tt|xmp)$'
);

var htmlTagsRx = new RegExp(htmlTags);
var deprecatedRx = new RegExp(deprecatedHTML);


module.exports = function (babel) {
	"use strict";

	var t = babel.types;
	var isStringLiteral = function (node) {
		return t.isLiteral(node) && isString(node.value);
	};
	function cleanJSXElementLiteralChild(child, args) {
		var i;
		var lines = child.value.split(/\r\n|\n|\r/);
	
		var lastNonEmptyLine = 0;
	
		for (i = 0; i < lines.length; i++) {
			if (lines[i].match(/[^ \t]/)) {
				lastNonEmptyLine = i;
			}
		}
	
		var str = "";
	
		for (i = 0; i < lines.length; i++) {
			var line = lines[i];
	
			var isFirstLine = i === 0;
			var isLastLine = i === lines.length - 1;
			var isLastNonEmptyLine = i === lastNonEmptyLine;
	
			// replace rendered whitespace tabs with spaces
			var trimmedLine = line.replace(/\t/g, " ");
	
			// trim whitespace touching a newline
			if (!isFirstLine) {
				trimmedLine = trimmedLine.replace(/^[ ]+/, "");
			}
	
			// trim whitespace touching an endline
			if (!isLastLine) {
				trimmedLine = trimmedLine.replace(/[ ]+$/, "");
			}
	
			if (trimmedLine) {
				if (!isLastNonEmptyLine) {
					trimmedLine += " ";
				}
	
				str += trimmedLine;
			}
		}
	
		if (str) args.push(t.literal(str));
	}
	function buildChildren(node) {
		var elems = [];
	
		for (var i = 0; i < node.children.length; i++) {
			var child = node.children[i];
	
			if (t.isLiteral(child) && typeof child.value === "string") {
				cleanJSXElementLiteralChild(child, elems);
				continue;
			}
	
			if (t.isJSXExpressionContainer(child)) child = child.expression;
			if (t.isJSXEmptyExpression(child)) continue;
	
			elems.push(child);
		}
	
		return elems;
	}
	
	var flatten = function (args) {
		var flattened = [];
		var last;
	
		for (var i = 0; i < args.length; i++) {
			var arg = args[i];
			if (isStringLiteral(arg) && isStringLiteral(last)) {
				last.value += arg.value;
			} else {
				last = arg;
				flattened.push(arg);
			}
		}
	
		return flattened;
	};
	
	function hasSpread(attrs) {
		for (var i = 0; i < attrs.length; i++) {
			var attr = attrs[i];
			if (t.isJSXSpreadAttribute(attr)) { return true; }
		}
		return false;
	}
	function isJSXAttributeOfName(attr, name) {
		return t.isJSXAttribute(attr) && t.isJSXIdentifier(attr.name, { name: name });
	}
	
	return new babel.Transformer('mjsx_plugin:before', {
		JSXAttribute: { 
			exit: function (node, a, b, c) {
				var value = node.value || t.literal(true);
				if (node.node) {
					if (t.isLiteral(node.name) && node.name.value === 'class') {
						node.name = t.literal('className');
					}
				}
				return t.inherits(t.property('init', node.name, value), node);
			}
		},
		JSXExpressionContainer: function (node, parent, scope, file) {
			return node.expression;
		},
		JSXElement: function (node, parent, scope, file) {
			var open = node.openingElement;
			
			// init
			var obj				 = t.objectExpression([]);
			var isComp			= false;
			var tag				 = open.name;
			var props			 = [];
			var objs				= [];
			
			if (t.isJSXIdentifier(tag)) {
				tag = t.literal(tag.name);
				if (deprecatedRx.test(tag.value)) {
					throw new Error('Using a deprecated html tag: `' + tag.value + '`');
				}
				if (!htmlTagsRx.test(tag.value)) {
					// Component
					isComp = true;
				}
			}
			
			function pushElemProp(key, value) {
				obj.properties.push(t.property('init', t.identifier(key), value));
			}
			
			function pushProps() {
				if (!props.length) { return; }
				objs.push(t.objectExpression(props));
				props = [];
			}
			
			// metadata
			pushElemProp('tag', tag);
			
			if (node.children.length) {
				pushElemProp('children', t.arrayExpression(flatten(buildChildren(node))));
			}
			
			// props
			for (var i = 0; i < open.attributes.length; i++) {
				var attr = open.attributes[i];
				if (t.isJSXSpreadAttribute(attr)) {
					pushProps();
					objs.push(attr.argument);
				}
				else {
					props.push(t.property('init', attr.name, attr.value || t.literal(true)));
				}
			}
			pushProps();
			
			if (objs.length === 1) {
				pushElemProp('attrs', objs[0]);
			}
			else if (objs.length > 1) {
				// looks like we have multiple objects
				if (!t.isObjectExpression(objs[0])) {
					objs.unshift(t.objectExpression([]));
				}
				
				// spread
				pushElemProp('attrs',
					t.callExpression(
						file.addHelper('extends'),
						objs
					)
				);
			}
			
			if (isComp) {
				var properties = obj.properties;
				var attrs = t.objectExpression([]);
				var children = t.arrayExpression([]);
				for (var j = 0; j < properties.length; j++) {
					var child = properties[j];
					if (child.kind === 'init') {
						if (child.key.name === 'attrs') {
							attrs = child.value;
						}
						else if (child.key.name === 'children') {
							children = child.value;
						}
					}
				}
				return t.callExpression(
					t.memberExpression(
						t.identifier('m'),
						t.identifier('component')
					),
					[t.identifier(tag.value), attrs, children]
				);
			}
			return obj;
		}
	});
};
