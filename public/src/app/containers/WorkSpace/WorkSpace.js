import React, {
	Component
} from 'react';

import PropTypes from 'prop-types';

// 引入 bindActionCreators 引入它是因为普通的action生成器生成action后，还需要手动去dispatch它；
// 使用 bindActionCreators 方法处理后的加强版生成器直接调用相关方法即可
import {
	bindActionCreators
} from 'redux';

import {
	connect
} from 'react-redux';

// Components
import {
	Nav,
	Icon,
	Avatar
} from '../../components';

// HTTP actions
import {
	fetchOrders,
	fetchAuthState,
	fetchWorkSpace,
	fetchWSBanner,
	getFirstInvalidIP,
	fetchCollectRecommend
} from '../../actions/HTTP';

// Popup actions
import {
	showToast
} from '../../actions/Popups';

// icons
import Glyphicon from 'react-bootstrap/lib/Glyphicon';

import purerender from '../../decorators/purerender';

// React carousel component
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.less';
import 'slick-carousel/slick/slick-theme.less';

// Style
import styles from './WorkSpace.scss';

// 工作卡片
class WorkCard extends Component {

	constructor(props) {
		super(props);
	}

	static propTypes = {
		/*
		 * type enum:
		 * 1 :待身份认证 2 :待重新进行身份认证 3 :待新建作品 4 :待重新提交作品
		 * 5 :待完善故事卡 6 :待申请版权保护 7 :待重新申请版权保护
		 */
		type: PropTypes.string.isRequired,
		object: PropTypes.string,
		title: PropTypes.string
	};

	render() {
		const {
			children
		} = this.props;
		const enmuCard = {
			'1': {
				cat: 1,
				header: '待身份认证',
				hoverTitle: '免费认证',
				linkUrl: 'http://www.yunlaiwu.com/auth/index',
				emptyContent: '您当前还没有进行身份认证，认证通过后即可创建作品出售版权啦',
				icon1: 'icon-1',
				icon2: 'icon-2',
				text1: '免费出售版权',
				text2: '直接向制片人投稿'
			},
			'2': {
				cat: 2,
				header: '待重新进行身份认证',
				hoverTitle: '重新认证',
				linkUrl: 'http://www.yunlaiwu.com/auth/index',
				modifyContent: '很抱歉，您的身份认证未通过，请修改后重新认证'
			},
			'3': {
				cat: 1,
				header: '待新建作品',
				hoverTitle: '新建作品',
				// linkUrl: 'https://user.yunlaiwu.com/#/ipinfo',
				linkUrl: 'http://user.yunlaiwu.com/#/ipinfo',
				emptyContent: '您当前没有可出售的作品，赶快去增加作品吧！',
				icon1: 'icon-3',
				icon2: 'icon-4',
				text1: '秒推全行业影视人',
				text2: '双方即时沟通'
			},
			'4': {
				cat: 2,
				header: '待重新提交作品',
				hoverTitle: '编辑作品',
				// linkUrl: `https://user.yunlaiwu.com/#/ipinfo/${this.props.objectId}`,
				linkUrl: `http://user.yunlaiwu.com/#/ipinfo/${this.props.objectId}`,
				modifyContent: `很抱歉，作品《${this.props.title}》审核未通过，请修改后重新提交审核`
			},
			'5': {
				cat: 3,
				header: '待完善故事卡',
				hoverTitle: '去完善',
				// linkUrl: `https://user.yunlaiwu.com/#/ipinfo/${this.props.objectId}`,
				linkUrl: `http://user.yunlaiwu.com/#/ipinfo/${this.props.objectId}`,
				emptyContent: `作品《${this.props.title}》暂未填写故事梗概，赶快去完善吧！`,
				icon1: 'icon-5',
				icon2: 'icon-6',
				text1: '完善才会被推荐',
				text2: '完善更容易成交'
			},
			'6': {
				cat: 1,
				header: '待申请版权保护',
				hoverTitle: '去申请',
				linkUrl: 'http://banquanbaohu.yunlaiwu.com/copy/workregister',
				emptyContent: `作品《${this.props.title}》暂未申请版权保护，有被盗用的风险，赶快免费申请吧！`,
				icon1: 'icon-7',
				icon2: 'icon-8',
				text1: '免费DCI证书',
				text2: '免费法务咨询'
			},
			'7': {
				cat: 2,
				header: '待重新申请版权保护',
				hoverTitle: '重新申请',
				linkUrl: 'http://banquanbaohu.yunlaiwu.com/copy/myworklist',
				modifyContent: `很抱歉，作品《${this.props.title}》版权保护未通过，请修改后重新申请`
			}
		};
		return (
			<div className={styles.workCard}>
				<div className={styles.layer}>
					<div className={styles.layerFooter}>
						<a target="_blank" href={enmuCard[this.props.type]['linkUrl']}
						   className={styles.actionBtn}>{enmuCard[this.props.type]['hoverTitle']}</a>
					</div>
				</div>
				<div className={styles.header}>
					{enmuCard[this.props.type]['header']}
				</div>
				{
					enmuCard[this.props.type]['cat'] == 3 ?
						<div className={styles.inputStatus}>
							<span className={styles.lightText}>填写情况</span>
							<span className={styles.solidCircle}></span>
							<span>基本信息</span>
							<span className={styles.hollowCircle}></span>
							<span>故事梗概</span>
						</div>
						:
						null
				}
				{
					enmuCard[this.props.type]['cat'] == 1 || enmuCard[this.props.type]['cat'] == 3 ?
						<div className={styles.emptyContent}>
							{enmuCard[this.props.type]['emptyContent']}
						</div>
						:
						null
				}
				{
					enmuCard[this.props.type]['cat'] == 2 ?
						<div className={styles.modifyContent}>
							{enmuCard[this.props.type]['modifyContent']}
						</div>
						:
						null
				}
				{
					enmuCard[this.props.type]['cat'] == 1 || enmuCard[this.props.type]['cat'] == 3 ?
						<div className={styles.showArea}>
							<div className={styles.area}>
								<Icon icon={enmuCard[this.props.type]['icon1']}/><br/>
								<span>{enmuCard[this.props.type]['text1']}</span>
							</div>
							<div className={styles.area}>
								<Icon icon={enmuCard[this.props.type]['icon2']}/><br/>
								<span>{enmuCard[this.props.type]['text2']}</span>
							</div>
						</div>
						:
						null
				}
			</div>
		);
	}
}

@purerender
@connect(state => ({
	orders: state.get('orders'),
	user: state.get('user'),
	authstate: state.get('authstate'),
	workspace: state.get('workspace'),
	banner: state.get('banner'),
	firstInvalid: state.get('firstInvalid'),
	collectrecommend: state.get('collectrecommend'),
	callState: state.get('callstate')
}), dispatch => bindActionCreators({
	fetchOrders: fetchOrders.bind(this, dispatch),
	fetchAuthState: fetchAuthState.bind(this, dispatch),
	fetchWorkSpace: fetchWorkSpace.bind(this, dispatch),
	fetchWSBanner: fetchWSBanner.bind(this, dispatch),
	getFirstInvalidIP: getFirstInvalidIP.bind(this, dispatch),
	fetchCollectRecommend: fetchCollectRecommend.bind(this, dispatch)
}, dispatch))

export default class WorkSpace extends Component {

	constructor(props) {
		super(props);
		const {
			user,
			orders
		} = props;
		this.user = user;
		this.orders = orders;
		this.state = {
			step: -1,
			showUploader: false,
			fileList: []
		};
	}

	componentWillMount() {
		const {
			fetchOrders,
			fetchAuthState,
			fetchWorkSpace,
			fetchWSBanner,
			getFirstInvalidIP,
			fetchCollectRecommend
		} = this.props;

		fetchOrders();
		fetchAuthState();
		fetchWorkSpace();
		fetchWSBanner();

		//todo

		getFirstInvalidIP();
		fetchCollectRecommend();
	}

	componentDidMount() {
		const first = !localStorage.getItem('USER_VISITED');
		// if (first) {
		// 	this.setState({
		// 		step: 1
		// 	});
		// }
		localStorage.setItem('USER_VISITED', '1');
	}

	handleGuide = () => {
		const flag = this.user.get('type') != 1 ? 6 : 5
		this.setState({
			step: this.state.step + 1 <= flag ? this.state.step + 1 : -1
		});
	};

	hanldeCloseGuide = () => {
		this.setState({
			step: -1
		});
	};

	showUploader = () => {
		this.setState({
			showUploader: true
		});
	};

	closed = () => {
		this.setState({
			showUploader: false
		});
	};

	handleUploadAvatar = e => {
		this.setState({
			showUploader: true
		});
	};

	removeCollect = (callId, e) => {
		e.target.parentNode.remove();
		const {removeRecommendCollect} = this.props;
		//从“推荐列表”中删除用户x掉的征稿
		$.ajax({
			url: 'http://api.yunlaiwu.com/ip/ipcall/ignorecall?callback=cb&callId=' + callId,
			type: 'GET',
			dataType: 'jsonp',
			success: function (ret) {
				//todo:
			}
		});
	};

	render() {
		const {
			path,
			orders,
			authstate,
			workspace,
			banner,
			user,
			firstInvalid,
			collectrecommend
		} = this.props;
		// console.log(firstInvalid);
		const ordersReady = orders && orders.get('list') && orders.get('loadingState') == 'success';
		const bannerReady = banner && banner.get('banner') && banner.get('loadingState') == 'success';
		const collectReady = collectrecommend && collectrecommend.get(0) && collectrecommend.get(0).get('title');

		const prevTime = localStorage.getItem('USER_EXIT_TIME') || 0;

		let showRedDot = false;
		if (ordersReady && orders.get('list') && orders.get('list')[0] && orders.get('list')[0].get('updateAt') && orders.get('list')[0].get('updateAt') > Number(prevTime)) {
			showRedDot = true;
		}
		var settings = {
			dots: true,
			infinite: true,
			autoplay: true,
			speed: 800,
			// slidesToShow: 1,
			// slidesToScroll: 1,
			autoplaySpeed: 6000
		};

		// console.log($('#create_work').offset().left);
		function getScrollbarWidth() {
			var oP = document.createElement('p'),
				styles = {
					width: '1px',
					height: '1px',
					overflowY: 'scroll'
				},
				i, scrollbarWidth;
			for (i in styles) oP.style[i] = styles[i];
			document.body.appendChild(oP);
			scrollbarWidth = oP.offsetWidth - oP.clientWidth;
			oP.remove();
			return scrollbarWidth;
		}

		const barWidth = getScrollbarWidth();

		const steps = [{}, {
			id: 1,
			width: 520,
			height: 286,
			left: '50%',
			marginLeft: (-470 - barWidth) + 'px',
			top: '70px'
		}, {
			id: 2,
			width: 380,
			height: 314,
			left: '50%',
			top: '287px',
			marginLeft: (110 - barWidth) + 'px'
		}, {
			id: 3,
			width: 820,
			height: 860,
			left: '50%',
			marginLeft: (-330 - barWidth) + 'px',
			top: '184px'
		}, {
			id: 4,
			width: 520,
			height: 246,
			marginLeft: (-470 - barWidth) + 'px',
			left: '50%',
			top: '129px'
		}, {
			id: 5,
			width: 520,
			height: 246,
			left: '50%',
			marginLeft: (-470 - barWidth) + 'px',
			top: '179px'
		}, {
			id: 6,
			width: 520,
			height: 266,
			left: '50%',
			marginLeft: (-470 - barWidth) + 'px',
			top: '229px'
		}];
		return (
			<div className={styles.container}>
				{this.state.showUploader ? <Avatar closed={this.closed}/> : null}
				<section className={styles.nav}>
					<Nav path={path}/>
				</section>
				<div className={styles.contentContainer + ' pull-right'}>
					<div className={styles.bannerCont}>
						{
							bannerReady
								? (banner.get('banner').size > 1
									? <Slider {...settings}>
										{
											banner.get('banner').toArray().map((ret, index) => {
												return (
													<div key={index} className={styles.slideCont}><a
														style={{display: 'block'}} target="_blank"
														href={ret.get('url')}><img width="100%" height="100%"
																				   src={ret.get('image')}/></a>
													</div>
												);
											})
										}
									</Slider>
									: banner.get('banner').toArray().map((ret, index) => {
										return (
											<div key={index} className={styles.slideCont}><a
												style={{display: 'block'}} target="_blank"
												href={ret.get('url')}><img width="100%" height="100%"
																		   src={ret.get('image')}/></a></div>
										);
									})
								)
								: null
						}
					</div>
					<div className={styles.infoCont}>
						<div className={styles.avatar}>
							<div onClick={this.handleUploadAvatar} className={styles.avatarLayer}>重新上传</div>
							<img width="100%" height="100%" alt="用户头像" src={user.get('avatar')}/>
						</div>
						<div className={styles.baseCont}>
							<div className={styles.titles}>
								<span className={styles.username}>{user.get('username')}</span>
								<span className={styles.subTitle}>
									{user.get('ability') == 0 ? <span
											className={styles.authTips}> {authstate.get('authState') == 'unauth' ? '未认证，认证后即可上传作品交易版权！' : ''}<a
											target="_blank" href="http://www.yunlaiwu.com/auth/index"
											className={styles.authBtn}>{authstate.get('authState') == 'failauth' ? '认证未通过' : (authstate.get('authState') == 'waitauth' ? '认证审核中' : '去认证')}</a></span> :
										<span
											className={'authedIcon ' + (user.get('type') == 1 ? 'peer' : 'org')}>v</span>}
								</span>
							</div>
							<div className={styles.listCont}>
								<a href="/#/iplist" className={styles.item}>
									<span>{workspace.get('count')}</span>
									<br/>
									<span>作品</span>
								</a>
								<a href="/#/orders" className={styles.item}>
									<span>{ordersReady && orders.get('count')}</span>
									{showRedDot && <em className={styles.redDot}></em>}
									<br/>
									<span>订单</span>
								</a>
							</div>
						</div>
						<a id="create_work" target="_blank" className={styles.newBtn} href="/#/ipinfo">新建作品</a>
					</div>
					<div className={styles.cardCont}>
						{
							authstate.get('authState') == 'unauth' ?
								<WorkCard type={'1'}/>
								:
								null
						}
						{
							authstate.get('authState') == 'failauth' ?
								<WorkCard type={'2'}/>
								:
								null
						}
						{
							workspace.get('fail') && workspace.get('fail').toArray().length > 0 ?
								<WorkCard type={'4'} objectId={workspace.get('fail').toArray()[0].get('objectId')}
										  title={workspace.get('fail').toArray()[0].get('title')}/>
								:
								null
						}
						{
							workspace.get('count') === 0 ?
								<WorkCard type={'3'}/>
								:
								null
						}
						{
							firstInvalid && firstInvalid.get('objectId') ?
								<WorkCard type={'5'} objectId={firstInvalid.get('objectId')}
										  title={firstInvalid.get('title')}/>
								:
								null
						}
						{
							workspace.get('dciWait') && workspace.get('dciWait').toArray().length > 0 ?
								<WorkCard type={'6'} title={workspace.get('dciWait').toArray()[0].get('title')}/>
								:
								null
						}
						{
							workspace.get('dciFail') && workspace.get('dciFail').toArray().length > 0 ?
								<WorkCard type={'7'} title={workspace.get('dciFail').toArray()[0].get('title')}/>
								:
								null
						}

						{

							collectReady ?

								collectrecommend.map((cc, index) => {
									if (index > 2) return;
									return (

										<div key={index} className={styles.workCard + ' ' + styles.big}>
											<span onClick={this.removeCollect.bind(this, cc.get('callId'))}
												  className={styles.closeCard}>×</span>
											<div className={styles.layer}>
												<div className={styles.layerFooter}>
													<a target="_blank"
													   href={"http://www.yunlaiwu.com/collect/detail/" + cc.get('callId')}
													   className={styles.actionBtn}>去投稿</a>
												</div>
											</div>
											<div className={styles.header}>
												征稿推荐
											</div>
											<div className={styles.collectCont}>
												<div className={styles.title}>
													<span>{cc.get('title')}</span>
												</div>
												<div className={styles.img}>
													<img width="100%" height="100%" src={cc.get('img')}/>
												</div>
												<div className={styles.projectDesc}>
													{cc.get('projectDesc')}
												</div>
											</div>
										</div>
									);
								})

								:
								null
						}
					</div>
				</div>
				{
					this.state.step > 0 ?
						<div className={styles.guideLayer}>
							<span onClick={this.hanldeCloseGuide} className={styles.close}>×</span>
							{this.state.step == 1 &&
							<img width={steps[this.state.step].width} height={steps[this.state.step].height}
								 style={{
									 position: 'absolute',
									 top: steps[this.state.step].top,
									 left: steps[this.state.step].left,
									 marginLeft: steps[this.state.step].marginLeft
								 }} onClick={this.handleGuide}
								 src={`https://yunlaiwu0.cn-bj.ufileos.com/step${this.state.step}.png`}/>}
							{this.state.step == 2 &&
							<img width={steps[this.state.step].width} height={steps[this.state.step].height}
								 style={{
									 position: 'absolute',
									 top: steps[this.state.step].top,
									 left: steps[this.state.step].left,
									 marginLeft: steps[this.state.step].marginLeft
								 }} onClick={this.handleGuide}
								 src={`https://yunlaiwu0.cn-bj.ufileos.com/step${this.state.step}.png`}/>}
							{this.state.step == 3 &&
							<img width={steps[this.state.step].width} height={steps[this.state.step].height}
								 style={{
									 position: 'absolute',
									 top: steps[this.state.step].top,
									 left: steps[this.state.step].left,
									 marginLeft: steps[this.state.step].marginLeft
								 }} onClick={this.handleGuide}
								 src={`https://yunlaiwu0.cn-bj.ufileos.com/step${this.state.step}.png`}/>}
							{this.state.step == 4 &&
							<img width={steps[this.state.step].width} height={steps[this.state.step].height}
								 style={{
									 position: 'absolute',
									 top: steps[this.state.step].top,
									 left: steps[this.state.step].left,
									 marginLeft: steps[this.state.step].marginLeft
								 }} onClick={this.handleGuide}
								 src={`https://yunlaiwu0.cn-bj.ufileos.com/step${this.state.step}.png`}/>}
							{this.state.step == 5 &&
							<img width={steps[this.state.step].width} height={steps[this.state.step].height}
								 style={{
									 position: 'absolute',
									 top: steps[this.state.step].top,
									 left: steps[this.state.step].left,
									 marginLeft: steps[this.state.step].marginLeft
								 }} onClick={this.handleGuide}
								 src={`https://yunlaiwu0.cn-bj.ufileos.com/step${this.state.step}.png`}/>}
							{this.state.step == 6 &&
							<img width={steps[this.state.step].width} height={steps[this.state.step].height}
								 style={{
									 position: 'absolute',
									 top: steps[this.state.step].top,
									 left: steps[this.state.step].left,
									 marginLeft: steps[this.state.step].marginLeft
								 }} onClick={this.handleGuide}
								 src={`https://yunlaiwu0.cn-bj.ufileos.com/step${this.state.step}.png`}/>}
						</div>
						:
						null
				}
			</div>
		);
	}
}
