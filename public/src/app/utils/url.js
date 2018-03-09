/**
 * 路径操作
 *
 * Created by BadWaka on 2017/4/25.
 */

/**
 * 从url中查询参数
 *
 * @param url
 * @param key
 * @return {string}
 */
export const query = (url, key) => {

	let params = url.split('?')[1];
	// console.log('params', params);

	let value = null;
	let arr = params.split('&');
	for (let i = 0; i < arr.length; i++) {
		const keyTemp = arr[i].split('=')[0];
		const valueTemp = arr[i].split('=')[1];
		if (keyTemp === key) {
			value = valueTemp;
			break;
		}
	}
	return value;
};

