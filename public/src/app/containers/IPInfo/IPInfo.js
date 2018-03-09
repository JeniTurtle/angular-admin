/**
 * @Author: chenming
 * @Date:   2017-01-17T20:59:16+08:00
 * @Last modified by:   chenming
 * @Last modified time: 2017-02-16T11:00:04+08:00
 */



'use strict';

import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	Link
} from 'react-router';
import {
	connect
} from 'react-redux';
import Helmet from 'react-helmet';
import ImmutablePropTypes from 'react-immutable-proptypes';
import {
	bindActionCreators
} from 'redux';
import * as IPInfoAtions from '../../actions/IPInfo';
import {
	push
} from 'react-router-redux';

import {
	Textfield,
	Selections,
	Tabs,
	Label,
	Tab,
	Author,
	Pagination,
	Loading,
	Progress
} from '../../components';

import styles from './IPInfo.scss';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import Checkbox from 'react-bootstrap/lib/Checkbox';
import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-bootstrap/lib/Modal';
import FormControl from 'react-bootstrap/lib/FormControl';

import Glyphicon from 'react-bootstrap/lib/Glyphicon';

import {
	showWarning,
	showToast
} from '../../actions/Popups';

import {
	// fetchCats,
	fetchAuthors,
	fetchIP,
	searchAuthor,

	updateIP,
	createIP
} from '../../actions/HTTP';

import trans, {
	COPYRIGHTMAP,
	RCOPYRIGHTMAP
} from '../../utils/copyrightMap';

import validation from '../../utils/validation';

import defaultProps from './defaultProps';
import infoStrategy from './strategy';

import {
	Map,
	List
} from 'immutable';

const pageCount = 20;

const textWorkType = ['电影剧本', '电视剧本', '网剧剧本', '网络大电影剧本', '长篇小说', '中篇小说', '短篇小说', '真实故事'];
const cartoonWorkType = ['长篇漫画', '中篇漫画', '短篇漫画'];

@connect(state => {
	return Object.assign(state.get('ipInfo').toObject(), {
		cats: state.get('cats'),
		authors: state.get('authors'),
		user: state.get('user')
	})
}, dispatch => bindActionCreators(Object.assign({}, IPInfoAtions, {
	// fetchCats: fetchCats.bind(this, dispatch),
	fetchAuthors: fetchAuthors.bind(this, dispatch),
	fetchIP: fetchIP.bind(this, dispatch),
	searchAuthor: searchAuthor.bind(this, dispatch),
	updateIP: updateIP.bind(this, dispatch),
	createIP: createIP.bind(this, dispatch),
	showWarning,
	showToast,
	push
}), dispatch))

export default class IPInfo extends Component {

	static get defaultProps() {
		return defaultProps;
	}

	static propTypes = {
		workType: PropTypes.string,
		workState: PropTypes.string,
		title: PropTypes.string,
		realAuthor: PropTypes.string,
		coreSellPoint: PropTypes.string,
		desc: PropTypes.string,
		cat: ImmutablePropTypes.listOf(PropTypes.number),
		tags: ImmutablePropTypes.listOf(PropTypes.string),
		selfPrice: PropTypes.string,
		hasPublished: PropTypes.string,
		copyright: ImmutablePropTypes.listOf(PropTypes.string),
		transTarget: PropTypes.string,
		anotherFilm: PropTypes.string,
		audience: PropTypes.string,
		workValue: PropTypes.string,
		workLength: PropTypes.string,
		workPV: PropTypes.string,
		moreInformation: PropTypes.string,
		relatedIndex: ImmutablePropTypes.mapOf(PropTypes.string),
	}

	constructor(props) {

		super(props);

		const {
			user
		} = props;

		this.state = {
			modalShow: false,
			modalAuthor: null,
			passProtocol: true,
			searchText: '',
			expand: false,
			pn: 0,
			tipTitle: false,
			tipCoreSellPoint: false,
			tipDesc: false,
			subCats: this.props.cats,
			repeatIp: false
		};
		//是否为个人用户
		this.isUser = user.get('type') == 1;
		// this.isUser = false;

	}

	componentWillMount() {

		const {
			// fetchCats,
			fetchAuthors,
			fetchIP,
			update,
			showWarning,
			showToast,
			user,
			push
		} = this.props;

		// fetchCats();
		fetchAuthors();

		if (this.getId()) {
			fetchIP(this.getId()).then(() => {
				if (+this.props.status == 1) {
					showToast('当前作品正在审核中', 'fail', 3000);
					setTimeout(() => {
						push('/iplist');
					}, 3000);
				}

				!!this.props.publishedIp && showWarning('温馨提示：作品已展示在云莱坞平台，修改信息后仅保存并不会更新展示，<b style="color: red">如需更新展示请再次提交审核！</b>', 'warning', -1);

				const {
					title
				} = this.props;

				document.title = '编辑-' + title;
			})
		} else {
			document.title = '新建作品';
		}

		if (this.isUser && user.get('authState') == 'authed') {
			update('realAuthor', user.get('username'));
		}
	}


	// shouldComponentUpdate(nextProps, nextState) {

	// 	const self = this;

	// 	const messageProps = {
	// 		loadingState: ['作品信息加载中', '作品信息加载成功', '作品信息加载失败']
	// 	};

	// 	const messageKeys = Object.keys(messageProps);

	// 	const {
	// 		showToast
	// 	} = this.props;

	// 	messageKeys.forEach(function(item) {

	// 		if (nextProps[item] != self.props[item]) {

	// 			switch (nextProps[item]) {

	// 				case 'start':
	// 					showToast(messageProps[item][0], 'loading', -1);
	// 					return;
	// 				case 'success':
	// 					showToast(messageProps[item][0], 'loading', 1);
	// 					// showToast(messageProps[item][1], 'success');
	// 					return;
	// 				case 'fail':
	// 					showToast(messageProps[item][2], 'fail');
	// 					return;

	// 			}

	// 		}

	// 	});

	// 	return true;

	// }

	getId = () => {

		const {
			params,
			objectId
		} = this.props;

		return params && params.id || objectId;

	}

	scrollTo = anchor => {
		if (anchor == 'hasPublished') {
			$(this.refs.publishTip).css('color', '#ff3b30');
		}

		anchor = this.refs[anchor];
		$('#container').animate({
			scrollTop: anchor.offsetTop - 100
		}, 'slow');
		$(anchor).css('color', '#ff3b30');
		$(anchor).find('input').focus();
		$(anchor).find('textarea').focus();
		setTimeout(() => {
			$(anchor).css('color', '');
			this.refs.publishTip && $(this.refs.publishTip).css('color', '');
		}, 3000);
	}

	validateInfo = () => {
		const {
			showWarning,
			hasPublished,
			relatedIndex
		} = this.props;

		const {
			passProtocol
		} = this.state;

		let validationResult = validation(infoStrategy, this.props);

		if (!passProtocol) {
			validationResult.push({
				content: '请确认上传作品协议！',
				anchor: 'protocol'
			});
		}

		if (hasPublished == '已发表') {

			if (!relatedIndex.get('siteLink') && !relatedIndex.get('publishingHouse')) {
				validationResult.unshift({
					content: '状态为已发表时，出版社或者发行网站至少选填一项目',
					anchor: 'hasPublished'
				});
			}

		}
		if (this.state.repeatIp) {
			validationResult.unshift({
				content: '已有同名作品',
				anchor: 'title'
			});
		}
		if (validationResult.length) {

			showWarning(validationResult[0].content, 'danger');
			const anchor = validationResult[0].anchor;

			if (!this.refs[anchor]) {
				this.setState({
					expand: true
				}, this.scrollTo.bind(this, anchor));
			} else {
				this.scrollTo(anchor);
			}


			return false;
		}

		return true;

	}

	handleSelectAuthor = () => {

		const {
			update
		} = this.props;

		const {
			modalAuthor
		} = this.state;

		update('realAuthor', modalAuthor.get('name'));
		update('realAuthorId', modalAuthor.get('authorId'));

		this.setState({
			modalShow: false
		});

	}

	closeSelectAuthor = () => {
		this.setState({
			modalShow: false
		});
	}

	handleAddAuthor = () => {
		const {
			fetchAuthors
		} = this.props;

		fetchAuthors().then(() => {
			this.setState({
				modalShow: true,
				modalAuthor: null
			});
		})
	}

	handleChangeAuthor = author => {
		this.setState({
			modalAuthor: author
		});

	}

	handleRefreshAuthor = () => {
		this.loadAuthor();
	}

	loadAuthor = p => {

		const {
			pn
		} = this.state;

		const {
			fetchAuthors
		} = this.props;

		fetchAuthors(p === undefined ? pn : p - 1, pageCount);
		this.setState({
			pn: p === undefined ? pn : p - 1
		});
	}

	handleCatChange = (val) => {
		const {
			cats,
			cat,
			update
		} = this.props;

		const indexTest = cat.indexOf(cats.filter(item => item.get('name') == val).get(0).get('id'));
		let newCat = cat;
		if (indexTest > 0) {
			newCat = cat.splice(indexTest, 1);
		}
		newCat = newCat.set(0, cats.filter(item => item.get('name') == val).get(0).get('id'));
		update('cat', newCat);
	}

	handleSubCatChange = (val) => {
		const {
			cats,
			cat,
			update
		} = this.props;
		const indexTest = cat.indexOf(cats.filter(item => item.get('name') == val).get(0).get('id'));
		if (indexTest > -1) {
			update('cat', cat.splice(indexTest, 1));
		} else {
			switch (cat.size) {
				case 1:
					let newCat1 = cat.set(1, cats.filter(item => item.get('name') == val).get(0).get('id'));
					update('cat', newCat1);
					break;
				case 2:
					let newCat2 = cat.set(2, cats.filter(item => item.get('name') == val).get(0).get('id'));
					update('cat', newCat2);
					break;
				case 3:
					let newCat3 = cat.set(1, cat.get(2));
					let newCat4 = newCat3.set(2, cats.filter(item => item.get('name') == val).get(0).get('id'));
					update('cat', newCat4);
					break;
			}
		}
	}

	handleCopyrightChange = (cr) => {

		const {
			copyright,
			update
		} = this.props;

		const indexTest = copyright.indexOf(RCOPYRIGHTMAP[cr]);

		if (copyright.indexOf('all') < 0 && indexTest > -1) {
			update('copyright', copyright.splice(indexTest, 1));
		} else {

			if (cr == COPYRIGHTMAP['all']) {
				update('copyright', List.of(...Object.keys(COPYRIGHTMAP)));
			} else {

				const allIndex = copyright.indexOf('all');

				if (allIndex > -1) {
					update('copyright', List.of(RCOPYRIGHTMAP[cr]));
				} else {
					update('copyright', copyright.push(RCOPYRIGHTMAP[cr]));
				}
			}
		}

	}

	handleNextClick = e => {

		const {
			updateIP,
			createIP,
			showToast,
			push
		} = this.props;

		try {
			if (this.validateInfo()) {

				let result = {};

				for (let i in defaultProps) {
					result[i] = this.props[i] !== undefined && this.props[i].toJS ? this.props[i].toJS() : this.props[i];
				}

				showToast('保存中', 'loading', -1);

				if (this.getId()) {
					updateIP(this.getId(), result).then(suc => {
						if (suc) {
							// showToast('保存成功', 'success');
							// setTimeout(() => {
							showToast('保存中', 'loading', 1);
							push('/ipdetail' + (this.getId() ? '/' + this.getId() : ''));
							// }, 1500);
						} else {
							showToast('保存失败', 'fail');
						}
					}, () => {
						showToast('保存失败', 'fail');
					});
				} else {
					createIP(result).then(suc => {
						if (suc) {
							// showToast('创建作品成功', 'success');
							// setTimeout(() => {
							showToast('保存中', 'loading', 1);
							push('/ipdetail' + (this.getId() ? '/' + this.getId() : ''));
							// }, 1500);
						} else {
							showToast('创建作品失败', 'fail');
						}
					}, () => {
						showToast('创建作品失败', 'fail');
					});
				}

			}

		} catch (err) {
			alert('出现错误');
			console.error(err);
		}


	}

	passProtocol = () => {

		const {
			passProtocol
		} = this.state;

		this.setState({
			passProtocol: !passProtocol
		});

	}

	handleSubmit = (e) => {
		e.preventDefault();

		const {
			searchAuthor
		} = this.props;

		const {
			searchText
		} = this.state;

		if (!searchText.trim()) return;

		searchAuthor(searchText.trim());
		return false;
	}

	removeSearch = () => {

		this.setState({
			searchText: ''
		});

		const {
			authors
		} = this.props;

		//为0说明处于搜索状态
		if (!authors.totalCount) {
			this.loadAuthor();
		}

	}

	expand = status => {

		this.setState({
			expand: status
		});

	}

	setTipState = obj => {

		this.setState(Object.assign({
			tipTitle: false,
			tipCoreSellPoint: false,
			tipDesc: false
		}, obj));

	};

	handleWorkTitle = title => {
		if (title && title !== '') {
			let self = this;
			this.setTipState({'tipTitle': false});
			let params = {};
			params.title = title;
			if (this.getId()) {
				params.ippreId = this.getId();
			}
			// console.log('重复作品 params', params);
			$.ajax({
				url: 'http://api.yunlaiwu.com/ip/ipprediff?callback=cb',
				data: params,
				dataType: 'jsonp',
				success: function (ret) {
					// console.log('重复作品 success ret', ret);
					if (ret.errno === 0 && ret.data === 1) {
						self.setState({
							repeatIp: true
						});
					} else {
						self.setState({
							repeatIp: false
						});
					}
				}
			});
		}
	};

	render() {

		const self = this;

		const {
			workType,
			workState,
			title,
			realAuthor,
			coreSellPoint,
			desc,
			cats,
			cat,
			tags,
			update,
			authors,
			user,
			copyright,
			selfPrice,
			hasPublished,
			transTarget,
			loadingState,
			anotherFilm,
			audience,
			workValue,
			workLength,
			workPV,
			moreInformation,
			relatedIndex
		} = this.props;

		const {
			modalShow,
			modalAuthor,
			passProtocol,
			searchText,
			expand,
			pn,
			tipTitle,
			tipCoreSellPoint,
			tipDesc
		} = this.state;

		const selectType = textWorkType.indexOf(workType) > -1 ? 0 : (cartoonWorkType.indexOf(workType) > -1 ? 1 : 0);

		const whetherRender = cats && (!this.getId() || (loadingState == 'success' && this.getId()));

		let selCat = '', selCatArr = [], selSubCat = [];

		if (whetherRender) {
			for (let c of cat) {
				const filterCat = cats.filter(item => item.get('id') == c);
				selCat = filterCat.count() ? filterCat.get(0).get('name') : '';
				selCatArr.push(selCat);
			}
			this.state.subCats = cats.filter(item => item.get('name') != selCatArr[0]);
			selSubCat = selCatArr.slice(1).join('、');
		}

		const isCartoon = cartoonWorkType.indexOf(workType) > -1;
		const showSearchRemoveBtn = searchText.trim().length > 0;

		const showTarget = ['网络大电影剧本', '网剧剧本', '电影剧本', '电视剧本'].indexOf(workType) < 0;

		if (workType == '网络大电影剧本' && transTarget != '网络大电影') {
			update('transTarget', '网络大电影');
		}
		if (workType == '网剧剧本' && transTarget != '网剧') {
			update('transTarget', '网剧');
		}
		if (workType == '电影剧本' && transTarget != '院线电影') {
			update('transTarget', '院线电影');
		}
		if (workType == '电视剧本' && transTarget != '电视剧') {
			update('transTarget', '电视剧');
		}

		return (
			<div className={ styles.container + ' clearfix' } ref="container">
				<Progress step={ 0 }/>
				{ whetherRender && <div className={ styles.form }>
					<div className={ styles.fieldSet + ' clearfix' } ref="workType">
						<Label className="col-sm-2" required={ true } style={ {fontSize: '16px'} }>作品形式</Label>
						<div className="col-sm-10">
							<Tabs tabs={ ['文学作品', '漫画作品'] } values={ [0, 1] } selected={ selectType } name="workType">
								<Tab>
									<Selections selections={ textWorkType } value={ workType }
												onChange={ value => update('workType', value) }/>
								</Tab>
								<Tab>
									<Selections selections={ cartoonWorkType } value={ workType }
												onChange={ value => update('workType', value) }/>
								</Tab>
							</Tabs>
						</div>
					</div>
					<div className={ styles.fieldSet + ' clearfix' } ref="cat">
						<Label className="col-sm-2" required={ true } style={ {fontSize: '16px'} }>作品类型</Label>
						<div className="col-sm-10">
							<div className={ styles.typeField + ' col-sm-3' }><Label className="col-sm-2"
																					 required={ true } style={ {
								fontWeight: 'normal',
								fontSize: '14px',
								width: 'auto',
								marginLeft: '10px',
								color: '#707070'
							} }>主类型：</Label><span className={ styles.selectedMain }>{ selCatArr[0] }</span></div>
							<div className={styles.clearfix}></div>
							<Selections value={ selCatArr.slice(0, 1) }
										selections={ cats.map(cat => cat.get('name')).toJS() }
										onChange={ this.handleCatChange }/>
						</div>
						<Label className="col-sm-2" required={ false } style={ {fontSize: '16px'} }></Label>
						{
							cat.size > 0 ?
								<div className="col-sm-10">
									<div className={ styles.typeField + ' col-sm-8' }><Label className="col-sm-2"
																							 required={ false }
																							 style={ {
																								 fontWeight: 'normal',
																								 fontSize: '14px',
																								 width: 'auto',
																								 color: '#707070'
																							 } }>副类型（选填，最多2个）：</Label><span
										className={ styles.selectedSub }>{ selSubCat }</span></div>
									<div className={styles.clearfix}></div>
									<Selections value={ selCatArr.slice(1) }
												selections={ this.state.subCats.map(cat => cat.get('name')).toJS() }
												onChange={ this.handleSubCatChange }/>
								</div>
								:
								null
						}
					</div>
					<div className={ styles.fieldSet + ' clearfix' } ref="workState">
						<Label className="col-sm-2" required={ true } style={ {fontSize: '16px'} }>作品当前状态</Label>
						<div className="col-sm-10">
							<Selections selections={ ['已完结', isCartoon ? '连载中' : '创作中'] } value={ workState }
										onChange={ value => update('workState', value) }/>
						</div>
					</div>
					<div className={ styles.fieldSet + ' clearfix' } ref="selfPrice">
						<Label className="col-sm-2" required={ true } style={ {fontSize: '16px'} }>定价范围</Label>
						<div className="col-sm-10">
							<Selections selections={ ['50万以内', '50万-100万', '100万-500万', '500万以上', '暂无估价'] }
										value={ selfPrice } onChange={ value => update('selfPrice', value) }/>
						</div>
					</div>
					{ !this.getId() && <div className={ styles.fieldSet + ' clearfix' } ref="copyright">
						<Label className="col-sm-2" required={ true } style={ {fontSize: '16px'} }>可售版权（多选）</Label>
						<div className="col-sm-10">
							<Selections selections={ Object.keys(RCOPYRIGHTMAP) }
										value={ copyright.indexOf('all') > -1 ? COPYRIGHTMAP['all'] : copyright.map(k => trans(k)).toJS() }
										onChange={ this.handleCopyrightChange }/>
						</div>
					</div> }
					<div className={ styles.fieldSet + ' clearfix' } ref="title">
						<Label className="col-sm-2" required={ true } style={ {fontSize: '16px'} }>作品标题</Label>
						<div className="col-sm-8">
							<Textfield maxLength={ 15 } value={ title } onChange={ value => update('title', value) }
									   onFocus={ () => this.setTipState({'tipTitle': true}) }
									   onBlur={ this.handleWorkTitle }/>
						</div>
						<div className="col-sm-2" style={{paddingTop: '10px'}}>
							<Label tipName="示例" tipRight={ 80 }
								   onTipToggle={ () => this.setTipState({'tipTitle': !tipTitle})}
								   onTipHide={() => this.setTipState({'tipTitle': false})} tipShow={ tipTitle }
								   tip="a.已出版、已签约连载或有一定知名度的作品，直接上传自己的作品名称即可；\nb.未曾给大家见面过的作品，可以写作品本身名称，也可以慎重考虑后，基于故事本身，另取更有卖相的名称。取名的标准可参照同类型豆瓣8分以上电影片名，总结后修改。"></Label>
						</div>
						{
							this.state.repeatIp &&
							<div className={ styles.repeatTip }>
								已有同名作品，
								<Link target="_blank" className={ styles.repeatLink } to="/iplist">去查看</Link>
							</div>
						}
					</div>
					{ user.get('authState') != 'authed' &&
					<div className={ styles.cpAuthor + ' clearfix' } ref="realAuthor">
						<Label className="col-sm-2" required={ true } style={ {fontSize: '16px'} }>作者</Label>
						<div className="col-sm-8">
							<Textfield value={ realAuthor } onChange={ value => update('realAuthor', value) }/>
						</div>
					</div> }
					{ user.get('authState') == 'authed' && !this.isUser &&
					<div className={ styles.cpAuthor + ' clearfix' } ref="realAuthor">
						<Label className="col-sm-2" required={ true } style={ {fontSize: '16px'} }>作者</Label>
						<div className="col-sm-8">
							<div onClick={ this.handleAddAuthor }
								 className={ styles.authorButton }>{ realAuthor ? '修改作者' : '添加作者' }</div>
							{ realAuthor && <span className={ styles.authorSpan }>{ realAuthor }</span> }
						</div>
					</div> }
					<div className={ styles.fieldSet + ' clearfix' } ref="coreSellPoint">
						<Label className="col-sm-2" required={ true } style={ {fontSize: '16px'} }>核心卖点</Label>
						<div className="col-sm-8">
							<Textfield maxLength={ 15 } value={ coreSellPoint }
									   onChange={ value => update('coreSellPoint', value) }
									   onFocus={ () => this.setTipState({'tipCoreSellPoint': true}) }
									   onBlur={ () => this.setTipState({'tipCoreSellPoint': false}) }/>
						</div>
						<div className="col-sm-2" style={{paddingTop: '10px'}}>
							<Label tipName="示例" tipRight={ 80 }
								   onTipToggle={ () => this.setTipState({'tipCoreSellPoint': !tipCoreSellPoint})}
								   onTipHide={() => this.setTipState({'tipCoreSellPoint': false})}
								   tipShow={ tipCoreSellPoint }
								   tip="基于故事本身，总结并输出您作品的核心价值观；\n例如《肖申克的救赎》，它的核心卖点是希望、永不放弃、绝地反击。"></Label>
						</div>
					</div>
					<div className={ styles.fieldSet + ' clearfix' } ref="desc">
						<Label className="col-sm-2" required={ true } style={ {fontSize: '16px'} }>一句话故事（15~50字）</Label>
						<div className="col-sm-8">
							<Textfield maxLength={ 50 } autoExpand={ true } height={ 100 } value={ desc }
									   isArea={ true } onChange={ value => update('desc', value) }
									   onFocus={ () => this.setTipState({'tipDesc': true}) }
									   onBlur={ () => this.setTipState({'tipDesc': false}) }/>
						</div>
						<div className="col-sm-2" style={{paddingTop: '10px'}}>
							<Label tipName="示例" tipRight={ 80 }
								   onTipToggle={ () => this.setTipState({'tipDesc': !tipDesc})}
								   onTipHide={() => this.setTipState({'tipDesc': false})} tipShow={ tipDesc }
								   tip="【非常重要】参考范例：\n（你的标题）是一部拥有某种（影片基调）的（影片类型），讲述了具有（某种缺点、动机）的（主人公）在遇到（激励事件的发生）的时候，必须克服（主要困难）才能达成其（终极目标），否则会发生（灾难性的后果）。\n注：不必被这个公式完全束缚住，最简单的方式先写一个繁复笨拙的长句，将所有元素囊括其中，然后再润色成精炼的样子。\n《肖申克的救赎》讲述小有成就的青年银行家安迪，因被诬陷杀害自己的妻子和妻子的情人被捕入狱，在暗无天日的监狱生活中利用自己的才能、智力以及人格魅力最终越狱重生……"></Label>
						</div>
					</div>
					<div className={ styles.fieldSet + ' clearfix' } ref="hasPublished">
						<Label className="col-sm-2" required={ true } style={ {fontSize: '16px'} }>是否已发表</Label>
						<div className="col-sm-10">
							<Selections selections={ ['未发表', '已发表'] } value={ hasPublished }
										onChange={ value => update('hasPublished', value) }/>
							{ hasPublished == '已发表' &&
							<p ref="publishTip" style={ {margin: '-52px 0 0 42px', color: '#9b9b9b'} }>
								出版社或发行网站至少选填一项</p> }
						</div>
					</div>
					{ hasPublished == '已发表' &&
					<div>
						<div className={ styles.fieldSet + ' clearfix' }>
							<Label className="col-sm-2">出版社</Label>
							<div className="col-sm-4" ref="relatedIndex.publishingHouse">
								<Textfield placeholder="出版社名称" value={ relatedIndex.get('publishingHouse') }
										   maxLength={ 20 }
										   onChange={ value => update('relatedIndex.publishingHouse', value) }/>
							</div>
							<div className="col-sm-4" ref="relatedIndex.ISBN">
								<Textfield placeholder="出版社国际标准书号ISBN" value={ relatedIndex.get('ISBN') }
										   maxLength={ 20 } onChange={ value => update('relatedIndex.ISBN', value) }/>
							</div>
						</div>
						<div className={ styles.fieldSet + ' clearfix' }>
							<Label className="col-sm-2">发行网站</Label>
							<div className="col-sm-4" ref="relatedIndex.siteLink">
								<Textfield placeholder="网站名称" value={ relatedIndex.get('siteLink') } maxLength={ 20 }
										   onChange={ value => update('relatedIndex.siteLink', value) }/>
							</div>
							<div className="col-sm-4" ref="relatedIndex.clickCount">
								<Textfield placeholder="网站点击量收藏量" value={ relatedIndex.get('clickCount') }
										   maxLength={ 20 }
										   onChange={ value => update('relatedIndex.clickCount', value) }/>
							</div>
						</div>
					</div>
					}
					{
						showTarget &&
						<div className={ styles.fieldSet + ' clearfix' } ref="transTarget">
							<Label className="col-sm-2" required={ true } style={ {fontSize: '16px'} }>期望改编方式</Label>
							<div className="col-sm-10">
								<Selections selections={ ['院线电影', '电视剧', '网剧', '网络大电影'] } value={ transTarget }
											onChange={ value => update('transTarget', value) }/>
							</div>
						</div>
					}
					<div className={ styles.expand }>
						{ !expand &&
						<p className={ styles.moreContent }><b onClick={ () => this.expand(true) }>更多选项&nbsp;<Glyphicon
							style={ {verticalAlign: '-2px', color: '#9B9B9B'} } glyph="chevron-down"/></b>&nbsp;&nbsp;
							（提升作品公信力和吸引力，有助于快速出售）</p>}
						{ expand &&
						<div>
							<p className={ styles.moreContent }><b onClick={ () => this.expand(false) }>收起选项&nbsp;
								<Glyphicon style={ {verticalAlign: '-2px', color: '#9B9B9B'} }
										   glyph="chevron-up"/></b>&nbsp;&nbsp;（提升作品公信力和吸引力，有助于快速出售）</p>
							<div className={ styles.fieldSet + ' clearfix' } ref="tags">
								<div className="clearfix">
									<Label className="col-sm-2" style={ {fontSize: '16px'} }>作品标签</Label>
									<div className="col-sm-4">
										<Textfield value={ tags.get(0) } maxLength={ 20 }
												   onChange={ value => update('tags', tags.splice(0, 1, value)) }/>
									</div>
									<div className="col-sm-4">
										<Textfield value={ tags.get(1) } maxLength={ 20 }
												   onChange={ value => update('tags', tags.splice(1, 1, value)) }/>
									</div>
								</div>
								<div className="col-sm-offset-2 col-sm-4">
									<Textfield value={ tags.get(2) } maxLength={ 20 }
											   onChange={ value => update('tags', tags.splice(2, 1, value)) }/>
								</div>
							</div>
							<div className={ styles.fieldSet + ' clearfix' } ref="workValue">
								<Label className="col-sm-2" style={ {fontSize: '16px'} }>作品亮点</Label>
								<div className="col-sm-8">
									<Textfield maxLength={ 100 } autoExpand={ true } height={ 100 } isArea={ true }
											   value={ workValue } onChange={ value => update('workValue', value) }/>
								</div>
							</div>
							<div className={ styles.fieldSet + ' clearfix' } ref="relatedIndex.achievement">
								<Label className="col-sm-2" style={ {fontSize: '16px'} }>曾获得成就</Label>
								<div className="col-sm-8">
									<Textfield maxLength={ 20 } value={ relatedIndex.get('achievement') }
											   onChange={ value => update('relatedIndex.achievement', value) }/>
								</div>
							</div>
							<div className={ styles.fieldSet + ' clearfix' } ref="workLength">
								<Label className="col-sm-2" style={ {fontSize: '16px'} }>作品长度</Label>
								<div className="col-sm-8">
									<Textfield maxLength={ 20 } placeholder="作品字数、页数或者剧本预估时长" value={ workLength }
											   onChange={ value => update('workLength', value) }/>
								</div>
							</div>
							<div className={ styles.fieldSet + ' clearfix' } ref="audience">
								<Label className="col-sm-2" style={ {fontSize: '16px'} }>目标受众</Label>
								<div className="col-sm-8">
									<Textfield maxLength={ 20 } value={ audience }
											   onChange={ value => update('audience', value) }/>
								</div>
							</div>
							<div className={ styles.fieldSet + ' clearfix' } ref="anotherFilm">
								<Label className="col-sm-2" style={ {fontSize: '16px'} }>对标作品</Label>
								<div className="col-sm-8">
									<Textfield maxLength={ 20 } value={ anotherFilm }
											   onChange={ value => update('anotherFilm', value) }/>
								</div>
							</div>
							<div className={ styles.fieldSet + ' clearfix' } ref="moreInformation">
								<Label className="col-sm-2" style={ {fontSize: '16px'} }>交易条件</Label>
								<div className="col-sm-8">
									<Textfield maxLength={ 20 } placeholder="可填写您对交易的更多备注信息" value={ moreInformation }
											   onChange={ value => update('moreInformation', value) }/>
								</div>
							</div>
							<Label style={ {fontSize: '16px', margin: '20px 0'} }>作品相关指数</Label>
							<div className={ styles.fieldSet + ' clearfix' } ref="baiduIndexCount">
								<Label className="col-sm-2">百度指数：</Label>
								<div className="col-sm-8">
									<Textfield maxLength={ 20 } value={ relatedIndex.get('baiduIndexCount') }
											   onChange={ value => update('relatedIndex.baiduIndexCount', value) }/>
								</div>
							</div>
							<div className={ styles.fieldSet + ' clearfix' } ref="baiduSearchPages">
								<Label className="col-sm-2">百度相关页数：</Label>
								<div className="col-sm-8">
									<Textfield maxLength={ 20 } value={ relatedIndex.get('baiduSearchPages') }
											   onChange={ value => update('relatedIndex.baiduSearchPages', value) }/>
								</div>
							</div>
							<div className={ styles.fieldSet + ' clearfix' } ref="doubanScore">
								<Label className="col-sm-2">豆瓣评分：</Label>
								<div className="col-sm-8">
									<Textfield maxLength={ 20 } value={ relatedIndex.get('doubanScore') }
											   onChange={ value => update('relatedIndex.doubanScore', value) }/>
								</div>
							</div>
							<div className={ styles.fieldSet + ' clearfix' } ref="fansCount">
								<Label className="col-sm-2">微博粉丝数量：</Label>
								<div className="col-sm-8">
									<Textfield maxLength={ 20 } value={ relatedIndex.get('fansCount') }
											   onChange={ value => update('relatedIndex.fansCount', value) }/>
								</div>
							</div>
						</div>
						}
					</div>
					<div className={ styles.next } onClick={ this.handleNextClick }>保存，进入下一步</div>
					<Checkbox ref="protocol" checked={ passProtocol ? 1 : 0 } onChange={ this.passProtocol }
							  className={ styles.protocol }>我同意<a target="_blank"
																  href="http://www.yunlaiwu.com/protocol#protocol">上传作品协议</a></Checkbox>
				</div> }
				{ !whetherRender && <div style={ {marginTop: '200px'} }><Loading /></div> }
				{ !this.isUser &&
				<Modal show={ modalShow } className={ styles.modal } onHide={ this.closeSelectAuthor }>
					<Modal.Header closeButton>
						<Modal.Title>选择作者</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<form className={ styles.search + ' row'} onSubmit={ this.handleSubmit }>
							<div className="col-sm-9">
								<FormControl type="text" placeholder="搜索作者" className={ styles.input }
											 value={ searchText }
											 onChange={ e => this.setState({searchText: e.target.value}) }/>
								<div className={ styles.searchicon } onClick={ this.handleSubmit }></div>
								{ showSearchRemoveBtn && <Glyphicon glyph="remove" className={ styles.removeicon }
																	onClick={ this.removeSearch }/> }
							</div>
						</form>
						<Link to='/authorlist/autoshow' target="_blank" className={ styles.authorAddBtn }
							  onClick={ () => this.setState({modalShow: false}) }>新增作者</Link>
						{ authors.get('list').map((author, index) =>
							<div key={ author.get('authorId') } className={ styles.author + ' col-sm-4' }>
								<input type="radio" checked={ author == modalAuthor ? 1 : 0 }
									   onChange={ self.handleChangeAuthor.bind(self, author) }/>
								<img onClick={ self.handleChangeAuthor.bind(self, author) }
									 style={ {cursor: 'pointer'} } src={ author.get('avatar') }/>
								<span onClick={ self.handleChangeAuthor.bind(self, author) }
									  style={ {cursor: 'pointer'} }>{ author.get('name') }</span>
							</div>
						) }
						{ authors.get('totalCount') > pageCount &&
						<Pagination pageCount={ pageCount } handleTurn={ this.loadAuthor }
									total={ authors.get('totalCount') } curPage={ pn + 1 }/> }
					</Modal.Body>
					<Modal.Footer>
						<Button className="cancel" onClick={ this.closeSelectAuthor }>取消</Button>
						{
							modalAuthor && modalAuthor.get && modalAuthor.get('name') ?
								<Button className="ok" onClick={ this.handleSelectAuthor }>确定</Button>
								:
								<Button className="cancel">确定</Button>
						}
					</Modal.Footer>
				</Modal> }
			</div>
		);
	}
}
