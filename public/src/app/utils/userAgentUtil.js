/**
 * 获得浏览器型号及版本
 * @return {string}
 */
export function getBrowserType() {
	let Sys = {};
	let ua = navigator.userAgent.toLowerCase();
	let s;
	let result = '';
	let type = '';
	let number = '';
	(s = ua.match(/rv:([\d.]+)\) like gecko/)) ? Sys.ie = s[1] :
		(s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
			(s = ua.match(/edge\/([\d.]+)/)) ? Sys.edge = s[1] :
				(s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
					(s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
						(s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
							(s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;
	// console.log('ua', ua);
	if (Sys.ie) {
		// console.log('IE: ' + Sys.ie);
		result = 'IE: ' + Sys.ie;
		type = 'IE';
		number = Sys.ie;
	}
	if (Sys.edge) {
		// console.log('Edge: ' + Sys.edge);
		result = 'Edge: ' + Sys.edge;
		type = 'Edge';
		number = Sys.edge;
	}
	if (Sys.firefox) {
		// console.log('Firefox: ' + Sys.firefox);
		result = 'Firefox: ' + Sys.firefox;
		type = 'Firefox';
		number = Sys.firefox;
	}
	if (Sys.chrome) {
		// console.log('Chrome: ' + Sys.chrome);
		result = 'Chrome: ' + Sys.chrome;
		type = 'Chrome';
		number = Sys.chrome;
	}
	if (Sys.opera) {
		// console.log('Opera: ' + Sys.opera);
		result = 'Opera: ' + Sys.opera;
		type = 'Opera';
		number = Sys.opera;
	}
	if (Sys.safari) {
		// console.log('Safari: ' + Sys.safari);
		result = 'Safari: ' + Sys.safari;
		type = 'Safari';
		number = Sys.safari;
	}
	return {
		result,
		type,
		number,
	};
}
