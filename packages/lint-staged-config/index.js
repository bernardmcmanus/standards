module.exports = {
	'*.{js,jsx,ts,tsx}': [
		'prettier --write',
		'eslint --cache --cache-location node_modules/.cache/eslint/ --ext .js,.jsx,.ts,.tsx --fix --max-warnings=-1 --report-unused-disable-directives',
	],
	'*.{css,less,sass,scss}': ['prettier --write'],
	'*.{g?(raph)ql,json,html,md,y?(a)ml}': ['prettier --write'],
};
