import {
	NOTIFYMERGEIPS,
	NOTIFYADDCOPYRIGHT,
	NOTIFYDOWNCOPYRIGHT,
	NOTIFYDOWNIP,
	NOTIFYDELIP,
	NOTIFYONLINEIPS
} from '../actions/HTTP'

import {
	handleCopyright
} from './IPInfo';

import {
	RESET
} from '../actions/IPList'

import {
	processNotify
} from './HTTP';

import Immutable, {
	fromJS,
	List,
	Map
} from 'immutable';

const defaultState = fromJS({
	data: [],
	count: -1
});

export default function (state = defaultState, action) {

	let data = fromJS(action.data);

	switch (action.type) {

		case NOTIFYMERGEIPS:
		case NOTIFYONLINEIPS:

			if (typeof(data) === 'object' && data.get('data')) {
				data = data.set('data', data.get('data').map(item => handleCopyright(item)));
			}

			return processNotify(state, data);

		case NOTIFYADDCOPYRIGHT:

			return processNotify(state, data, 'proccessingAddCopyright', true);

		case NOTIFYDOWNCOPYRIGHT:

			return processNotify(state, data, 'proccessingDownCopyright', true);

		case NOTIFYDOWNIP:

			return processNotify(state, data, 'processingDownIP', true);

		case NOTIFYDELIP:

			return processNotify(state, data, 'processingDelIP', true);

		case RESET:
			return defaultState;

		default:
			return state;

	}
}
