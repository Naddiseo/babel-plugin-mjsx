/*
Much of this file is from eslint-plugin-react project, only changed to work with babel-plugin-mjsx
https://github.com/yannickcr/eslint-plugin-react

The MIT License (MIT)

Copyright (c) 2014 Yannick Croissant
*/

const DOM_ATTRIBUTE_NAMES =  {
  'acceptCharset': 'accept-charset',
  'className': 'class',
  'htmlFor': 'for',
  'httpEquiv': 'http-equiv',
  'clipPath': 'clip-path',
  'fillOpacity': 'fill-opacity',
  'fontFamily': 'font-family',
  'fontSize': 'font-size',
  'markerEnd': 'marker-end',
  'markerMid': 'marker-mid',
  'markerStart': 'marker-start',
  'stopColor': 'stop-color',
  'stopOpacity': 'stop-opacity',
  'strokeDasharray': 'stroke-dasharray',
  'strokeLinecap': 'stroke-linecap',
  'strokeOpacity': 'stroke-opacity',
  'strokeWidth': 'stroke-width',
  'textAnchor': 'text-anchor',
  'xlinkActuate': 'xlink:actuate',
  'xlinkArcrole': 'xlink:arcrole',
  'xlinkHref': 'xlink:href',
  'xlinkRole': 'xlink:role',
  'xlinkShow': 'xlink:show',
  'xlinkTitle': 'xlink:title',
  'xlinkType': 'xlink:type',
  'xmlBase': 'xml:base',
  'xmlLang': 'xml:lang',
  'xmlSpace': 'xml:space'
};

const DOM_PROPERTY_NAMES = {};

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
	DOM_PROPERTY_NAMES[x] = x.toLowerCase();
})

export function getStandardName(name) {
	if (DOM_ATTRIBUTE_NAMES[name]) {
		return DOM_ATTRIBUTE_NAMES[name];
	}
	else if (DOM_PROPERTY_NAMES[name]) {
		return DOM_PROPERTY_NAMES[name];
	}
	return name;
}
