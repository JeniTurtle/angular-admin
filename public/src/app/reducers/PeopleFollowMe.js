/**
 * 关注我的人 reducer
 * Created by waka on 2017/4/21.
 */
import {
	NOTIFY_FOCUS_PEOPLE_FOLLOW_ME,	// 关注我的人列表
	NOTIFY_CHANGE_FOLLOW_STATUS,	// 改变关注状态
} from '../actions/HTTP';

import {
	fromJS,
} from 'immutable';

import {
	processNotify
} from './HTTP';

export default function (state = fromJS({}), action) {

	let data = fromJS(action.data);

	switch (action.type) {
		// 关注我的人列表
		case NOTIFY_FOCUS_PEOPLE_FOLLOW_ME:
			return processNotify(state, data);
		// 改变关注状态
		case NOTIFY_CHANGE_FOLLOW_STATUS:
			return processNotify(state, data, 'processingChangeFollowStatus', true);
		default:
			return state;
	}
}
