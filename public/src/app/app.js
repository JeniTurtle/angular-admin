/**
 * react
 */
import React from 'react';
import {
	render
} from 'react-dom';

/**
 * react-router
 */
import {
	Router,
	hashHistory
} from 'react-router';

import getRoutes from './routes';
import reducers from './reducers';

/**
 * redux
 */
import {
	createStore,			// 创建一个store
	applyMiddleware,		// 使用中间件
	compose				// 从左到右组合多个函数
} from 'redux';
import thunkMiddleware from 'redux-thunk';		// redux异步action中间件
import {
	Provider
} from 'react-redux';
import {
	routerMiddleware,
	syncHistoryWithStore
} from 'react-router-redux';

/**
 * stylesheet
 */
import './stylesheets/reset.css';

// ant-design
// import 'antd/dist/antd.less';	// 引入官方提供的 less 样式入口文件
// import './stylesheets/antDesignTheme.less';	// 用于覆盖上面定义的变量

// 推荐在入口文件全局设置 locale
import moment from 'moment';
import 'moment/locale/zh-cn';
// 设置日期语言
moment.locale('zh-cn');

/**
 * 日志
 */
if (window.NODE_SERVER_ENV !== 'production') {
	console.log('app.js 当前环境', window.NODE_SERVER_ENV);	// 该变量是从node层渲染ejs模板传过来的
	console.log('是否启用开发工具扩展', !!window.devToolsExtension);	// window.devToolsExtension是如果chrome里安装了Redux插件就会存在,这里加两个叹号是将function转化为boolean
}

/**
 * initial
 */
let store = null;

/**
 * middleware
 */
if (window.NODE_SERVER_ENV !== 'production') {
	const {
		persistState
	} = require('redux-devtools');

	const DevTools = require('./containers/DevTools/DevTools');

	store = compose(
		applyMiddleware(thunkMiddleware, routerMiddleware(hashHistory)),
		window.devToolsExtension ? window.devToolsExtension() : DevTools.instrument(),
		persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
	)(createStore)(reducers);
} else {
	// 生产环境
	store = applyMiddleware(thunkMiddleware, routerMiddleware(hashHistory))(createStore)(reducers);
}

/**
 * immutable support
 */
const history = syncHistoryWithStore(hashHistory, store, {
	selectLocationState(state) {
		return state.get('routing').toObject();
	}
});

/**
 * Channel Support
 */
const channelArr = location.hash.match(/channel=(\w*)/);
window.channel = channelArr && channelArr[1] || 'default';

/**
 * 以下代码的作用主要是判断是否启用 redux-devtools
 */
if (window.NODE_SERVER_ENV !== 'production' && !window.devToolsExtension) {
	const DevTools = require('./containers/DevTools/DevTools');
	render(
		<Provider store={store} key="provider">
			<div>
				<Router history={history}>
					{getRoutes(store)}
				</Router>
				{/*<DevTools/>*/}
			</div>
		</Provider>,
		document.getElementById('container')
	);
} else {
	render(
		<Provider store={store} key="provider">
			<Router history={history}>
				{getRoutes(store)}
			</Router>
		</Provider>,
		document.getElementById('container')
	);
}
