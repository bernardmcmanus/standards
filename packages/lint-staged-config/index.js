module.exports = {
	'*.{js,jsx,ts,tsx}': [
		'prettier --write',
		'eslint --cache --cache-location node_modules/.cache/eslint/ --ext .js,.jsx,.ts,.tsx --fix --max-warnings=-1 --report-unused-disable-directives',
		'git add',
	],
	'*.{css,less,sass,scss}': ['prettier --write', 'git add'],
	'*.{g?(raph)ql,json,html,md,y?(a)ml}': ['prettier --write', 'git add'],
};
