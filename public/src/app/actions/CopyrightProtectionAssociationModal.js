// util
import {
	getCookie,	// 获得cookie
} from '../utils/funcs';

// ant-design
import {
	message,	// 全局提示
} from 'antd';

import {
	fetchMergeIPs,
} from './HTTP';

/****************** 变量初始化 *******************/

import {
	apiHost,
	httpTimeout,
} from './http.config';

// ****************** 本地 action ******************* //

/**
 * 初始化版保关联数据
 * @param mode
 */
export const INIT_COPYRIGHT_PROTECTION = 'COPYRIGHT_PROTECTION_ASSOCIATION/INIT_COPYRIGHT_PROTECTION';
export const initCopyrightProtection = (data) => {
	return {
		type: INIT_COPYRIGHT_PROTECTION,
		data: data,
	}
};

/**
 * 改变当前选中的 copyId
 * @param currentSelectCopyId
 */
export const CHANGE_CURRENT_SELECT_COPYID = 'COPYRIGHT_PROTECTION_ASSOCIATION/CHANGE_CURRENT_SELECT_COPYID';
export const changeCurrentSelectCopyId = (currentSelectCopyId) => {
	return {
		type: CHANGE_CURRENT_SELECT_COPYID,
		data: currentSelectCopyId,
	}
};

/**
 * 改变当前版保关联的错误提示语
 * @param data
 */
export const CHANGE_CURRENT_COPYRIGHT_PROTECTION_ERROR_TIPS = 'COPYRIGHT_PROTECTION_ASSOCIATION/CHANGE_CURRENT_COPYRIGHT_PROTECTION_ERROR_TIPS';
export const changeCurrentCopyrightProtectionErrorTips = (data) => {
	return {
		type: CHANGE_CURRENT_COPYRIGHT_PROTECTION_ERROR_TIPS,
		data: data,
	}
};

/**
 * 改变当前版保关联的模式
 * @param mode
 */
export const CHANGE_CURRENT_COPYRIGHT_PROTECTION_MODE = 'COPYRIGHT_PROTECTION_ASSOCIATION/CHANGE_CURRENT_COPYRIGHT_PROTECTION_MODE';
export const changeCurrentCopyrightProtectionMode = (mode) => {
	return {
		type: CHANGE_CURRENT_COPYRIGHT_PROTECTION_MODE,
		data: mode,
	}
};

/**
 * 清空当前根据 copyId 获取的作品详情
 * @param data
 */
export const setWorkDetailByCopyId = (data) => {
	return {
		type: GET_WORK_DETAIL_BY_COPYID,
		data,
	}
};

// ****************** HTTP 请求 ******************* //

/**
 * 一个通用的 action 生成器
 * @param type
 * @param data
 * @param error
 * @returns {{type: *, data: *, error:*}}
 */
const actionGenerator = (type, data, error = null) => {
	return {
		type,
		data,
		error
	};
};

/**
 * 根据 cookie 获得版保记录
 * @param dispatch
 */
export const GET_COPYRIGHT_PROTECTION_RECORDS_BY_COOKIE = 'COPYRIGHT_PROTECTION_ASSOCIATION/GET_COPYRIGHT_PROTECTION_RECORDS_BY_COOKIE';
export const getCopyrightProtectionRecordsByCookie = (dispatch) => {
	dispatch(actionGenerator(GET_COPYRIGHT_PROTECTION_RECORDS_BY_COOKIE, {
		isLoading: true,
	}));

	return dispatch => $.ajax({
		url: apiHost + '/copy/myworklist?json=999',
		data: {
			token: getCookie('X-AVOSCloud-Session-Token'),
		},
		timeout: httpTimeout,
		dataType: 'jsonp'
	}).then(
		result => {
			// console.log('根据 cookie 获得版保记录 result', result);
			if (result.errno === 0 && result.data) {
				let array = [];
				for (let key in result.data) {
					if (result.data.hasOwnProperty(key)) {
						if (/\d/g.test(key)) {
							// 这里进行筛选，筛选出版保成功的项；通过 caid 字段过滤
							if (result.data[key].caid) {
								array.push(result.data[key]);
							}
							// array.push(result.data[key]);	// 未筛选的数据，测试用，用来测试
						}
					}
				}
				// console.log('筛选后的 array', array);
				dispatch(actionGenerator(GET_COPYRIGHT_PROTECTION_RECORDS_BY_COOKIE, {
					array,
					isLoading: false,
				}));
				// 默认的，如果 array 的长度大于0
				if (array.length > 0) {
					// 自动设置当前选中的 copyId 为第一项
					dispatch(changeCurrentSelectCopyId(array[0].copyId));
					// 改变当前模式
					dispatch(changeCurrentCopyrightProtectionMode(0));
				}
			}
		},
		e => {
			console.error(e);
			dispatch(actionGenerator(GET_COPYRIGHT_PROTECTION_RECORDS_BY_COOKIE, {
				isLoading: false,
			}, e));
			message.error(`根据 cookie 获得版保记录 失败 errno=${e.message}`);
		}
	);
};

/**
 * 根据 copyId 获得作品标题
 * @param dispatch
 * @param copyId
 */
export const GET_WORK_DETAIL_BY_COPYID = 'COPYRIGHT_PROTECTION_ASSOCIATION/GET_WORK_DETAIL_BY_COPYID';
export const getWorkDetailByCopyId = (dispatch, copyId) => {
	dispatch(actionGenerator(GET_WORK_DETAIL_BY_COPYID, {
		isLoading: true,
	}));

	return dispatch => $.ajax({
		url: apiHost + '/copy/worktitle?copyId=' + copyId,
		data: {
			token: getCookie('X-AVOSCloud-Session-Token'),
		},
		timeout: httpTimeout,
		dataType: 'jsonp'
	}).then(
		result => {
			console.log('根据 copyId 获得作品详情 result', result);
			if (result.errno === 0 && result.data) {
				dispatch(actionGenerator(GET_WORK_DETAIL_BY_COPYID, {
					data: result.data,
					isLoading: false,
				}));
			}
		},
		e => {
			console.error(e);
			dispatch(actionGenerator(GET_WORK_DETAIL_BY_COPYID, {
				isLoading: false,
			}, e));
			message.error(`根据 copyId 获得作品详情 失败 errno=${e.message}`);
		}
	);
};

/**
 * 根据 ippreId 获得 copyId
 * @param dispatch
 * @param ippreId
 */
export const GET_COPYID_BY_IPPREID = 'COPYRIGHT_PROTECTION_ASSOCIATION/GET_COPYID_BY_IPPREID';
export const getCopyIdByIppreId = (dispatch, ippreId) => {
	dispatch(actionGenerator(GET_COPYID_BY_IPPREID, {
		isLoading: true,
	}));

	return dispatch => $.ajax({
		url: apiHost + '/copy/ippresearch?ippreId=' + ippreId,
		data: {
			token: getCookie('X-AVOSCloud-Session-Token'),
		},
		timeout: httpTimeout,
		dataType: 'jsonp'
	}).then(
		result => {
			// console.log('【根据 ippreId 获得 copyId】result', result);
			if (result.errno === 0 && result.data instanceof Object && result.data.copyId) {
				dispatch(actionGenerator(GET_COPYID_BY_IPPREID, {
					copyId: result.data.copyId,
					isLoading: false,
				}));
			}
		},
		e => {
			console.error(e);
			dispatch(actionGenerator(GET_COPYID_BY_IPPREID, {
				isLoading: false,
			}, e));
			message.error(`【根据 ippreId 获得 copyId】失败 errno=${e.message}`);
		}
	);
};

/**
 * 版保关联
 * @param dispatch
 * @param data
 */
export const COPYRIGHT_PROTECTION_ASSOCIATION_BY_COPYID = 'COPYRIGHT_PROTECTION_ASSOCIATION/COPYRIGHT_PROTECTION_ASSOCIATION_BY_COPYID';
export const copyrightProtectionAssociationByCopyId = (dispatch, data) => {
	dispatch(actionGenerator(COPYRIGHT_PROTECTION_ASSOCIATION_BY_COPYID, {
		isLoading: true,
	}));

	return dispatch => $.ajax({
		url: apiHost + '/ip/ippre/bindcopy',
		method: 'POST',
		data: {
			token: getCookie('X-AVOSCloud-Session-Token'),
			leanId: data.leanId,
			copyId: data.copyId,
		},
		timeout: httpTimeout,
		dataType: 'jsonp'
	}).then(
		result => {
			// console.log('版保关联 result', result);
			if (result.errno === 0) {
				message.success(`恭喜您，版保关联成功`);
				// loading 状态置为原态，成功标识置为 true
				dispatch(actionGenerator(COPYRIGHT_PROTECTION_ASSOCIATION_BY_COPYID, {
					isLoading: false,
					isSuccess: true,	// 是否关联成功标识
				}));
				// 错误提示置为空
				dispatch(changeCurrentCopyrightProtectionErrorTips({
					errorTips: '',
					color: ''
				}));
				// 重新拉取数据
				dispatch(fetchMergeIPs(dispatch, 0, 20));
			} else {
				dispatch(actionGenerator(COPYRIGHT_PROTECTION_ASSOCIATION_BY_COPYID, {
					isLoading: false,
				}));
				if (result.errno === 1001) {
					message.error(`版保关联号有误，请检查后重试`);
					dispatch(changeCurrentCopyrightProtectionErrorTips({
						errorTips: '版保关联号有误，请检查后重试',
						color: 'red'
					}));
				}
				else if (result.errno === 2100) {
					message.error(`此版保关联号已被其他作品占用，请检查后重试`);
					dispatch(changeCurrentCopyrightProtectionErrorTips({
						errorTips: '此版保关联号已被其他作品占用，请检查后重试',
						color: 'red'
					}));
				}
				else {
					message.error(`errno=${result.errno} errmsg=${result.errmsg}`);
				}
			}

		},
		e => {
			console.error(e);
			dispatch(actionGenerator(COPYRIGHT_PROTECTION_ASSOCIATION_BY_COPYID, {
				isLoading: false,
			}, e));
			message.error(`版保关联 失败 errno=${e.message}`);
		}
	);
};
