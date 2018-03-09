import {
	combineReducers
} from 'redux-immutable';

import {
	routerReducer
} from 'react-router-redux';

import app from './App';
import authInfo from './AuthInfo';
import copyrightProtectionAssociationModal from './CopyrightProtectionAssociationModal';
import followWorks from './FollowWorks';
import ipInfo from './IPInfo';
import ips from './IPList';
import authors from './Authors';
import histories from './Histories';
import popups from './Popups';
import myresume from './MyResume';
import orders from './Orders';
import peopleFollowMe from './PeopleFollowMe';
import peopleMyFollow from './PeopleMyFollow';
import personalInfo from './PersonalInfo';
import * as https from './HTTP';


import {
	fromJS
} from 'immutable';
import {
	LOCATION_CHANGE
} from 'react-router-redux';

const initialState = fromJS({
	locationBeforeTransitions: null
});

export default combineReducers({
	routing: (state = initialState, action) => {
		if (action.type === LOCATION_CHANGE) {
			return state.set('locationBeforeTransitions', action.payload);
		}
		return state;
	},
	app,
	authInfo,
	authors,
	copyrightProtectionAssociationModal,
	followWorks,
	ipInfo,
	popups,
	ips,
	histories,
	myresume,
	orders,
	peopleFollowMe,
	peopleMyFollow,
	personalInfo,
	...https
});
