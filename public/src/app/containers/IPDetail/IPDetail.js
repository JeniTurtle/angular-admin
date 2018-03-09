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
	showWarning,
	showPopup,
	showToast
} from '../../actions/Popups';
import {
	lengthRegex
}
	from '../../utils/validation';
import {
	Textfield,
	Selections,
	Tabs,
	Label,
	Uploader,
	ImageUploader,
	Tab,
	Phone,
	Alert,
	Progress,
	Confirm,
	Loading
} from '../../components';
import {
	fetchIP,
	createIP,
	updateIP
} from '../../actions/HTTP';
import validation from '../../utils/validation';
import styles from './IPDetail.scss';
import Checkbox from 'react-bootstrap/lib/Checkbox';
import Modal from 'react-bootstrap/lib/Modal';
import Button from 'react-bootstrap/lib/Button';
import defaultProps from './defaultProps';
import detailStrategy from './strategy';
import infoStrategy from '../IPInfo/strategy';
import {
	getPathFromLocation
} from '../../utils/funcs';

import {
	checkVerified
} from '../../utils/auth';

import {
	push
} from 'react-router-redux';

import {
	Map,
	List
} from 'immutable';

@connect(state => state.get('ipInfo').set('user', state.get('user')).toObject(), dispatch => bindActionCreators(Object.assign({}, IPInfoAtions, {
	createIP: createIP.bind(this, dispatch),
	updateIP: updateIP.bind(this, dispatch),
	fetchIP: fetchIP.bind(this, dispatch),
	push,
	showWarning,
	showPopup,
	showToast
}), dispatch))

export default class IPDetail extends Component {

	static get defaultProps() {
		return defaultProps;
	}

	static propTypes = {
		biographies: ImmutablePropTypes.listOf(PropTypes.string).isRequired,
		cartoonBiography: ImmutablePropTypes.listOf(ImmutablePropTypes.mapOf(PropTypes.string).isRequired).isRequired,
		outline: ImmutablePropTypes.listOf(PropTypes.string),
		cartoonProbation: ImmutablePropTypes.listOf(PropTypes.string),
		probation: PropTypes.string,
		rawFile: PropTypes.string
	}

	static isCartoon = workType => {

		const cartoonWorkType = ['长篇漫画', '中篇漫画', '短篇漫画'];

		return cartoonWorkType.indexOf(workType) > -1;
	}


	static validateDetail = data => {

		let validationResult = [];

		detailStrategy.biographies = IPDetail.isCartoon(data.workType) ? false : {
			isArray: true,
			required: true,
			allRequired: true,
			singleMaxLength: 100,
			name: '人物小传'
		};

		if (data && data.biographies && data.biographies.toJS()) {
			data.biographies.toJS().forEach((item, index) => {
				if (item.replace(lengthRegex, '').length > 100) {
					validationResult.push({
						content: '人物小传的描述内容不能超过100字',
						anchor: 'biography'
					});
					return;
				}
			});
		}

		//对漫画的小传做单独处理。。。。没必要写得那么通用
		if (IPDetail.isCartoon(data.workType)) {
			const {
				cartoonBiography
			} = data;

			if (!cartoonBiography || !cartoonBiography.count() || cartoonBiography.filter(c => c.get('lengendName').replace(lengthRegex, '').length <= 0).count() > 0) {
				validationResult.push({
					content: '卡通人物小传人物不能为空',
					anchor: 'cartoonBiography'
				});
			}
			if (cartoonBiography && cartoonBiography.filter(c => c.get('lengendDesc').replace(lengthRegex, '').length > 100).count() > 0) {
				validationResult.push({
					content: '卡通人物小传的描述内容不能超过100字',
					anchor: 'cartoonBiography'
				});
			}
		}

		return validationResult.concat(validation(detailStrategy, data));
	}

	constructor(props) {
		super(props);
		this.state = {
			alertShow: false,
			confirmShow: false,
			backShow: false,

			tipBio: false,
			tipo1: false,
			tipo2: false,
			tipo3: false,
			tipo4: false,

			render: false,
			hideJump: false
		};

		const {
			user,
			location
		} = props;

	}

	componentWillMount() {

		const {
			update,
			fetchIP
		} = this.props;

		// console.log('update', update);

		//因为上一步已经将cartoonBiography存成了空数组，这里需要还原
		fetchIP(this.getId()).then(() => {

			const {
				cartoonBiography,
				publishedIp,
				showWarning,
				title
			} = this.props;

			cartoonBiography.count() <= 0 && update('cartoonBiography', defaultProps.cartoonBiography);

			window.scrollTo(0, 0);

			this.setState({
				render: true
			});

			//完整的ip，不显示跳过
			if (IPDetail.validateDetail(this.props).length <= 0) {
				this.setState({
					hideJump: true
				});
			}

			!!this.props.publishedIp && showWarning('温馨提示：作品已展示在云莱坞平台，修改信息后仅保存并不会更新展示，<b style="color: red">如需更新展示请再次提交审核！</b>', 'warning', -1);

			document.title = '编辑-' + title;

		});

	}

	// shouldComponentUpdate(nextProps, nextState) {

	// 	const self = this;

	// 	const messageProps = {
	// 		loadingState: ['作品信息加载中', '作品信息加载成功', '作品信息加载失败']
	// 	};

	// 	const messageKeys = Object.keys(messageProps);

	// 	const {
	// 		push,
	// 		showToast
	// 	} = this.props;

	// 	messageKeys.forEach(function(item) {
	// 		if (nextProps[item] != self.props[item]) {
	// 			switch (nextProps[item]) {
	// 				case 'start':
	// 					showToast(messageProps[item][0], 'loading', -1);
	// 					return;
	// 				case 'success':
	// 					showToast(messageProps[item][1], 'success');
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


	expand = status => {

		this.setState({
			expand: status
		});

	}

	addBiography = () => {

		const {
			update,
			biographies,
			cartoonBiography,
			workType
		} = this.props;

		IPDetail.isCartoon(workType) ?
			update('cartoonBiography', cartoonBiography.push(defaultProps.cartoonBiography.get(0))) :
			update('biographies', biographies.push(''));

	}

	removeBiography = (index) => {

		const {
			update,
			biographies,
			workType,
			cartoonBiography
		} = this.props;

		IPDetail.isCartoon(workType) ?
			update('cartoonBiography', cartoonBiography.splice(index, 1)) :
			update('biographies', biographies.splice(index, 1));

	}

	okConfirm = () => {
		this.setState({
			confirmShow: false
		});
		$(this.refs.reason).find('input').focus();
	}

	closeConfirm = () => {
		this.setState({
			confirmShow: false
		});
		this.handleSave(true, true);
	}

	validate = () => {

		const {
			showWarning,
			workType
		} = this.props;


		const validationResult = IPDetail.validateDetail(this.props);


		if (validationResult.length) {

			showWarning(validationResult[0].content, 'danger');

			let anchor = validationResult[0].anchor;

			//fuck
			if (IPDetail.isCartoon(workType) && validationResult[0].anchor == 'cartoonBiography') {

				if (validationResult[0].content == '卡通人物小传人物不能为空') {

					[0, 1, 2, 3, 4].forEach(item => {
						const ref = this.refs["cartoonBiography" + (item || '')];
						if (ref && $(ref).find('input').val().replace(lengthRegex, '').length <= 0) {
							anchor = $(ref).find('input').closest('.fieldset')[0];
						}
					});

				} else {

					[0, 1, 2, 3, 4].forEach(item => {
						const ref = this.refs["cartoonBiography" + (item || '')];
						if (ref && $(ref).find('textarea').val().replace(lengthRegex, '').length > 100) {
							anchor = $(ref).find('textarea').closest('.fieldset')[0];
						}
					});
				}

			}

			this.scrollTo(anchor);

			return false;
		}

		return true;

	}

	scrollTo = anchor => {

		if (typeof(anchor) == 'string')
			anchor = this.refs[anchor];

		$('#container').animate({
			scrollTop: $(anchor).closest('.' + styles.fieldSet)[0].offsetTop - 100
		}, 'slow');
		$(anchor).css('color', '#ff3b30');
		$(anchor).find('input').focus();
		$(anchor).find('textarea').focus();
		setTimeout(() => {
			$(anchor).css('color', '');
		}, 3000);
	}

	handleSave = (forward, force = false) => {

		const {
			updateIP,
			showToast,
			push
		} = this.props;

		if (force || this.validate()) {

			let result = {};

			for (let i in defaultProps) {
				result[i] = this.props[i] !== undefined && this.props[i].toJS ? this.props[i].toJS() : this.props[i];
			}

			result.biography = result.biographies.join('\n');
			result.weight = 0.00001;

			showToast('保存中', 'loading', -1);

			updateIP(this.getId(), result).then(suc => {
				if (suc) {
					// showToast('保存成功', 'success');

					// setTimeout(() => {
					showToast('保存中', 'loading', 1);
					forward ? push((force ? '/praw/' : '/raw/') + this.getId()) : push('/ipinfo/' + this.getId());
					// }, 1500);

					this.setState({
						backShow: false
					});
				} else {
					showToast('保存失败', 'fail');
				}
			}, () => {
				showToast('保存失败', 'fail');
			});
		}
	}

	jump = () => {
		this.setState({
			confirmShow: true
		});
	}

	backward = () => {
		// this.setState({
		// 	backShow: true
		// });
		this.handleSave(false, true);
	}

	// okBack = () => {
	// 	this.handleSave(false);
	// 	this.setState({
	// 		backShow: false
	// 	});
	// }

	// closeBack = () => {
	// 	const {
	// 		push
	// 	} = this.props;
	// 	push("/ipinfo/" + this.getId());
	// 	this.setState({
	// 		backShow: false
	// 	});
	// }

	setTipState = obj => {

		this.setState(Object.assign({
			tipBio: false,
			tipo1: false,
			tipo2: false,
			tipo3: false,
			tipo4: false,
		}, obj));

	}

	render() {

		const self = this;

		const {
			cartoonBiography,
			cartoonProbation,
			biographies,
			outline,
			probation,
			update,
			previews,
			user,
			workType,

			proccessingCreateIP,
			proccessingUpdateIP,
			proccessingPublishIP

		} = this.props;

		// console.log('outline', outline.toJS());

		const biographiesThreshold = 5;

		const {
			expand,
			alertShow,
			confirmShow,
			backShow,

			tipBio,
			tipo1,
			tipo2,
			tipo3,
			tipo4,

			render,
			hideJump
		} = this.state;

		function arrayChange(name, raw, index) {
			return value => {
				update(name, raw.set(index, value));
			}
		}

		function previewsChange(links, override) {
			update('previews', override ? links : previews.concat(links));
		}

		const isCartoon = IPDetail.isCartoon(workType);

		const allowTypes = isCartoon ? ['pdf', 'zip'] : ['doc', 'docx', 'pdf', 'txt'];

		const isVerified = checkVerified(user);

		const outlineCount = outline.reduce((pre, item) => pre + item.replace(lengthRegex, '').length, 0);

		const showJump = window.channel !== 'newwriter' && !hideJump;

		return (
			<div className={ styles.container + ' clearfix' }>
				<Progress step={ 1 }/>
				{
					render ?
						<div className={ styles.form + ' clearfix'}>
							<div className={ styles.fieldSet + ' clearfix' }>
								<Label className="col-sm-2" required={ true } style={ {fontSize: '16px'} }>人物小传</Label>
								<p className="col-sm-10" style={ {color: '#9b9b9b', fontSize: '14px'} }>
									请勿将多个人物填写到一个输入框里面</p>
							</div>
							{ isCartoon && cartoonBiography.map((biography, index) =>
								<div className={ styles.fieldSet + ' clearfix' } style={{position: 'relative'}}
									 key={ index } ref={ "cartoonBiography" + (index || '') }>
									<div className="clearfix fieldset">
										<Label className="col-sm-2">人物{ ('一二三四五六七八九十').substr(index, 1) }</Label>
										<div className="col-sm-8">
											<Textfield value={ biography.get('lengendName') }
													   onChange={ value => arrayChange('cartoonBiography', cartoonBiography, index)(biography.set('lengendName', value)) }
													   onFocus={ index == 0 ? () => this.setTipState({'tipBio': true}) : () => {
													   } }
													   onBlur={ index == 0 ? () => this.setTipState({'tipBio': false}) : () => {
													   } }/>
										</div>
										{ index == 0 && <div className="col-sm-2" style={{paddingTop: '10px'}}>
											<Label tipName="示例" tipShow={ tipBio }
												   onTipToggle={ () => this.setTipState({'tipBio': !tipBio})}
												   onTipHide={() => this.setTipState({'tipBio': false})} tipRight={ 80 }
												   tip="例：《肖申克的救赎》\n安迪·杜佛兰：年轻银行家，被诬陷杀害自己的妻子及妻子情人，进入肖申克监狱。期间利用自己的智慧和对自由的坚持，最终重获新生。\n艾利斯·波德·瑞德：肖申克监狱囚犯之一，狱中交易商，与安迪结为好友在狱中数次为安迪提供凿子之类的小工具。\n山姆·诺顿：肖申克监狱典狱长，当得知安迪的理财能力之后，典狱长开始利用安迪替其作黑帐，渐渐露出魔鬼狰狞的面容，最后安迪于狱外举发他的罪行，丑闻败露只得饮弹自尽。"></Label>
										</div> }
										{ index > 0 && <div onClick={ self.removeBiography.bind(self, index) }
															className={ styles.removebtn }>删除</div> }
									</div>
									<div className="clearfix fieldset">
										<Label className="col-sm-2">人物{ ('一二三四五六七八九十').substr(index, 1) + '描述' }</Label>
										<div className="col-sm-8">
											<Textfield height={ 150 } autoExpand={ true } maxLength={ 100 }
													   value={ biography.get('lengendDesc') } isArea={ true }
													   onChange={ value => arrayChange('cartoonBiography', cartoonBiography, index)(biography.set('lengendDesc', value)) }/>
										</div>
									</div>
									<div className="clearfix">
										<Label className="col-sm-2">人物{ ('一二三四五六七八九十').substr(index, 1) + '图片' }</Label>
										<div className="col-sm-8">
											<ImageUploader isMultiple={ false } required={ true }
														   previews={ [biography.get('lengendPic')] } buttonName="上传图片"
														   types={ ['jpg', 'png', 'gif', 'jpeg'] }
														   tips="建议尺寸750*305，1M以内；仅支持jpg、jpeg、gif、png"
														   onChange={ value => arrayChange('cartoonBiography', cartoonBiography, index)(biography.set('lengendPic', value[0])) }/>
										</div>
									</div>
								</div>
							) }
							{ !isCartoon && (biographies.count() ? biographies : List.of('')).map((biography, index) =>
								<div className={ styles.fieldSet + ' clearfix' } key={ index }
									 ref={ "biography" + (index || '') }>
									<Label className="col-sm-2">人物{ ('一二三四五六七八九十').substr(index, 1) }</Label>
									<div className="col-sm-8">
										<Textfield height={ 150 } autoExpand={ true } maxLength={ 100 }
												   value={ biography } isArea={ true }
												   onChange={ arrayChange('biographies', biographies, index) }
												   onFocus={ index == 0 ? () => this.setTipState({'tipBio': true}) : () => {
												   } }
												   onBlur={ index == 0 ? () => this.setTipState({'tipBio': false}) : () => {
												   } }/>
									</div>
									{ index == 0 && <div className="col-sm-2" style={{paddingTop: '10px'}}>
										<Label tipName="示例" tipShow={ tipBio }
											   onTipToggle={ () => this.setTipState({'tipBio': !tipBio})}
											   onTipHide={() => this.setTipState({'tipBio': false})} tipRight={ 80 }
											   tip="例：《肖申克的救赎》\n安迪·杜佛兰：年轻银行家，被诬陷杀害自己的妻子及妻子情人，进入肖申克监狱。期间利用自己的智慧和对自由的坚持，最终重获新生。\n艾利斯·波德·瑞德：肖申克监狱囚犯之一，狱中交易商，与安迪结为好友在狱中数次为安迪提供凿子之类的小工具。\n山姆·诺顿：肖申克监狱典狱长，当得知安迪的理财能力之后，典狱长开始利用安迪替其作黑帐，渐渐露出魔鬼狰狞的面容，最后安迪于狱外举发他的罪行，丑闻败露只得饮弹自尽。"></Label>
									</div> }
									{ index > 0 && <div onClick={ self.removeBiography.bind(self, index) }
														className={ styles.removebtn + " col-sm-2" }>删除</div>}
								</div>
							) }
							{ !isCartoon && biographies.count() < biographiesThreshold &&
							<div className={ styles.addbtn + ' col-sm-10 col-sm-offset-2' }>
								<div onClick={ this.addBiography }>添加人物</div>
								<div>最多为{ biographiesThreshold }个，已添加{ biographies.count() }个</div>
							</div> }

							{ isCartoon && cartoonBiography.count() < biographiesThreshold &&
							<div className={ styles.addbtn + ' col-sm-10 col-sm-offset-2' }>
								<div onClick={ this.addBiography }>添加人物</div>
								<div>最多为{ biographiesThreshold }个，已添加{ cartoonBiography.count() }个</div>
							</div> }

							<div className={ styles.fieldSet + ' clearfix' } style={ {marginTop: '80px'} }>
								<Label className="col-sm-2" required={ true } style={ {fontSize: '16px'} }>故事梗概</Label>
								<div className={ styles.demos + ' col-sm-10' }><Link target="_blank"
																					 to="/preview/0">示例一</Link><Link
									target="_blank" to="/preview/1">示例二</Link><Link target="_blank"
																					to="/preview/2">示例三</Link>
									<p style={{display: 'inline', color: '#707070'}}>总字数须大于600且小于1600字，现<span
										style={{color: outlineCount >= 600 && outlineCount <= 1600 ? '#0037ff' : '#970a0a'}}>{ outlineCount }</span>字
									</p>
								</div>
							</div>
							<div className={ styles.fieldSet + ' clearfix' } ref="reason">
								<Label className="col-sm-2">起因：</Label>
								<div className="col-sm-8" ref="outline">
									<Textfield isArea={ true } height={ 300 } autoExpand={ true }
											   value={ outline.get(0) } onChange={ arrayChange('outline', outline, 0) }
											   onFocus={ () => this.setTipState({'tipo1': true}) }
											   onBlur={ () => this.setTipState({'tipo1': false}) }/>
								</div>
								<div className="col-sm-2" style={{paddingTop: '10px'}}>
									<Label tipName="示例" tipShow={ tipo1 }
										   onTipToggle={ () => this.setTipState({'tipo1': !tipo1})}
										   onTipHide={() => this.setTipState({'tipo1': false})} tipRight={ 80 }
										   tip="写清楚故事的起承转合。\n例：《肖申克的救赎》\n【起因】：故事发生在1947年，银行家安迪，在一个失意的深夜之后，被当作杀害妻子与情夫的凶手送上法庭。妻子的不忠、律师的奸诈、法官的误判、狱警的凶暴、典狱长的贪心与卑鄙，将正处而立之年的安迪一下子从人生的巅峰推向了世间地狱。他被判无期徒刑，送进了固若金汤的鲨堡监狱。"></Label>
								</div>
							</div>
							<div className={ styles.fieldSet + ' clearfix' }>
								<Label className="col-sm-2">经过：</Label>
								<div className="col-sm-8">
									<Textfield isArea={ true } height={ 300 } autoExpand={ true }
											   value={ outline.get(1) } onChange={ arrayChange('outline', outline, 1) }
											   onFocus={ () => this.setTipState({'tipo2': true}) }
											   onBlur={ () => this.setTipState({'tipo2': false}) }/>
								</div>
								<div className="col-sm-2" style={{paddingTop: '10px'}}>
									<Label tipName="示例" tipShow={ tipo2 }
										   onTipToggle={ () => this.setTipState({'tipo2': !tipo2})}
										   onTipHide={() => this.setTipState({'tipo2': false})} tipRight={ 80 }
										   tip="写清楚故事的起承转合。\n例：《肖申克的救赎》\n【过程】在目睹了狱中腐败之后，他自知难以讨回清白，只有越狱才是生路。于是他开始暗中实施自己的计划，他结识了专在狱中从事黑市交易的罪犯雷，并从雷那里弄来《圣经》和一些最不起眼的小东西。同时，他坚持近十年接连不断的书信上访，为鲨堡监狱建立了全美最好的监狱图书馆。他还无私地辅导帮助众多犯人获得了同等学历，使得他们可以在狱中继续学习，为日后重获自由，踏上社会打下基础。\n安迪在众狱友的心中是一种尊严的象征，他的才能、智力和人格魅力使他赢得了雷真诚的友情。而他在金融方面的专业知识又使他成为众狱警的得力帮手，甚至成为了典狱长的私人财务助理，如此的待遇让安迪的越狱计划有了实现的可能。"></Label>
								</div>
							</div>
							<div className={ styles.fieldSet + ' clearfix' }>
								<Label className="col-sm-2">高潮：</Label>
								<div className="col-sm-8">
									<Textfield isArea={ true } height={ 300 } autoExpand={ true }
											   value={ outline.get(2) } onChange={ arrayChange('outline', outline, 2) }
											   onFocus={ () => this.setTipState({'tipo3': true}) }
											   onBlur={ () => this.setTipState({'tipo3': false}) }/>
								</div>
								<div className="col-sm-2" style={{paddingTop: '10px'}}>
									<Label tipName="示例" tipShow={ tipo3 }
										   onTipToggle={ () => this.setTipState({'tipo3': !tipo3})}
										   onTipHide={() => this.setTipState({'tipo3': false})} tipRight={ 80 }
										   tip="写清楚故事的起承转合。\n例：《肖申克的救赎》\n【高潮】当一个年轻的窃贼告诉安迪他曾在另一所监狱中遇到过杀害安迪妻子和情夫的真正凶手时，安迪再也克制不住自己感情，他希望典狱长能够帮他沉冤昭雪，讨回公道。谁知，典狱长因为安迪知悉他贪污、受贿的内幕而决意不让安迪重返人间，竟残酷杀害了那个年轻窃贼，并再次将安迪关入黑牢。"></Label>
								</div>
							</div>
							<div className={ styles.fieldSet + ' clearfix' }>
								<Label className="col-sm-2">结果：</Label>
								<div className="col-sm-8">
									<Textfield isArea={ true } height={ 300 } autoExpand={ true }
											   value={ outline.get(3) } onChange={ arrayChange('outline', outline, 3) }
											   onFocus={ () => this.setTipState({'tipo4': true}) }
											   onBlur={ () => this.setTipState({'tipo4': false}) }/>
								</div>
								<div className="col-sm-2" style={{paddingTop: '10px'}}>
									<Label tipName="示例" tipShow={ tipo4 }
										   onTipToggle={ () => this.setTipState({'tipo4': !tipo4})}
										   onTipHide={() => this.setTipState({'tipo4': false})} tipRight={ 80 }
										   tip="写清楚故事的起承转合。\n例：《肖申克的救赎》\n【结局】忍无可忍的安迪终于在一个雷电交加的夜晚，越狱而出，重获自由。当翌日典狱长打开安迪的牢门时，发现他已不翼而飞。预感到末日来临的典狱长在检察人员收到安迪投寄的典狱长的罪证之后，畏罪自杀。"></Label>
								</div>
							</div>

							{ isCartoon &&
							<div className={ styles.fieldSet + ' clearfix' }>
								<Label className="col-sm-2" style={ {fontSize: '16px'} }>作品试读</Label>
								<div className="col-sm-8">
									<ImageUploader required={ true } previews={ cartoonProbation.toJS() }
												   buttonName="上传图片" types={ ['jpg', 'png', 'gif', 'jpeg'] }
												   tips="建议宽度800px，1M以内；仅支持jpg、jpeg、gif、png；条漫请上传10P内，页漫请上传48P内"
												   onChange={ files => update('cartoonProbation', List.of(...files)) }/>
								</div>
							</div> }
							{ !isCartoon &&
							<div className={ styles.fieldSet + ' clearfix' }>
								<Label className="col-sm-2" style={ {fontSize: '16px'} }>作品试读</Label>
								<div className="col-sm-8">
									<Textfield isArea={ true } height={ 500 } autoExpand={ true } value={ probation }
											   maxLength={ 10000 } onChange={ value => update('probation', value) }/>
								</div>
							</div> }

							<div className={ styles.next } onClick={ this.handleSave.bind(this, true, false) }>
								保存，进入下一步
							</div>
							<div className={ styles.nextText }>
								<span style={ {
									paddingLeft: showJump ? '300px' : '380px',
									color: '#707070',
									textDecoration: 'none',
									cursor: 'pointer'
								} } onClick={ this.backward }>&lt;返回上一步</span>
								{ showJump && <span style={ {paddingLeft: '40px', color: '#707070', cursor: 'pointer'} }
													onClick={ this.jump }>跳过，直接上传作品</span> }
							</div>
						</div>
						:
						<div style={{marginTop: '200px'}}>
							<Loading />
						</div>
				}
				<Confirm title="温馨提示"
						 content="<p style='color: #FF3B30'>你没有保存故事梗概，跳过会清空当前页面的内容</p><p>没有故事梗概的作品不会被推荐，制片人无法看到您的作品，建议您完善故事梗概。</p>"
						 closeText="知道了，暂时不想展示" okText="去填写" show={ confirmShow } onClose={ this.closeConfirm }
						 onOK={ this.okConfirm } onX={ this.okConfirm } closeIsText={ true }/>
			</div>
		);
	}
}
