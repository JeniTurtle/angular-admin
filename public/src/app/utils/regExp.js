/**
 * 正则表达式验证
 *
 * Created by BadWaka on 2017/4/24.
 */

/**
 * 校验手机号
 *
 * @param mobileNumber
 * @return {boolean}
 */
export const verifyMobileNumber = (mobileNumber) => {
	return /^1[34578]\d{9}$/.test(mobileNumber);
};

/**
 * 校验邮箱
 *
 * @param email
 * @return {boolean}
 */
export const verifyEmail = (email) => {
	const isCorrect = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(email);
	// console.log('isCorrect', isCorrect);
	return isCorrect;
};

/**
 * 校验短信验证码
 *
 * @param authCode
 * @return {boolean}
 */
export const verifyAuthCode = (authCode) => {
	return /^\d{6}$/.test(authCode);
};

/**
 * 去除首尾空格
 * @param string
 */
export const removeHeadTailSpace = (string) => {
	return string.replace(/^\s*|\s*$/, '');
};

/**
 * 去除首尾空格（传入一个对象 Object）
 * @param obj
 * @return {*}
 */
export const removeHeadTailSpaceObject = (obj) => {
	for (let key in obj) {
		if (obj.hasOwnProperty(key)) {
			if (typeof obj[key] === 'string') {
				obj[key] = removeHeadTailSpace(obj[key]);
			}
		}
	}
	return obj;
};


