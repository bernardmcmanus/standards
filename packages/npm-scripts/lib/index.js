const snakeCase = require('lodash/snakeCase');
const { table } = require('table');

const debug = require('./debug');
const scripts = require('../scripts');

function runScript(identifier, args, flags) {
	const key = snakeCase(identifier);
	const script = scripts[key];

	if (!script) {
		throw new Error(`No such script '${identifier}'`);
	}

	if (flags.silent) {
		debug(`> ${script.command(args)}\n`);
	} else {
		process.stderr.write(`> ${script.command(args)}\n\n`);
	}

	script.run(args, cp => {
		process.on('exit', () => {
			cp.kill();
		});
	})
	.catch(err => {
		if (err.exitCode) {
			debug(err.stack);
		} else {
			console.error(`${err.stack}\n`);
		}
		process.exit(err.exitCode || 1);
	});
}

async function help() {
	console.log('USAGE: npm-scripts <identifier> [...args]\n');

	const commands = await Promise.all(
		Object.keys(scripts).map(async key => {
			const script = scripts[key];
			const score = await script.getRunnableScore();

			debug({key, score});

			let icon;
			switch (true) {
				case score === 2:
					icon = '🟢';
					break;
				case score > 0:
					icon = '🟡'
					break;
				default:
					icon = '🔴'
					break;
			}

			return [icon, key, script.command()];
		})
	);

	console.log(
		table(commands, {
			columns: {
				2: {
					width: 80,
					wrapWord: true
				}
			}
		})
	);
}

Object.defineProperties(runScript, {
	help: {
		value: help
	}
});

module.exports = runScript;
