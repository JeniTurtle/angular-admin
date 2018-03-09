/**
 * 过滤 Emoji （字符串）
 * @param str
 */
export function filterEmojiStr(str) {
	return str.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, "");
}

/**
 * 过滤 Emoji （对象）
 * @param obj
 */
export function filterEmojiObj(obj) {
	for (let key in obj) {
		if (obj.hasOwnProperty(key)) {
			// console.log('key', key);
			if (typeof obj[key] === 'string') {
				obj[key] = filterEmojiStr(obj[key]);
			}
		}
	}
	return obj;
}
