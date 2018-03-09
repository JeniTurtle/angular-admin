/**
 * (代表) 作品 reducer
 * Changed by waka on 2017/4/19.
 */
import {
	NOTIFYHISTORIES,
	NOTIFYADDHISTORY,
	NOTIFYDELHISTORY,
	NOTIFYUPDATEHISTORY
} from '../actions/HTTP'


import {
	processNotify
} from './HTTP';

import {
	fromJS,
	List,
	Map
} from 'immutable';

const defaultState = fromJS({
	list: [],
	totalCount: 0
});

export default function(state = defaultState, action) {

	let data = fromJS(action.data);

	switch (action.type) {

		case NOTIFYHISTORIES:

			if (data && data.has('list')) {

				data.get('list').forEach(item => {
					try {
						item.set('works', fromJS(JSON.parse(item.works)));
					} catch (e) {
						item.set('works', List());
					}
				});

			}

			return processNotify(state, data);

		case NOTIFYADDHISTORY:

			return processNotify(state, data, 'proccessingAddHistory', true);

		case NOTIFYDELHISTORY:

			return processNotify(state, data, 'proccessingDelHistory', true);

		case NOTIFYUPDATEHISTORY:

			return processNotify(state, data, 'processingUpdateHistory', true);

		default:
			return state;

	}
}
