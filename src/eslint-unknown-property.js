/*
Much of this file is from eslint-plugin-react project, only changed to work with babel-plugin-mjsx
https://github.com/yannickcr/eslint-plugin-react

The MIT License (MIT)

Copyright (c) 2014 Yannick Croissant
*/

const DOM_ATTRIBUTE_NAMES = {
	// Standard
	'accept-charset': 'acceptCharset',
	'class': 'className',
	'for': 'htmlFor',
	'http-equiv': 'httpEquiv',
	// SVG
	'clip-path': 'clipPath',
	'fill-opacity': 'fillOpacity',
	'font-family': 'fontFamily',
	'font-size': 'fontSize',
	'marker-end': 'markerEnd',
	'marker-mid': 'markerMid',
	'marker-start': 'markerStart',
	'stop-color': 'stopColor',
	'stop-opacity': 'stopOpacity',
	'stroke-dasharray': 'strokeDasharray',
	'stroke-linecap': 'strokeLinecap',
	'stroke-opacity': 'strokeOpacity',
	'stroke-width': 'strokeWidth',
	'text-anchor': 'textAnchor',
	'xlink:actuate': 'xlinkActuate',
	'xlink:arcrole': 'xlinkArcrole',
	'xlink:href': 'xlinkHref',
	'xlink:role': 'xlinkRole',
	'xlink:show': 'xlinkShow',
	'xlink:title': 'xlinkTitle',
	'xlink:type': 'xlinkType',
	'xml:base': 'xmlBase',
	'xml:lang': 'xmlLang',
	'xml:space': 'xmlSpace'
};

const DOM_PROPERTY_NAMES = new Map();

[
	// Standard
	'acceptCharset', 'accessKey', 'allowFullScreen', 'allowTransparency', 'autoComplete', 'autoFocus', 'autoPlay',
	'cellPadding', 'cellSpacing', 'charSet', 'classID', 'className', 'colSpan', 'contentEditable', 'contextMenu',
	'crossOrigin', 'dateTime', 'encType', 'formAction', 'formEncType', 'formMethod', 'formNoValidate', 'formTarget',
	'frameBorder', 'hrefLang', 'htmlFor', 'httpEquiv', 'marginHeight', 'marginWidth', 'maxLength', 'mediaGroup',
	'noValidate', 'onBlur', 'onChange', 'onClick', 'onContextMenu', 'onCopy', 'onCut', 'onDoubleClick',
	'onDrag', 'onDragEnd', 'onDragEnter', 'onDragExit', 'onDragLeave', 'onDragOver', 'onDragStart', 'onDrop',
	'onFocus', 'onInput', 'onKeyDown', 'onKeyPress', 'onKeyUp', 'onMouseDown', 'onMouseEnter', 'onMouseLeave',
	'onMouseMove', 'onMouseOut', 'onMouseOver', 'onMouseUp', 'onPaste', 'onScroll', 'onSubmit', 'onTouchCancel',
	'onTouchEnd', 'onTouchMove', 'onTouchStart', 'onWheel',
	'radioGroup', 'readOnly', 'rowSpan', 'spellCheck', 'srcDoc', 'srcSet', 'tabIndex', 'useMap',
	// Non standard
	'autoCapitalize', 'autoCorrect',
	'autoSave',
	'itemProp', 'itemScope', 'itemType', 'itemRef', 'itemID'
].forEach(function (x) {
	DOM_PROPERTY_NAMES.set(x, x.toLowerCase());
})

export function getStandardName(name) {
	if (DOM_ATTRIBUTE_NAMES[name]) {
		return DOM_ATTRIBUTE_NAMES[name];
	}
	return DOM_PROPERTY_NAMES.get(name) || name;
}
