"use strict";

result = {
	tag: "html",
	children: [{
		tag: "head",
		children: [{
			tag: "title",
			children: ["Hello World"]
		}, {
			tag: "style",
			children: ["* { box-sizing: border-box; }"],
			attrs: { type: "text/css" }
		}, {
			tag: "script",
			attrs: { src: "./file.js", type: "text/javascript" }
		}, {
			tag: "meta",
			attrs: { name: "encoding", value: "utf8" }
		}]
	}, {
		tag: "body",
		children: [{
			tag: "div"
		}, {
			tag: "a",
			children: ["bar"],
			attrs: { href: "foo" }
		}, {
			tag: "br"
		}]
	}]
};
