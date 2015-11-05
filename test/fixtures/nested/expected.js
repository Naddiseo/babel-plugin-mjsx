"use strict";

result = {
	tag: "html",
	children: ["\n\t", {
		tag: "head",
		children: ["\n\t\t", {
			tag: "title",
			children: ["Hello World"]
		}, "\n\t\t", {
			tag: "style",
			children: ["\n\t\t\t* { box-sizing: border-box; }\n\t\t"],
			attrs: { type: "text/css" }
		}, "\n\t\t", {
			tag: "script",
			attrs: { src: "./file.js", type: "text/javascript" }
		}, "\n\t\t", {
			tag: "meta",
			attrs: { name: "encoding", value: "utf8" }
		}, "\n\t"]
	}, "\n\t", {
		tag: "body",
		children: ["\n\t\t", {
			tag: "div"
		}, "\n\t\t", {
			tag: "a",
			children: ["bar"],
			attrs: { href: "foo" }
		}, "\n\t\t", {
			tag: "br"
		}, "\n\t"]
	}, "\n"]
};
