const express = require('express');
const compression = require('compression');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const PORT = 8001;
const SSLPORT = 9001;
const app = express();
const pmx = require('pmx');
const morgan = require('morgan');
const fs = require('fs');
const http = require('http');
const https = require('https');
const request = require('request');
const console = require('tracer').colorConsole(); // 增强console
const FormData = require('form-data');
const multer = require('multer');	// Multer 是一个 node.js 中间件，用于处理 multipart/form-data 类型的表单数据, 它主要用于上传文件. 它是写在 busboy 之上非常高效
const upload = multer({
	dest: './uploads/',	// 定义文件上传时的临时目录
});
const md5 = require('md5');	// md5

const privateKey = fs.readFileSync(process.env.NODE_ENV === 'production' ? '/home/work/node/ssl/yunlaiwu.key' : '../../ssl/yunlaiwu.key', 'utf8');
const certificate = fs.readFileSync(process.env.NODE_ENV === 'production' ? '/home/work/node/ssl/yunlaiwu.crt' : '../../ssl/yunlaiwu.crt', 'utf8');
const credentials = {
	key: privateKey,
	cert: certificate
};

// pmx 相当于日志监控
pmx.init({
	http: true,	// (default: true) HTTP routes logging
	errors: true,
	custom_probes: true,	// (default: true) Auto expose JS Loop Latency and HTTP req/s as custom metrics
	network: true 	// (default: false) Network monitoring at the application level
});

app.use(compression());
app.use(express.static('public', {
	maxAge: 3600000 * 24	// Set the max-age property of the Cache-Control header in milliseconds or a string in ms format
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json({
	limit: "10000kb"
}));
app.use(bodyParser.urlencoded({
	extended: false,	// parsing the URL-encoded data with the querystring library
	limit: "10000kb"
}));

// cookieParser 解析cookie
app.use(cookieParser());

// morgan 一个日志库
app.use(morgan('combined'));

/******* route ********/

// 代理上传头像接口
app.post('/uploadAvatar', upload.single('avatar'), function (req, res) {
	const url = 'http://api.yunlaiwu.com/sns/resume/avatar';
	// 这里将文件名 encodeURIComponent 下，因为如果有特殊字符会导致大问题
	// req.file.originalname = req.file.originalname.replace('\s', '');
	console.debug('/uploadAvatar req.file', req.file);
	console.debug('/uploadAvatar req.body', req.body);
	// 拿到用户ID 生成文件ID
	const userId = req.body.userId;
	const randomUserId = userId + Math.random().toString(16);
	// 拿到文件扩展名
	const imgExtension = req.body.imgExtension;
	console.debug('randomUserId', randomUserId);
	const newFileName = md5(randomUserId) + imgExtension;
	console.debug('newFileName', newFileName);
	req.file.originalname = newFileName;
	console.debug('req.headers.cookie', req.headers.cookie);

	fs.rename(req.file.path, "uploads/" + req.file.originalname, function (err) {
		if (err) {
			throw err;
		}
		console.debug('上传成功头像!');

		const avatarPath = path.resolve(__dirname, "uploads/" + req.file.originalname);

		const post = request.post({
			url: url,
			headers: {
				cookie: req.headers.cookie,
			},
		}, function (error, response, body) {
			fs.unlinkSync(avatarPath);	// 删除本地保存的图片
			if (error) {
				console.error(error);
				throw error;
			}
			console.debug('response.statusCode:', response && response.statusCode);
			console.debug('body:', body);
			try {
				res.json(JSON.parse(body));
			} catch (e) {
				console.error(e);
				res.send(body);
			}
		});
		const form = post.form();
		form.append('file', fs.createReadStream(avatarPath));
	});
});

// 测试是否文件流是否可用
// app.use('/getAvatar', function (req, res) {
// 	const avatarPath = path.resolve(__dirname, "uploads/QQ20170625-233057@2x.png");
// 	const rs = fs.createReadStream(avatarPath);
// 	console.debug('rs', rs);
// 	rs.on('open', function () {
// 		rs.pipe(res);
// 	});
// 	rs.on('error', function (err) {
// 		res.end(err);
// 	});
// });

// 代理生成简历PDF接口
app.use('/resume/phantom', function (req, res) {
	const id = req.query.id;
	console.debug('id', id);
	if (!id) {
		res.json({
			errno: -1,
			errmsg: '未传用户id'
		});
		return;
	}
	const url = 'http://usb.yunlaiwu.com/resume/phantom?id=' + id;
	request({
		url: url,
		headers: {
			cookie: req.headers.cookie,
		},
	}, function (error, response, body) {
		console.debug('statusCode:', response && response.statusCode);
		console.debug('body:', body);
		if (error) {
			console.error(error);
			res.status(500).send(error.message);
			return;
		}
		try {
			res.json(JSON.parse(body));
		} catch (e) {
			console.error(e);
			res.send(body);
		}
	});
});

// pv 不知道有啥用
app.get('/pv/*', function (req, res) {
	res.render('pv');
});

// immutable测试页
app.get('/immutable', function (req, res) {
	res.render('immutable');
});

// 去重测试页
app.get('/quchong', function (req, res) {
	res.render('quchong');
});

// edm页不知道干嘛的
app.get('/edm', function (req, res) {
	res.render('edm');
});

// sms 路由会报错，因为找不到 /home/work/node/notifications 这个模块
app.get('/sms', function (req, res) {
	const spawn = require("child_process").spawn;
	const notifyList = require("/home/work/node/notifications");
	require('/home');
	const data = req.body;

	if (!data || !data.event) res.end('no data to commit!');

	const content = '报警类型：' + data.event + '\n具体消息：' + JSON.stringify(data.data.data).substr(0, 20) + '...\nServer：' + data.data.process.server;
	const process = spawn('python', ["/home/work/node/ucloud_sdk/send_sms.py", notifyList.join('|'), content]);

	res.end('ok');
});

// 组件测试页
app.get('/componentsDemo', function (req, res) {
	res.render('components-demo', {
		srcPath: 'http://localhost:8080/assets/components-demo.js'
	});
});

// 主页
app.get('/', function (req, res) {
	// 如果请求的安全字段为true或者协议为https，则重定向至http://user.yunlaiwu.com
	if (req.secure || req.protocol === 'https') {
		res.redirect('http://user.yunlaiwu.com');	// 这里原来写的是http://user.yulaiwu.com，少了一个字母
		return;
	}

	// user agent 用来判断用户的一些硬件及软件的型号及版本
	const ua = req.headers['user-agent'];
	const msie = /msie\s(\d+)/i.exec(ua);	// 是Microsoft IE的缩写

	// add ie 11 detection
	if (msie || /rv:([^\)]+)\) like Gecko/.test(ua)) {
		res.render('browser');	// 返回浏览器过低的提示
		return;
	}

	// 如果没有登录，就重定向到pc登录页
	if (!req.cookies || !req.cookies['X-AVOSCloud-Session-Token']) {
		res.redirect('http://www.yunlaiwu.com/userlogin?towhere=' + encodeURIComponent('http://user.yunlaiwu.com'));
		return;
	}

	// 渲染ejs模板
	res.render('index', {
		getResources: function () {
			// 生产环境的js从./public/dist/manifest.json配置文件中获取
			if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test') {
				const manifest = require('./public/dist/manifest.json');
				return [
					manifest.main.js
				];
			}
			// 开发环境的js是webpack-dev-server生成的main.js，未压缩
			else {
				return [
					'http://localhost:8080/assets/main.js'
				];
			}
		},
		NODE_SERVER_ENV: process.env.NODE_ENV
	});

	if (process.env.NODE_ENV === 'production') {
		pmx.emit('pv:success', {
			ua: req.headers['user-agent']
		});
	}
});

// TODO 该中间件使用的位置必须在定义完路由之后，原因不详... 实测发现放在`/`路由之前，一次请求会进行多次重定向操作
// 使用一个自定义中间件
app.use(function (req, res, next) {

	res.redirect('/');	// 重定向至'/'

	if (process.env.NODE_ENV === 'production') {
		pmx.emit('pv:fail', {
			ua: req.headers['user-agent']
		});
	}
});

// 启动服务器
http.createServer(app).listen(PORT, function () {
	console.info('User app is running, port:', PORT);
	console.info('当前环境', process.env.NODE_ENV);
});
