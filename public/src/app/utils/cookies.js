/**
 * cookies操作
 *
 * Created by BadWaka on 2017/4/24.
 */

/**
 * 读取cookie
 *
 * @param name
 * @return {*}
 */
export const getCookie = (name) => {
	const cookies = document.cookie;
	// console.log('cookies', cookies);
	let arr = cookies.split(';');
	for (let i = 0; i < arr.length; i++) {
		const key = arr[i].split('=')[0].trim();
		const value = arr[i].split('=')[1].trim();
		if (key === name) {
			return value;
		}
	}
	return null;
};

/**
 * 删除cookie
 *
 * @param name
 * @return {*}
 */
export const deleteCookie = (name) => {
	// 获得cookie
	const cookie = document.cookie;
	// console.log('cookie', cookie);
	let arr = cookie.split(';');	// cookie数组
	let newCookie = '';	// 新cookie
	let deleteValue = null;	// 被删除的值
	// 遍历查找
	for (let i = 0; i < arr.length; i++) {
		const key = arr[i].split('=')[0].trim();
		const value = arr[i].split('=')[1].trim();
		if (key !== name) {
			newCookie += key + '=' + value + ';';
		} else {
			deleteValue = value;
		}
	}
	// 赋给 document.cookie
	document.cookie = newCookie;
	// console.log('newCookie', newCookie);
	return deleteValue;
};
