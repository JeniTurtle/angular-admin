/**
 * Created by waka on 2017/3/30.
 */

// React
import React, {
	Component,
} from 'react';

import PropTypes from 'prop-types';

// 引入样式
import styles from './FocusLiteratureList.scss';

// 公共组件
import {
	Spin,	// 加载中
} from '../../commonComponents';

// 业务组件
import {
	NoData,
} from '../../components';

// 作品项
import LiteratureItem from './LiteratureItem/LiteratureItem';

// 引入存在的组件
import {
	Nav,
} from '../../components';

/************************** redux ****************************/
import {
	bindActionCreators
} from 'redux';

import {
	connect
} from 'react-redux';

// 引入action
import {
	fetchFollowWorks,
} from '../../actions/HTTP';

@connect(state => ({
	user: state.get('user'),
	followWorks: state.get('followWorks'),
}), dispatch => bindActionCreators({
	fetchFollowWorks: fetchFollowWorks.bind(this, dispatch),
}, dispatch))

/**
 * 关注的作品页
 */
export default class FocusLiteratureList extends Component {

	// 定义属性类型
	static propTypes = {};

	// 设置默认属性
	static defaultProps = {};

	constructor(props) {
		super(props);

		this.state = {
			loadMoreTips: '点击查看更多',	// 加载更多提示语
		};

		// 上次关注作品的长度，用来改进交互体验，比如如果数据加载完毕了显示数据加载完毕，而不是继续显示点击加载更多
		this.lastFollowWorksLength = -1;
	}

	componentWillMount() {
		this.props.fetchFollowWorks(0, 10);
	}

	componentWillUpdate() {
		// console.log('关注的作品列表 componentWillUpdate');
	}

	/**
	 * 加载更多
	 */
	handleLoadMore() {

		const pn = this.props.followWorks.get('pn');
		const rn = this.props.followWorks.get('rn');

		// 如果是否停止增加页数===true
		if (this.isStopAddPageNumber) {
			this.props.fetchFollowWorks(pn, rn);	// 停止增加页数
		} else {
			this.props.fetchFollowWorks(pn + 1, rn);	// 默认增加页数
		}
	}

	/**
	 * 渲染列表
	 */
	renderList() {

		const followWorks = this.props.followWorks.get('data');	// 获得数据
		const loadingState = this.props.followWorks.get('loadingState');	// 获得数据加载状态

		// 如果关注的作品列表数量为0
		if (followWorks && followWorks.size === 0) {
			this.isStopAddPageNumber = true;	// 是否停止增加页数===true
		} else {
			this.isStopAddPageNumber = false;	// 是否停止增加页数===false
		}

		const pn = this.props.followWorks.get('pn');	// 获得 pn
		const rn = this.props.followWorks.get('rn');	// 获得 rn

		// 如果缓存的 followWorks 不存在或者 pn 为0
		if (!this.followWorks || pn === 0) {
			this.followWorks = followWorks;	// 本地缓存一个followWorks，用来链接列表数组
		}
		// 如果 pn > 0 并且 loadingState 加载状态为成功时
		else if (pn > 0 && loadingState && loadingState === 'success') {
			this.followWorks = this.followWorks.concat(followWorks);	// 链接数组
		}

		let isLoadFinished = false;	// 是否加载完毕

		// 判断上一次的长度和当前的长度是否相等
		if (this.followWorks && this.lastFollowWorksLength && loadingState && loadingState === 'success') {
			// console.log('上一次长度', this.lastFollowWorksLength);
			// console.log('当前长度', this.followWorks.size);
			isLoadFinished = this.followWorks.size === this.lastFollowWorksLength;
		}

		// 赋值给上一次的长度
		if (loadingState && loadingState === 'success') {
			this.lastFollowWorksLength = this.followWorks.size;	// 把当前长度赋值给上一次的长度
		}

		// 有数据
		if (this.followWorks && this.followWorks.size > 0) {
			return <div className={styles.literatureList}>
				{this.followWorks.map((item, index) => {
					item = item.toJS();
					return <div className={styles.literatureItem} key={item.objectId}>
						<LiteratureItem
							id={item.objectId}
							title={item.title}
							dciCode={item.dciCode}
							dciUrl={item.dciUrl}
							vip={item.vip}
							coreSellingPoint={item.coreSellingPoint}
							desc={item.desc}
							author={item.author[0].username}
							category={item.cat[0]}
							workType={item.workType}
							subscribed={item.subscribed}
						/>
					</div>;
				})}
				<div
					className={styles.loadMore}
					onClick={this.handleLoadMore.bind(this)}>
					{isLoadFinished ? '数据加载完毕' : '点击加载更多'}
				</div>
			</div>;
		}
		// 没有数据
		else {
			return <div className={styles.noData}>
				<NoData type="work" text="目前没有关注的作品"/>
			</div>;
		}
	}

	render() {

		const loadingState = this.props.followWorks.get('loadingState');	// 获得数据加载状态

		return (
			<section className={styles.wrapper}>

				{/* 模态框加载中... */}
				{loadingState === 'start'
					? <Spin isModal={true}/>
					: null
				}

				{/* 左边导航栏 */}
				<section className={styles.nav}>
					<Nav path={this.props.path}/>
				</section>

				{/* 右侧关注的作品 */}
				<section className={styles.focusLiteratureList}>

					{/* 标题 */}
					<div className={styles.title}>关注的作品</div>

					{/* 关注的作品列表 */}
					{this.renderList()}

				</section>

			</section>
		);
	}
}
