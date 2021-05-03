const path = require('path');

/* polyfills optional */
// const polyfills = ['core-js', 'regenerator-runtime/runtime'];
// const polyfills = ['promise-polyfill/src/polyfill'];
const polyfills = [];

module.exports = {
	entry: [...polyfills, './src/index.js'],

	output: {
		path: path.resolve(__dirname, 'build'),
		filename: 'script.js',
	},

	devServer: {
		contentBase: path.resolve(__dirname, 'build'),
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
			}
		]
	}
};
