/**
 * 得到字符串的长度（除去特殊字符）
 * @param string 要处理的字符串
 * @param regExp 正则
 * @return {number}
 */
export function getLengthOfStringRemoveSpecialChar(string, regExp) {
	const newString = string.replace(regExp, '');
	return newString.length;
}
