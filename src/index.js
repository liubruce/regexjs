const { createMatcher } = require('./regex');

const fs = require('fs');

const expressions = [], targets = [], origin_expected = [], expected = [], exceptioned = [];

const { once } = require('events');
const { createReadStream } = require('fs');
const { createInterface } = require('readline');

function getResultText(result) {
	//console.log('result=', result);
	switch (result){
		case true:
			return 'YES:';
		case false:
			return 'NO: '
		default:
			return result + ':';
	}
}

function findParentheseIndex(array) {
	const left = [], right = [];

	let idx = array.indexOf('(');
	while (idx !== -1) {
		left.push(idx);
		idx = array.indexOf('(', idx + 1);
	}

	idx = array.indexOf(')');
	while (idx !== -1) {
		right.push(idx);
		idx = array.indexOf(')', idx + 1);
	}
	if (left.length === right.length){
		if (left.length > 1 && left[1] < right[0]){
			return right[right.length-1];
		}else
			return array.indexOf(')')
	}else
		return -1;
}


function initMatch(pattern) {
	if (pattern === ")" || pattern === "*" ) {
		return 'SYNTAX ERROR';
	}
	if (pattern.indexOf(")") > -1 || pattern.indexOf("(") > -1 ) {
		const groupEnd = findParentheseIndex(pattern);
		if (groupEnd === -1) {
			return 'SYNTAX ERROR';
		}
	}
	const starIndex = pattern.indexOf("*");
	if (starIndex === 0) {
		return 'SYNTAX ERROR';
	}
	if (starIndex > 0) {
		if (pattern[starIndex-1] === '|' || pattern[starIndex-1] === ']' || pattern[starIndex-1] === '(')
			return 'SYNTAX ERROR';
	}
	if (pattern.indexOf("\\(") > -1){
		return 'SYNTAX ERROR';
	}
	return 0;
}

(async function processLineByLine() {
	// const match = createMatcher('|b');
	// const result = match('b');
	// console.log(result);
	// return;
	try {
		const rl = createInterface({
			input: createReadStream('./expressions.txt'),
			crlfDelay: Infinity
		});

		rl.on('line', (line) => {
			expressions.push(line);
		});

		const rlTarget = createInterface({
			input: createReadStream('./targets.txt'),
			crlfDelay: Infinity
		});

		rlTarget.on('line', (line) => {
			targets.push(line);
		});

		const rlOriginExpected = createInterface({
			input: createReadStream('./expected.txt'),
			crlfDelay: Infinity
		});

		rlOriginExpected.on('line', (line) => {
			origin_expected.push(line);
		});

		await once(rl, 'close');

		await once(rlTarget, 'close');

		await once(rlOriginExpected, 'close');

		let i =0;
		for (i = 0;i < expressions.length; i++){
			//console.log(`${i+1} Expression ${expressions[i]} -> ${targets[i]}`);
			const initResult = initMatch(expressions[i]);
			let result;
			if (initResult === 0){
				const match = createMatcher(expressions[i]);
				result = match(targets[i] || '');
			}else
				result = initResult;

			const strExpected = `${getResultText(result)} ${expressions[i]} with ${targets[i]}`;
			if (strExpected !== origin_expected[i]) {
				exceptioned.push(`${i+1} ${origin_expected[i]} but my is ${strExpected}`);
			}
			expected.push(strExpected);
		}

		if (i === expressions.length) {
			const file = fs.createWriteStream('bruce_expected.txt');
			file.on('error', function(err) {
				console.log('write error:', err);
			});
			expected.forEach(function(v) { file.write(v + '\n'); });
			file.end();

			const exceptionFile = fs.createWriteStream('exceptions.txt');
			exceptionFile.on('error', function(err) {
				console.log('write error:', err);
			});
			exceptioned.forEach(function(v) { exceptionFile.write(v + '\n'); });
			exceptionFile.end();
		}


	} catch (err) {
		console.error(err);
	}
})();
