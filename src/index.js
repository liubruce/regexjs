const { createMatcher } = require('./regex');
//const readline = require('readline');

// const match = createMatcher('(a|b)*c');
//
// return;
//
// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
// });
//
// rl.question(`Pattern: `, (pattern) => {
//     const match = createMatcher(pattern);
//
//     console.log('Check words: ');
//
//     rl.on('line', (input) => {
//         console.log(`Match? ${match(input)}`);
//     });
// });

const fs = require('fs');

const expressions = [], targets = [], origin_expected = [], expected = [], exceptioned = [];

// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
// });

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

(async function processLineByLine() {
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
			input: createReadStream('./src/expected.txt'),
			crlfDelay: Infinity
		});

		rlOriginExpected.on('line', (line) => {
			origin_expected.push(line);
		});

		await once(rl, 'close');

		await once(rlTarget, 'close');

		await once(rlOriginExpected, 'close');

		//console.log('File processed.');
		//console.log('expressions.length=', expressions, expressions.length);
		let i =0;
		for (i = 0;i < expressions.length; i++){
			//console.log(`${i+1} Expression ${expressions[i]} -> ${targets[i]}`);
			const match = createMatcher(expressions[i]);
			const result = match(targets[i] || '');
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

		// if (i === expressions.length) {
		// 	const file = fs.createWriteStream('bruce_expected.txt');
		// 	file.on('error', function(err) {
		// 		console.log('write error:', err);
		// 	});
		// 	expected.forEach(function(v) { file.write(v + '\n'); });
		// 	file.end();
		//
		// 	const exceptionFile = fs.createWriteStream('exceptions.txt');
		// 	exceptionFile.on('error', function(err) {
		// 		console.log('write error:', err);
		// 	});
		// 	exceptioned.forEach(function(v) { exceptionFile.write(v + '\n'); });
		// 	exceptionFile.end();
		// }

	} catch (err) {
		console.error(err);
	}
})();
