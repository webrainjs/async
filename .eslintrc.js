module.exports = {
	'extends': [
		'pro',
		// 'plugin:@typescript-eslint/recommended',
		// 'plugin:@typescript-eslint/recommended-requiring-type-checking',
	],
	rules: {
		// web app only
		'require-await': 'off',
		'prefer-const' : 'off',
		'no-lonely-if' : 'off',

		// all
		// '@typescript-eslint/no-var-requires': 'off',
		'no-empty-function'                   : 'warn',
		'@typescript-eslint/no-empty-function': 'warn',
		'no-control-regex'                    : 'off',
		yoda                                  : 'off',
		'@typescript-eslint/no-unused-vars'   : 'off',
		'@typescript-eslint/no-shadow'        : [
			'error',
			{
				builtinGlobals                            : false,
				hoist                                     : 'never',
				allow                                     : [],
				ignoreTypeValueShadow                     : false,
				ignoreFunctionTypeParameterNameValueShadow: true,
			},
		],
	},

	env: {
		node: true,
		es6 : true,
	},

	// parser       : 'babel-eslint',
	parser       : '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion                : 6,
		sourceType                 : 'module',
		allowImportExportEverywhere: false,
		codeFrame                  : true,
		project                    : 'tsconfig.eslint.json',
		// babelOptions               : {
		// 	configFile: './env/babel/configs/minimal.js'
		// },
	},

	plugins: [
		'@typescript-eslint',
		'sonarjs',
		'html',
	],
	settings: {
		'html/indent'           : '+tab',
		'html/report-bad-indent': 'error',
		'html/html-extensions'  : ['.html', '.svelte'],
	},

	overrides: [
		{
			files: ['src/*.html'],
			rules: {
				semi                : ['error', 'always'],
				'semi-style'        : ['error', 'last'],
				'prefer-rest-params': 'off',
				'no-var'            : 'off',
				'vars-on-top'       : 'off',
			},
			env: {
				browser: true,
				es6    : false,
				node   : false,
			},
			parser       : 'espree',
			parserOptions: {
				ecmaVersion: 5,
			},
		},
	],
}
