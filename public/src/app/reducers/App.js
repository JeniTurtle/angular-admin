import {
	fromJS,
} from 'immutable';

import {
	// 全局
	CHANGE_RESUME_EXPLAIN_MODAL_SHOW_STATUS,
	CHANGE_CHROME_DOWNLOAD_MODAL_SHOW_STATUS,
	CHANGE_CHROME_DOWNLOAD_MODAL,
} from '../actions/App';

export default function (state = fromJS({
	// 简历说明对话框显示状态
	resumeExplainModalShowStatus: false,
	// chrome下载对话框显示状态
	chromeDownloadModalShowStatus: false,
	// chrome下载对话框
	chromeDownloadModal: {
		isShow: false,
		isWarningShow: false,	// 警告栏显示
		tips: '为了保证您的体验，请下载Chrome浏览器',
		link: 'http://www.baidu.com/s?wd=Chrome',
	},
}), action) {

	switch (action.type) {

		// 全局

		// 简历说明对话框显示状态
		case CHANGE_RESUME_EXPLAIN_MODAL_SHOW_STATUS:
			return state.set('resumeExplainModalShowStatus', fromJS(action.data));

		// chrome下载对话框显示状态
		case CHANGE_CHROME_DOWNLOAD_MODAL_SHOW_STATUS:
			return state.set('chromeDownloadModalShowStatus', fromJS(action.data));

		// chrome下载对话框显示状态
		case CHANGE_CHROME_DOWNLOAD_MODAL:
			let chromeDownloadModal = state.get('chromeDownloadModal') || fromJS({});
			for (let key in action.data) {
				if (action.data.hasOwnProperty(key)) {
					chromeDownloadModal = chromeDownloadModal.set(key, action.data[key]);
				}
			}
			return state.set('chromeDownloadModal', chromeDownloadModal);

		default:
			return state;
	}
}
