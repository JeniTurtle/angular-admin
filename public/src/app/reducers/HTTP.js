import {
	NOTIFYCATS,
	NOTIFYUSER,
	NOTIFYDESC,
	NOTIFYAVATAR,
	NOTIFYAUTHSTATE,
	NOTIFYWORKSPACE,
	NOTIFYWSBANNER,
	GETFIRSTINVALIDIP,
	NOTIFYDELIVERS,
	NOTIFYDELIVERDETAIL,
	NOTIFYCOLLECTRECOMMEND,
	NOTIFYCALLSTATE,
	NOTIFY_FOLLOW_WORKS,	// 关注的作品列表
	NOTIFY_FOCUS_PEOPLE_MY_FOLLOW,	// 我关注的人
	NOTIFY_FOCUS_PEOPLE_FOLLOW_ME,	// 关注我的人
	NOTIFY_CHANGE_FOLLOW_STATUS,	// // 关注/取消关注（人） 改变关注状态
	NOTIFY_FETCH_PERSONAL_INFO,	// 获得个人信息
	NOTIFY_UPDATE_PERSONAL_INFO_SEX_EMAIL_DESC,	// 提交个人信息
} from '../actions/HTTP';

import {
	fromJS,
	Map
} from 'immutable';

const defaultCats = fromJS([{
	id: 1,
	name: '爱情'
}, {
	id: 2,
	name: '喜剧'
}, {
	id: 3,
	name: '青春'
}, {
	id: 4,
	name: '剧情'
}, {
	id: 5,
	name: '悬疑'
}, {
	id: 6,
	name: '惊悚'
}, {
	id: 7,
	name: '古装'
}, {
	id: 8,
	name: '奇幻'
}, {
	id: 9,
	name: '科幻'
}, {
	id: 10,
	name: '动作'
}, {
	id: 11,
	name: '犯罪'
}, {
	id: 12,
	name: '冒险'
}, {
	id: 13,
	name: '家庭'
}, {
	id: 14,
	name: '励志'
}, {
	id: 15,
	name: '儿童'
}, {
	id: 16,
	name: '武侠'
}, {
	id: 17,
	name: '战争'
}, {
	id: 18,
	name: '历史'
}]);

export function processNotify(state = Map({}), data, name = 'loadingState', persist = false) {
	data = fromJS(data);
	// console.log('state', state.toJS(), 'data', data, 'name', name, 'persist', persist);

	// 这里做一个保护，防止报错
	// 测试发现 NOTIFYWSBANNER 这个action会发送过来一个为null的data，测试环境
	if (data === null || data === '') {
		return state;
	}
	if (data === 0) {
		return state.set(name, 'start');
	} else if (data === -1) {
		return state.set(name, 'fail');
	} else {
		return persist ? state.set(name, 'success') : data.set(name, 'success');
	}
}

export function callstate(state = Map({}), action) {
	switch (action.type) {
		case NOTIFYCALLSTATE:
			return processNotify(state, fromJS(action.data));
		default:
			return state;
	}
}

export function collectrecommend(state = Map({}), action) {
	switch (action.type) {
		case NOTIFYCOLLECTRECOMMEND:
			return processNotify(state, fromJS(action.data));
		default:
			return state;
	}
}

export function deliverdetail(state = Map({}), action) {
	switch (action.type) {
		case NOTIFYDELIVERDETAIL:
			return processNotify(state, fromJS(action.data));
		default:
			return state;
	}
}

export function delivers(state = Map({}), action) {
	switch (action.type) {
		case NOTIFYDELIVERS:
			return processNotify(state, fromJS(action.data));
		default:
			return state;
	}
}

export function authstate(state = Map({}), action) {
	switch (action.type) {
		case NOTIFYAUTHSTATE:
			return processNotify(state, fromJS(action.data));
		default:
			return state;
	}
}

export function workspace(state = Map({}), action) {
	switch (action.type) {
		case NOTIFYWORKSPACE:
			return processNotify(state, fromJS(action.data));
		default:
			return state;
	}
}

export function banner(state = Map({}), action) {
	switch (action.type) {
		case NOTIFYWSBANNER:
			return processNotify(state, fromJS(action.data));
		default:
			return state;
	}
}

export function cats(state = defaultCats, action) {
	switch (action.type) {
		case NOTIFYCATS:
			return processNotify(state, fromJS(action.data));
		default:
			return state;
	}
}

export function firstInvalid(state = false, action) {

	switch (action.type) {
		case GETFIRSTINVALIDIP:
			return fromJS(action.data);
		default:
			return state;
	}
}

export function user(state = Map({}), action) {
	let data = fromJS(action.data);
	switch (action.type) {
		case NOTIFYUSER:
			return processNotify(state, data);
		case NOTIFYDESC:
			return state.set('desc', (data === 0 || data === -1) ? state.get('desc') : data);
		case NOTIFYAVATAR:
			return state.set('smallAvatar', data);
		default:
			return state;
	}
}
