import React from 'react';

import {
	IndexRoute,
	Route
} from 'react-router';

import {
	App,
	AuthInfo,
	AuthorList,
	DataCenter,
	DataDetail,
	DeliverDetail,
	Done,
	FocusLiteratureList,
	FocusPeople,
	HistoryList,
	HowTo,
	IPConfig,
	IPDetail,
	IPInfo,
	IPList,
	NotFound,
	PersonalInfo,
	Preview,
	Raw,
	WorkSpace,
	MyDeliver,
	MyResume,
	Orders
} from './containers';

export default (store) => {

	/**
	 * 按照字母表的顺序来整理路由
	 */
	return (
		<Route path="/" component={App}>

			{/* Default Child Component */}
			<IndexRoute component={WorkSpace}/> {/* 工作台，默认主页就是该子组件 */}

			{ /* Routes */ }
			<Route path="authinfo" component={AuthInfo}/> {/* 认证信息 */}
			<Route path="authorlist(/:auto)" component={AuthorList}/> {/* 匹配authorlist；匹配authorlist/123 */}
			<Route path="datacenter" component={DataCenter}/> {/* 数据中心 */}
			<Route path="datadetail/:id" component={DataDetail}/> {/* 数据中心，作品分析 */}
			<Route path="done/:id" component={Done}/> {/* 提交审核 */}
			<Route path="deliverdetail/:id" component={DeliverDetail}/>
			<Route path="historylist" component={HistoryList}/> {/* 版权小站，代表作品 */}
			<Route path="howto" component={HowTo}/> {/* 版权小站，怎样卖的更好的文本引导 */}
			<Route path="ipconfig/:id" component={IPConfig}/> {/* 作品设置 */}
			<Route path="ipdetail/:id" component={IPDetail}/> {/* 故事梗概 */}
			<Route path="ipinfo" component={IPInfo}/> {/* 编辑作品 */}
			<Route path="ipinfo/:id" component={IPInfo}/> {/* 编辑作品，特定作品 */}
			<Route path="iplist" component={IPList}/> {/* 我的作品 */}
			<Route path="orders" component={Orders}/> {/* 我的订单 */}
			<Route path="preview/:index" component={Preview}/> {/* 电脑预览，手机预览 */}
			<Route path="raw/:id" component={Raw}/> {/* 上传原文 */}
			<Route path="praw/:id" component={Raw}/> {/* 也是上传原文 */}
			<Route path="workspace" component={WorkSpace}/> {/* 工作台 */}
			<Route path="mydeliver" component={MyDeliver}/> {/* 我的投稿 */}
			<Route path="personalInfo" component={PersonalInfo}/> {/* 我的信息 */}
			<Route path="focusPeople" component={FocusPeople}/> {/* 关注的人 */}
			<Route path="focusLiteratureList" component={FocusLiteratureList}/> {/* 关注的列表 */}
			<Route path="myresume" component={MyResume}/> {/* 我的简历 */}

			{ /* Catch all route */ }
			<Route path="*" component={NotFound} status={404}/>
		</Route>
	);
};
