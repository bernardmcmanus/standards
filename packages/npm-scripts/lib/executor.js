const { spawn } = require('child_process');

const noop = require('lodash/noop');
const memoize = require('lodash/memoize');
const once = require('lodash/once');
const random = require('lodash/random');
const truncate = require('lodash/truncate');
const hash = require('object-hash');
const { chunksToLinesAsync } = require('@rauschma/stringio');
const stripAnsi = require('strip-ansi');

const debug = require('./debug');

const createRandomColorizer = memoize(label => {
	const i = random(0, 16);
	const j = random (0, 16);
	const code = (i * 16 + j);
	return line => {
		const text = stripAnsi(line).replace(`${label} `, '');
		return `\x1b[38;5;${code}m${label} \x1b[0m${text}`;
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

		this.run = once(async (extras = [], cb = noop, { color, label } = {}) => {
			const command = script.command(extras);
			const shortCommand = truncate(command, { length: 40 });

			if (await script.getRunnableScore() > 0) {
				debug(`spawn: ${command}`);

				this.process = spawn(
					script.cmd,
					script.getArgs(extras),
					{
						env: script.env(),
						stdio: script.silent ? 'ignore' : [process.stdin, 'pipe', 'pipe']
					}
				);

				cb(this.process);

				await Promise.all([
					this.process.stdout && (async () => {
						if (label) {
							for await (const line of chunksToLinesAsync(this.process.stdout)) {
								process.stdout.write(
									color && line.trim().length > 0 ? this.colorize(line) : line
								);
							}
						} else {
							this.process.stdout.pipe(process.stdout);
						}
					})(),
					this.process.stderr && (async () => {
						if (script.type !== Script.OPTIONAL) {
							if (label) {
								for await (const line of chunksToLinesAsync(this.process.stderr)) {
									process.stderr.write(
										color && line.trim().length > 0 ? this.colorize(line) : line
									);
								}
							} else {
								this.process.stderr.pipe(process.stderr);
							}
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
