import {
	fromJS,
} from 'immutable';

import {
	// 全局
	FORM_ITEM_ERROR_TIPS,
	CHANGE_RESUME_ANCHOR,
	CHANGE_RESUME_PERCENT,
	GENERATE_RESUME_PDF,
	// HTTP
	FETCH_RESUME_DETAIL,
	SAVE_RESUME_BASE_INFO,
	UPLOAD_AVATAR,
	ADD_WORK,
	EDIT_WORK_BY_ID,
	DELETE_WORK_BY_ID,
	ADD_EDUCATION,
	EDIT_EDUCATION_BY_ID,
	DELETE_EDUCATION_BY_ID,
	UNIVERSITY_ASSOCIATE,
	MAJOR_ASSOCIATE,
	// 基本信息
	CHANGE_BASE_INFO_EDIT_STATUS,
	CHANGE_BASE_INFO_EDIT_FORM,
	CHANGE_WORKS_ARRAY_KEY_VALUE_BY_ID,
	CHANGE_UPLOAD_AVATAR,
	// 代表作品
	CHANGE_WORKS_ADD_STATUS,
	CHANGE_WORKS_ARRAY,
	// 教育信息
	CHANGE_EDUCATION_ADD_STATUS,
	CHANGE_EDUCATION_ARRAY,
	CHANGE_EDUCATION_ARRAY_KEY_VALUE_BY_ID,
} from '../actions/MyResume';

import {
	getIndexByIdFromArray,
} from '../utils/array';

export default function (state = fromJS({
	// 表单项错误提示
	formItemError: {
		formId: '',
		errorTips: '',
	},
	// 简历详情
	resumeDetail: {
		person_edu: [],
	},
	resumeDetailStatus: '',	// 简历加载状态
	// 简历百分比
	resumePercent: 0,
	// 上传头像
	uploadAvatar: {
		isShowModal: false,	// 是否显示对话框
		isShowReactCrop: false,	// 是否显示裁剪框
		crop: {
			x: 0,
			y: 0,
			width: 75,	// 宽度
			height: 75,
			aspect: 1,	// 宽高比
		},	// 裁剪参数对象
		imgExtension: '',	// 文件扩展名
		imgData: '',	// 图像数据
		uploadResult: '',	// 上传结果
	},
	// 基本信息编辑
	baseInfoEdit: {
		form: {},	// 表单
		status: false,	// 编辑状态
		saveResult: null,	// 保存结果
	},
	// 代表作品
	works: {
		array: [],
		addStatus: false,
	},
	// 教育经历
	education: {
		array: [],
		addStatus: false,
	},
}), action) {

	// switch 语句块内共享变量，所以重复的变量名需要提前声明
	let uploadAvatar;	// 上传头像
	let baseInfoEdit;	// 基本信息
	let works;	// 代表作品
	let worksArray;	// 代表作品数组
	let education;	// 教育信息
	let educationArray;	// 教育信息数组

	switch (action.type) {

		// 全局

		// 表单项错误提示
		case FORM_ITEM_ERROR_TIPS:
			return state.set('formItemError', fromJS(action.data));
		// 切换简历锚点
		case CHANGE_RESUME_ANCHOR:
			return state.set('resumeAnchor', fromJS(action.data));
		// 改变简历完成度
		case CHANGE_RESUME_PERCENT:
			return state.set('resumePercent', fromJS(action.data));

		// HTTP

		// 获得简历详情
		case FETCH_RESUME_DETAIL:
			if (action.data === 0 || action.data === -1) {
				return state.set('resumeDetailStatus', fromJS(action.data));
			} else {
				let newState = state.set('resumeDetailStatus', 1);
				return newState.set('resumeDetail', fromJS(action.data));
			}
		// 保存个人信息
		case SAVE_RESUME_BASE_INFO:
			baseInfoEdit = state.get('baseInfoEdit') || fromJS({});
			baseInfoEdit = baseInfoEdit.set('saveResult', fromJS(action.data));
			return state.set('baseInfoEdit', baseInfoEdit);
		// 上传头像
		case UPLOAD_AVATAR:
			uploadAvatar = state.get('uploadAvatar') || fromJS({});
			uploadAvatar = uploadAvatar.set('uploadResult', fromJS(action.data));
			return state.set('uploadAvatar', uploadAvatar);
		// 生成简历PDF
		case GENERATE_RESUME_PDF:
			return state.set('generateResumePdfResult', fromJS(action.data));
		// 新增代表作品
		case ADD_WORK:
			works = state.get('works') || fromJS({});
			works = works.set('addWorkResult', fromJS(action.data));
			return state.set('works', works);
		// 编辑代表作品
		case EDIT_WORK_BY_ID:
			works = state.get('works') || fromJS({});
			works = works.set('editWorkByIdResult', fromJS(action.data));
			return state.set('works', works);
		// 删除代表作品
		case DELETE_WORK_BY_ID:
			works = state.get('works') || fromJS({});
			works = works.set('deleteWorkByIdResult', fromJS(action.data));
			return state.set('works', works);
		// 新增教育经历
		case ADD_EDUCATION:
			education = state.get('education') || fromJS({});
			education = education.set('addEducationResult', fromJS(action.data));
			return state.set('education', education);
		// 编辑教育经历
		case EDIT_EDUCATION_BY_ID:
			education = state.get('education') || fromJS({});
			education = education.set('editEducationByIdResult', fromJS(action.data));
			return state.set('education', education);
		// 删除教育经历
		case DELETE_EDUCATION_BY_ID:
			education = state.get('education') || fromJS({});
			education = education.set('deleteEducationByIdResult', fromJS(action.data));
			return state.set('education', education);

		// 基本信息

		// 修改上传头像
		case CHANGE_UPLOAD_AVATAR:
			uploadAvatar = state.get('uploadAvatar') || fromJS({});
			for (let key in action.data) {
				if (action.data.hasOwnProperty(key)) {
					uploadAvatar = uploadAvatar.set(key, fromJS(action.data[key]));
				}
			}
			return state.set('uploadAvatar', uploadAvatar);
		// 切换个人介绍编辑状态
		case CHANGE_BASE_INFO_EDIT_STATUS:
			baseInfoEdit = state.get('baseInfoEdit') || fromJS({});
			baseInfoEdit = baseInfoEdit.set('status', fromJS(action.data));
			return state.set('baseInfoEdit', baseInfoEdit);
		// 修改基本信息(编辑态)表单
		case CHANGE_BASE_INFO_EDIT_FORM:
			baseInfoEdit = state.get('baseInfoEdit') || fromJS({});
			baseInfoEdit = baseInfoEdit.set('form', fromJS(action.data));
			return state.set('baseInfoEdit', baseInfoEdit);

		// 代表作品

		// 切换代表作品编辑状态
		case CHANGE_WORKS_ADD_STATUS:
			works = state.get('works') || fromJS({});
			works = works.set('addStatus', fromJS(action.data));
			// 清空项的所有编辑态
			worksArray = state.get('works').get('array').toJS();
			if (worksArray.length > 0) {
				worksArray.map((item) => {
					return item['editStatus'] = false;
				});
			}
			works = works.set('array', fromJS(worksArray));
			return state.set('works', works);
		// 修改代表作品数组
		case CHANGE_WORKS_ARRAY:
			works = state.get('works') || fromJS({});
			works = works.set('array', fromJS(action.data));
			return state.set('works', works);
		// 根据 id 修改代表作品数组中特定的值
		case CHANGE_WORKS_ARRAY_KEY_VALUE_BY_ID:
			works = state.get('works') || fromJS({});
			worksArray = state.get('works').get('array').toJS();
			// 只有当 array 中有数据才查询
			if (worksArray.length > 0) {
				// 根据 id 在数组中找到特定对象
				let itemIndex = getIndexByIdFromArray(worksArray, action.id);
				if (itemIndex !== -1) {
					// 一次只能有一个编辑态
					// 如果是编辑态而且是打开一个编辑态
					if (action.key === 'editStatus' && action.value === true) {
						// 重置所有项的编辑态
						worksArray.map((item) => {
							return item['editStatus'] = false;
						});
						// 关闭添加态
						works = works.set('addStatus', false);
					}
					// 得到那个对象，并将传来的键值对赋给它
					worksArray[itemIndex][action.key] = action.value;
				}
			}
			works = works.set('array', fromJS(worksArray));
			return state.set('works', works);

		// 教育信息

		// 修改教育经历添加状态
		case CHANGE_EDUCATION_ADD_STATUS:
			education = state.get('education') || fromJS({});
			education = education.set('addStatus', fromJS(action.data));
			// 清空项的所有编辑态
			educationArray = state.get('education').get('array').toJS();
			if (educationArray.length > 0) {
				educationArray.map((item) => {
					return item['editStatus'] = false;
				});
			}
			education = education.set('array', fromJS(educationArray));
			return state.set('education', education);
		// 修改教育经历数组
		case CHANGE_EDUCATION_ARRAY:
			education = state.get('education') || fromJS({});
			education = education.set('array', fromJS(action.data));
			return state.set('education', education);
		// 根据 id 修改教育经历数组中特定的值
		case CHANGE_EDUCATION_ARRAY_KEY_VALUE_BY_ID:
			education = state.get('education') || fromJS({});
			educationArray = state.get('education').get('array').toJS();
			// 只有当 array 中有数据才查询
			if (educationArray.length > 0) {
				// 根据 id 在数组中找到特定对象
				let itemIndex = getIndexByIdFromArray(educationArray, action.id);
				if (itemIndex !== -1) {
					// 一次只能有一个编辑态
					// 如果是编辑态而且是打开一个编辑态
					if (action.key === 'editStatus' && action.value === true) {
						// 重置所有项的编辑态
						educationArray.map((item) => {
							return item['editStatus'] = false;
						});
						// 关闭添加态
						education = education.set('addStatus', false);
					}
					// 得到那个对象，并将传来的键值对赋给它
					educationArray[itemIndex][action.key] = action.value;
				}
			}
			education = education.set('array', fromJS(educationArray));
			return state.set('education', education);

		default:
			return state;
	}
}
