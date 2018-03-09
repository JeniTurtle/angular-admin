'use strict';

const webpack = require('webpack');
const AssetsPlugin = require('assets-webpack-plugin');
const CleanPlugin = require('clean-webpack-plugin');
const path = require('path');

// 默认使用生产环境配置
let config = require('./webpack.config.base.js');

// 判断是否是生产环境
const isProduction = function () {
	return process.env.NODE_ENV === 'production';
};

console.log('webpack.config.js 当前环境', process.env.NODE_ENV);

// 生产环境
if (isProduction()) {
	config.output.publicPath = '/dist/';
	config.output.path = path.resolve(__dirname, 'public', 'dist');
	config.output.filename = '[name]-[hash:7].js';
	config.output.chunkFilename = '[name]-[chunkhash:7].js';
	config.plugins = [
		new CleanPlugin('public/dist'),
		new AssetsPlugin({
			path: path.resolve('public/dist/'),
			filename: 'manifest.json',
			prettyPrint: true
		}),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
		}),
		new webpack.optimize.UglifyJsPlugin({
			mangle: true,
			compress: {
				warnings: false
			}
		})
	];
}
// 开发环境
else {
	// 切换至开发环境配置
	config = require('./webpack.dev.config');
	config.output.publicPath = 'http://localhost:8080/assets/';
	config.plugins = [
		new webpack.HotModuleReplacementPlugin()
	];
	config.entry.push('webpack/hot/only-dev-server');
}
module.exports = config;
