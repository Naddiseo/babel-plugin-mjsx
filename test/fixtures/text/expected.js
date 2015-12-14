"use strict";

result = {
	tag: "div",
	children: ["Hello World!", {
		tag: "div",
		children: ["  Bonjour  "]
	}, {
		tag: "div",
		children: ["What's up doc?"]
	}, {
		tag: "div",
		children: [["More ", {
			tag: "span",
			children: ["·"]
		}, " Text here"]]
	}]
};
