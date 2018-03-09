import {
	NOTIFYAUTHDATA
} from '../actions/HTTP';

import {
	fromJS
} from 'immutable';

import {
	processNotify
} from './HTTP'

const defaultState = fromJS({});

export default function(state = defaultState, action) {

	let data = fromJS(action.data);

	switch (action.type) {

		case NOTIFYAUTHDATA:

			return processNotify(state, data);

		default:
			return state;

	}
}
