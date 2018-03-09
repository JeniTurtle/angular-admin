/**
* @Author: chenming
* @Date:   2017-01-17T20:59:16+08:00
* @Last modified by:   chenming
* @Last modified time: 2017-02-13T19:05:03+08:00
*/



export default {
	workType: {
		required: true,
		name: '作品形式'
	},
	cat: {
		isArray: true,
		required: true,
		firstRequired: true,
		name: '作品主类型'
	},
	workState: {
		required: true,
		name: '作品当前状态'
	},
	copyright: {
		isArray: true,
		required: true,
		name: '可出售的版权'
	},
	title: {
		required: true,
		maxLength: 15,
		name: '作品标题'
	},
	realAuthor: {
		required: true,
		name: '作者'
	},
	coreSellPoint: {
		maxLength: 15,
		name: '核心卖点',
		required: true
	},
	desc: {
		required: true,
		minLength: 15,
		maxLength: 50,
		name: '一句话故事'
	},
	hasPublished: {
		required: true,
		name: '是否已发表'
	},
	transTarget: {
		required: true,
		name: '期望改编方式'
	},
	tags: {
		isArray: true,
		singleMaxLength: 5,
		name: '作品标签'
	},
	selfPrice: {
		required: true,
		name: '预估价格'
	},
	anotherFilm: {
		maxLength: 20,
		name: '相似影片'
	},
	audience: {
		maxLength: 50,
		name: '目标群体'
	},
	workValue: {
		maxLength: 100,
		name: '作品亮点'
	},
	workLength: {
		maxLength: 20,
		name: '作品长度'
	},
	workPV: {
		maxLength: 20,
		name: '点击量、发行量'
	},
	moreInformation: {
		maxLength: 100,
		name: '交易条件'
	},
	relatedIndex: {
		notLeaf: true,
		siteLink: {
			maxLength: 20,
			name: '首发网站'
		},
		clickCount: {
			maxLength: 20,
			name: '首发网站点击量、收藏量'
		},
		fansCount: {
			maxLength: 20,
			name: '粉丝数量'
		},
		weiboTopicCount: {
			maxLength: 20,
			name: '微博话题量'
		},
		doubanScore: {
			maxLength: 20,
			name: '豆瓣评分'
		},
		baiduSearchPages: {
			maxLength: 20,
			name: '百度搜索指数'
		},
		publishingHouse: {
			maxLength: 20,
			name: '出版社'
		},
		ISBN: {
			maxLength: 20,
			name: '出版社国际标准书号ISBN'
		},
		sameNamePostBar: {
			maxLength: 20,
			name: '同名贴吧用户数'
		},
		achievement: {
			maxLength: 20,
			name: '曾获得成就'
		},
		baiduIndexCount: {
			maxLength: 20,
			name: '百度指数'
		}
	}
};
