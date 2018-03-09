const path = require('path');

module.exports = {

	// 入口
	entry: [
		path.resolve(__dirname, 'public/src/app/app.js')
	],

	output: {
		filename: 'main.js'
	},

	// 配置 sourceMap
	// devtool: 'eval-source-map',

	module: {

		// loaders
		loaders: [
			{
				test: /bootstrap\/js\//,
				loader: 'imports?jQuery=jquery'
			}, {
				test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
				loader: "url?limit=10000&minetype=application/font-woff"
			}, {
				test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
				loader: "url?limit=10000&minetype=application/font-woff"
			}, {
				test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
				loader: "url?limit=10000&minetype=application/octet-stream"
			}, {
				test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
				loader: "file"
			}, {
				test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
				loader: "url?limit=10000&minetype=image/svg+xml"
			}, {
				test: /\.css$/,
				loader: 'style!css?modules!autoprefixer-loader?browsers=last 2 versions'
			}, {
				test: /\.scss$/,
				loader: 'style!css?modules!sass'
			}, {
				test: /\.less$/,
				loader: 'style!css?postcss!less-loader?{"modifyVars":{"primary-color":"#434c5f"}}'
			}, {
				test: /\.js?$/,
				loaders: ['react-hot', 'babel'],
				exclude: /node_modules/
			}, {
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel'
			}, {
				test: /\.(png|jpg|gif)$/,
				loader: 'url-loader?limit=8192'
			}
		]
	},
	resolve: {
		extensions: ['', '.js', '.json', '.css']
	},
	// 外部扩展
	// externals: {
	// 	react: 'React',
	// 	'react-dom': 'ReactDOM'
	// }
};
