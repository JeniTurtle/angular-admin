/**
 * Created by waka on 2017/3/30.
 */

// React
import React, {
	Component,
} from 'react';

import PropTypes from 'prop-types';

// 引入样式
import styles from './FocusPeople.scss';

// 公共组件
import {
	TabGroup,	// Tab组
	SearchBar,	// 搜索框
	Spin,	// 加载中
	Pagination,	// 分页栏
} from '../../commonComponents';

// 业务组件
import {
	NoData,	// 没有数据
} from '../../components';

import FocusList from './FocusList/FocusList';	// 关注的人列表

// 引入存在的组件
import {
	Nav
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
	fetchPeopleMyFollow,
	fetchPeopleFollowMe,
	changeFollowStatus,
} from '../../actions/HTTP';

@connect(state => ({
	user: state.get('user'),
	peopleMyFollow: state.get('peopleMyFollow'),
	peopleFollowMe: state.get('peopleFollowMe'),
}), dispatch => bindActionCreators({
	fetchPeopleMyFollow: fetchPeopleMyFollow.bind(this, dispatch),
	fetchPeopleFollowMe: fetchPeopleFollowMe.bind(this, dispatch),
	changeFollowStatus: changeFollowStatus.bind(this, dispatch)
}, dispatch))

/**
 * 关注的人页
 */
export default class FocusPeople extends Component {

	// 定义属性类型
	static propTypes = {};

	// 设置默认属性
	static defaultProps = {};

	constructor(props) {
		super(props);

		// initial state
		this.state = {
			tab: 0,	// 内部维护一个tab状态，关注列表的类型：0.我关注的人；1.关注我的人
		};
	}

	/**
	 * 在完成首次渲染之前调用
	 */
	componentWillMount() {
		// 请求数据
		this.props.fetchPeopleMyFollow(0, 10);
		this.props.fetchPeopleFollowMe(0, 10);
	}

	componentDidMount() {
	}

	componentWillUpdate() {
	}

	componentDidUpdate() {

	}

	/**
	 * 监听Tab变化
	 * @param index
	 */
	onTabChanged(index) {
		// console.log('tab change', index);
		this.setState(() => {
			return {
				tab: index
			};
		});
	}

	/**
	 * 渲染关注人列表
	 */
	renderFollowPeopleList() {
		// 我关注的人
		if (this.state.tab === 0) {
			const {
				peopleMyFollow
			} = this.props;
			const myFollowList = peopleMyFollow.get('data');
			const currentPage = peopleMyFollow.get('pn') ? peopleMyFollow.get('pn') + 1 : 1;	// 当前页数
			let count = peopleMyFollow.get('count');	// 总数
			// count = 0;	// 测试没有数据的情形
			if (count > 0) {
				return <section>
					<FocusList
						dataArray={myFollowList}/>
					<div className={styles.pagination}>
						<Pagination
							current={currentPage}
							total={count}
							onChange={(index) => {
								let pn = index - 1;	// 这里需要减一，因为分页器组件是从1开始的，而后端接口是从0开始的
								let rn = peopleMyFollow.get('rn');
								this.props.fetchPeopleMyFollow(pn, rn);

								// 回到顶部
								let dom = document.getElementById('container');
								dom.scrollTop = 0;
							}}/>
					</div>
				</section>;
			} else {
				return <div className={styles.noData}>
					<NoData type="person" text="目前没有我关注的人"/>
				</div>;
			}
		}
		// 关注我的人
		else if (this.state.tab === 1) {
			const {
				peopleFollowMe
			} = this.props;
			const followMeList = peopleFollowMe.get('data');
			const currentPage = peopleFollowMe.get('pn') ? peopleFollowMe.get('pn') + 1 : 1;	// 当前页数
			let count = peopleFollowMe.get('count');	// 总数
			// count = 0; // 测试为0时的情况
			if (count > 0) {
				return <section>
					<FocusList
						isShowFollowBtn={true}
						dataArray={followMeList}
						onFollowClick={(index, uid, isFollow) => {
							// console.log('onFocusButtonClick', index, uid, isFollow);
							this.props.changeFollowStatus(uid, isFollow);
						}}/>
					<div className={styles.pagination}>
						<Pagination
							current={currentPage}
							total={count}
							onChange={(index) => {
								let pn = index - 1;	// 这里需要减一，因为分页器组件是从1开始的，而后端接口是从0开始的
								let rn = peopleFollowMe.get('rn');
								this.props.fetchPeopleFollowMe(pn, rn);

								// 回到顶部
								let dom = document.getElementById('container');
								dom.scrollTop = 0;
							}}/>
					</div>
				</section>;
			} else {
				return <div className={styles.noData}>
					<NoData type="person" text="目前没有关注我的人"/>
				</div>;
			}
		}
		else {
			return null;
		}
	}

	render() {

		const {
			peopleMyFollow,	// 我关注的人
			peopleFollowMe,	// 关注我的人
		} = this.props;

		/************************* tab *************************/

		let tabs = [{
			text: '我关注的人'
		}, {
			text: '关注我的人'
		}];

		/************************* 我关注的人 *************************/

		const myFollowLoadingState = peopleMyFollow.get('loadingState');

		/************************* 关注我的人 *************************/

		const followMeLoadingState = peopleFollowMe.get('loadingState');
		const processingChangeFollowStatus = peopleFollowMe.get('processingChangeFollowStatus');	// 改变关注状态status
		// console.log('processingChangeFollowStatus', processingChangeFollowStatus);

		return (
			<section className={styles.wrapper}>

				{/* 模态框加载中... */}
				{myFollowLoadingState === 'start' || followMeLoadingState === 'start' || processingChangeFollowStatus === 'start'
					? <Spin isModal={true}/>
					: null
				}

				{/* 左侧Nav */}
				<section className={styles.nav}>
					<Nav path={this.props.path}/>
				</section>

				{/* 右侧正文 */}
				<section className={styles.focusPeople}>

					{/* tab */}
					<div className={styles.tabGroup}>
						<TabGroup tabs={tabs} onTabChanged={this.onTabChanged.bind(this)}/>
					</div>

					{/* 渲染关注的人列表和分页栏 */}
					{this.renderFollowPeopleList()}

				</section>
			</section>
		);
	}
}
