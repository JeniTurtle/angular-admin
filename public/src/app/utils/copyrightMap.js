// 版权类型map
export const COPYRIGHTMAP = {
	all: '全版权',
	dy: '电影',
	ds: '电视剧',
	wj: '网剧',
	yx: '游戏',
	wt: '舞台剧',
	dh: '动画电影',
	dhp: '动画片',
	vr: 'VR视觉作品',
	wd: '网络大电影'
};

// 反式版权类型map，它的key与value是反的
export const RCOPYRIGHTMAP = Object.keys(COPYRIGHTMAP).reduce(function (obj, key) {
	obj[COPYRIGHTMAP[key]] = key;
	return obj;
}, {});

/**
 * 根据key 获取value
 * @param key
 * @returns {*}
 */
export default function trans(key) {
	return COPYRIGHTMAP[key];
}
