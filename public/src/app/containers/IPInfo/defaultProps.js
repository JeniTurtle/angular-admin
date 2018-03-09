import {
	fromJS
} from 'immutable';

export default fromJS({
	workType: '',
	workState: '',
	title: '',
	realAuthor: '',
	realAuthorId: '',
	coreSellPoint: '',
	desc: '',
	cat: [],
	tags: ['', '', ''],
	selfPrice: '',
	hasPublished: '',
	transTarget: '',
	copyright: [],
	//相似影片
	anotherFilm: '',
	//目标群体
	audience: '',
	//作品亮点
	workValue: '',
	//作品长度
	workLength: '',
	//点击量/发行量
	workPV: '',
	//交易条件
	moreInformation: '',
	//作品相关指数
	relatedIndex: {
		//首发网站
		siteLink: '',
		//首发网站点击量／收藏量
		clickCount: '',
		//粉丝数量
		fansCount: '',
		//微博话题量
		weiboTopicCount: '',
		//豆瓣评分
		doubanScore: '',
		//百度搜索相关页数
		baiduSearchPages: '',
		//出版社
		publishingHouse: '',
		//出版国际标准书号ISBN
		ISBN: '',
		//同名贴吧用户数
		sameNamePostBar: '',
		//曾获得成就
		achievement: '',
		//百度指数
		baiduIndexCount: ''
	}
}).toObject();
