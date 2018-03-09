//谁tmd能看懂这一堆就牛逼了
import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	fetchIP,
	addCopyright,
	downCopyright,
	downWork,
	orderZone,
	hidden
} from '../../actions/HTTP';
import trans, {
	COPYRIGHTMAP,
	RCOPYRIGHTMAP
} from '../../utils/copyrightMap';

import ImmutablePropTypes from 'react-immutable-proptypes';
import {
	connect
} from 'react-redux';

import {
	bindActionCreators
} from 'redux';
import {
	List,
	Map
} from 'immutable';
import Modal from 'react-bootstrap/lib/Modal';
import Button from 'react-bootstrap/lib/Button';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import {
	update
} from '../../actions/IPInfo';
import {
	Label,
	Toggle,
	Selections,
	Loading
} from '../../components';
import {
	showToast,
	showPopup
} from '../../actions/Popups';
import styles from './IPConfig.scss';


@connect(state => state.get('ipInfo').toObject(), dispatch => bindActionCreators({
	fetchIP: fetchIP.bind(this, dispatch),
	addCopyright: addCopyright.bind(this, dispatch),
	downCopyright: downCopyright.bind(this, dispatch),
	downWork: downWork.bind(this, dispatch),
	orderZone: orderZone.bind(this, dispatch),
	hidden: hidden.bind(this, dispatch),
	update,
	showPopup,
	showToast
}, dispatch))

export default class WorkSpace extends Component {

	static get defaultProps() {
		return {
			sellCopyrights: List(),
			soldCopyrights: List(),
			otherCopyrights: List()
		};
	}

	static propTypes = {
		sellCopyrights: ImmutablePropTypes.listOf(PropTypes.string),
		soldCopyrights: ImmutablePropTypes.listOf(PropTypes.string),
		otherCopyrights: ImmutablePropTypes.listOf(PropTypes.string)
	};

	constructor(props) {

		super();

		this.state = {
			sellModalShow: false,
			soldModalShow: false,

			selectSold: [],
			selectSell: [],

			isHidden: false,
			isShow: true,
			originalLock: null
		};

	}

	componentWillMount() {

		this.load();
	}

	load = () => {
		const {
			fetchIP
		} = this.props;

		if (this.getId()) {
			fetchIP(this.getId()).then(d => {

				const {
					title
				} = this.props;

				this.setState({
					isHidden: !!this.props.publishedIp && this.props.publishedIp.get('statusInfo') === 'selfdown',
					isShow: !!this.props.publishedIp && this.props.publishedIp.get('orderZone') === 1,
					originalLock: this.props.lockCopyright
				})

				document.title = title + ' 作品设置';

			}, () => {
				//todo
			});
		}
	}

	addCopyright = copyrights => {

		const {
			modalSelOtherCopyright,
			modalInfo,

			pn
		} = this.state;

		if (!modalSelOtherCopyright) return;

		const {
			dispatch
		} = this.props;

	}

	closeSold = () => {

		this.setState({
			soldModalShow: false,
			selectSold: []
		});

	}

	addSold = () => {

		const {
			selectSold
		} = this.state;

		if (selectSold.length) {
			let {
				sellCopyrights,
				lockCopyright,
				otherCopyrights,
				update
			} = this.props;

			//如果选择全版权下架
			if (selectSold.indexOf(COPYRIGHTMAP['all']) > -1) {
				update(Map({
					sellCopyrights: List(),
					lockCopyright: Object.keys(COPYRIGHTMAP)
				}));
			} else {

				selectSold.forEach(item => {
					sellCopyrights = sellCopyrights.splice(sellCopyrights.indexOf(item), 1);
					lockCopyright = lockCopyright.push(RCOPYRIGHTMAP[item]);
				});

				if (sellCopyrights.indexOf(COPYRIGHTMAP['all']) > -1) {
					sellCopyrights = sellCopyrights.splice(sellCopyrights.indexOf(COPYRIGHTMAP['all']), 1);
				}

				if (lockCopyright.indexOf('all') < 0) {
					lockCopyright.unshift('all');
				}

				if (otherCopyrights.indexOf(COPYRIGHTMAP['all']) > -1) {
					otherCopyrights = otherCopyrights.splice(otherCopyrights.indexOf(COPYRIGHTMAP['all']), 1);
				}

				update(Map({
					sellCopyrights,
					lockCopyright,
					otherCopyrights
				}));
			}
		}

		this.setState({
			soldModalShow: false,
			selectSold: []
		});

	};

	closeSell = () => {

		this.setState({
			sellModalShow: false,
			selectSell: []
		});
	};

	//不可能出现往在售版权里添加全版权的事情
	addSell = () => {

		const {
			selectSell
		} = this.state;

		if (selectSell) {
			let {
				update,
				otherCopyrights,
				sellCopyrights,
				copyright
			} = this.props;

			selectSell.forEach(item => {
				otherCopyrights = otherCopyrights.splice(otherCopyrights.indexOf(item), 1);
				sellCopyrights = sellCopyrights.push(item);
			});


			selectSell.length && update(Map({
				otherCopyrights,
				sellCopyrights
			}));
		}

		this.setState({
			sellModalShow: false,
			selectSell: []
		});
	};

	getId = () => {

		const {
			params,
			objectId
		} = this.props;

		return params && params.id || objectId;

	};

	manageSell = () => {

		this.setState({
			sellModalShow: true,
			soldModalShow: false
		});

	};

	manageSold = () => {

		this.setState({
			soldModalShow: true,
			sellModalShow: false
		});

	};

	//不可能出现往在售版权里添加全版权的事情
	addTmpSell = cp => {

		let {
			selectSell
		} = this.state;

		if (selectSell.indexOf(cp) < 0) selectSell.push(cp);
		else selectSell.splice(selectSell.indexOf(cp), 1);

		this.setState({
			selectSell
		});

	};

	addTmpSold = cp => {

		let {
			selectSold
		} = this.state;

		const indexTest = selectSold.indexOf(cp);
		if (selectSold.indexOf(COPYRIGHTMAP['all']) < 0 && indexTest > -1) {
			selectSold.splice(indexTest, 1);
		} else {

			if (cp === COPYRIGHTMAP['all']) {
				selectSold = [COPYRIGHTMAP['all']];
			} else {

				const allIndex = selectSold.indexOf(COPYRIGHTMAP['all']);

				if (allIndex > -1) {
					selectSold = [cp];
				} else {
					selectSold.push(cp);
				}
			}
		}

		this.setState({
			selectSold
		});

	}

	save = () => {

		const {
			addCopyright,
			downCopyright,
			orderZone,
			hidden,
			sellCopyrights,	// 可售版权数组，汉字
			lockCopyright,	// 已售版权数组，字母
			objectId,	// 作品id
			publishedIp,	// ip详情
			showToast
		} = this.props;
		// console.log('sellCopyrights', sellCopyrights.toJS());
		// console.log('lockCopyright', lockCopyright.toJS());
		// console.log('objectId', objectId);
		// console.log('publishedIp', publishedIp.toJS());

		const {
			originalLock,	// 界面上显示的已售版权数组，字母
			isShow,	// 是否显示成交版权
			isHidden,	// 是否显示作品上架
		} = this.state;
		// console.log('originalLock', originalLock.toJS());

		let promiseQueue = [];

		let cps = [];	// 要添加的可售版权数组，字母
		let addlockcps = [];	// 要添加的已售版权数组（就是要删除的可售版权数组），汉字

		// 把可售版权数组汉字转换成字母扔到cps数组里
		sellCopyrights.forEach(item => cps.push(RCOPYRIGHTMAP[item]));
		// console.log('cps', cps);

		lockCopyright.forEach(cp => {
			// 如果界面上显示的已售版权数组不包含已售版权数组中的值，就是新增了已售版权的话
			if (originalLock.indexOf(cp) < 0) {
				// 把这个值转换成汉字，扔到addlockcps数组里
				addlockcps.push(COPYRIGHTMAP[cp]);
			}
		});
		// console.log('addlockcps', addlockcps);

		// 进行添加版权操作，并把它扔到Promise队列里去
		promiseQueue.push(addCopyright(cps, objectId));
		// 如果新的已售版权数组（即要改动的）有值的话，进行删除可售版权操作，并把它扔到Promise队列里去
		addlockcps.length && promiseQueue.push(downCopyright(cps, lockCopyright, addlockcps.join(','), objectId));

		// 调用接口控制已售版权是否展示
		publishedIp && publishedIp.get('ipId') && promiseQueue.push(orderZone(isShow, publishedIp.get('ipId')));
		// 调用接口控制作品上架还是下架
		publishedIp && publishedIp.get('ipId') && promiseQueue.push(hidden(isHidden, publishedIp.get('ipId')));

		showToast('提交中', 'loading', -1);

		// 所有 Promise 跑完以后显示提示语
		Promise.all(promiseQueue).then(() => {
			showToast('提交成功', 'success');
			this.load();
		}, () => {
			showToast('提交失败', 'success');
			this.load();
		});

	};

	hideWork = () => {
		const {
			isHidden
		} = this.state;

		this.setState({
			isHidden: !isHidden
		});
	}

	showCopyright = () => {

		const {
			isShow
		} = this.state;

		this.setState({
			isShow: !isShow
		});

	}

	showIntro = () => {
		const {
			showPopup
		} = this.props;
		showPopup({
			content: '<p>版权设置是用来管理您作品可用于交易的版权，比如电影、电视剧等。<p><br /><p><b>1.增加可售版权</b></p><p>使用它你可以为您的作品增加或减少可用于交易的版权。</p><br /><p><b>2.设置已售版权</b></p><p>使用它你可以将已成交的版权置为售出，避免二次交易。</p><p>已售出的版权不能再次出售，请谨慎操作。</p>',
			title: '作品版权设置说明',
			height: 260
		});
	}

	render() {

		const {
			sellCopyrights,
			soldCopyrights,
			otherCopyrights,
			lockCopyright,
			loadingState
		} = this.props;

		const {
			sellModalShow,
			soldModalShow,

			selectSold,
			selectSell,

			isHidden,
			isShow
		} = this.state;

		const whetherRender = loadingState == 'success' && this.getId();

		return (
			whetherRender ?
				<div className={ styles.container + ' clearfix' }>
					<div style={ {
						width: '940px',
						margin: '0 auto',
						border: '1px solid #dbdbdb',
						background: '#fff',
						padding: '40px'
					} }>
						<h1>作品版权设置<Glyphicon glyph="question-sign" className={ styles.tip } onClick={ this.showIntro }/>
						</h1>
						<div className={ styles.copyDiv + ' clearfix'}>
							<Label className="col-sm-2" style={ {fontSize: '16px', width: '100px'} }>可售版权</Label>
							<div className="col-sm-10">
								<p style={ {marginBottom: '15px', fontSize: '14px'} }>已成交版权请置为售出，避免二次出售</p>
								{ sellCopyrights.count() ?
									<Selections selections={ sellCopyrights.toJS() } onChange={ () => {
									} } disabled={ true }/>
									:
									<p style={ {margin: '30px 0', color: '#4a4a4a', fontSize: '14px'} }>所有版权均已售出</p>
								}
							</div>
						</div>
						<div className={ styles.copyDiv + ' clearfix'}>
							<Label className="col-sm-2" style={ {fontSize: '16px', width: '100px'} }>已售版权</Label>
							<div className="col-sm-10">
								<p style={ {marginBottom: '15px', fontSize: '14px'} }>已售出的版权不能再次出售</p>
								{ soldCopyrights.concat(lockCopyright.map(cp => COPYRIGHTMAP[cp])).count() ?
									<Selections
										selections={ soldCopyrights.concat(lockCopyright.map(cp => COPYRIGHTMAP[cp])).toJS() }
										onChange={ () => {
										} } disabled={ true }/>
									:
									<p style={ {margin: '30px 0', color: '#4a4a4a', fontSize: '14px'} }>暂无已出售版权</p>
								}
							</div>
						</div>
						<div className={ styles.manageCopy }>
							{ otherCopyrights.count() > 0 && <div onClick={ this.manageSell }
																  className={ sellCopyrights.count() <= 0 ? styles.single : ''}>
								增加可售版权</div> }
							{ sellCopyrights.count() > 0 && <div onClick={ this.manageSold }
																 className={ otherCopyrights.count() <= 0 ? styles.single : ''}>
								设置已售版权</div> }
						</div>
						<div className="clearfix">
							<Label className="col-sm-2" style={ {fontSize: '16px', width: '100px'} }>作品出售设置</Label>
							<div className="col-sm-10">
								{ !isHidden &&
								<p style={ {marginBottom: '15px', fontSize: '14px'} }><b style={ {color: '#5f82ff'} }>作品已上架</b>，制片人可以在云莱坞看到您的作品
								</p> }
								{ isHidden &&
								<p style={ {marginBottom: '15px', fontSize: '14px'} }><b style={ {color: '#5f82ff'} }>作品已下架</b>，制片人在云莱坞无法看到您的作品
								</p> }
								<Toggle onClick={ this.hideWork } enable={ !isHidden }/>
							</div>
						</div>
						<div className="clearfix" style={ {marginTop: '15px'} }>
							<Label className="col-sm-2" style={ {fontSize: '16px', width: '100px'} }>已成交版权展示设置</Label>
							<div className="col-sm-10">
								{ isShow &&
								<p style={ {marginBottom: '15px', fontSize: '14px'} }>成交版权展示中，其他人可在云莱坞成交专区中查看</p> }
								{ !isShow &&
								<p style={ {marginBottom: '15px', fontSize: '14px'} }>成交版权隐藏中，其他人无法在云莱坞成交专区查看</p> }
								<Toggle onClick={ this.showCopyright } enable={ isShow }/>
								{ !isShow &&
								<p style={ {margin: '-26px 0 0 60px', fontSize: '14px'} }>建议展示已成交的版权，宣传您的知名度</p> }
							</div>
						</div>
						<div className={ styles.saveBtn } onClick={ this.save }>保存</div>
					</div>
					<Modal show={ sellModalShow } className={ styles.modal }
						   onHide={ () => this.setState({sellModalShow: false}) }>
						<Modal.Header closeButton>
							<Modal.Title>增加可售版权</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<Selections selections={ otherCopyrights.toJS() } onChange={ this.addTmpSell }
										value={ selectSell }/>
						</Modal.Body>
						<Modal.Footer>
							<Button className="cancel" onClick={ this.closeSell }>取消</Button>
							<Button className="ok" onClick={ this.addSell }>确定</Button>
						</Modal.Footer>
					</Modal>
					<Modal show={ soldModalShow } className={ styles.modal }
						   onHide={ () => this.setState({soldModalShow: false}) }>
						<Modal.Header closeButton>
							<Modal.Title>设置已售版权</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<Selections selections={ sellCopyrights.toJS() } onChange={ this.addTmpSold }
										value={ selectSold }/>
						</Modal.Body>
						<Modal.Footer>
							{ selectSold.length > 0 &&
							<p style={ {position: 'absolute', left: '20px', bottom: '14px', color: '#ff3b30'} }>
								设置为已售出的版权不能再次出售</p> }
							<Button className="cancel" onClick={ this.closeSold }>取消</Button>
							<Button className="ok" onClick={ this.addSold }>确定</Button>
						</Modal.Footer>
					</Modal>
				</div> :
				<Loading />
		);
	}
}
