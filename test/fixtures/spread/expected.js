"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

result = {
	tag: "div",
	children: [{
		tag: "div",
		attrs: props
	}],
	attrs: _extends({ className: "test", id: id }, props, { key: "test", "data-expanded": expanded }, props.attrs)
};
