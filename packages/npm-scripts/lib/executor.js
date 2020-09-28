const { spawn } = require('child_process');

const noop = require('lodash/noop');
const memoize = require('lodash/memoize');
const once = require('lodash/once');
const random = require('lodash/random');
const truncate = require('lodash/truncate');
const hash = require('object-hash');
const { chunksToLinesAsync } = require('@rauschma/stringio');
const supportsColor = require('supports-color');
const stripAnsi = require('strip-ansi');

const debug = require('./debug');

const createRandomColorizer = memoize(label => {
	const i = random(0, 16);
	const j = random (0, 16);
	const code = (i * 16 + j);
	return text => {
		if (supportsColor.stdout) {
			return `\x1b[38;5;${code}m${label}\x1b[0m${text}`;
		}
		return text;
	};
});

class Executor {
	static memo(script) {
		const key = hash.MD5(script);
		if (!Executor.cache.has(key)) {
			Executor.cache.set(key, new Executor(script));
		}
		return Executor.cache.get(key);
	}

	constructor(script) {
		// FIXME: Bad
		const { Script } = require('./script');

		this.exitCode = undefined;
		this.process = undefined;
		this.script = script;
		this.colorize = createRandomColorizer(`[${script.name}]`);

		this.run = once(async (extras = [], cb = noop) => {
			const command = script.command(extras);
			const shortCommand = truncate(command, { length: 40 });

			if (await script.getRunnableScore() > 0) {
				debug(`spawn: ${command}`);

				this.process = spawn(
					script.cmd,
					script.getArgs(extras),
					{
						env: script.env(),
						stdio: script.silent ? 'ignore' : ['ignore', 'pipe', process.stderr]
					}
				);

				cb(this.process);

				await Promise.all([
					this.process.stdout && (async () => {
						for await (const line of chunksToLinesAsync(this.process.stdout)) {
							// const prefix = `[${script.name}] `;
							// process.stdout.write(
							// 	`${
							// 		line.trim().length > 0 ? this.colorize(prefix) : ''
							// 	}${
							// 		stripAnsi(line).replace(prefix, '')
							// 	}`
							// );
							process.stdout.write(
								line.trim().length > 0 ? this.colorize(stripAnsi(line).replace(/^\[([^\]]+)\]/, '')) : ''
							);
						}
					})(),
					new Promise((resolve, reject) => {
						this.process.on('error', reject);
						this.process.on('exit', exitCode => {
							this.exitCode = exitCode;
							if (exitCode > 0) {
								const err = Object.assign(
									new Error(`"${shortCommand}"\nChild process exited with code ${exitCode}`),
									{ exitCode }
								);
								reject(err);
							} else {
								resolve();
							}
						});
					})
					.catch(script.onError)
				]);

			} else if (script.type === Script.OPTIONAL) {
				debug(
					`Skipping non-runnable script "${shortCommand}"`
				);
			} else if (script.type === Script.NORMAL) {
				throw new Error(
					`${
						script.conditions.command()
					}\nFailed to resolve conditions for required script "${
						shortCommand
					}"`
				);
			}
		});
	}
}

Object.defineProperties(Executor, {
	cache: {
		configurable: false,
		enumerable: false,
		value: new Map(),
		writable: false
	}
});

module.exports = Executor;
