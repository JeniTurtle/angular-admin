// ****************** 本地状态 ******************* //

// 全局

/**
 * 切换简历说明对话框显示状态
 * @param isShow
 */
export const CHANGE_RESUME_EXPLAIN_MODAL_SHOW_STATUS = 'APP/CHANGE_RESUME_EXPLAIN_MODAL_SHOW_STATUS';
export const changeResumeExplainModalShowStatus = (isShow) => {
	return {
		type: CHANGE_RESUME_EXPLAIN_MODAL_SHOW_STATUS,
		data: isShow,
	}
};


/**
 * 切换chrome下载说明对话框显示状态
 * @param isShow
 */
export const CHANGE_CHROME_DOWNLOAD_MODAL_SHOW_STATUS = 'APP/CHANGE_CHROME_DOWNLOAD_MODAL_SHOW_STATUS';
export const changeChromeDownloadModalShowStatus = (isShow) => {
	return {
		type: CHANGE_CHROME_DOWNLOAD_MODAL_SHOW_STATUS,
		data: isShow,
	}
};

/**
 * 切换chrome下载说明对话框
 * @param data
 */
export const CHANGE_CHROME_DOWNLOAD_MODAL = 'APP/CHANGE_CHROME_DOWNLOAD_MODAL';
export const changeChromeDownloadModal = (data) => {
	return {
		type: CHANGE_CHROME_DOWNLOAD_MODAL,
		data: data,
	}
};
