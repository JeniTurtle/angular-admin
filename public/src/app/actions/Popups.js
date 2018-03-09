/**
 * 弹出层
 * Changed by waka on 2017/4/19.
 */
export const WARNING = "POPUPS/WARNING";
export const TOAST = "POPUPS/TOAST";
export const POPUP = "POPUPS/POPUP";
export const UPDATE = "POPUPS/UPDATE";
export const CHANGE_SPIN_STATUS = "POPUPS/CHANGE_SPIN_STATUS";	// 改变加载中...状态
export const ALERT = "POPUPS/ALERT";	// 警告框

export function showWarning(content, wType, duration = 0) {
	return {
		type: WARNING,
		wType,
		content,
		duration
	}
}

export function showToast(content, wType, duration = 0) {
	return {
		type: TOAST,
		wType,
		content,
		duration
	}
}

export function showPopup(obj) {
	return {
		type: POPUP,
		...obj
	}
}

export function update(data) {
	return {
		type: UPDATE,
		data
	}
}

/**
 * 显示加载中...
 * @return {{type: string, data: string}}
 */
export function showSpin() {
	return {
		type: CHANGE_SPIN_STATUS,
		data: 'show'
	}
}

/**
 * 隐藏加载中...
 * @return {{type: string, data: string}}
 */
export function hideSpin() {
	return {
		type: CHANGE_SPIN_STATUS,
		data: 'hide'
	}
}

/**
 * 显示警告框
 * @param content    内容
 * @param aType    类型
 * @param duration    持续时间;为0为永远存在
 * @return {{type: string, content: *, aType: *, duration: number}}
 */
export function showAlert(content, aType, duration = 1500) {
	return {
		type: ALERT,
		content,
		aType,
		duration
	}
}
