import React, {
	Component
} from 'react';
import PropTypes from 'prop-types';
import {
	bindActionCreators
} from 'redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import moment from 'moment';
import styles from './MyDeliver.scss';
import {
	connect
} from 'react-redux';
import QRious from 'qrious';
import {
	showToast
} from '../../actions/Popups';

import {
	Nav,
	Loading
} from '../../components';
import {
	fetchDelivers,
	fetchCallState
} from '../../actions/HTTP';
import emptyHolder from './empty.png';
import Modal from 'react-bootstrap/lib/Modal';

import purerender from '../../decorators/purerender';

import {
	Map
} from 'immutable';

@connect(state => ({
	user: state.get('user'),
	delivers: state.get('delivers'),
	callstate: state.get('callstate')
}), dispatch => bindActionCreators({
	fetchDelivers: fetchDelivers.bind(this, dispatch),
	fetchCallState: fetchCallState.bind(this, dispatch),
	showToast
}, dispatch))

export default class MyDeliver extends Component {

	constructor(props) {

		super();

		this.state = {
			modalShow: false,
			tabIndex: -1
		};

	}

	componentWillMount() {

		const {
			fetchDelivers,
			fetchCallState,
			showToast
		} = this.props;

		fetchDelivers(-1);
		fetchCallState();

	}

	changeStatus = (status) => {
		const {fetchDelivers, fetchCallState} = this.props;
		fetchDelivers(status);
		fetchCallState();
		this.setState({
			tabIndex: status
		});
	};

	render() {
		const self = this;
		const {
			modalShow,
			qrImg
		} = this.state;

		const {
			delivers,
			path,
			user,
			callstate
		} = this.props;

		const whetherOK = delivers;

		// console.log('delivers.toJS() instanceof Array', delivers.toJS() instanceof Array);

		const callSateReady = callstate && callstate.get('loadingState') == 'success';
		return (

			<div className={styles.container}>
				<section className={styles.nav}>
					<Nav path={path}/>
				</section>
				<div className={styles.contentContainer + ' pull-right'}>
					<div className={styles.bar}>
						<div onClick={this.changeStatus.bind(this, -1)}
							 className={styles.tab + (this.state.tabIndex == -1 ? ' ' + styles.active : '')}>
							全部{callSateReady && callstate.get('total') > 0 ?
							<span className={styles.redDot}></span> : null}</div>
						<div onClick={this.changeStatus.bind(this, 0)}
							 className={styles.tab + (this.state.tabIndex == 0 ? ' ' + styles.active : '')}>
							初审中{callSateReady && callstate.get('0') > 0 ?
							<span className={styles.redDot}></span> : null}</div>
						<div onClick={this.changeStatus.bind(this, 1)}
							 className={styles.tab + (this.state.tabIndex == 1 ? ' ' + styles.active : '')}>
							复审中{callSateReady && callstate.get('1') > 0 ?
							<span className={styles.redDot}></span> : null}</div>
						<div onClick={this.changeStatus.bind(this, 3)}
							 className={styles.tab + (this.state.tabIndex == 3 ? ' ' + styles.active : '')}>
							已采纳{callSateReady && callstate.get('3') > 0 ?
							<span className={styles.redDot}></span> : null}</div>
						<div onClick={this.changeStatus.bind(this, 2)}
							 className={styles.tab + (this.state.tabIndex == 2 ? ' ' + styles.active : '')}>
							不合适{callSateReady && callstate.get('2') > 0 ?
							<span className={styles.redDot}></span> : null}</div>
					</div>

					{whetherOK ? (delivers.toJS() instanceof Array && delivers.count() > 0 ? delivers.map((deliver, index) => {
							// console.log('deliver', deliver instanceof Map);
							return <div className={styles.order} key={index}>
								<div className={styles.content}>
									<div className={styles.detail}>
										<div className={styles.header}>
											<div
												className={styles.title}>{deliver.get('title')}</div>
											<a className={styles.jumpChunk} target="_blank"
											   href={"http://www.yunlaiwu.com/collect/detail/" + deliver instanceof Map && deliver.get('callId')}>
												<div className={styles.person}>
													征稿需求：{deliver instanceof Map && deliver.get('publishDemand')}</div>
												<div className={styles.copyrights}>
													发布人：{deliver instanceof Map && deliver.get('publishName')}</div>
											</a>
										</div>
									</div>
									{
										deliver instanceof Map && deliver.get('status') === 0 ?
											<div className={styles.deliverState}>
												<p>{'初审中'}<br/><span
													className={styles.leftDays}>剩余{deliver.get('publishTime').split('：')[1]}</span>
												</p>
											</div>
											:
											null
									}
									{
										deliver instanceof Map && deliver.get('status') == 1 ?
											<div className={styles.deliverState}>
												<p>{'复审中'}<br/><span
													className={styles.leftDays}>剩余{deliver.get('publishTime').split('：')[1]}</span>
												</p>
											</div>
											:
											null
									}
									{
										deliver instanceof Map && deliver.get('status') === 2 ?
											<div className={styles.deliverState}>
												<p>{'不合适'}</p>
											</div>
											:
											null
									}
									{
										deliver instanceof Map && deliver.get('status') === 3 ?
											<div className={styles.deliverState}>
												<p>{'已采纳，交易阶段'}</p>
											</div>
											:
											null
									}
								</div>
								<section className={styles.footerWrapper}>
									<div className={styles.divider}/>
									<div className={styles.footer}>
										<p>
											投递时间：{deliver instanceof Map && moment(deliver.get('submitTime') * 1000).format('YYYY.MM.DD HH:mm:ss')} </p>
										<a className={styles.scan} target="_blank"
										   href={"/#/deliverdetail/" + deliver instanceof Map && deliver.get('ipCallId')}>详情</a>
									</div>
								</section>
							</div>
						})
						: <div className={styles.emptyHolder}>
							<img width={175} height={175} src={emptyHolder}/>
							<p style={{color: '#707070', textAlign: 'center'}}>
								一键投稿顶级制片方，在线查看投稿进度<br/>
								投稿再也不会石沉大海
							</p>
						</div> )
						: <div style={{marginTop: '200px'}}>
							<Loading/>
						</div>
					}
				</div>
			</div>
		);
	}
}
