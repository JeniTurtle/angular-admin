/**
 * 不想每次异步都定义三个action，所以通过notify + 状态码去dispatch action
 *
 * @Author: chenming
 * @Date:   2017-01-17T20:59:16+08:00
 * @Last modified by:   chenming
 * @Last modified time: 2017-02-16T10:30:19+08:00
 * @changed by waka 2017-05-26
 */

/**
 * import
 */

// Immutable
import {
	fromJS,
	toObject
} from 'immutable';

// 引入 md5 加密第三方库
import md5 from 'blueimp-md5';

// Popups action
import {
	showWarning,	// 显示警告
	showAlert,
} from './Popups';

// PersonalInfo action
import {
	setSmsRetrySurplusTime,	// 设置短信验证码剩余时间
	setModalBindPhoneNumberError,	// 设置绑定手机号模态框错误
	setModalAddRepresentativeWorksShowToggle,	// 设置添加代表作品对话框显示开关
	setBindPhoneNumberStatus,	// 设置绑定手机号状态
} from './PersonalInfo';

// utils
import {
	getCookie,	// 获得cookie
} from '../utils/funcs';

// http.config
import {
	apiHost,
	siteHost,
	httpTimeout,
} from './http.config';

// IPDetail 不知道为什么会有这个
import IPDetail from '../containers/IPDetail/IPDetail';

/**
 * 常量字符串
 */
export const NOTIFYCATS = 'HTTP/NOTIFYCATS';
export const NOTIFYUSER = 'HTTP/NOTIFYUSER';
export const NOTIFYIPS = 'HTTP/NOTIFYIPS';
export const NOTIFYONLINEIPS = 'HTTP/NOTIFYONLINEIPS';
export const NOTIFYMERGEIPS = 'HTTP/NOTIFYMERGEIPS';
export const NOTIFYIP = 'HTTP/NOTIFYIP';
export const NOTIFYCREATEIP = 'HTTP/NOTIFYCREATEIP';
export const NOTIFYUPDATEIP = 'HTTP/NOTIFYUPDATEIP';
export const NOTIFYPUBLISHIP = 'HTTP/NOTIFYPUBLISHIP';
export const NOTIFYDOWNCOPYRIGHT = 'HTTP/NOTIFYDOWNCOPYRIGHT';
export const NOTIFYADDCOPYRIGHT = 'HTTP/NOTIFYADDCOPYRIGHT';
export const NOTIFYDOWNIP = 'HTTP/NOTIFYDOWNIP';
export const NOTIFYDELIP = 'HTTP/NOTIFYDELIP';
export const NOTIFYAUTHORS = 'HTTP/NOTIFYAUTHORS';
export const NOTIFYAUTHORIPS = 'HTTP/NOTIFYAUTHORIPS';
export const NOTIFYADDAUTHOR = 'HTTP/NOTIFYADDAUTHOR';
export const NOTIFYDELAUTHOR = 'HTTP/NOTIFYDELAUTHOR';
export const NOTIFYUPDATEAUTHOR = 'HTTP/NOTIFYUPDATEAUTHOR';
export const NOTIFYSEARCHAUTHOR = 'HTTP/NOTIFYSEARCHAUTHOR';
export const NOTIFYORDERS = 'HTTP/ORDERS';
export const NOTIFYAUTHSTATE = "HTTP/AUTHSTATE";
export const NOTIFYAUTHDATA = "HTTP/AUTHDATA";
export const NOTIFYWORKSPACE = "HTTP/WORKSPACE";
export const NOTIFYWSBANNER = "HTTP/WSBANNER";
export const ORDERZONE = 'HTTP/ORDERZONE';
export const HIDDEN = 'HTTP/HIDDEN';
export const GETFIRSTINVALIDIP = 'HTTP/GETFIRSTINVALIDIP';
export const NOTIFYDELIVERS = 'HTTP/DELIVERS';
export const NOTIFYDELIVERDETAIL = 'HTTP/DELIVERDETAIL';
export const NOTIFYCOLLECTRECOMMEND = 'HTTP/COLLECTRECOMMEND';
export const NOTIFYCALLSTATE = 'HTTP/CALLSTATE';

// 登录登出
export const LOGOUT = 'HTTP/LOGOUT'; // 登出

// 关注（作品）
export const NOTIFY_FOLLOW_WORKS = 'HTTP/FOLLOW_WORKS'; // 关注的作品列表

// 关注（人）
export const NOTIFY_FOCUS_PEOPLE_MY_FOLLOW = 'HTTP/FOCUS_PEOPLE_MY_FOLLOW'; // 我关注的人列表
export const NOTIFY_FOCUS_PEOPLE_FOLLOW_ME = 'HTTP/FOCUS_PEOPLE_FOLLOW_ME'; // 关注我的人列表
export const NOTIFY_CHANGE_FOLLOW_STATUS = 'HTTP/CHANGE_FOLLOW_STATUS'; // 改变关注状态

// 个人信息
export const NOTIFY_FETCH_PERSONAL_INFO = 'HTTP/FETCH_PERSONAL_INFO'; // 获得个人信息 by cookie (包括邮箱、性别)
export const NOTIFY_FETCH_PERSONAL_INFO_BY_UID = 'HTTP/FETCH_PERSONAL_INFO_BY_UID'; // 获得个人信息 by uid
export const NOTIFY_UPDATE_PERSONAL_INFO_SEX_EMAIL_DESC = 'HTTP/UPDATE_PERSONAL_INFO_SEX_EMAIL_DESC'; // 更新个人信息（性别、邮箱、个人简介）
export const NOTIFYDESC = 'HTTP/NOTIFYDESC'; // 更新个人简介
export const NOTIFYAVATAR = 'HTTP/NOTIFYAVATAR'; // 更新头像
export const NOTIFY_REQUEST_SMS_CODE = 'HTTP/NOTIFY_REQUEST_SMS_CODE'; // 发送短信验证码
export const NOTIFY_VERIFY_SMS = 'HTTP/NOTIFY_VERIFY_SMS'; // 验证码验证接口
export const NOTIFY_SET_MOBILE = 'HTTP/NOTIFY_SET_MOBILE'; // 绑定手机
export const NOTIFY_SET_PASSWORD = 'HTTP/NOTIFY_SET_PASSWORD'; // 密码修改接口

// 代表作品
export const NOTIFY_FETCH_HISWORKS_BY_UID = 'HTTP/FETCH_HISWORKS_BY_UID'; // 代表作品列表 by uid
export const NOTIFYHISTORIES = 'HTTP/NOTIFYHISTORIES'; // 代表作品列表 by cookie
export const NOTIFYADDHISTORY = 'HTTP/NOTIFYADDHISTORY'; // 创建代表作品
export const NOTIFYDELHISTORY = 'HTTP/NOTIFYDELHISTORY'; // 删除代表作品
export const NOTIFYUPDATEHISTORY = 'HTTP/NOTIFYUPDATEHISTORY'; // 修改代表作品

/**
 * 一个通用的 action 生成器
 * @param type
 * @param data
 * @returns {{type: *, data: *}}
 */
function receiveData(type, data, error) {
	return {
		type: type,
		data: data
	};
}

export function fetchCallState(dispatch) {
	dispatch(receiveData(NOTIFYCALLSTATE, 0));

	return dispatch => $.ajax({
		url: apiHost + '/ip/ipcall/myipcallstat',
		data: {
			token: getCookie('X-AVOSCloud-Session-Token')
		},
		timeout: httpTimeout,
		dataType: 'jsonp'
	}).then(
		result => dispatch(receiveData(NOTIFYCALLSTATE, result.data)),
		e => dispatch(receiveData(NOTIFYCALLSTATE, -1, e))
	);
}

export function fetchCollectRecommend(dispatch) {
	dispatch(receiveData(NOTIFYCOLLECTRECOMMEND, 0));

	return dispatch => $.ajax({
		url: apiHost + '/ip/ipcall/calllist2?pn=0&rn=3&type=1&filter=1',
		data: {
			token: getCookie('X-AVOSCloud-Session-Token')
		},
		timeout: httpTimeout,
		dataType: 'jsonp'
	}).then(
		result => dispatch(receiveData(NOTIFYCOLLECTRECOMMEND, result.data)),
		e => dispatch(receiveData(NOTIFYCOLLECTRECOMMEND, -1, e))
	);
}

export function fetchDeliverDetail(dispatch, ipCallId) {
	dispatch(receiveData(NOTIFYDELIVERDETAIL, 0));

	return dispatch => $.ajax({
		url: apiHost + '/ip/ipcall/ipcallinfo?callback=cb&ipCallId=' + ipCallId,
		data: {
			token: getCookie('X-AVOSCloud-Session-Token')
		},
		timeout: httpTimeout,
		dataType: 'jsonp'
	}).then(
		result => dispatch(receiveData(NOTIFYDELIVERDETAIL, result.data)),
		e => dispatch(receiveData(NOTIFYDELIVERDETAIL, -1, e))
	);
}

export function fetchDelivers(dispatch, status = -1) {

	dispatch(receiveData(NOTIFYDELIVERS, 0));
	let statusStr = '';
	status !== -1 ? (statusStr = '&status=' + status) : '';
	return dispatch => $.ajax({
		url: apiHost + '/ip/ipcall/myiplist?callback=cb&pn=0&rn=20' + statusStr,
		data: {
			token: getCookie('X-AVOSCloud-Session-Token')
		},
		timeout: httpTimeout,
		dataType: 'jsonp'
	}).then(
		result => dispatch(receiveData(NOTIFYDELIVERS, result.data)),
		e => dispatch(receiveData(NOTIFYDELIVERS, -1, e))
	);
}

export function fetchWSBanner(dispatch) {
	dispatch(receiveData(NOTIFYWSBANNER, 0));

	return dispatch => $.ajax({
		url: apiHost + '/xpage/get?id=workspace_banner&callback=?',
		data: {
			token: getCookie('X-AVOSCloud-Session-Token')
		},
		timeout: httpTimeout,
		dataType: 'json'
	}).then(
		result => dispatch(receiveData(NOTIFYWSBANNER, result.data)),
		e => dispatch(receiveData(NOTIFYWSBANNER, -1, e))
	);
}

export function fetchWorkSpace(dispatch) {
	dispatch(receiveData(NOTIFYWORKSPACE, 0));

	return dispatch => $.ajax({
		url: apiHost + '/ip/workshop/list?callback=?',
		data: {
			token: getCookie('X-AVOSCloud-Session-Token')
		},
		timeout: httpTimeout,
		dataType: 'json'
	}).then(
		result => dispatch(receiveData(NOTIFYWORKSPACE, result.data)),
		e => dispatch(receiveData(NOTIFYWORKSPACE, -1, e))
	);
}

export function fetchAuthData(dispatch) {
	dispatch(receiveData(NOTIFYAUTHSTATE, 0));

	return dispatch => $.ajax({
		url: apiHost + '/sns/auth/getauthdata?callback=?',
		data: {
			token: getCookie('X-AVOSCloud-Session-Token')
		},
		timeout: httpTimeout,
		dataType: 'json'
	}).then(
		result => dispatch(receiveData(NOTIFYAUTHDATA, result.data)),
		e => dispatch(receiveData(NOTIFYAUTHDATA, -1, e))
	);
}

export function fetchAuthState(dispatch) {
	dispatch(receiveData(NOTIFYAUTHSTATE, 0));

	return dispatch => $.ajax({
		url: apiHost + '/sns/user/authstate?callback=?',
		data: {
			token: getCookie('X-AVOSCloud-Session-Token')
		},
		timeout: httpTimeout,
		dataType: 'json'
	}).then(
		result => dispatch(receiveData(NOTIFYAUTHSTATE, result.data)),
		e => dispatch(receiveData(NOTIFYAUTHSTATE, -1, e))
	);
}

export function fetchOrders(dispatch) {

	dispatch(receiveData(NOTIFYORDERS, 0));

	return dispatch => $.ajax({
		url: apiHost + '/conversation/order/getmyorder?callback=?',
		data: {
			token: getCookie('X-AVOSCloud-Session-Token')
		},
		timeout: httpTimeout,
		dataType: 'json'
	}).then(
		result => dispatch(receiveData(NOTIFYORDERS, result.data)),
		e => dispatch(receiveData(NOTIFYORDERS, -1, e))
	);
}

export function fetchCats(dispatch) {

	dispatch(receiveData(NOTIFYCATS, 0));

	return dispatch => $.ajax({
		url: siteHost + '/api/cats',
		timeout: httpTimeout,
		dataType: 'json'
	}).then(
		result => dispatch(receiveData(NOTIFYCATS, {
			data: result
		})),
		e => dispatch(receiveData(NOTIFYCATS, -1, e))
	);
}

export function fetchUser(dispatch) {

	dispatch(receiveData(NOTIFYUSER, 0));

	return dispatch => Promise.all([$.ajax({
		url: apiHost + '/sns/user/info?callback=?',
		data: {
			token: getCookie('X-AVOSCloud-Session-Token')
		},
		timeout: httpTimeout,
		dataType: 'json'
	}), $.ajax({
		url: apiHost + '/sns/user/authstate?callback=?',
		data: {
			token: getCookie('X-AVOSCloud-Session-Token')
		},
		timeout: httpTimeout,
		dataType: 'json'
	})]).then(
		result => {

			if (!result[0] || !result[1] || result[0].errno > 0 || result[1].errno > 0) {
				dispatch(receiveData(NOTIFYUSER, -1, result));
				return;
			}

			result[0].data.authState = result[1].data.authState;

			dispatch(receiveData(NOTIFYUSER, result[0].data));
		},
		e => dispatch(receiveData(NOTIFYUSER, -1, e))
	);

}

/******* 作者编辑相关 ***************/

/**
 * 显示或隐藏成交版权
 * @param dispatch
 * @param isShow
 * @param ipId
 * @return {function(*): (*|Request|Promise.<TResult>)}
 */
export function orderZone(dispatch, isShow, ipId) {

	dispatch(receiveData(ORDERZONE, 0));

	return dispatch => $.ajax({
		url: apiHost + '/ip/orderzoneupdate',
		method: 'POST',
		data: {
			token: getCookie('X-AVOSCloud-Session-Token'),
			orderzone: isShow ? 1 : 0,
			ipId
		},
		timeout: httpTimeout,
		dataType: 'json'
	}).then(
		result => {

			if (!result || result.code != 0) {
				dispatch(receiveData(ORDERZONE, -1, result));
				return;
			}

			dispatch(receiveData(ORDERZONE, result));
		},
		e => dispatch(receiveData(ORDERZONE, -1, e))
	);

}

/**
 * 上架或下架作品
 * @param dispatch
 * @param isHidden
 * @param id
 * @return {function(*): (*|Request|Promise.<TResult>)}
 */
export function hidden(dispatch, isHidden, id) {

	dispatch(receiveData(HIDDEN, 0));

	return dispatch => $.ajax({
		url: apiHost + '/ip/updown',
		method: 'POST',
		data: {
			token: getCookie('X-AVOSCloud-Session-Token'),
			status: isHidden ? 3 : 0,
			id
		},
		timeout: httpTimeout,
		dataType: 'json'
	}).then(
		result => {

			if (!result || result.code !== 0) {
				dispatch(receiveData(HIDDEN, -1, result));
				return;
			}

			dispatch(receiveData(HIDDEN, result));
		},
		e => dispatch(receiveData(HIDDEN, -1, e))
	);

}

export function fetchIPs(dispatch) {

	dispatch(receiveData(NOTIFYIPS, 0));

	return dispatch => $.ajax({
		url: siteHost + '/api/ip/list',
		xhrFields: {
			withCredentials: true
		}
	}).then(
		result => {

			if (!result || result.code != 0) {
				dispatch(receiveData(NOTIFYIPS, -1, result));
				return;
			}

			dispatch(receiveData(NOTIFYIPS, result));
		},
		e => dispatch(receiveData(NOTIFYIPS, -1, e))
	);
}

export function fetchIP(dispatch, id) {

	dispatch(receiveData(NOTIFYIP, 0));

	return dispatch => $.ajax({
		url: siteHost + '/api/ip/list',
		data: {
			id
		},
		timeout: httpTimeout,
		dataType: 'json',
		xhrFields: {
			withCredentials: true
		}
	}).then(
		result => {
			if (!result || result.code != 0) {
				dispatch(receiveData(NOTIFYIP, -1, result));
				return;
			}

			let queryId = result.data.publishedIp ? result.data.publishedIp.phpId : '';
			if (queryId)
				return $.ajax({
					url: apiHost + '/ip/iplist',
					data: {
						ipids: queryId,
						copyright: 1
					},
					dataType: 'json'
				}).then(
					onlineResult => {
						if (onlineResult.code > 0) {
							dispatch(receiveData(NOTIFYMERGEIPS, -1, onlineResult));
							return;
						}
						result.data.publishedIp = onlineResult.data[0];

						dispatch(receiveData(NOTIFYIP, result.data));

					},
					e => dispatch(receiveData(NOTIFYIP, -1, result))
				);
			else {
				return dispatch(receiveData(NOTIFYIP, result.data));
			}
		},
		e => dispatch(receiveData(NOTIFYIP, -1, e))
	);

}

export function fetchOnlineIPs(dispatch, uid, pn = 0, rn = 10, condition = {}) {

	dispatch(receiveData(NOTIFYONLINEIPS, 0));

	return dispatch => $.ajax({
		url: apiHost + '/ip/personlist',
		data: Object.assign({
			uid,
			pn,
			rn
		}, 'status' in condition ? {
			action: condition.status
		} : {}),
		timeout: httpTimeout,
		dataType: 'json'
	}).then(
		result => {
			if (!result || result.errno > 0) {
				dispatch(receiveData(NOTIFYONLINEIPS, -1, result));
				return;
			}
			if (result.data.length) {
				$.ajax({
					url: siteHost + '/api/ip/fromip/' + result.data.map(item => item.objectId).join(','),
					xhrFields: {
						withCredentials: true
					},
					dataType: 'json'
				}).then(r => {

					if (r.code != 0) {
						dispatch(receiveData(NOTIFYONLINEIPS, -1, e));
						return;
					}

					//兼容老数据
					r.data = r.data.filter(item => +item.status == 2 || +item.status == 0).map(item => {
						item.publishedIp = result.data.filter(i => i.objectId == item.publishedIp.objectId)[0];
						return item;
					});


					dispatch(receiveData(NOTIFYONLINEIPS, Object.assign(r, {
						//todo, fuck here
						// count: result.data.length,
						count: 1 //现在金老师没给分页，所以强制不出现分页条
					})));

				})
			} else {
				dispatch(receiveData(NOTIFYONLINEIPS, Object.assign(result, {
					count: result.data.length
				})));
			}
		},
		e => dispatch(receiveData(NOTIFYONLINEIPS, -1, e))
	);

}

export function getFirstInvalidIP(dispatch) {

	return dispatch => fetchMergeIPs(dispatch, 0, 20)(dispatch).then(ret => {

		if (!ret || !ret.data) {
			dispatch(receiveData(GETFIRSTINVALIDIP, false));
			return;
		}

		const invalid = ret.data.filter(item => IPDetail.validateDetail(fromJS(item).toObject()).length > 0);

		if (!invalid || !invalid.length) {
			dispatch(receiveData(GETFIRSTINVALIDIP, false));
		} else {
			dispatch(receiveData(GETFIRSTINVALIDIP, invalid[0]));
		}


	}, e => dispatch(receiveData(GETFIRSTINVALIDIP, false)))


}

/**
 * 信息需要同时从IPPRE表和IP表里取，因为IP表里只有线上作品
 * 先展现在售的，不够的用其他的补位
 * @param dispatch
 * @param pn
 * @param rn
 * @param condition
 * @return {function(*=)}
 */
export function fetchMergeIPs(dispatch, pn = 0, rn = 10, condition = {}) {

	dispatch(receiveData(NOTIFYMERGEIPS, 0));

	return dispatch => {
		return $.ajax({
			url: siteHost + '/api/ip/list',
			data: Object.assign({
				pn,
				rn
			}, typeof condition === 'string' ? {
				wd: condition
			} : ('status' in condition ? {
				status: condition.status
			} : {})),
			xhrFields: {
				withCredentials: true
			},
			dataType: 'json'
		}).then(
			totalResult => {

				if (totalResult.code !== 0) {
					dispatch(receiveData(NOTIFYMERGEIPS, -1, totalResult));
					return;
				}


				let queryList = [];
				let mapList = [];

				if (!totalResult.data) {
					dispatch(receiveData(NOTIFYMERGEIPS, totalResult));
					return;
				}

				totalResult.data.forEach(function (item, index) {
					if (item.publishedIp && item.publishedIp.phpId) {
						queryList.push(item.publishedIp.phpId);
						mapList.push(index);
					}
				});

				if (!queryList.length) {
					dispatch(receiveData(NOTIFYMERGEIPS, totalResult));
				} else {
					return $.ajax({
						url: apiHost + '/ip/iplist',
						data: {
							ipids: queryList.join(','),
							copyright: 1
						},
						dataType: 'json'
					}).then(
						onlineResult => {

							if (onlineResult.code > 0) {
								dispatch(receiveData(NOTIFYMERGEIPS, -1, onlineResult));
								return;
							}

							mapList.forEach(function (anchor, index) {
								totalResult.data[anchor].publishedIp = onlineResult.data[index];
							});

							dispatch(receiveData(NOTIFYMERGEIPS, totalResult));

							// 回到顶部
							let dom = document.getElementById('container');
							dom.scrollTop = 0;

							return totalResult;

						},
						e => dispatch(receiveData(NOTIFYMERGEIPS, -1, e))
					);

				}
			},
			e => dispatch(receiveData(NOTIFYMERGEIPS, -1, e))
		);
	}

}

/**
 * 添加可售版权
 * @param dispatch
 * @param cps
 * @param id
 * @return {function(*): (*|Request|Promise.<TResult>)}
 */
export function addCopyright(dispatch, cps, id) {

	dispatch(receiveData(NOTIFYADDCOPYRIGHT, 0));

	return dispatch => $.ajax({
		url: siteHost + '/api/ip/addCopyright/' + id,
		method: 'POST',
		data: JSON.stringify({
			copyright: cps
		}),
		contentType: 'application/json',
		timeout: httpTimeout,
		dataType: 'json',
		xhrFields: {
			withCredentials: true
		}
	}).then(
		result => {
			if (!result || result.code !== 0) {
				dispatch(receiveData(NOTIFYADDCOPYRIGHT, -1, e));
				return;
			}
			dispatch(receiveData(NOTIFYADDCOPYRIGHT, result));
		},
		e => dispatch(receiveData(NOTIFYADDCOPYRIGHT, -1, e))
	);
}

/**
 * 删除可售版权
 * @param dispatch
 * @param cps
 * @param lcps
 * @param wcps
 * @param id
 * @return {function(*): (*|Request|Promise.<TResult>)}
 */
export function downCopyright(dispatch, cps, lcps, wcps, id) {

	dispatch(receiveData(NOTIFYDOWNCOPYRIGHT, 0));

	return dispatch => $.ajax({
		url: siteHost + '/api/ip/delCopyright/' + id,
		method: 'POST',
		data: JSON.stringify({
			copyright: cps,
			lockCopyright: lcps,
			whichCopyright: wcps
		}),
		contentType: 'application/json',
		timeout: httpTimeout,
		dataType: 'json',
		xhrFields: {
			withCredentials: true
		}
	}).then(
		result => {
			if (!result || result.code != 0) {
				dispatch(receiveData(NOTIFYDOWNCOPYRIGHT, -1, result));
				return;
			}
			dispatch(receiveData(NOTIFYDOWNCOPYRIGHT, result));
		},
		e => dispatch(receiveData(NOTIFYDOWNCOPYRIGHT, -1, e))
	);
}

export function downWork(dispatch, workInfo, pn = 0, rn = 10) {

	dispatch(receiveData(NOTIFYDOWNIP, 0));

	return dispatch => $.ajax({
		url: siteHost + '/api/ip/down/' + workInfo.objectId,
		timeout: httpTimeout,
		dataType: 'json',
		xhrFields: {
			withCredentials: true
		}
	}).then(
		result => {

			if (!result || result.code != 0) {
				dispatch(receiveData(NOTIFYDOWNIP, -1, result));
				return;
			}
			dispatch(receiveData(NOTIFYDOWNIP, result));
			// dispatch(fetchMergeIPs(dispatch, pn, rn));
		},
		e => dispatch(receiveData(NOTIFYDOWNIP, -1, e))
	);
}

export function delWork(dispatch, workInfo) {

	dispatch(receiveData(NOTIFYDELIP, 0));

	return dispatch => $.ajax({
		url: siteHost + '/api/ip/delIPPRE',
		data: {
			id: workInfo.objectId
		},
		timeout: httpTimeout,
		dataType: 'json',
		xhrFields: {
			withCredentials: true
		}
	}).then(
		result => {
			if (!result || result.code != 0) {
				dispatch(receiveData(NOTIFYDELIP, -1, result));
				return;
			}
			dispatch(receiveData(NOTIFYDELIP, result));
			// dispatch(fetchMergeIPs(dispatch, pn, rn));
		},
		e => dispatch(receiveData(NOTIFYDELIP, -1, e))
	);

}

//dismissVerify 让后台忽略认证
export function createIP(dispatch, data, force = false) {

	dispatch(receiveData(NOTIFYCREATEIP, 0));

	return dispatch => $.ajax({
		url: siteHost + '/api/ip/create?dismissVerify=1',
		method: 'POST',
		data: JSON.stringify({
			ip: data
		}),
		timeout: httpTimeout,
		contentType: 'application/json',
		dataType: 'json',
		xhrFields: {
			withCredentials: true
		}
	}).then(
		result => {
			if (!result || result.code != 0) {
				dispatch(receiveData(NOTIFYCREATEIP, -1, result));
				return false;
			}

			if (force) {
				return dispatch(publishIP(dispatch, result.data.objectId));
			} else {
				dispatch(receiveData(NOTIFYCREATEIP, result.data));
			}

			return true;
		},
		e => dispatch(receiveData(NOTIFYCREATEIP, -1, e))
	);

}

//dismissVerify 让后台忽略认证
export function updateIP(dispatch, id, data, force = false, unAuth = false) {

	dispatch(receiveData(NOTIFYUPDATEIP, 0));

	return dispatch => $.ajax({
		url: siteHost + '/api/ip/save/' + id + '?dismissVerify=1',
		method: 'POST',
		data: JSON.stringify({
			ip: data
		}),
		timeout: httpTimeout,
		contentType: 'application/json',
		dataType: 'json',
		xhrFields: {
			withCredentials: true
		}
	}).then(
		result => {
			// console.log('updateIP', result);
			if (!result || result.code != 0) {
				dispatch(receiveData(NOTIFYUPDATEIP, -1, result));
				return false;
			}

			if (force) {
				return dispatch(publishIP(dispatch, id, unAuth ? 1 : 0));
			} else {
				dispatch(receiveData(NOTIFYUPDATEIP, result.data));
			}

			return true;

		},
		e => dispatch(receiveData(NOTIFYUPDATEIP, -1, e))
	);
}

export function publishIP(dispatch, id, unAuth) {
	dispatch(receiveData(NOTIFYPUBLISHIP, 0));

	return dispatch => $.ajax({
		url: siteHost + '/api/ip/submit/' + id,
		data: {
			unAuth
		},
		method: 'GET',
		timeout: httpTimeout,
		contentType: 'application/json',
		dataType: 'json',
		xhrFields: {
			withCredentials: true
		}
	}).then(
		result => {
			if (!result || result.code != 0) {
				dispatch(receiveData(NOTIFYPUBLISHIP, -1, result));
				return false;
			}

			dispatch(receiveData(NOTIFYPUBLISHIP, id));

			return true;
		},
		e => dispatch(receiveData(NOTIFYPUBLISHIP, -1, e))
	);
}

/******* 作者管理相关 ***************/

export function fetchAuthors(dispatch, pn = 0, rn = 10) {

	dispatch(receiveData(NOTIFYAUTHORS, 0));

	return dispatch => $.ajax({
		url: apiHost + '/sns/author/mylist?callback=?',
		data: {
			token: getCookie('X-AVOSCloud-Session-Token'),
			pn,
			rn
		},
		timeout: httpTimeout,
		dataType: 'json'
	}).then(
		result => {

			if (!result || result.errno > 0) {
				dispatch(receiveData(NOTIFYAUTHORS, -1, result));
				return;
			}

			dispatch(receiveData(NOTIFYAUTHORS, result.data));
		},
		e => dispatch(receiveData(NOTIFYAUTHORS, -1, e))
	);

}

export function addAuthor(dispatch, data, pn = 0, rn = 10) {

	dispatch(receiveData(NOTIFYADDAUTHOR, 0));

	data.works = JSON.stringify(data.works);

	return dispatch => $.ajax({
		url: apiHost + '/sns/author/create',
		data: Object.assign(data, {
			token: getCookie('X-AVOSCloud-Session-Token')
		}),
		method: 'POST',
		timeout: httpTimeout,
		dataType: 'json'
	}).then(
		result => {

			if (!result || result.errno > 0) {
				dispatch(receiveData(NOTIFYADDAUTHOR, -1, result));
				return;
			}

			dispatch(receiveData(NOTIFYADDAUTHOR, result.data));
			dispatch(fetchAuthors(dispatch, pn, rn));
		},
		e => dispatch(receiveData(NOTIFYADDAUTHOR, -1, e))
	);

}

export function deleteAuthor(dispatch, authorId, pn = 0, rn = 10) {

	dispatch(receiveData(NOTIFYDELAUTHOR, 0));
	return dispatch => $.ajax({
		url: apiHost + '/sns/author/delete',
		data: {
			authorId,
			token: getCookie('X-AVOSCloud-Session-Token')
		},
		timeout: httpTimeout,
		dataType: 'json'
	}).then(
		result => {

			if (!result || result.errno > 0) {
				dispatch(receiveData(NOTIFYDELAUTHOR, -1, result));
				return;
			}

			dispatch(receiveData(NOTIFYDELAUTHOR, result.data));
			dispatch(fetchAuthors(dispatch, pn, rn));
		},
		e => dispatch(receiveData(NOTIFYDELAUTHOR, -1, e))
	);

}

export function updateAuthor(dispatch, authorId, data, pn = 0, rn = 10) {

	dispatch(receiveData(NOTIFYUPDATEAUTHOR, 0));

	data.works = JSON.stringify(data.works);

	return dispatch => $.ajax({
		url: apiHost + '/sns/author/update',
		data: Object.assign(data, {
			authorId,
			token: getCookie('X-AVOSCloud-Session-Token')
		}),
		timeout: httpTimeout,
		method: 'POST',
		dataType: 'json'
	}).then(
		result => {

			if (!result || result.errno > 0) {
				dispatch(receiveData(NOTIFYUPDATEAUTHOR, -1, result));
				return;
			}

			dispatch(receiveData(NOTIFYUPDATEAUTHOR, result.data));
			dispatch(fetchAuthors(dispatch, pn, rn));
		},
		e => dispatch(receiveData(NOTIFYUPDATEAUTHOR, -1, e))
	);

}

export function getAuthorIPs(authorId, count = true) {


	return $.ajax({
		url: siteHost + '/api/ip/author/' + authorId,
		data: {
			authorId,
			count: count ? 1 : 0
		},
		timeout: httpTimeout,
		dataType: 'json',
		xhrFields: {
			withCredentials: true
		}
	})

}

export function searchAuthor(dispatch, name, pn = 0, rn = 10) {

	dispatch(receiveData(NOTIFYSEARCHAUTHOR, 0));

	return dispatch => $.ajax({
		url: apiHost + '/sns/author/search',
		data: {
			name,
			token: getCookie('X-AVOSCloud-Session-Token')
		},
		timeout: httpTimeout,
		dataType: 'json'
	}).then(
		result => {

			if (!result || result.errno > 0) {
				dispatch(receiveData(NOTIFYSEARCHAUTHOR, -1, result));
				return;
			}

			//搜索暂时没有分页
			dispatch(receiveData(NOTIFYSEARCHAUTHOR, {
				list: result.data,
				totalCount: result.data.length || 0
			}));
			// dispatch(fetchAuthors(dispatch, pn, rn));
		},
		e => dispatch(receiveData(NOTIFYSEARCHAUTHOR, -1, e))
	);

}

/**************************************** 登录登出 ****************************************/

/**
 * 登出
 * @param dispatch
 */
export function logout(dispatch) {
	// console.log('登出 logout');
	var originLocationHref = location.href;
	originLocationHref = encodeURIComponent(originLocationHref);
	return dispatch => $.ajax({
		url: 'http://www.yunlaiwu.com/dologout',
		timeout: httpTimeout,
		dataType: 'jsonp'
	}).then(
		result => {
			// console.log('【登出】【成功】result', result);
			location.href = 'http://www.yunlaiwu.com/home?towhere=' + originLocationHref;
		}, e => {
			// console.log('【登出】【失败】e', e);
			location.href = 'http://www.yunlaiwu.com/home?towhere=' + originLocationHref;
		}
	);
}

/**************************************** 关注（作品） ****************************************/

/**
 * 关注的作品列表
 * @param dispatch
 * @param pn    页数
 * @param rn    每页条数
 * @returns {function(*)}
 */
export function fetchFollowWorks(dispatch, pn = 0, rn = 10) {
	dispatch(receiveData(NOTIFY_FOLLOW_WORKS, 0));
	// console.log('token', getCookie('X-AVOSCloud-Session-Token'));
	// console.log('pn', pn);
	// console.log('rn', rn);
	return dispatch => $.ajax({
		url: apiHost + '/ip/mysubscribe',
		data: {
			token: getCookie('X-AVOSCloud-Session-Token'),
			pn: pn,
			rn: rn
		},
		timeout: httpTimeout,
		dataType: 'jsonp'
	}).then(
		result => {
			// 这里把分页的页数也带上，一起放在store里，方便组件确认页数
			result.pn = pn;
			result.rn = rn;
			// console.log('【请求关注的作品列表】【成功】result', result);
			// result.data.forEach(function (item) {
			// 	console.log(item.title);
			// })
			dispatch(receiveData(NOTIFY_FOLLOW_WORKS, result));
		},
		e => {
			// console.log('【请求关注的作品列表】【失败】e', e);
			dispatch(receiveData(NOTIFY_FOLLOW_WORKS, -1, e))
		}
	);
}

/**************************************** 关注（人） ****************************************/

/**
 * 我关注的人
 *
 * @param dispatch
 * @param pn    页数
 * @param rn    每页条数
 * @returns {function(*)}
 */
export function fetchPeopleMyFollow(dispatch, pn = 0, rn = 10) {
	dispatch(receiveData(NOTIFY_FOCUS_PEOPLE_MY_FOLLOW, 0));
	return dispatch => $.ajax({
		url: apiHost + '/sns/myfollow',
		data: {
			token: getCookie('X-AVOSCloud-Session-Token'),
			pn: pn,
			rn: rn,
		},
		timeout: httpTimeout,
		dataType: 'jsonp'
	}).then(
		result => {
			result.pn = pn;
			result.rn = rn;
			// console.log('【我关注的人】result', result);
			dispatch(receiveData(NOTIFY_FOCUS_PEOPLE_MY_FOLLOW, result));
		},
		e => {
			dispatch(receiveData(NOTIFY_FOCUS_PEOPLE_MY_FOLLOW, -1, e))
		}
	);
}

/**
 * 关注我的人
 *
 * @param dispatch
 * @param pn    页数
 * @param rn    每页条数
 * @returns {function(*)}
 */
export function fetchPeopleFollowMe(dispatch, pn = 0, rn = 10) {
	dispatch(receiveData(NOTIFY_FOCUS_PEOPLE_FOLLOW_ME, 0));
	return dispatch => $.ajax({
		url: apiHost + '/sns/followme',
		data: {
			token: getCookie('X-AVOSCloud-Session-Token'),
			pn: pn,
			rn: rn,
		},
		timeout: httpTimeout,
		dataType: 'jsonp'
	}).then(
		result => {
			result.pn = pn;
			result.rn = rn;
			// console.log('【关注我的人】result', result);
			dispatch(receiveData(NOTIFY_FOCUS_PEOPLE_FOLLOW_ME, result));
		},
		e => {
			dispatch(receiveData(NOTIFY_FOCUS_PEOPLE_FOLLOW_ME, -1, e))
		}
	);
}

/**
 * 改变关注状态
 *
 * @param dispatch
 * @param uid 人员唯一标识
 * @param isFollow    是否关注
 * @param pn
 * @param rn
 * @returns {function(*)}
 */
export function changeFollowStatus(dispatch, uid, isFollow, pn = 0, rn = 10) {
	dispatch(receiveData(NOTIFY_CHANGE_FOLLOW_STATUS, 0));
	return dispatch => $.ajax({
		url: apiHost + '/sns/follow',
		method: 'POST',
		data: {
			token: getCookie('X-AVOSCloud-Session-Token'),
			type: isFollow ? 'unfollow' : 'follow',
			uid: uid,
		},
		timeout: httpTimeout,
		dataType: 'jsonp'
	}).then(
		result => {

			if (!result || result.errno > 0) {
				dispatch(receiveData(NOTIFY_CHANGE_FOLLOW_STATUS, -1, result)); // 置为fail
				dispatch(showAlert(isFollow ? '取消关注失败' : '关注失败', 'error'));
				// dispatch(showWarning(result.errno + ' ' + result.errmsg, 'danger')); // 错误提示
				return;
			}
			dispatch(receiveData(NOTIFY_CHANGE_FOLLOW_STATUS, result));
			// dispatch(showWarning(isFollow ? '取消关注成功' : '关注成功', 'success')); // 成功提示
			dispatch(showAlert(isFollow ? '取消关注成功' : '关注成功', 'success'));
			dispatch(fetchPeopleMyFollow(dispatch, pn, rn));
			dispatch(fetchPeopleFollowMe(dispatch, pn, rn));
		},
		e => {
			// console.log('【改变关注状态】【错误】e', e);
			dispatch(receiveData(NOTIFY_CHANGE_FOLLOW_STATUS, -1, e))
		}
	);
}

/**************************************** 个人信息 ****************************************/

/**
 * 获得个人信息 by uid
 *
 * @param dispatch
 * @param uid    用户唯一标识
 * @returns {function(*)}
 */
export function fetchPersonalInfoByUid(dispatch, uid) {
	// console.log('fetchPersonalInfo uid', uid);
	dispatch(receiveData(NOTIFY_FETCH_PERSONAL_INFO_BY_UID, 0));
	return dispatch => $.ajax({
		url: apiHost + '/sns/user/info' + '?uid=' + uid,
		timeout: httpTimeout,
		dataType: 'jsonp'
	}).then(
		result => {
			// console.log('【获得个人信息】【成功】result', result);
			dispatch(receiveData(NOTIFY_FETCH_PERSONAL_INFO_BY_UID, result.data));
		},
		e => {
			// console.log('【获得个人信息】【错误】e', e);
			dispatch(receiveData(NOTIFY_FETCH_PERSONAL_INFO_BY_UID, -1, e))
		}
	);
}

/**
 * 获取个人信息 by cookie（包含邮箱、性别）
 *
 * @param dispatch
 * @returns {function(*)}
 */
export function fetchPersonalInfo(dispatch) {
	// console.log('用户信息接口 token', getCookie('X-AVOSCloud-Session-Token'));
	dispatch(receiveData(NOTIFY_FETCH_PERSONAL_INFO, 0));
	return dispatch => $.ajax({
		url: apiHost + '/sns/user/myinfo',
		data: {
			token: getCookie('X-AVOSCloud-Session-Token')
		},
		timeout: httpTimeout,
		dataType: 'jsonp'
	}).then(
		result => {
			// console.log('【获得个人信息】/sns/user/myinfo【成功】result', result);
			dispatch(receiveData(NOTIFY_FETCH_PERSONAL_INFO, result.data));
		},
		e => {
			// console.log('【获得个人信息】/sns/user/myinfo【错误】e', e);
			dispatch(receiveData(NOTIFY_FETCH_PERSONAL_INFO, -1, e))
		}
	);
}

/**
 * 更新个人信息（性别、邮箱、个人简介）
 *
 * @param dispatch
 * @param sex 性别
 * @param email 用户邮箱
 * @param desc 个人简介
 * @returns {function(*)}
 */
export function updatePersonalInfo(dispatch, sex, email, desc) {
	// console.log('更新个人信息 email', email, 'desc', desc);
	dispatch(receiveData(NOTIFY_UPDATE_PERSONAL_INFO_SEX_EMAIL_DESC, 0));
	const data = {
		token: getCookie('X-AVOSCloud-Session-Token'),
		sex: sex,
		desc: desc
	};
	if (email) {
		data.email = email;
	}
	return dispatch => $.ajax({
		url: apiHost + '/sns/luser/setuser',
		method: 'POST',
		data: data,
		timeout: httpTimeout,
		dataType: 'jsonp'
	}).then(
		result => {

			// console.log('【更新个人信息】【成功】result', result);
			if (!result || result.errno > 0) {
				dispatch(receiveData(NOTIFY_UPDATE_PERSONAL_INFO_SEX_EMAIL_DESC, -1, result));
				// 错误提示
				// dispatch(showWarning(result.errno + ' ' + result.errmsg, 'danger'));
				dispatch(showAlert('修改个人信息失败', 'error'));
				return;
			}

			// 成功提示
			// dispatch(showWarning('修改个人信息成功', 'success'));
			dispatch(showAlert('修改个人信息成功', 'success'));
			dispatch(receiveData(NOTIFY_UPDATE_PERSONAL_INFO_SEX_EMAIL_DESC, result));

			// 重新获得个人信息
			dispatch(fetchPersonalInfo(dispatch));
		},
		e => {
			// console.log('【更新个人信息】【错误】e', e);
			dispatch(receiveData(NOTIFY_UPDATE_PERSONAL_INFO_SEX_EMAIL_DESC, -1, e));
		}
	);
}

/**
 * 更新个人简介
 *
 * @param dispatch
 * @param desc
 */
export function updateUserDesc(dispatch, desc) {

	dispatch(receiveData(NOTIFYDESC, 0));
	return dispatch => $.ajax({
		url: apiHost + '/sns/user/update/desc',
		data: {
			desc,
			token: getCookie('X-AVOSCloud-Session-Token')
		},
		timeout: httpTimeout,
		dataType: 'json'
	}).then(
		result => {

			if (!result || result.errno > 0) {
				dispatch(receiveData(NOTIFYDESC, -1, result));
				return;
			}

			dispatch(receiveData(NOTIFYDESC, desc));
		},
		e => dispatch(receiveData(NOTIFYDESC, -1, e))
	);
}

/**
 * 更新头像
 *
 * @param dispatch
 * @param image
 * @return {function(*): *}
 */
export function updateUserAvatar(dispatch, image) {
	return dispatch => dispatch(receiveData(NOTIFYAVATAR, image));
}

/**
 * 发送短信验证码
 *
 * @param dispatch
 * @param mobile
 * @param smsType
 */
export function requestSmsCode(dispatch, mobile, smsType = 'sms') {

	dispatch(receiveData(NOTIFY_REQUEST_SMS_CODE, 0));

	const url = apiHost + '/sns/luser/requestsmscode';	// url
	const token = getCookie('X-AVOSCloud-Session-Token');	// token
	let validateCode = getCookie('xingcunzhenmb');	// 校验码
	validateCode = validateCode.substr(0, 4);	// 截取前4个字符
	validateCode = md5(md5(validateCode));	// 双重md5加密
	const validateKey = getCookie('validate_session');	// 校验key

	// console.log('发送验证码参数 url', url, 'mobile', mobile, 'smsType', smsType, 'token', token, 'validateCode', validateCode, 'validateKey', validateKey);

	return dispatch => $.ajax({
		url: apiHost + '/sns/luser/requestsmscode',
		data: {
			token: getCookie('X-AVOSCloud-Session-Token'),
			mobile,
			smsType,
			validateKey,
			validateCode
		},
		method: 'POST',
		timeout: httpTimeout,
		dataType: 'json'
	}).then(
		result => {

			// console.log('【发送短信验证码】result', result);

			if (!result || result.errno > 0) {
				dispatch(receiveData(NOTIFY_REQUEST_SMS_CODE, result));
				switch (result.errno) {
					case 601:
						dispatch(setModalBindPhoneNumberError('很抱歉，您发送的短信已超过每天5条的上限', result.errno));
						dispatch(showAlert('很抱歉，您发送的短信已超过每天5条的上限', 'error'));
						break;
					case 602:
						dispatch(setModalBindPhoneNumberError(result.errmsg, result.errno));
						break;
					default:
						// dispatch(showWarning('发送验证码失败，' + result.errno + ' ' + result.errmsg, 'danger'));
						dispatch(setModalBindPhoneNumberError('发送验证码失败，' + result.errno + ' ' + result.errmsg, 0));
						break;
				}
				return;
			}

			// dispatch(showWarning('发送验证码成功，请注意查收', 'success')); // 成功提示
			dispatch(receiveData(NOTIFY_REQUEST_SMS_CODE, result));
			dispatch(setSmsRetrySurplusTime(new Date().getTime() + 60 * 1000));

		},
		e => {
			// console.log('【发送短信验证码】【错误】e', e);
			dispatch(receiveData(NOTIFY_REQUEST_SMS_CODE, -1, e))
		}
	);
}

/**
 * 验证码验证接口
 *
 * @param dispatch
 * @param mobile 手机号
 * @param code 验证码
 */
export function verifySms(dispatch, mobile, code) {

	dispatch(receiveData(NOTIFY_VERIFY_SMS, 0));

	return dispatch => $.ajax({
		url: apiHost + '/sns/luser/verifysms',
		data: {
			token: getCookie('X-AVOSCloud-Session-Token'),
			mobile,
			code
		},
		method: 'POST',
		timeout: httpTimeout,
		dataType: 'json'
	}).then(
		result => {

			// console.log('【验证码验证】result', result);

			if (!result || result.errno > 0) {
				dispatch(receiveData(NOTIFY_VERIFY_SMS, result));
				// dispatch(showWarning('验证码验证失败，' + result.errno + ' ' + result.errmsg, 'danger')); // 错误提示
				dispatch(showAlert('验证码验证失败，' + result.errno + ' ' + result.errmsg, 'error'));
				return;
			}

			// dispatch(showWarning('验证码验证成功', 'success')); // 成功提示
			dispatch(showAlert('验证码验证成功', 'success'));
			dispatch(receiveData(NOTIFY_VERIFY_SMS, result));
		},
		e => {
			// console.log('【验证码验证】【错误】e', e);
			dispatch(receiveData(NOTIFY_VERIFY_SMS, -1, e));
		}
	);
}

/**
 * 绑定手机号
 *
 * @param dispatch
 * @param mobile
 * @param code
 * @return {function(*=): (Promise.<>|Request|*)}
 */
export function setMobile(dispatch, mobile, code) {

	dispatch(receiveData(NOTIFY_SET_MOBILE, 0));

	const data = {
		token: getCookie('X-AVOSCloud-Session-Token'),
		mobile,
		code
	};
	// console.log('setMobile data', data);

	return dispatch => $.ajax({
		url: apiHost + '/sns/luser/setmobile',
		data: data,
		method: 'POST',
		timeout: httpTimeout,
		dataType: 'json'
	}).then(
		result => {

			// console.log('绑定手机号 setMobile result', result);

			if (!result || result.errno > 0) {
				dispatch(receiveData(NOTIFY_SET_MOBILE, -1, result));
				switch (result.errno) {
					case 214:
						// dispatch(showWarning('绑定手机失败，该手机号已被注册', 'danger'));
						dispatch(setModalBindPhoneNumberError('绑定手机失败，该手机号已被注册', 1));
						break;
					case 2006:
						// dispatch(showAlert('绑定手机失败，验证码错误', 'error'));
						dispatch(setModalBindPhoneNumberError('绑定手机失败，验证码错误', 2));
						break;
					default:
						// dispatch(showWarning('绑定手机失败，' + result.errno + ' ' + result.errmsg, 'danger'));
						dispatch(showAlert('绑定手机失败，' + result.errno + ' ' + result.errmsg, 'error'));
						break;
				}
				return;
			}

			// dispatch(showWarning('绑定手机成功', 'success')); // 成功提示
			// dispatch(showAlert('绑定手机成功', 'success'));
			dispatch(receiveData(NOTIFY_SET_MOBILE, result.data));
			dispatch(setBindPhoneNumberStatus('success'));
			// dispatch(logout(dispatch));	// 登出
			// dispatch(fetchPersonalInfo(dispatch));
		},
		e => {
			// console.log('【绑定手机号】【错误】e', e);
			dispatch(receiveData(NOTIFY_SET_MOBILE, -1, e))
		}
	);
}

/**
 * 密码设置接口
 *
 * @param dispatch
 * @param password 密码
 * @param hash 哈希值
 */
export function setPassword(dispatch, password, hash) {

	dispatch(receiveData(NOTIFY_SET_PASSWORD, 0));

	return dispatch => $.ajax({
		url: apiHost + '/sns/luser/setpassword',
		data: {
			token: getCookie('X-AVOSCloud-Session-Token'),
			password,
			hash
		},
		method: 'POST',
		timeout: httpTimeout,
		dataType: 'json'
	}).then(
		result => {

			// console.log('【密码设置接口】result', result);

			if (!result || result.errno > 0) {
				dispatch(receiveData(NOTIFY_SET_PASSWORD, -1, result));
				// dispatch(showWarning('密码设置失败，' + result.errno + ' ' + result.errmsg, 'danger')); // 错误提示
				dispatch(showAlert('密码设置失败，' + result.errno + ' ' + result.errmsg, 'error'));
				return;
			}

			// dispatch(showWarning('密码设置接口成功', 'success')); // 成功提示
			dispatch(receiveData(NOTIFY_SET_PASSWORD, result));
		},
		e => {
			// console.log('【密码设置接口】【错误】e', e);
			dispatch(receiveData(NOTIFY_SET_PASSWORD, -1, e));
		}
	);
}

/**************************************** 代表作品 ****************************************/

/**
 * 代表作品列表 by uid
 *
 * @param dispatch
 * @param uid 用户唯一标识
 * @param pn
 * @param rn
 * @returns {function(*)}
 */
export function fetchHisworksByUid(dispatch, uid, pn = 0, rn = 10) {
	dispatch(receiveData(NOTIFY_FETCH_HISWORKS_BY_UID, 0));
	return dispatch => $.ajax({
		url: apiHost + '/sns/hisworks/list',
		data: {
			uid,
			pn,
			rn
		},
		timeout: httpTimeout,
		dataType: 'jsonp'
	}).then(
		result => {
			// console.log('【代表作品列表 by uid】【成功】result', result);
			dispatch(receiveData(NOTIFY_FETCH_HISWORKS_BY_UID, result));
		},
		e => {
			// console.log('【代表作品列表 by uid】【错误】e', e);
			dispatch(receiveData(NOTIFY_FETCH_HISWORKS_BY_UID, -1, e))
		}
	);
}

/**
 * 代表作品列表 by cookie
 *
 * @param dispatch
 * @param pn
 * @param rn
 * @return {function(*): (Request|*|Promise.<>)}
 */
export function fetchHistories(dispatch, pn = 0, rn = 10) {

	dispatch(receiveData(NOTIFYHISTORIES, 0));

	return dispatch => $.ajax({
		url: apiHost + '/sns/hisworks/list',
		data: {
			token: getCookie('X-AVOSCloud-Session-Token'),
			pn,
			rn
		},
		timeout: httpTimeout,
		dataType: 'json'
	}).then(
		result => {

			// console.log('【代表作品列表 by cookie】【成功】result', result);

			if (!result || result.errno > 0) {
				dispatch(receiveData(NOTIFYHISTORIES, -1, result));
				return;
			}

			dispatch(receiveData(NOTIFYHISTORIES, result.data));
		},
		e => {
			// console.log('【代表作品列表 by cookie】【错误】e', e);
			dispatch(receiveData(NOTIFYHISTORIES, -1, e))
		}
	);
}

/**
 * 创建代表作品
 *
 * @param dispatch
 * @param data
 * @param pn
 * @param rn
 * @return {function(*=): (Request|*|Promise.<>)}
 */
export function addHistory(dispatch, data, pn = 0, rn = 10) {

	dispatch(receiveData(NOTIFYADDHISTORY, 0));

	const reqData = {
		title: data.title,
		workType: data.workType,
		publishTime: data.publishTime,
		publisher: data.publisher,
		achievement: data.achievement,
		token: getCookie('X-AVOSCloud-Session-Token')
	};
	if (data.author) {
		reqData.author = data.author;
	}

	return dispatch => $.ajax({
		url: apiHost + '/sns/hisworks/create',
		data: reqData,
		method: 'POST',
		timeout: httpTimeout,
		dataType: 'json'
	}).then(
		result => {

			// console.log('【创建代表作品】【成功】result', result);

			if (!result || result.errno > 0) {
				// 置为fail
				dispatch(receiveData(NOTIFYADDHISTORY, -1, result));
				// 错误提示
				// dispatch(showWarning(result.errno + ' ' + result.errmsg, 'danger'));
				dispatch(showAlert('创建代表作品失败 ' + result.errno + ' ' + result.errmsg, 'error'));
				return;
			}

			// 成功提示
			// dispatch(showWarning('创建代表作品成功', 'success'));
			dispatch(showAlert('创建代表作品成功', 'success'));
			dispatch(receiveData(NOTIFYADDHISTORY, result.data));
			dispatch(fetchHistories(dispatch, pn, rn));
			dispatch(setModalAddRepresentativeWorksShowToggle(false));	// 关闭添加代表作品对话框
		},
		e => {
			// console.log('【创建代表作品】【错误】e', e);
			dispatch(receiveData(NOTIFYADDHISTORY, -1, e))
		}
	);
}

/**
 * 删除代表作品
 *
 * @param dispatch
 * @param hisworksId
 * @param pn
 * @param rn
 * @return {function(*=): (Request|*|Promise.<>)}
 */
export function deleteHistory(dispatch, hisworksId, pn = 0, rn = 10) {

	dispatch(receiveData(NOTIFYDELHISTORY, 0));

	return dispatch => $.ajax({
		url: apiHost + '/sns/hisworks/delete',
		data: {
			hisworksId,
			token: getCookie('X-AVOSCloud-Session-Token')
		},
		timeout: httpTimeout,
		dataType: 'json'
	}).then(
		result => {

			// console.log('【删除代表作品】【成功】result', result);

			if (!result || result.errno > 0) {
				dispatch(receiveData(NOTIFYDELHISTORY, -1, result));
				return;
			}

			dispatch(receiveData(NOTIFYDELHISTORY, result.data));
			dispatch(fetchHistories(dispatch, pn, rn));
		},
		e => {
			// console.log('【删除代表作品】【错误】e', e);
			dispatch(receiveData(NOTIFYDELHISTORY, -1, e))
		}
	);
}

/**
 * 修改代表作品
 *
 * @param dispatch
 * @param hisworksId
 * @param data
 * @param pn
 * @param rn
 * @return {function(*=)}
 */
export function updateHistory(dispatch, hisworksId, data, pn = 0, rn = 10) {

	dispatch(receiveData(NOTIFYUPDATEHISTORY, 0));

	const reqData = {
		hisworksId,
		title: data.title,
		workType: data.workType,
		publishTime: data.publishTime,
		publisher: data.publisher,
		achievement: data.achievement,
		token: getCookie('X-AVOSCloud-Session-Token')
	};
	if (data.author) {
		reqData.author = data.author;
	}

	return dispatch => $.ajax({
		url: apiHost + '/sns/hisworks/update',
		data: reqData,
		timeout: httpTimeout,
		method: 'POST',
		dataType: 'json'
	}).then(
		result => {

			// console.log('【修改代表作品】【成功】result', result);

			if (!result || result.errno > 0) {
				dispatch(receiveData(NOTIFYUPDATEHISTORY, -1, result));
				// 错误提示
				// dispatch(showWarning(result.errno + ' ' + result.errmsg, 'danger'));
				dispatch(showAlert('修改代表作品失败', 'error'));
				return;
			}

			// 成功提示
			dispatch(showAlert('修改代表作品成功', 'success'));
			dispatch(receiveData(NOTIFYUPDATEHISTORY, result.data));
			dispatch(fetchHistories(dispatch, pn, rn));
			dispatch(setModalAddRepresentativeWorksShowToggle(false));	// 关闭添加代表作品对话框
		},
		e => {
			// console.log('【修改代表作品】【错误】e', e);
			dispatch(receiveData(NOTIFYUPDATEHISTORY, -1, e))
		}
	);
}
