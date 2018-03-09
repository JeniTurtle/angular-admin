import React, {
	Component
} from 'react';

import PropTypes from 'prop-types';

import ImmutablePropTypes from 'react-immutable-proptypes';

import {
	Link
} from 'react-router';

import {
	Card,
	Pagination,
	Confirm,
	Loading,
	Nav,
	CopyrightProtectionCertificateModal,
} from '../../components';

import {
	connect
} from 'react-redux';

import purerender from '../../decorators/purerender';

import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import FormControl from 'react-bootstrap/lib/FormControl';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Modal from 'react-bootstrap/lib/Modal';

import {
	fetchMergeIPs,
	fetchOnlineIPs,
	delWork
} from '../../actions/HTTP';
import styles from './IPList.scss';

import {
	showWarning,
	showPopup
} from '../../actions/Popups';

import emptyHolder from './empty.png';

const pageCount = 20;
const workStates = ['全部', '草稿', '出售中', '已下架', '审核中', '审核未通过', '等待提交审核'];

@purerender
@connect(state => ({
	cards: state.get('ips'),
	user: state.get('user')
}))

export default class IPList extends Component {

	static get defaultProps() {
		return {
			cards: {
				data: [],
				count: -1
			}
		};
	}

	static propTypes = {
		cards: ImmutablePropTypes.map
	};

	constructor(props) {
		super(props);

		this.state = {
			confirmShow: false,
			confirmTitle: '',
			confirmContent: '',

			pn: 0,
			showAd: true,
			searchText: '',

			workState: '全部',
			condition: null,
			showDCI: false,
			dciImg: ''
		};
	}

	componentWillMount() {
		const {
			dispatch
		} = this.props;

		dispatch(fetchMergeIPs(dispatch, 0, pageCount));
	}

	shouldComponentUpdate(nextProps, nextState) {
		const messageProps = {
			loadingState: ['作品列表加载中', '作品列表加载成功', '作品列表加载失败'],
			proccessingAddCopyright: ['版权添加中', '版权添加成功', '版权添加失败'],
			proccessingDownCopyright: ['版权下架中', '版权下架成功', '版权下架失败'],
			processingDownIP: ['作品下架中', '作品下架成功', '作品下架失败'],
			processingDelIP: ['作品删除中', '作品删除成功', '作品删除失败']
		};

		const messageKeys = Object.keys(messageProps);

		const {
			dispatch,
			cards
		} = this.props;

		messageKeys.forEach(function (item) {
			if (nextProps.cards[item] !== cards[item]) {
				switch (nextProps.cards[item]) {
					case 'start':
						dispatch(showWarning(messageProps[item][0], 'warning'), -1);
						return;
					case 'success':
						dispatch(showWarning(messageProps[item][1], 'success'));
						return;
					case 'fail':
						dispatch(showWarning(messageProps[item][2], 'danger'));
						return;
				}
			}
		});
		return true;
	}

	showReasonTip = reason => {
		const {
			dispatch
		} = this.props;
		reason && dispatch(showPopup({
			content: reason,
			height: 60,
			title: '作品审核未通过原因'
		}));
	};

	hideConfirm = () => {
		this.setState({
			confirmShow: false,
			confirmTitle: '',
			confirmContent: ''
		});
	};

	load = (pn) => {
		const {
			dispatch,
			user
		} = this.props;

		const {
			searchText,
			workState
		} = this.state;

		if (searchText.trim()) {
			dispatch(fetchMergeIPs(dispatch, pn - 1, pageCount, searchText.trim()))
			return;
		}

		this.setState({
			pn: pn - 1
		});

		let conditionObj = {
			type: 'pre'
		};

		// const ACTION_SELLING = 'selling';   //在售
		// const ACTION_HALF = 'half';         //部分售出
		// const ACTION_FINISH = 'finish';     //已售完
		// const ACTION_SELFDOWN = 'selfdown'; //自主下架
		// const ACTION_ADMINDOWN = 'admindown';//管理员下架
		// const ACTION_ALL = 'all';           //不解释
		switch (workState) {

			case '草稿':
				conditionObj.status = 0;
				break;
			case '出售中':
				conditionObj.status = 'selling';
				conditionObj.type = 'online';
				break;
			case '已下架':
				conditionObj.status = 'selfdown';
				conditionObj.type = 'online';
				break;
			case '审核中':
				conditionObj.status = 1;
				break;
			case '审核未通过':
				conditionObj.status = 3;
				break;
			case '等待提交审核':
				conditionObj.status = 9;
				break;
		}

		conditionObj.type === 'pre' ? dispatch(fetchMergeIPs(dispatch, pn - 1, pageCount, conditionObj)) : dispatch(fetchOnlineIPs(dispatch, user.get('objectId'), pn - 1, pageCount, conditionObj))
	};

	handleDelWork = info => {
		const {
			pn
		} = this.state;

		const {
			dispatch
		} = this.props;

		this.setState({
			confirmShow: true,
			confirmTitle: '删除作品',
			confirmContent: '你确定要删除“' + info.get('title') + '”作品么？该操作不可恢复',
			confirmOkHandler: () => {
				dispatch(delWork(dispatch, info.toJS())).then(() => this.load(this.state.pn + 1));
				this.hideConfirm();
			}
		});
	};

	handleSubmit = (e) => {
		e.preventDefault();
		this.setState({
			condition: '',
			workState: '全部'
		}, () => {
			this.load(1);
		});
		return false;
	};

	removeSearch = () => {
		this.setState({
			searchText: ''
		}, () => {
			this.load(1);
		});
	};

	setWorkState = state => {
		this.setState({
			workState: state,
			searchText: ''
		}, () => {
			this.load(1);
		});
	};

	showSellPopup = () => {
		const {
			dispatch
		} = this.props;
		dispatch(showPopup({
			content: '<p><b>待售</b>：作品未成交任何版权\n<b>部分售出</b>：作品已成交部分版权\n<b>已售出</b>：作品的全部版权均已成交</p>'.split('\n').join('</p><p>'),
			title: '售出状态说明',
			height: 80
		}));
	};

	showWorkPopup = () => {
		const {
			dispatch
		} = this.props;
		dispatch(showPopup({
			content: '<p><b>草稿</b>：作品未曾提交审核，可以继续编辑或删除，只有草稿状态的作品可以删除。\n<b>等待身份认证</b>：为了保证用户的权益，交易双方均需通过实名认证。所以作品展示到云莱坞前需先进行实名认证，认证后通过后即可展示出售了。\n<b>等待身份认证通过</b>：您已进行身份认证，认证后通过后作品即可展示出售了。\
			\n<b>身份认证未通过</b>：您提交的身份认证信息未通过，请重新编辑认证信息后再提交审核，认证后通过后作品即可展示出售了。\n<b>作品审核未通过</b>：您提交的作品信息未通过，请重新编辑作品信息后再提交审核，审核通过后作品即可展示出售了。\n<b>出售中</b>：作品已通过审核并展示在云莱坞平台，制片人可以看到您的作品，如果您不想出售作品可通过【作品设置】将作品置为下架，出售中的作品可以使用【作品设置】功能。\
			\n<b>已下架</b>：作品已通过审核但未展示在云莱坞平台，制片人不会看到您的作品，如果您想出售作品可通过【作品设置】将作品置为出售中，下架状态的作品可以使用【作品设置】功能。\n<b>审核中</b>：您提交的作品已提交审核，审核通过后作品即可展示出售了。</p>'.split('\n').join('</p><p>'),
			title: '作品状态说明',
			height: 460
		}));
	};

	showSpeedPopup = () => {
		const {
			dispatch
		} = this.props;
		dispatch(showPopup({
			content: '<p>除了故事本身的价值，另一个至关重要的因素就好的故事卡。<br/><br/>\n您填写的故事卡越完整，就越容易被制片人青睐并成交；\n制片人太忙了，当他们扫过【故事卡】没有发现有用的信息，您的整部作品就直接被忽视掉了；\n毫不夸张地说，【一句话故事】和简短的【核心卖点】，是制片人要不要继续了解您作品的前提；\n接下来，他们才会更耐心地观察您作品中【人物小传】和【故事梗概】中的信息，发现改编可行性，决定是否购买版权。\n因此，写好故事卡至关重要。</p>'.split('\n').join('</p><p>'),
			title: '如何快速出售作品',
			height: 260
		}));
	};

	close = () => {
		this.setState({
			showDCI: false
		});
	};

	showDCI = img => {
		this.setState({
			dciImg: img,
			showDCI: true
		});
	};

	render() {
		const self = this;

		const {
			confirmShow,
			confirmTitle,
			confirmContent,
			confirmOkHandler,
			pn,
			searchText,
			workState,
			showDCI,
			dciImg
		} = this.state;

		const {
			cards,
			user,
			path
		} = this.props;

		const whetherOK = cards && cards.get('loadingState') === 'success';
		const showSearchRemoveBtn = searchText.trim().length > 0;

		// console.log('【cards】', cards.get('data').toJS());

		return (
			<div className={styles.container}>

				{/*<CopyrightProtectionCertificateModal/>*/}

				{/* Nav */}
				<section className={styles.nav}>
					<Nav path={path}/>
				</section>

				{/* 容器 */}
				<section className={styles.contentContainer + ' pull-right'}>
					<div className={styles.searchAdd + ' clearfix'}>
						<form className={styles.search} onSubmit={this.handleSubmit}>
							<FormControl type="text"
										 placeholder="作品名称"
										 className={styles.input}
										 value={searchText}
										 style={{
											 borderColor: '#D4D9E2',
										 }}
										 onChange={e => this.setState({searchText: e.target.value})}/>
							<div className={styles.searchicon} onClick={this.handleSubmit}/>
							{showSearchRemoveBtn &&
							<Glyphicon glyph="remove" className={styles.removeicon} onClick={this.removeSearch}/>}
						</form>
						<p className={styles.speedSell} onClick={this.showSpeedPopup}>如何更快出售作品？</p>
						<Link to="/ipinfo" target="_blank" className={styles.newIP}>新建作品</Link>
					</div>
					<div className={styles.sort}>
						<div className={styles.detail}>作品详情</div>
						<div className={styles.writingStatus}>填写状况</div>
						<div className={styles.sellStatus}>
							<Glyphicon glyph="question-sign" className={styles.tip}
									   onClick={this.showSellPopup}/>
							售出状态
						</div>
						<DropdownButton id="drop-work"
										className={styles.workStatus}
										style={{
											border: 'none',
											lineHeight: '30px',
											background: 'none',
											position: 'relative'
										}}
										bsStyle="default"
										title={workState === '全部' ? '作品状态' : workState}>
							{workStates.map((item, index) =>
								<MenuItem eventKey={index}
										  key={index}
										  active={workState === item}
										  onClick={this.setWorkState.bind(this, item)}>
									{item}
								</MenuItem>)
							}
						</DropdownButton>
						<Glyphicon glyph="question-sign"
								   className={styles.tip}
								   style={{
									   right: (84 + workState.length * 3) + 'px',
									   top: '13px',
									   position: 'absolute',
									   zIndex: 2
								   }}
								   onClick={this.showWorkPopup}/>
					</div>
					{whetherOK && cards.get('count') > 0
						? cards.get('data').map((card, index) => {
							return <Card showDCI={this.showDCI} showReasonTip={this.showReasonTip}
										 key={index}
										 handleDel={self.handleDelWork.bind(self, card)} {...card.toJS()} />;
						})
						: <div className={styles.emptyHolder}>
							<img src={emptyHolder}/>
							<p style={{color: '#707070', textAlign: 'center'}}>没有相关作品</p>
						</div>
					}
					{!whetherOK &&
					<div className={styles.loadingContainer}>
						<Loading/>
					</div>
					}
					{whetherOK && cards.get('count') > pageCount &&
					<Pagination pageCount={pageCount}
								handleTurn={this.load}
								total={cards.get('count')}
								curPage={pn + 1}/>
					}
					<Confirm show={confirmShow}
							 onClose={this.hideConfirm}
							 onOK={confirmOkHandler}
							 content={confirmContent}
							 title={confirmTitle}/>
				</section>

				{/* 版保证书弹窗 */}
				<Modal show={showDCI}
					   className={styles.dci}
					   onHide={this.close}>
					<Modal.Header closeButton>
						<Modal.Title>版权保护证书</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<img src={dciImg}/>
					</Modal.Body>
				</Modal>
			</div>
		);
	}
}
