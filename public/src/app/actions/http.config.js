/**
 * http 配置文件
 * @type {{apiHost: string, httpTimeout: number}}
 */
const httpConfig = {
	// PHP API 接口 host
	apiHost: window.NODE_SERVER_ENV !== 'production' ? 'http://testapi.yunlaiwu.com:8099' : 'http://api.yunlaiwu.com',	// 自动判断
	// apiHost: 'http://api.yunlaiwu.com',	// 显示使用生产环境
	// apiHost: 'http://testapi.yunlaiwu.com:8099',	// 显示使用测试环境

	// yunlaiwu.com 主页 host
	siteHost: 'http://www.yunlaiwu.com',
	// siteHost: 'http://r.yunlaiwu.com',
	// siteHost: 'http://test.yunlaiwu.com',

	// 超时时间
	httpTimeout: 10 * 1000,
};

// 本地开发环境也使用正式环境数据
// 测试环境也是用正式环境数据
if (window.NODE_SERVER_ENV === 'development' || window.NODE_SERVER_ENV === 'test') {
	httpConfig.apiHost = 'http://api.yunlaiwu.com';
	// httpConfig.apiHost = 'http://testapi.yunlaiwu.com:8099';
}

export default httpConfig;
