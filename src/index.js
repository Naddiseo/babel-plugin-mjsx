const deprecatedHTML = (
	'^(acronym|applet|basefont|big|blink|center|dir|frame|frameset|isindex|listings|noembed|plaintext|spacer|strike|tt|xmp)$'
);

const deprecatedRx = new RegExp(deprecatedHTML);

function D(v) {
	console.log(JSON.stringify(v, null, '\t'));
}

export default function({ types: t }) {
	function convertAttributeValue(node) {
		if (t.isJSXExpressionContainer(node)) {
			return node.expression;
		} else {
			return node;
		}
	}

	function convertAttribute(node) {
		let value = convertAttributeValue(node.value || t.booleanLiteral(true));

		if (t.isStringLiteral(value)) {
			value.value = value.value.replace(/\n\s+/g, " ");
		}
		
		let propertyName = node.name;
		if ((t.isIdentifier(propertyName) || t.isJSXIdentifier(propertyName)) && propertyName.name === 'class') {
			propertyName = t.identifier('className');
		}
		else {
			propertyName = t.isValidIdentifier(propertyName.name) ? t.identifier(propertyName.name) : t.stringLiteral(propertyName.name);
		}

		return t.inherits(t.objectProperty(propertyName, value), node);
	}
	function buildChildren(node) {
		return node.children
			.map(convertAttributeValue)
			.filter(child => !t.isJSXEmptyExpression(child))
			.map(child => {
				if (t.isStringLiteral(child) || t.isJSXText(child)) {
					return t.stringLiteral(child.value);
				}
				return child;
			});
	}
	
	function flatten(args) {
		let flattened = [];
		let last = null;
		
		for (let arg of args) {
			if (t.isStringLiteral(arg) && t.isStringLiteral(last)) {
				last.value += arg.value;
			}
			else {
				last = arg;
				flattened.push(arg);
			}
		}
		
		return flattened;
	}
	
	return {
		inherits: require('babel-plugin-syntax-jsx'),
		
		visitor: {
			JSXElement(path, {file}) {
				let {node, parent, scope} = path;
				let open = node.openingElement;
				let obj = t.objectExpression([]);
				let tag = open.name;
				let attrObjs = [];
				let props = [];
				let isComp = false;
				
				function pushElemProp(key, value) {
					obj.properties.push(t.objectProperty(t.identifier(key), value));
				}
				
				function pushProps() {
					if (!props.length) { return; }
					attrObjs.push(t.objectExpression(props));
					props = [];
				}
				
				if (t.isJSXIdentifier(tag)) {
					tag = t.stringLiteral(tag.name);
					if (deprecatedRx.test(tag.value)) {
						throw new Error(`Using a deprecated html tag: '${ tag.value }'`);
					}
					if (tag.value !== tag.value.toLowerCase()) {
						isComp = true;
					}
				}
				
				pushElemProp('tag', tag);
				
				if (node.children.length) {
					pushElemProp('children', t.arrayExpression(flatten(buildChildren(node))));
				}
				
				for (let attr of open.attributes) {
					if (t.isJSXSpreadAttribute(attr)) {
						pushProps();
						attrObjs.push(attr.argument);
					}
					else {
						props.push(convertAttribute(attr));
					}
				}
				pushProps();
				
				if (attrObjs.length === 1) {
					pushElemProp('attrs', attrObjs[0]);
				}
				else if (attrObjs.length > 1) {
					if (!t.isObjectExpression(attrObjs[0])) {
						attrObjs.unshift(t.objectExpression([]));
					}
					
					pushElemProp('attrs', 
						t.callExpression(
							file.addHelper('extends'),
							attrObjs
						)
					);
				}
				
				if (isComp) {
					let properties = obj.properties;
					let attrs = t.objectExpression([]);
					let children = t.arrayExpression([]);
					
					for (let child of properties) {
						if (child.key.name === 'attrs') {
							attrs = child.value;
						}
						else if (child.key.name === 'children') {
							children = child.value;
						}
					}
					
					path.replaceWith(
						t.callExpression(
							t.memberExpression(
								t.identifier('m'),
								t.identifier('component')
							),
							[t.identifier(tag.value), attrs, children]
						),
						node
					);
				}
				else {
					path.replaceWith(obj, node);
				}
			},
		}
	};
};
