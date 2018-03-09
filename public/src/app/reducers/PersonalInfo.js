/**
 * 个人信息 reducer
 * Created by waka on 2017/4/19.
 */
import {
	NOTIFY_FETCH_PERSONAL_INFO,	// fetch 个人信息
	NOTIFY_UPDATE_PERSONAL_INFO_SEX_EMAIL_DESC,	// 更新个人信息
	NOTIFY_REQUEST_SMS_CODE,	// 发送短信验证码
	NOTIFY_VERIFY_SMS,	// 验证码验证接口
	NOTIFY_SET_MOBILE,	// 绑定手机
	NOTIFY_SET_PASSWORD,	// 密码修改接口
} from '../actions/HTTP';

import {
	SET_SMS_RETRY_SURPLUS_TIME,	// 设置短信剩余时间
	SET_MODAL_BIND_PHONE_NUMBER_ERROR,	// 设置绑定手机号对话框错误
	SET_MODEL_ADD_REPRESENTATIVE_WORKS_SHOW_TOGGLE,	// 设置添加代表作品对话框显示开关
	SET_MODEL_ADD_REPRESENTATIVE_WORKS_DATA,	// 设置添加代表作品对话框数据
	SET_MODEL_ADD_REPRESENTATIVE_WORKS_ERROR,	// 设置添加代表作品对话框错误
	SET_BIND_PHONE_NUMBER_STATUS,	// 设置绑定手机号状态
} from '../actions/PersonalInfo';

import {
	fromJS,
} from 'immutable';

import {
	processNotify
} from './HTTP';

export default function (state = fromJS({}), action) {

	// console.log('【reducers】【PersonalInfo.js】action', action);

	let data = fromJS(action.data);

	switch (action.type) {

		// 获得个人信息
		case NOTIFY_FETCH_PERSONAL_INFO:
			return processNotify(state, data);

		// 更新用户信息
		case NOTIFY_UPDATE_PERSONAL_INFO_SEX_EMAIL_DESC:
			return processNotify(state, data, 'processingUpdatePersonalInfo', true);

		// 发送短信验证码
		case NOTIFY_REQUEST_SMS_CODE:
			return processNotify(state, data, 'proccessingRequestSmsCode', true);

		// 验证码验证接口
		case NOTIFY_VERIFY_SMS:
			return state.set('proccessingVerifySms', data);

		// 绑定手机
		case NOTIFY_SET_MOBILE:
			return processNotify(state, data, 'proccessingSetMobile', true);

		// 密码修改接口
		case NOTIFY_SET_PASSWORD:
			return processNotify(state, data, 'proccessingSetPassword', true);

		// 设置短信剩余时间
		case SET_SMS_RETRY_SURPLUS_TIME:
			return state.set('smsRetrySurplusTime', action.surplusTime);

		// 设置绑定手机号对话框错误
		case SET_MODAL_BIND_PHONE_NUMBER_ERROR:
			return state.set('modalBindPhoneNumberError', action.error);

		// 设置绑定手机号状态
		case SET_BIND_PHONE_NUMBER_STATUS:
			return state.set('bindPhoneNumberStatus', action.status);

		/****************************** 添加代表作品对话框 *******************************/

		// 设置添加代表作品对话框显示开关
		case SET_MODEL_ADD_REPRESENTATIVE_WORKS_SHOW_TOGGLE:
			return state.set('modalAddRepresentativeWorksShowToggle', action.isShow);

		// 设置添加代表作品对话框数据
		case SET_MODEL_ADD_REPRESENTATIVE_WORKS_DATA:

			// 如果不传数据
			if (!action.needUploadRepresentativeWorksData) {
				// 清空数据
				return state.set('modalAddRepresentativeWorksData', null);
			}

			let newModalAddRepresentativeWorksData = null;	// 要填的新数据
			const originModalAddRepresentativeWorksData = state.get('modalAddRepresentativeWorksData');	// 获得老数据
			if (originModalAddRepresentativeWorksData) {	// 如果老数据有值
				const propertyArr = Object.keys(action.needUploadRepresentativeWorksData);	// 遍历新数据的所有属性
				propertyArr.forEach((item, index) => {
					originModalAddRepresentativeWorksData[item] = action.needUploadRepresentativeWorksData[item];	// 把新数据的属性赋值给老数据
				});
				newModalAddRepresentativeWorksData = originModalAddRepresentativeWorksData;	// 要填写的新数据就是更改后的老数据
			} else {	// 如果老数据没有值，直接使用新数据
				newModalAddRepresentativeWorksData = action.needUploadRepresentativeWorksData;
			}
			return state.set('modalAddRepresentativeWorksData', newModalAddRepresentativeWorksData);

		// 设置添加代表作品对话框错误
		case SET_MODEL_ADD_REPRESENTATIVE_WORKS_ERROR:
			return state.set('modalAddRepresentativeWorksError', action.error);

		default:
			return state;
	}
}
