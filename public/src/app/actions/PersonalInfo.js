/**
 * 设置短信重置剩余时间
 * @param surplusTime
 * @return {{type: *, surplusTime: *}}
 */
export const SET_SMS_RETRY_SURPLUS_TIME = 'PERSONAL_INFO/SET_SMS_RETRY_SURPLUS_TIME';
export function setSmsRetrySurplusTime(surplusTime) {
	return {
		type: SET_SMS_RETRY_SURPLUS_TIME,
		surplusTime
	}
}

/**
 * 设置绑定手机号对话框错误
 * @param errorTips
 * @param errorNumber
 * @return {{type: string, error: {errorTips: *, errorNumber: *}}}
 */
export const SET_MODAL_BIND_PHONE_NUMBER_ERROR = 'PERSONAL_INFO/SET_MODAL_BIND_PHONE_NUMBER_ERROR';
export function setModalBindPhoneNumberError(errorTips, errorNumber) {
	return {
		type: SET_MODAL_BIND_PHONE_NUMBER_ERROR,
		error: {
			errorTips: errorTips,
			errorNumber: errorNumber
		}
	}
}

/****************************** 添加代表作品对话框 *******************************/

/**
 * 设置添加代表作品对话框显示开关
 * @param isShow 是否显示
 */
export const SET_MODEL_ADD_REPRESENTATIVE_WORKS_SHOW_TOGGLE = 'PERSONAL_INFO/SET_MODEL_ADD_REPRESENTATIVE_WORKS_SHOW_TOGGLE';
export function setModalAddRepresentativeWorksShowToggle(isShow) {
	return {
		type: SET_MODEL_ADD_REPRESENTATIVE_WORKS_SHOW_TOGGLE,
		isShow
	}
}

/**
 * 设置添加代表作品对话框数据
 * @param needUploadRepresentativeWorks 需要上传的代表作品信息
 */
export const SET_MODEL_ADD_REPRESENTATIVE_WORKS_DATA = 'PERSONAL_INFO/SET_MODEL_ADD_REPRESENTATIVE_WORKS_DATA';
export function setModalAddRepresentativeWorksData(needUploadRepresentativeWorksData) {
	return {
		type: SET_MODEL_ADD_REPRESENTATIVE_WORKS_DATA,
		needUploadRepresentativeWorksData
	}
}

/**
 * 设置添加代表作品对话框错误
 * @param errorTips
 * @param errorNumber
 * @return {{type: string, error: {errorTips: *, errorNumber: *}}}
 */
export const SET_MODEL_ADD_REPRESENTATIVE_WORKS_ERROR = 'PERSONAL_INFO/SET_MODEL_ADD_REPRESENTATIVE_WORKS_ERROR';
export function setModalAddRepresentativeWorksError(errorTips, errorNumber) {
	return {
		type: SET_MODEL_ADD_REPRESENTATIVE_WORKS_ERROR,
		error: {
			errorTips: errorTips,
			errorNumber: errorNumber
		}
	}
}

/**
 * 设置绑定手机号状态
 * @param status
 */
export const SET_BIND_PHONE_NUMBER_STATUS = 'PERSONAL_INFO/SET_BIND_PHONE_NUMBER_STATUS';
export function setBindPhoneNumberStatus(status) {
	return {
		type: SET_BIND_PHONE_NUMBER_STATUS,
		status
	}
}

