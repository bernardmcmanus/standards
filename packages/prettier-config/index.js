module.exports = {
	printWidth: 80,
	semi: true,
	singleQuote: true,
	trailingComma: 'all',
	useTabs: true,
	overrides: [
		{
			files: '**/*.{json,y?(a)ml}',
			options: {
				tabWidth: 2,
				useTabs: false
			}
		},
		{
			files: '**/*.md',
			options: {
				tabWidth: 4,
				useTabs: false
			}
		}
	]
};
