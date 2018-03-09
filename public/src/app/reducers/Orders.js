import {
	NOTIFYORDERS
} from '../actions/HTTP';

import {
	fromJS,
	List,
	Map
} from 'immutable';

import {
	processNotify
} from './HTTP'

const defaultState = fromJS({
	list: [],
	totalCount: 0
});

export default function(state = defaultState, action) {

	let data = fromJS(action.data);

	switch (action.type) {

		case NOTIFYORDERS:

			return processNotify(state, data);

		default:
			return state;

	}
}
