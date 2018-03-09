import {
	NOTIFYAUTHORS,
	NOTIFYADDAUTHOR,
	NOTIFYDELAUTHOR,
	NOTIFYUPDATEAUTHOR,
	NOTIFYSEARCHAUTHOR
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

		case NOTIFYAUTHORS:

			data && data.get && (data = data.set('list', data.get('list').map(item => {

				let works = List();

				try {
					works = fromJS(JSON.parse(item.get('works')))
				} catch (e) {}

				return item.set('works', works);
			})))

			return processNotify(state, data);

		case NOTIFYADDAUTHOR:

			return processNotify(state, data, 'proccessingAddAuthor', true);

		case NOTIFYDELAUTHOR:

			return processNotify(state, data, 'proccessingDelAuthor', true);

		case NOTIFYUPDATEAUTHOR:

			return processNotify(state, data, 'processingUpdateAuthor', true);

		case NOTIFYSEARCHAUTHOR:

			return processNotify(state, data, 'processingSearchAuthor');

		default:
			return state;

	}
}
