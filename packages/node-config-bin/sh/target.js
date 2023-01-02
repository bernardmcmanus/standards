#!/usr/bin/env node

const cp = require('child_process');
const os = require('os');

const ARCHITECTURES = new Set(['arm64', 'x64']);
const PLATFORMS = new Set(['alpine', 'linux', 'linuxstatic', 'macos', 'win']);

let arch = process.env.NODE_CONFIG_PKG_ARCH || os.arch();
let platform = process.env.NODE_CONFIG_PKG_PLATFORM || os.platform();

if (platform === 'linux') {
	// If platform is linux, check whether we are running on alpine
	try {
		cp.execSync('cat /etc/os-release | grep -i alpine');
		platform = 'alpine';
	} catch (err) {
		// noop
	}
}

/**
 * 'darwin' must be mapped to 'macos' 🤷‍♂️
 * @see https://github.com/vercel/pkg/tree/e3ac4902e9cb023f0ac2a596e21ff9166d2e268c#targets
 */
if (platform === 'darwin') {
	platform = 'macos';
}

if (!ARCHITECTURES.has(arch)) {
	throw new Error(
		`Failed to determine target architecture. You must explicitly set NODE_CONFIG_PKG_ARCH to one of: (${
			[...ARCHITECTURES].join(' ')
		})`
	);
}

if (!PLATFORMS.has(platform)) {
	throw new Error(
		`Failed to determine target platform. You must explicitly set NODE_CONFIG_PKG_PLATFORM to one of: (${
			[...PLATFORMS].join(' ')
		})`
	);
}

console.log(`${platform}-${arch}`);
