"use strict";

result = {
	tag: "div",
	children: ["\n\tHello World!\n\t", {
		tag: "div",
		children: ["Bonjour"]
	}, "\n\t", {
		tag: "div",
		children: ["What's up doc?"]
	}, "\n\t", {
		tag: "div",
		children: [["More ", {
			tag: "span",
			children: ["·"]
		}, " Text here"]]
	}, "\n"]
};
