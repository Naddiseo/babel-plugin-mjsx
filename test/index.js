import path from 'path';
import fs from 'fs';
import assert from 'assert';
import { transformFileSync } from 'babel-core';
import plugin from '../src';

/*
NOTE: many tests come from babel-plugin-incremental-dom. 

*/

function trim(str) {
  return str.replace(/^\s+|\s+$/, '');
}


function resolve(path) {
	let expected = '';
	try {
		expected = fs.readFileSync(path).toString();
	} catch (err) {
	if (err.code !== 'ENOENT') {
		throw err;
	}
	}
	return expected;
}

function transform(path, opts = {}) {
	return transformFileSync(path, {plugins: [[require('../src').default, opts]]}).code;
}

function parse(json) {
	return json ? JSON.parse(json) : {};
}

function trim(str) {
	return str.replace(/^\s+|\s+$/, "");
}

describe("turn jsx into mithril compliant virtual-dom", () => {
	const fixturesDir = path.join(__dirname, 'fixtures');
	const original_log = console.log.bind(console);
	
	fs.readdirSync(fixturesDir).map(caseName => {
		it(`should transform ${caseName.split('-').join(' ')}`, () => {
			const fixtureDir = path.join(fixturesDir, caseName);
			const expected = resolve(path.join(fixtureDir, 'expected.js'));
			const opts = parse(resolve(path.join(fixtureDir, 'options.json')));
			const throwMsg = opts.throws;
			const consoleMsg = opts.console;
			
			let actual = null;
			let logMsgs = [];
			function log(msg) {
				logMsgs.push(msg);
			}
			
			try {
				console.log = log;
				actual = transform(path.join(fixtureDir, 'actual.js'), opts.opts || {});
				console.log = original_log;
			}
			catch (err) {
				if (throwMsg) {
					if (err.message.indexOf(throwMsg) >= 0) {
						return;
					}
					else {
						err.message = `Expected error message: ${throwMsg}. Got error message: ${err.message}`;
					}
				}
				throw err;
			}
			
			if (throwMsg) {
				throw new Error(`Expected error message: ${throwMsg}. But parsing succeeded.`);
			}
			else {
				assert.equal(trim(actual), trim(expected));
			}
			if (consoleMsg) {
				assert.equal(consoleMsg.length, logMsgs.length);
				for (let i = 0; i < consoleMsg.length; i++) {
					let expectedMsg = consoleMsg[i];
					let actualMsg = logMsgs[i];
					assert.equal(expectedMsg, actualMsg);
				}
			}
		});
	});
});
