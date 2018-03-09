/**
 * 我关注的人 reducer
 * Created by waka on 2017/4/19.
 */
import {
	NOTIFY_FOCUS_PEOPLE_MY_FOLLOW,	// 我关注的人列表
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
		// 我关注的人列表
		case NOTIFY_FOCUS_PEOPLE_MY_FOLLOW:
			return processNotify(state, data);
		default:
			return state;
	}
}
