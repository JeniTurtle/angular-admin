import {
	fromJS,
} from 'immutable';

import {
	// 本地
	INIT_COPYRIGHT_PROTECTION,
	CHANGE_CURRENT_SELECT_COPYID,
	CHANGE_CURRENT_COPYRIGHT_PROTECTION_ERROR_TIPS,
	CHANGE_CURRENT_COPYRIGHT_PROTECTION_MODE,
	// HTTP
	GET_COPYRIGHT_PROTECTION_RECORDS_BY_COOKIE,
	COPYRIGHT_PROTECTION_ASSOCIATION_BY_COPYID,
	GET_WORK_DETAIL_BY_COPYID,
	GET_COPYID_BY_IPPREID,
} from '../actions/CopyrightProtectionAssociationModal';

export default function (state = fromJS({
	// 版保记录
	copyrightProjectionRecords: {
		array: [],	// 记录数组
		isLoading: false,	// 是否加载中
	},
	// 根据 copyId 获得作品详情
	workDetailByCopyId: {
		data: {},	// 数据
		isLoading: false,	// 是否加载中
	},
	// 当期选中的版保号
	currentSelectCopyId: '',
	// 当前模式；0：版保记录；1：手动输入版保号
	currentCopyrightProtectionMode: 1,
	// 当前版保关联的错误提示语
	currentCopyrightProtectionErrorTips: {
		errorTips: '',	// 错误提示语
		color: '',	// 颜色
	},
	// 版保关联
	copyrightProtectionAssociationByCopyid: {
		isLoading: false,	// 是否加载中
	},
	// 根据 ippreId 获得 copyId
	getCopyIdByIppreId: {
		copyId: '',
	}
}), action) {

	switch (action.type) {

		// 本地

		// 初始化版保关联数据
		case INIT_COPYRIGHT_PROTECTION:
			return fromJS({
				// 版保记录
				copyrightProjectionRecords: {
					array: [],	// 记录数组
					isLoading: false,	// 是否加载中
				},
				// 根据 copyId 获得作品详情
				workDetailByCopyId: {
					data: {},	// 数据
					isLoading: false,	// 是否加载中
				},
				// 当期选中的版保号
				currentSelectCopyId: '',
				// 当前模式；0：版保记录；1：手动输入版保号
				currentCopyrightProtectionMode: 1,
				// 当前版保关联的错误提示语
				currentCopyrightProtectionErrorTips: {
					errorTips: '',	// 错误提示语
					color: '',	// 颜色
				},
				// 版保关联
				copyrightProtectionAssociationByCopyid: {
					isLoading: false,	// 是否加载中
				},
				// 根据 ippreId 获得 copyId
				getCopyIdByIppreId: {
					copyId: '',
				}
			});

		// 改变当前选中的 copyId
		case CHANGE_CURRENT_SELECT_COPYID:
			return state.set('currentSelectCopyId', fromJS(action.data));

		// 改变当前版保关联的模式
		case CHANGE_CURRENT_COPYRIGHT_PROTECTION_MODE:
			return state.set('currentCopyrightProtectionMode', fromJS(action.data));

		// 改变当前版保关联的错误提示语
		case CHANGE_CURRENT_COPYRIGHT_PROTECTION_ERROR_TIPS:
			let currentCopyrightProtectionErrorTips = state.get('currentCopyrightProtectionErrorTips') || fromJS({});
			for (let key in action.data) {
				if (action.data.hasOwnProperty(key)) {
					currentCopyrightProtectionErrorTips = currentCopyrightProtectionErrorTips.set(key, action.data[key]);
				}
			}
			return state.set('currentCopyrightProtectionErrorTips', currentCopyrightProtectionErrorTips);


		// HTTP

		// 获得简历详情
		case GET_COPYRIGHT_PROTECTION_RECORDS_BY_COOKIE:
			let copyrightProjectionRecords = state.get('copyrightProjectionRecords') || fromJS({});
			for (let key in action.data) {
				if (action.data.hasOwnProperty(key)) {
					copyrightProjectionRecords = copyrightProjectionRecords.set(key, action.data[key]);
				}
			}
			return state.set('copyrightProjectionRecords', copyrightProjectionRecords);

		// 根据 copyId 获得作品详情
		case GET_WORK_DETAIL_BY_COPYID:
			let workDetailByCopyId = state.get('workDetailByCopyId') || fromJS({});
			for (let key in action.data) {
				if (action.data.hasOwnProperty(key)) {
					workDetailByCopyId = workDetailByCopyId.set(key, action.data[key]);
				}
			}
			return state.set('workDetailByCopyId', workDetailByCopyId);

		// 版保关联
		case COPYRIGHT_PROTECTION_ASSOCIATION_BY_COPYID:
			let copyrightProtectionAssociationByCopyid = state.get('copyrightProtectionAssociationByCopyid') || fromJS({});
			for (let key in action.data) {
				if (action.data.hasOwnProperty(key)) {
					copyrightProtectionAssociationByCopyid = copyrightProtectionAssociationByCopyid.set(key, action.data[key]);
				}
			}
			return state.set('copyrightProtectionAssociationByCopyid', copyrightProtectionAssociationByCopyid);

		// 根据 ippreId 获得 copyId
		case GET_COPYID_BY_IPPREID:
			let getCopyIdByIppreId = state.get('getCopyIdByIppreId') || fromJS({});
			for (let key in action.data) {
				if (action.data.hasOwnProperty(key)) {
					getCopyIdByIppreId = getCopyIdByIppreId.set(key, fromJS(action.data[key]));
				}
			}
			return state.set('getCopyIdByIppreId', getCopyIdByIppreId);

		default:
			return state;
	}
}
