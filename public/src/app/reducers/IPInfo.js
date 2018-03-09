import {
	SAVE,
	UPDATE
} from '../actions/IPInfo'

import {
	NOTIFYIP,
	NOTIFYCREATEIP,
	NOTIFYUPDATEIP,
	NOTIFYPUBLISHIP
} from '../actions/HTTP'

import clone from '../utils/clone';

import {
	processNotify
} from './HTTP';

import Immutable, {
	fromJS,
	List,
	Map
} from 'immutable';

import copyrightMap, {
	COPYRIGHTMAP
} from '../utils/copyrightMap';

const initialState = fromJS({
	type: 0,
	//作品标题
	title: '',
	//作者
	realAuthor: '',
	//核心卖点
	coreSellPoint: '',
	//一句话故事
	desc: '',
	//作品标签
	tags: ['', '', '']
});


//在此处理好关于版权的一切
export function handleCopyright(info) {

	//已出售的版权从线上的IP库中获取
	let soldCopyrights = List();
	//可出售的版权要过滤掉线上已出售的版权
	let sellCopyrights = List();

	if (info.get('publishedIp')) {
		soldCopyrights = info.get('publishedIp').get('copyright2').filter(item => item.get('status') == 3).map(item => item.get('chs') == '电视' ? '电视剧' : item.get('chs'));
	}

	if (soldCopyrights.indexOf('全版权') > -1) {
		sellCopyrights = List();
	} else {
		info.get('copyright').map(key => copyrightMap(key)).forEach(item => {
			if (soldCopyrights.indexOf(item) < 0) {
				sellCopyrights = sellCopyrights.push(item);
			}
		});
	}

	//如果已经有已售的版权了，就把在售中的全版权去掉
	if (soldCopyrights.count() && sellCopyrights.indexOf('全版权') > -1) {

		sellCopyrights = sellCopyrights.splice(sellCopyrights.indexOf('全版权'), 1);

	}

	let otherCopyrights = List();

	for (let i in COPYRIGHTMAP) {

		//在版权列表里的，且不在在售、已售和主动下架版权状态的
		if ((!info.get('lockCopyright') || info.get('lockCopyright').indexOf(i) < 0) //主动下架版权
			&& sellCopyrights.indexOf(COPYRIGHTMAP[i]) < 0 //在售
			&& soldCopyrights.indexOf(COPYRIGHTMAP[i]) < 0) { //已售

			//如果已经卖出或者锁定了版权，就不能再添加全部版权了
			if (((info.get('lockCopyright') && info.get('lockCopyright').count()) || soldCopyrights.count()) && i == 'all') {
				continue;
			}

			otherCopyrights = otherCopyrights.push(COPYRIGHTMAP[i]);
		}

	}

	//如果卖出了全版权，就不要再添加版权了。。。
	if (soldCopyrights.indexOf('全版权') > -1) {
		otherCopyrights = List();
	}

	return info.merge(Map({
		soldCopyrights,
		sellCopyrights,
		otherCopyrights
	}));

}

export default function(state = initialState, action) {

	let data = fromJS(action.data);

	switch (action.type) {

		case UPDATE:

			if (Map.isMap(action.key)) {
				//这儿不能用merge，否则子项目为数组删除的时候会有问题
				return state.merge(action.key);
			}

			//Excelent setIn method!!!
			return state.setIn(action.key.split('.'), action.value);

		case NOTIFYIP:

			//新老数据兼容
			if (data === 0) {
				return state.set('loadingState', 'start');
			}

			if (data === -1) {
				return state.set('loadingState', 'fail');
			}

			if (data.has('biography') && (!data.has('biographies') || !data.get('biographies').count() || !data.get('biographies').get(0))) {
				data = data.set('biographies', data.get('biography') ? List.of(data.get('biography')) : List.of('', ''));
			}

			if (!data.has('outline')) {
				data = data.set('outline', List.of('', '', '', ''));
			} else {
				data = data.set('outline', data.get('outline').map(item => item || ''));
			}

			return handleCopyright(data).set('loadingState', 'success');

		case NOTIFYCREATEIP:
			return processNotify(state, data, 'proccessingCreateIP', false);

		case NOTIFYUPDATEIP:
			return processNotify(state, data, 'proccessingUpdateIP', true);

		case NOTIFYPUBLISHIP:
			return processNotify(state.set('objectId', data), data, 'proccessingPublishIP', true);

		default:
			return state;

	}
}
