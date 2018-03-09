// util
import {
	getCookie,	// 获得cookie
} from '../utils/funcs';
import {
	downloadFile,	// 下载文件
} from '../utils/download';

// ant-design
import {
	message,	// 全局提示
} from 'antd';

/****************** 变量初始化 *******************/

import {
	apiHost,
	httpTimeout,
} from './http.config';

// ****************** 本地状态 ******************* //

// 全局

/**
 * 表单项错误提示
 * @param formId 表单ID
 * @param errorTips 错误提示
 */
export const FORM_ITEM_ERROR_TIPS = 'MY_RESUME/FORM_ITEM_ERROR_TIPS';
export const formItemErrorTips = (formId, errorTips) => {
	return {
		type: FORM_ITEM_ERROR_TIPS,
		data: {
			formId,
			errorTips
		},
	}
};

/**
 * 改变简历锚点
 * @param anchorNumber 锚点数字
 */
export const CHANGE_RESUME_ANCHOR = 'MY_RESUME/CHANGE_RESUME_ANCHOR';
export const changeResumeAnchor = (anchorNumber) => {
	return {
		type: CHANGE_RESUME_ANCHOR,
		data: anchorNumber,
	}
};

/**
 * 改变简历完成度
 * @param percent 百分比
 */
export const CHANGE_RESUME_PERCENT = 'MY_RESUME/CHANGE_RESUME_PERCENT';
export const changeResumePercent = (percent) => {
	return {
		type: CHANGE_RESUME_PERCENT,
		data: percent,
	}
};

// 上传头像

/**
 * 修改上传头像
 * @param data
 */
export const CHANGE_UPLOAD_AVATAR = 'MY_RESUME/CHANGE_UPLOAD_AVATAR';
export const changeUploadAvatar = (data) => {
	return {
		type: CHANGE_UPLOAD_AVATAR,
		data: data,
	}
};

// 基本信息

/**
 * 切换基本信息编辑状态
 * @param isEdit
 */
export const CHANGE_BASE_INFO_EDIT_STATUS = 'MY_RESUME/CHANGE_BASE_INFO_EDIT_STATUS';
export const changeBaseInfoEditStatus = (isEdit) => {
	// console.log('【action】【changeBaseInfoEditStatus】');
	return {
		type: CHANGE_BASE_INFO_EDIT_STATUS,
		data: isEdit,
	}
};

/**
 * 修改基本信息(编辑态)表单
 * @param baseInfoEditForm
 */
export const CHANGE_BASE_INFO_EDIT_FORM = 'MY_RESUME/CHANGE_BASE_INFO_EDIT_FORM';
export const changeBaseInfoEditForm = (baseInfoEditForm) => {
	return {
		type: CHANGE_BASE_INFO_EDIT_FORM,
		data: baseInfoEditForm,
	}
};

// 代表作品

/**
 * 切换代表作品编辑状态
 * @param isEdit
 */
export const CHANGE_WORKS_ADD_STATUS = 'MY_RESUME/CHANGE_WORKS_ADD_STATUS';
export const changeWorksAddStatus = (isEdit) => {
	return {
		type: CHANGE_WORKS_ADD_STATUS,
		data: isEdit,
	}
};

/**
 * 修改代表作品数组
 * @param worksArray
 */
export const CHANGE_WORKS_ARRAY = 'MY_RESUME/CHANGE_WORKS_ARRAY';
export const changeWorksArray = (worksArray) => {
	return {
		type: CHANGE_WORKS_ARRAY,
		data: worksArray,
	}
};

/**
 * 根据 id 修改代表作品数组中特定的值
 * @param workItemId
 * @param key
 * @param value
 */
export const CHANGE_WORKS_ARRAY_KEY_VALUE_BY_ID = 'MY_RESUME/CHANGE_WORKS_ARRAY_KEY_VALUE_BY_ID';
export const changeWorksArrayKeyValueById = (workItemId, key, value) => {
	return {
		type: CHANGE_WORKS_ARRAY_KEY_VALUE_BY_ID,
		id: workItemId,
		key,
		value,
	}
};

// 教育经历

/**
 * 修改教育经历添加状态
 * @param isAdd
 */
export const CHANGE_EDUCATION_ADD_STATUS = 'MY_RESUME/CHANGE_EDUCATION_ADD_STATUS';
export const changeEducationAddStatus = (isAdd) => {
	return {
		type: CHANGE_EDUCATION_ADD_STATUS,
		data: isAdd,
	}
};

/**
 * 修改教育经历数组
 * @param educationArray
 */
export const CHANGE_EDUCATION_ARRAY = 'MY_RESUME/CHANGE_EDUCATION_ARRAY';
export const changeEducationArray = (educationArray) => {
	return {
		type: CHANGE_EDUCATION_ARRAY,
		data: educationArray,
	}
};

/**
 * 根据 id 修改教育经历数组中特定的值
 * @param educationItemId
 * @param key
 * @param value
 */
export const CHANGE_EDUCATION_ARRAY_KEY_VALUE_BY_ID = 'MY_RESUME/CHANGE_EDUCATION_ARRAY_KEY_VALUE_BY_ID';
export const changeEducationArrayKeyValueById = (educationItemId, key, value) => {
	return {
		type: CHANGE_EDUCATION_ARRAY_KEY_VALUE_BY_ID,
		id: educationItemId,
		key,
		value,
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
 * 上传头像
 * @param dispatch
 * @param formData
 * @param userId
 */
export const UPLOAD_AVATAR = 'MY_RESUME/UPLOAD_AVATAR';	// 获得简历详情
export const uploadAvatar = (dispatch, formData, userId) => {
	dispatch(actionGenerator(UPLOAD_AVATAR, 'loading'));

	return dispatch => $.ajax({
		url: `/uploadAvatar`,
		type: 'POST',
		processData: false,
		contentType: false,
		data: formData,
		timeout: httpTimeout,
		dataType: 'json'
	}).then(
		result => {
			// console.log('上传头像 result', result);
			// 上传成功
			if (result.errno === 0) {
				dispatch(actionGenerator(UPLOAD_AVATAR, result.url));
				message.success('上传头像成功');
				dispatch(fetchResumeDetail(dispatch, userId));	// 重新拉取数据
				dispatch(changeUploadAvatar({
					isShowModal: false,
					isShowReactCrop: false,
					crop: {
						x: 0,
						y: 0,
						width: 75,	// 宽度
						height: 75,
						aspect: 1,	// 宽高比
					},	// 裁剪参数对象
					imgData: '',	// 图像数据
					imgExtension: '',	// 文件扩展名
				}));
			} else {
				message.error(`上传头像 失败 errno=${result.errno} errmsg=${result.errmsg}`);
				dispatch(actionGenerator(UPLOAD_AVATAR, 'error'));
			}
		},
		e => {
			console.error(e);
			dispatch(actionGenerator(UPLOAD_AVATAR, 'error', e));
			message.error(`上传头像 失败 errno=${e.message}`);
		}
	);
};

/**
 * 生成简历PDF
 * @param dispatch
 * @param userId
 * @param username
 */
export const GENERATE_RESUME_PDF = 'MY_RESUME/GENERATE_RESUME_PDF';	// 获得简历详情
export const generateResumePdf = (dispatch, userId, username) => {
	dispatch(actionGenerator(GENERATE_RESUME_PDF, 'loading'));

	return dispatch => $.ajax({
		url: `/resume/phantom`,
		data: {
			id: userId
		},
		timeout: 60000,
		dataType: 'json'
	}).then(
		result => {
			// console.log('生成简历PDF result', result);
			// 拉取成功
			if (result.errno === 0) {
				dispatch(actionGenerator(GENERATE_RESUME_PDF, result.url));
				message.success('生成PDF成功，开始下载');
				downloadFile(result.url);	// 下载文件
			} else {
				message.error(`生成简历PDF 失败 errno=${result.errno} errmsg=${result.errmsg}`);
				dispatch(actionGenerator(GENERATE_RESUME_PDF, 'error'));
			}
		},
		e => {
			console.error(e);
			dispatch(actionGenerator(GENERATE_RESUME_PDF, 'error', e));
			message.error(`生成简历PDF 失败 errno=${e.message}`);
		}
	);
};

/**
 * 获得简历详情
 * @param dispatch
 * @param userId
 */
export const FETCH_RESUME_DETAIL = 'MY_RESUME/FETCH_RESUME_DETAIL';	// 获得简历详情
export const fetchResumeDetail = (dispatch, userId) => {
	dispatch(actionGenerator(FETCH_RESUME_DETAIL, 0));

	return dispatch => $.ajax({
		url: apiHost + '/sns/resume/detail',
		data: {
			id: userId,
		},
		timeout: httpTimeout,
		dataType: 'jsonp'
	}).then(
		result => {
			console.log('获得简历详情 result', result);
			// 拉取成功
			if (result.errno === 0) {
				dispatch(actionGenerator(FETCH_RESUME_DETAIL, result.data));
				// 代表作品数组
				if (result.data.person_works) {
					// 遍历得到 timestamp
					let worksArray = result.data.person_works.map((item, index) => {
						const data = JSON.parse(item);
						data.id = index;
						data.content = JSON.parse(data.content);

						// 筛选需要展示的内容
						let timestamp = '';	// 时间

						// 一系列判断逻辑
						if (data.content.workType === '已上映剧本') {
							timestamp = data.content.workShowDate;	// 上映日期
						}
						if (data.content.workType === '即将上映剧本') {
							timestamp = data.content.workExpectedShowDate;	// 预计上映日期
						}
						if (data.content.workType === '获奖/成交剧本') {
							timestamp = 0;
						}
						if (data.content.workType === '出版作品') {
							timestamp = data.content.workFirstPublishDate;	// 首次发行时间
						}
						if (data.content.workType === '网络文学') {
							timestamp = data.content.workFirstOutsideDate;	// 首次发表时间
						}

						data.timestamp = timestamp;
						if (data.timestamp) {
							data.timestamp = new Date(data.timestamp).getTime();
						}
						return data;
					});
					// 根据 timestamp 降序排序
					worksArray = worksArray.sort((a, b) => {
						return a.timestamp < b.timestamp ? 1 : -1;
					});
					// 塞到 redux 里
					dispatch(changeWorksArray(worksArray));
				}
				// 教育经历数组
				if (result.data.person_edu) {
					// 遍历得到 timestamp
					let educationArray = result.data.person_edu.map((item, index) => {
						const newItem = JSON.parse(item);
						newItem.id = index;
						newItem.timestamp = new Date(newItem.graduation).getTime();
						return newItem;
					});
					// 根据 timestamp 降序排序
					educationArray = educationArray.sort((a, b) => {
						return a.timestamp < b.timestamp ? 1 : -1;
					});
					// 塞到 redux 里
					dispatch(changeEducationArray(educationArray));
				}

				// 简历百分比
				let resumePercent = 0;
				if (result.data.avatar) {
					resumePercent += 5;
				}
				if (result.data.name) {
					resumePercent += 35;
				}
				if (result.data.person_works && result.data.person_works.length > 0) {
					resumePercent += 40;
				}
				if (result.data.person_edu && result.data.person_edu.length > 0) {
					resumePercent += 20;
				}
				// 改变简历百分比
				dispatch(changeResumePercent(resumePercent));
			} else {
				dispatch(actionGenerator(FETCH_RESUME_DETAIL, -1));
			}
		},
		e => {
			console.error(e);
			dispatch(actionGenerator(FETCH_RESUME_DETAIL, -1, e));
		}
	);
};

/**
 * 保存个人信息
 * @param dispatch
 * @param data
 */
export const SAVE_RESUME_BASE_INFO = 'MY_RESUME/SAVE_RESUME_BASE_INFO';
export const saveResumeBaseInfo = (dispatch, data) => {
	dispatch(actionGenerator(SAVE_RESUME_BASE_INFO, 0));
	data.token = getCookie('X-AVOSCloud-Session-Token');	// 塞进去 cookie
	// console.log('data.toJSON', JSON.stringify(data));

	return dispatch => $.ajax({
		url: apiHost + '/sns/resume/infosave',
		method: 'POST',
		data,
		timeout: httpTimeout,
		dataType: 'jsonp'
	}).then(
		result => {
			// console.log('保存个人信息 result', result);
			// 保存成功
			if (result.errno === 0) {
				dispatch(actionGenerator(SAVE_RESUME_BASE_INFO, result));
				message.success('保存个人信息成功');	// 提示成功信息
				dispatch(changeBaseInfoEditStatus(false));	// 关闭编辑状态
				dispatch(fetchResumeDetail(dispatch, data.id));	// 重新拉取简历详情数据
			} else {
				message.error(`保存个人信息 errno=${result.errno},errmsg=${result.errmsg}`);
			}
		},
		e => {
			console.error(e);
			dispatch(actionGenerator(SAVE_RESUME_BASE_INFO, -1, e));
		}
	);
};

/**
 * 新增代表作品
 * @param dispatch
 * @param data
 */
export const ADD_WORK = 'MY_RESUME/ADD_WORK';
export const addWork = (dispatch, data) => {
	dispatch(actionGenerator(ADD_WORK, 0));
	data.token = getCookie('X-AVOSCloud-Session-Token');	// 塞进去 cookie
	// console.log('data.toJSON', JSON.stringify(data));

	return dispatch => $.ajax({
		url: apiHost + '/sns/resume/worksave',
		method: 'POST',
		data,
		timeout: httpTimeout,
		dataType: 'jsonp'
	}).then(
		result => {
			// console.log('新增代表作品 result', result);
			// 保存成功
			if (result.errno === 0) {
				dispatch(actionGenerator(ADD_WORK, result));
				message.success('新增代表作品成功');	// 提示成功信息
				dispatch(changeWorksAddStatus(false));	// 关闭编辑状态
				dispatch(fetchResumeDetail(dispatch, data.id));	// 重新拉取简历详情数据
			} else {
				message.error(`新增代表作品 errno=${result.errno},errmsg=${result.errmsg}`);
			}
		},
		e => {
			console.error(e);
			dispatch(actionGenerator(ADD_WORK, -1, e));
		}
	);
};

/**
 * 编辑代表作品
 * @param dispatch
 * @param data
 */
export const EDIT_WORK_BY_ID = 'MY_RESUME/EDIT_WORK_BY_ID';
export const editWorkById = (dispatch, data) => {
	dispatch(actionGenerator(EDIT_WORK_BY_ID, 0));
	data.token = getCookie('X-AVOSCloud-Session-Token');	// 塞进去 cookie
	// console.log('data.toJSON', JSON.stringify(data));

	return dispatch => $.ajax({
		url: apiHost + '/sns/resume/workedit',
		method: 'POST',
		data,
		timeout: httpTimeout,
		dataType: 'jsonp'
	}).then(
		result => {
			// console.log('编辑代表作品 result', result);
			// 保存成功
			if (result.errno === 0) {
				dispatch(actionGenerator(EDIT_WORK_BY_ID, result));
				message.success('编辑代表作品成功');	// 提示成功信息
				dispatch(changeWorksArrayKeyValueById(data.num, 'editStatus', false));	// 关闭编辑状态
				dispatch(changeWorksArrayKeyValueById(data.num, 'hoverStatus', false));	// 关闭编辑状态
				dispatch(fetchResumeDetail(dispatch, data.id));	// 重新拉取简历详情数据
			} else {
				message.error(`编辑代表作品 errno=${result.errno},errmsg=${result.errmsg}`);
			}
		},
		e => {
			console.error(e);
			dispatch(actionGenerator(EDIT_WORK_BY_ID, -1, e));
		}
	);
};

/**
 * 删除代表作品
 * @param dispatch
 * @param userId
 * @param workItemId
 */
export const DELETE_WORK_BY_ID = 'MY_RESUME/DELETE_WORK_BY_ID';
export const deleteWorkById = (dispatch, userId, workItemId) => {
	dispatch(actionGenerator(DELETE_WORK_BY_ID, 0));

	return dispatch => $.ajax({
		url: apiHost + '/sns/resume/del',
		method: 'POST',
		data: {
			token: getCookie('X-AVOSCloud-Session-Token'),
			id: userId,
			type: 'works',
			num: workItemId,
		},
		timeout: httpTimeout,
		dataType: 'jsonp'
	}).then(
		result => {
			// console.log('删除代表作品 result', result);
			// 保存成功
			if (result.errno === 0) {
				dispatch(actionGenerator(DELETE_WORK_BY_ID, result));
				message.success('删除代表作品成功');	// 提示成功信息
				dispatch(fetchResumeDetail(dispatch, userId));	// 重新拉取简历详情数据
			} else {
				message.error(`删除代表作品 errno=${result.errno},errmsg=${result.errmsg}`);
			}
		},
		e => {
			console.error(e);
			dispatch(actionGenerator(DELETE_WORK_BY_ID, -1, e));
		}
	);
};

/**
 * 新增教育经历
 * @param dispatch
 * @param data
 */
export const ADD_EDUCATION = 'MY_RESUME/ADD_EDUCATION';
export const addEducation = (dispatch, data) => {
	dispatch(actionGenerator(ADD_EDUCATION, 0));
	data.token = getCookie('X-AVOSCloud-Session-Token');	// 塞进去 cookie
	// console.log('data.toJSON', JSON.stringify(data));

	return dispatch => $.ajax({
		url: apiHost + '/sns/resume/edusave',
		method: 'POST',
		data,
		timeout: httpTimeout,
		dataType: 'jsonp'
	}).then(
		result => {
			// console.log('新增教育经历 result', result);
			// 保存成功
			if (result.errno === 0) {
				dispatch(actionGenerator(ADD_EDUCATION, result));
				message.success('新增教育经历成功');	// 提示成功信息
				dispatch(changeEducationAddStatus(false));	// 关闭编辑状态
				dispatch(fetchResumeDetail(dispatch, data.id));	// 重新拉取简历详情数据
			} else {
				message.error(`新增教育经历 errno=${result.errno},errmsg=${result.errmsg}`);
			}
		},
		e => {
			console.error(e);
			dispatch(actionGenerator(ADD_EDUCATION, -1, e));
		}
	);
};

/**
 * 编辑教育经历
 * @param dispatch
 * @param data
 */
export const EDIT_EDUCATION_BY_ID = 'MY_RESUME/EDIT_EDUCATION_BY_ID';
export const editEducationById = (dispatch, data) => {
	dispatch(actionGenerator(EDIT_EDUCATION_BY_ID, 0));
	data.token = getCookie('X-AVOSCloud-Session-Token');	// 塞进去 cookie
	// console.log('data.toJSON', JSON.stringify(data));

	return dispatch => $.ajax({
		url: apiHost + '/sns/resume/eduedit',
		method: 'POST',
		data,
		timeout: httpTimeout,
		dataType: 'jsonp'
	}).then(
		result => {
			// console.log('编辑教育经历 result', result);
			// 保存成功
			if (result.errno === 0) {
				dispatch(actionGenerator(EDIT_EDUCATION_BY_ID, result));
				message.success('编辑教育经历成功');	// 提示成功信息
				dispatch(changeEducationArrayKeyValueById(data.num, 'editStatus', false));	// 关闭编辑状态
				dispatch(changeEducationArrayKeyValueById(data.num, 'hoverStatus', false));	// 关闭编辑状态
				dispatch(fetchResumeDetail(dispatch, data.id));	// 重新拉取简历详情数据
			} else {
				message.error(`编辑教育经历 errno=${result.errno},errmsg=${result.errmsg}`);
			}
		},
		e => {
			console.error(e);
			dispatch(actionGenerator(EDIT_EDUCATION_BY_ID, -1, e));
		}
	);
};

/**
 * 删除教育经历
 * @param dispatch
 * @param userId
 * @param educationItemId
 */
export const DELETE_EDUCATION_BY_ID = 'MY_RESUME/DELETE_EDUCATION_BY_ID';
export const deleteEducationById = (dispatch, userId, educationItemId) => {
	dispatch(actionGenerator(DELETE_EDUCATION_BY_ID, 0));

	return dispatch => $.ajax({
		url: apiHost + '/sns/resume/del',
		method: 'POST',
		data: {
			token: getCookie('X-AVOSCloud-Session-Token'),
			id: userId,
			type: 'edu',
			num: educationItemId,
		},
		timeout: httpTimeout,
		dataType: 'jsonp'
	}).then(
		result => {
			// console.log('删除教育经历 result', result);
			// 保存成功
			if (result.errno === 0) {
				dispatch(actionGenerator(DELETE_EDUCATION_BY_ID, result));
				message.success('删除教育经历成功');	// 提示成功信息
				dispatch(fetchResumeDetail(dispatch, userId));	// 重新拉取简历详情数据
			} else {
				message.error(`删除教育经历 errno=${result.errno},errmsg=${result.errmsg}`);
			}
		},
		e => {
			console.error(e);
			dispatch(actionGenerator(DELETE_EDUCATION_BY_ID, -1, e));
		}
	);
};

/**
 * 大学联想
 * @param dispatch
 * @param key 关键字
 */
export const UNIVERSITY_ASSOCIATE = 'MY_RESUME/UNIVERSITY_ASSOCIATE';
export const universityAssociate = (dispatch, key) => {
	dispatch(actionGenerator(UNIVERSITY_ASSOCIATE, 0));

	return dispatch => $.ajax({
		url: apiHost + '/sns/eduapi/universities',
		method: 'GET',
		data: {
			key,
		},
		timeout: httpTimeout,
		dataType: 'jsonp'
	}).then(
		result => {
			// console.log('大学联想 result', result);
			// 保存成功
			if (result.errno === 0) {
				dispatch(actionGenerator(UNIVERSITY_ASSOCIATE, result));
			}
		},
		e => {
			console.error(e);
			dispatch(actionGenerator(UNIVERSITY_ASSOCIATE, -1, e));
		}
	);
};

/**
 * 专业联想
 * @param dispatch
 * @param key 关键字
 * @param id 大学id
 */
export const MAJOR_ASSOCIATE = 'MY_RESUME/MAJOR_ASSOCIATE';
export const majorAssociate = (dispatch, key, id) => {
	dispatch(actionGenerator(MAJOR_ASSOCIATE, 0));

	return dispatch => $.ajax({
		url: apiHost + '/sns/eduapi/majors',
		method: 'GET',
		data: {
			key,
			id,
		},
		timeout: httpTimeout,
		dataType: 'jsonp'
	}).then(
		result => {
			// console.log('专业联想 result', result);
			// 保存成功
			if (result.errno === 0) {
				dispatch(actionGenerator(MAJOR_ASSOCIATE, result));
			}
		},
		e => {
			console.error(e);
			dispatch(actionGenerator(MAJOR_ASSOCIATE, -1, e));
		}
	);
};
