const path = require('path');

/* polyfills optional */
// const polyfills = ['core-js', 'regenerator-runtime/runtime'];
// const polyfills = ['promise-polyfill/src/polyfill'];
const polyfills = [];

module.exports = {
	entry: [...polyfills, './src/js/index.js'],

	output: {
		path: path.resolve(__dirname, 'src'),
		filename: 'script.js',
	},

	devServer: {
		static: {
			directory: path.resolve(__dirname, 'src'),
		},
		port: 8000,
	},

	mode: 'production', // 'production', 'development', 'none' //could be passed as env var webpack --mode=development

	module: {
		rules: [
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader'
				}
			},
			{
				test: /\.s[ac]ss$/i,
				use: [
					'style-loader',
					'css-loader',
					'sass-loader',
				],
			},
		]
	}
};
