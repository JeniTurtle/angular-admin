import React, {
	Component
} from 'react';
import PropTypes from 'prop-types';
import {
	bindActionCreators
} from 'redux';

import {
	Map,
} from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import moment from 'moment';
import styles from './Orders.scss';
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
	fetchOrders
} from '../../actions/HTTP';
import emptyHolder from './empty.png';
import qrIcon from './qr.png';
import Modal from 'react-bootstrap/lib/Modal';

@connect(state => ({
	orders: state.get('orders'),
	user: state.get('user')
}), dispatch => bindActionCreators({
	fetchOrders: fetchOrders.bind(this, dispatch),
	showToast
}, dispatch))

export default class Orders extends Component {

	constructor(props) {

		super();

		this.state = {
			modalShow: false,
			qrShow: false
		};

	}

	componentWillMount() {
		const {
			fetchOrders,
			showToast
		} = this.props;

		fetchOrders();
	}

	componentDidMount() {
		const curStamp = new Date().valueOf();
		localStorage.setItem('USER_EXIT_TIME', curStamp);
	}

	shouldComponentUpdate(nextProps, nextState) {

		const messageProps = {
			// loadingState: ['订单列表加载中', '订单列表加载成功', '订单列表加载失败']
		};

		const messageKeys = Object.keys(messageProps);

		const {
			showToast,
			orders
		} = this.props;

		messageKeys.forEach(function (item) {
			if (nextProps.orders.get(item) !== orders.get(item)) {
				switch (nextProps.orders.get(item)) {
					case 'start':
						showToast(messageProps[item][0], 'loading', -1);
						return;
					case 'success':
						showToast(messageProps[item][1], 'success');
						return;
					case 'fail':
						showToast(messageProps[item][2], 'fail');
						return;
				}
			}
		});
		return true;
	}

	/*
	 按钮逻辑

	 0   0
	 买方： 立即报价（编辑）    联系版权方    "等待购买方报价"
	 卖方：     联系购买方                 "等待购买方报价"
	 1 0 买方出价（type = 1）
	 买方： 编辑议价    联系版权方             "等待版权方回复"
	 卖方：     立即答复                     "等待版权方回复"
	 1 0 卖方报价 （type = 2）
	 买方：     联系版权方                    "等待版权方报价"
	 卖方： 立即报价（跳订单编辑） 联系购买方     "等待版权方报价"
	 1 1 买方报价/卖方报价
	 买方： 提醒下架（发 + 跳）   联系版权方（跳） "议价中，线下交易成功后下架版权"
	 卖方： 确认交易完成（详情）   联系购买方      "议价中，线下交易成功后下架版权"
	 2 0
	 买方：     联系版权方       "交易完成，版权下架"
	 卖方：     联系购买方       "交易完成，版权下架"
	 3 0
	 买方：     联系版权方       "交易取消"
	 卖方：     联系购买方       "交易取消"
	 */
	getState = order => {

		const mainStatus = order.get('mainStatus');
		const subStatus = order.get('subStatus');
		const type = order.get('type');

		switch (mainStatus) {
			case 0:
				return '等待购买方报价';
			case 1:
				return subStatus ? '议价中，线下交易成功后下架版权' : (type == 1 ? '等待版权方回复' : '等待版权方报价');
			case 2:
				return '交易完成，版权下架';
			case 3:
				return '交易取消';
		}
		return '';
	};

	showQR = orderId => {
		this.setState({
			qrImg: new QRious({
				size: 260,
				value: 'http://www.yunlaiwu.com/mobile/transfer?add=' + encodeURIComponent('yunlaiwu:///showorderdetail?orderId=' + orderId),
				foreground: '#000'
			}).toDataURL('image/jpeg'),
			qrShow: true
		});
	};

	closeQR = () => {
		this.setState({
			qrShow: false
		});
	};

	render() {
		const self = this;
		const {
			modalShow,

			qrShow,
			qrImg
		} = this.state;

		const {
			orders,
			path,
			user
		} = this.props;

		const whetherOK = orders && orders.get('list') && orders.get('loadingState') === 'success';

		return (

			<div className={styles.container}>
				<section className={styles.nav}>
					<Nav path={path}/>
				</section>
				<div className={styles.contentContainer + ' pull-right'}>
					<div className={styles.bar}>
						<div className={styles.detail}>订单</div>
						<div className={styles.orderType}>订单类型</div>
						<div className={styles.orderCost}>意向出价</div>
						<div className={styles.orderState}>当前状态</div>
					</div>

					{whetherOK ? (orders.get('list').count() > 0 ? orders.get('list').map(order => {

							const ip = order.get('ip');
							const seller = order.get('seller');
							const buyer = order.get('buyer');

							let isBuy = false;
							if (buyer instanceof Map) {
								isBuy = buyer.get('objectId') === user.get('objectId');
							}
							const duration = order.get('duration');
							const price = order.get('price');
							const priceRange = order.get('priceRange');
							const orderId = order.get('orderId');
							const copyright = order.get('copyright') || [];


							return <div className={styles.order} key={orderId}>
								<div className={styles.content}>
									<div className={styles.detail}>
										<div className={styles.header}>
											<div className={styles.title}>{ip.get('title')}</div>
											<div className={styles.person}>{isBuy ? '版权方' : '购买方'}：<img
												src={isBuy ? seller.get('smallAvatar') : buyer instanceof Map && buyer.get('smallAvatar')}/>{isBuy ? seller.get('username') : buyer instanceof Map && buyer.get('username')}
											</div>
											{copyright.count() > 0 && <div className={styles.copyrights}>
												购买版权：{copyright.map(c => c.get('chs')).join('、')}</div>}
											{!!duration && <div className={styles.time}>购买年限：{duration + '年'}</div>}
										</div>
									</div>
									<div className={styles.orderType}>
										<p>{isBuy ? '购买订单' : '出售订单'}</p>
									</div>
									<div className={styles.orderCost}>
										<p>{price ? price + '元' : (priceRange || '')}</p>
									</div>
									<div className={styles.orderState}>
										<p>{self.getState(order)}</p>
									</div>
								</div>
								<div className={styles.divider}/>
								<div className={styles.footer}>
									<p>作者：{ip.get('realAuthor')}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
										订单更新时间：{moment(order.get('updateAt')).format('YYYY.MM.DD HH:mm:ss')} </p>
									{!!orderId &&
									<div className={styles.scan} onClick={this.showQR.bind(this, orderId)}><img
										src={qrIcon}/>查看订单</div>}
								</div>
								{!!orderId &&
								<p className={styles.update}>订单编号：{orderId.substr(0, 8).toLowerCase()}</p>}
							</div>

						}) : <div className={styles.emptyHolder}>
							<img src={emptyHolder}/>
							<p style={{color: '#707070', textAlign: 'center'}}>暂无订单</p>
						</div> )
						:
						<div style={{marginTop: '200px'}}>
							<Loading/>
						</div>
					}
				</div>
				<Modal show={qrShow} className={styles.modal} onHide={this.closeQR}>
					<Modal.Header closeButton>
						<Modal.Title>查看订单</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<img src={qrImg}/>
						<p>请使用云莱坞App扫描此二维码处理订单，还能随时和对方沟通</p>
						<p>还没有云莱坞APP？手机扫一扫此二维码下载</p>
					</Modal.Body>
				</Modal>
			</div>
		);
	}
}
