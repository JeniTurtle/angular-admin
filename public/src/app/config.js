require('babel-polyfill');

const environment = {
	development: {
		isProduction: false
	},
	production: {
		isProduction: true
	}
}[process.env.NODE_ENV || 'development'];

module.exports = Object.assign({
	host: process.env.HOST || 'localhost',
	port: process.env.PORT,
	apiHost: process.env.APIHOST || 'localhost',
	apiPort: process.env.APIPORT,
	app: {
		title: '作家后台',
		description: '云莱坞作家后台，世界上最牛逼的作家后台'
	}
}, environment);
