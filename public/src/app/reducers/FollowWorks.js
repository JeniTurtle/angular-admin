/**
 * 关注的作品 reducer
 * Created by waka on 2017/4/21.
 */
import {
	NOTIFY_FOLLOW_WORKS,	// 关注的作品列表
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
		// 关注的作品列表
		case NOTIFY_FOLLOW_WORKS:
			return processNotify(state, data);
		default:
			return state;
	}
}
