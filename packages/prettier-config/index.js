module.exports = {
	arrowParens: 'avoid',
	printWidth: 80,
	semi: true,
	singleQuote: true,
	trailingComma: 'all',
	useTabs: true,
	overrides: [
		{
			files: '**/*.{json,md,y?(a)ml}',
			options: {
				tabWidth: 2,
				useTabs: false,
			},
		},
	],
};
