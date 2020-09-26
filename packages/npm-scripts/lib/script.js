const assert = require('assert');
const Path = require('path');

const identity = require('lodash/identity');
const once = require('lodash/once');

const Executor = require('./executor');
const debug = require('./debug');
const { compact } = require('./helpers');

class Script {
	constructor({
		cmd,
		onError,
		args = [],
		conditions = [],
		cacheable = false,
		silent = false,
		type = Script.NORMAL,
		env = identity
	}) {
		assert(
			Script.types.includes(type),
			`Expected options.type to be one of ${
				Script.typeKeys.map(key => `Script.${key}`).join(' | ')
			}`
		);

		this.cmd = cmd;
		this.args = args;
		this.cacheable = cacheable;
		this.silent = silent;
		this.type = type;

		this.conditions = new ConcurrentSet(
			[
				type !== Script.CONDITION && {
					cmd: 'which',
					args: [cmd]
				},
				...conditions
			]
			.reduce((acc, input) => {
				if (input) {
					if (input.conditions instanceof ConcurrentSet) {
						acc.push(input.conditions);
					} else {
						acc.push({
							...input,
							cacheable: true,
							onError: undefined,
							silent: true,
							type: Script.CONDITION
						});
					}
				}
				return acc;
			}, [])
		);

		this.onError = onError || (err => {
			throw err;
		});

		this.env = () => ({
			...process.env,
			...env({
				...process.env,
				PATH: `${Path.resolve('node_modules/.bin')}:${process.env.PATH}`
			})
		});
	}

	getArgs = once(
		(extras = []) =>
			[...this.args, ...extras].map(arg => {
				switch (typeof arg) {
					case 'function':
						try {
							return arg();
						} catch (err) {
							return err;
						}
					default:
						return arg;
				}
			})
	)

	getRunnableScore = once(async () => {
		let result = 2;
		if (this.conditions.length > 0) {
			try {
				await this.conditions.run();
			} catch (err) {
				debug(err.stack);
				result = 0;
			}
		}
		return result;
	})

	command(extras = []) {
		return compact(`${this.cmd} ${this.getArgs(extras).join(' ')}`);
	}

	run(extras, cb) {
		const executor = this.cacheable
			? Executor.memo(this)
			: new Executor(this);
		return executor.run(extras, cb);
	}
}

Object.defineProperties(Script, {
	types: {
		configurable: false,
		enumerable: false,
		get: () => Object.values(Script)
	},
	typeKeys: {
		configurable: false,
		enumerable: false,
		get: () => Object.keys(Script)
	},
	NORMAL: {
		configurable: false,
		enumerable: true,
		value: Symbol('normal'),
		writable: false
	},
	OPTIONAL: {
		configurable: false,
		enumerable: true,
		value: Symbol('optional'),
		writable: false
	},
	CONDITION: {
		configurable: false,
		enumerable: true,
		value: Symbol('condition'),
		writable: false
	}
});

class AbstractSet {
	constructor(input) {
		this.scripts = (Array.isArray(input) ? input : [input])
			.map(value => {
				switch (true) {
					case value instanceof Script:
					case value instanceof AbstractSet:
						return value;
					default:
						return new Script(value);
				}
			});

		Object.defineProperties(this, {
			length: {
				get: () => this.scripts.length
			}
		});
	}

	async getRunnableScore() {
		const results = await Promise.all(
			this.scripts.map(script => script.getRunnableScore())
		);
		return results.reduce((sum, score) => {
			return sum + score;
		}, 0) / results.length;
	}

	command(extras = []) {
		return this.scripts
			.map(script => `${
				(() => {
					if (script.type === Script.OPTIONAL) {
						return `${
							script.conditions.scripts
								.map(conditionScript => conditionScript.command())
								.join(' && ')
						} && `;
					}
					return '';
				})()
			}${script.command(extras)}`)
			.join(' && ');
	}
}

class ConcurrentSet extends AbstractSet {
	async run(extras, cb) {
		await Promise.all(
			this.scripts.map(script => script.run(extras, cb))
		);
	}
}

class SequentialSet extends AbstractSet {
	async run(extras, cb) {
		for (const script of this.scripts) {
			await script.run(extras, cb);
		}
	}
}

Object.assign(exports, {
	AbstractSet,
	ConcurrentSet,
	SequentialSet,
	Script
});
