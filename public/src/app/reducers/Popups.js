import {
	WARNING,
	TOAST,
	POPUP,
	UPDATE,
	CHANGE_SPIN_STATUS,
	ALERT,
} from '../actions/Popups';

import Immutable, {
	fromJS,
	List,
	Map
} from 'immutable';

const initialState = fromJS({
	warning: '',
	type: 'warning',
	duration: 0,
	toast: '',
	toastType: 'loading',
	toastDuration: 0,
	spinStatus: 'hide',	// 加载中...状态

	// 警告框
	alertContent: '',	// 警告框内容
	alertType: 'success',	// 警告框类型
	alertDuration: 0,	// 警告框持续时间
});

export default function (state = initialState, action) {

	switch (action.type) {

		case WARNING:

			return state.merge(Map({
				warning: action.content,
				type: action.wType,
				duration: action.duration
			}));

		case TOAST:

			return state.merge(Map({
				toast: action.content,
				toastType: action.wType,
				toastDuration: action.duration
			}));

		case POPUP:

			return state.merge(Map({
				popup: action.content,
				popupTitle: action.title,
				popupHeight: action.height
			}));

		case UPDATE:

			return state.merge(Map(action.data));

		// 改变加载中...状态
		case CHANGE_SPIN_STATUS:
			return state.merge(Map({
				spinStatus: action.data
			}));

		// 警告框
		case ALERT:
			return state.merge(Map({
				alertContent: action.content,
				alertType: action.aType,
				alertDuration: action.duration
			}));

		default:
			return state;

	}
}
