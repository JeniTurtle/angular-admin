import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import styles from './Card.scss';
import moment from 'moment';
import {
	Link
} from 'react-router';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import {
	connect
} from 'react-redux';
import {
	Uploader,
	CopyrightProtectionCertificateModal,
} from '../../components';
import {
	CopyrightProtectionAssociationModal,
} from '../../containers';
import {
	fromJS,
	toObject
} from 'immutable';
import {
	push
} from 'react-router-redux'
import IPDetail from '../../containers/IPDetail/IPDetail';

@connect(state => ({
	user: state.get('user'),
	cats: state.get('cats')
}))
export default class Card extends Component {

	constructor(props) {
		super(props);

		this.state = {
			isShowCopyrightProtectionAssociationModal: false,	// 是否显示版保关联弹窗
			isShowCopyrightProtectionCertificateModal: false,	// 是否显示版保证书弹窗
		};
	}

	goGenggai = () => {
		const {
			status,
			dispatch,
			objectId
		} = this.props;

		+status !== 1 && dispatch(push('/ipdetail/' + objectId))
	};

	// 去版保点击
	handleGoToCopyrightProtectionClick() {
		// 打开弹窗
		this.setState({
			isShowCopyrightProtectionAssociationModal: true,
		});
	}

	// 版保关联弹窗关闭按钮点击
	handleCopyrightProtectionAssociationModalClose() {
		// 关闭弹窗
		this.setState({
			isShowCopyrightProtectionAssociationModal: false,
		});
	}

	// 已版保按钮点击
	handleAlreadyCopyrightProtectionClick() {
		// 打开弹窗
		this.setState({
			isShowCopyrightProtectionCertificateModal: true,
		});
	}

	// 版保证书弹窗关闭按钮点击
	handleCopyrightProtectionCertificateModalClose() {
		// 关闭弹窗
		this.setState({
			isShowCopyrightProtectionCertificateModal: false,
		});
	}

	render() {
		const {
			dciCode,
			dciUrl,
			//0,编辑中;1,审核中;2,审核通过;3,失败;4,审核通过
			status,
			title,
			realAuthor,
			desc,
			file,
			link,
			reason,
			update,
			objectId,
			publishedIp,
			handleDel,
			outline,
			updatedAt,
			workState,
			showReasonTip,
			showDCI,
			user,
			cat,
			workType,
			sellCopyrights,
			cats
		} = this.props;

		//如果没有能在售的版权就表示已售完版权
		//审核中的作品无法编辑和管理版权

		//outline为undefined代表加载的是线上列表

		let sellStatus = '待售';
		let workStatus = '草稿';
		const authState = user.get('authState');

		//status还有4（自主下架）的情况，属于老数据，一并视为草稿状态就可以

		switch (+status) {
			case 1:
				workStatus = '审核中';
				break;
			case 3:
				workStatus = '审核未通过'; //管理员评审的时候驳回;
				break;
			case 9:
				workStatus = '等待提交审核';
				break;
			default:
				workStatus = '草稿';
		}

		if (publishedIp) {

			// const ACTION_SELLING = 'selling';   //在售
			// const ACTION_HALF = 'half';         //部分售出
			// const ACTION_FINISH = 'finish';     //已售完
			// const ACTION_SELFDOWN = 'selfdown'; //自主下架
			// const ACTION_ADMINDOWN = 'admindown';//管理员下架
			// const ACTION_ALL = 'all';           //不解释
			const statusInfo = publishedIp.statusInfo;

			switch (statusInfo) {
				case 'half':
					sellStatus = '部分售出';
					break;
				case 'finish':
					sellStatus = '已售完';
					break;
				default:
					sellStatus = '待售';
			}

			//兼容老数据
			//老逻辑在任何情况下只要编辑就会让status置为0
			if (+status === 2 || +status === 0) {
				switch (statusInfo) {
					case 'admindown':
						//这种情况只能出现在版保24小时冷冻状态
						workStatus = '审核中'; //管理员下架形式的审核未通过
						break;
					case 'selfdown':
						workStatus = '已下架';
						break;
					default:
						workStatus = '展示中';
						break;
				}
			}
		}

		if (+status === 9) {
			if (authState === 'unauth') {
				workStatus = '待身份认证';
			} else if (authState === 'waitauth') {
				workStatus = '待身份认证通过';
			} else if (authState === 'failauth') {
				workStatus = '重新认证';
			}
		}

		// let dciCode = '123';
		// let dciUrl = 'http://ac-2eyad9yt.clouddn.com/1209cb4a29ef3fcdbb08.png';

		let WorkStatusComponent = null;

		switch (workStatus) {

			case '审核未通过':
				WorkStatusComponent = () => <div className={styles.workStatus}>{workStatus === '审核未通过' &&
				<Glyphicon glyph="question-sign" className={styles.tip}
						   onClick={showReasonTip.bind(this, reason)}/>}{workStatus}</div>;
				break;
			case '待身份认证':
				WorkStatusComponent = () => <div className={styles.workStatus}>
					<div className={styles.stateTip}>提交作品前需先通过身份认证</div>
					<a target="_blank" href="http://www.yunlaiwu.com/auth/index">{workStatus}</a></div>;
				break;
			case '待身份认证通过':
				WorkStatusComponent = () => <div className={styles.workStatus}>
					<div className={styles.stateTip}>认证通过后自动提交审核</div>
					<span style={{color: '#9b9b9b'}}>{workStatus}</span></div>;
				break;
			case '重新认证':
				WorkStatusComponent = () => <div className={styles.workStatus}>
					<div className={styles.stateTip}>身份认证失败，提交作品前需先通过身份认证</div>
					<a target="_blank" href="http://www.yunlaiwu.com/auth/index">{workStatus}</a></div>;
				break;
			default:
				WorkStatusComponent = () => <div className={styles.workStatus}>{workStatus}</div>;
				break;

		}

		let catName = cats.filter(item => item.get('id') === cat[0]).get(0);
		catName = catName ? catName.get('name') : cat[0];

		// console.log('workStatus', workStatus);
		// console.log('sellCopyrights.length', sellCopyrights.length);
		// console.log('objectId', objectId);
		// console.log('title', title);

		return (
			<div className={styles.card}>

				{/* 版保关联弹窗 */}
				{this.state.isShowCopyrightProtectionAssociationModal &&
				<CopyrightProtectionAssociationModal
					author={realAuthor}
					leanId={objectId}
					workTitle={title}
					onClose={this.handleCopyrightProtectionAssociationModalClose.bind(this)}/>
				}

				{/* 版保证书弹窗 */}
				{this.state.isShowCopyrightProtectionCertificateModal &&
				<CopyrightProtectionCertificateModal
					dciUrl={dciUrl}
					leanId={objectId}
					workTitle={title}
					onClose={this.handleCopyrightProtectionCertificateModalClose.bind(this)}/>
				}

				<div className={styles.content}>
					<div className={styles.detail}>
						<div className={styles.header}>
							<div className={styles.title}>
								{/* 标题 */}
								<Link target="_blank"
									  style={{color: 'inherit', textDecoration: 'none'}}
									  to={'/preview/' + objectId}>
									{title}
								</Link>
								{+status !== 9 &&
								<div className={styles.copy}>
									{dciCode
										? <span className={styles.copyright}
											// onClick={showDCI.bind(this, dciUrl)}
												onClick={this.handleAlreadyCopyrightProtectionClick.bind(this)}
												style={{
													cursor: 'pointer'
												}}>
											&nbsp;已版保
										</span>
										: <span className={styles.nocopyright}>
											未版保 &nbsp;
											<span className={styles.freeCopy}
												  style={{
													  cursor: 'pointer'
												  }}
												  onClick={this.handleGoToCopyrightProtectionClick.bind(this)}>
												免费申请版保&gt;
											</span>
									</span>
									}
								</div>
								}
							</div>
							{/* 描述 */}
							<Link target="_blank" to={'/preview/' + objectId}
								  style={{color: 'inherit', textDecoration: 'none'}}
								  className={styles.desc}>
								{desc}
							</Link>
							{publishedIp &&
							<div className={styles.subscript}>
								<span style={{paddingRight: '20px'}}>已推荐给{publishedIp.showCount}位制作人</span>
								<span>{catName + '·' + workType}</span>
							</div>
							}
							{!publishedIp &&
							<div className={styles.subscript}>
								<span>{catName + '·' + workType}</span>
							</div>
							}
						</div>
					</div>
					<div className={styles.writingStatus}>
						{outline === undefined || IPDetail.validateDetail(fromJS(this.props).toObject()).length <= 0 ?
							<div className={styles.pass}>已完成</div> :
							<div>
								<div className={styles.pass}>基本信息</div>
								<div style={{
									color: 'inherit',
									textDecoration: 'none',
									'cursor': 'pointer',
									marginTop: '8px'
								}} className={styles.fail} onClick={this.goGenggai}>
									故事梗概
								</div>
							</div>
						}
					</div>
					<div className={styles.sellStatus}>{sellStatus}</div>
					<WorkStatusComponent/>
				</div>
				<div className={styles.footer}>
					<span className={styles.plusInfo}>作者：{realAuthor}</span>
					<span className={styles.plusInfo}>{workState}</span>
					<span className={styles.plusInfo}>更新于：{moment(updatedAt).format('YYYY.MM.DD')}</span>
					<section className={styles.btns}>
						{['展示中', '已下架'].indexOf(workStatus) > -1 &&
						<Link className={styles.btn + ' ' + styles.ctrl} target="_blank"
							  to={"/ipconfig/" + objectId}>
							作品设置
						</Link>}
						{sellCopyrights.length > 0 ?
							<div>
								{['草稿'].indexOf(workStatus) > -1 &&
								<div className={styles.btn + ' ' + styles.ctrl} onClick={handleDel}>
									删除作品
								</div>}
								{/*{ ['展示中', '已下架'].indexOf(workStatus) > -1 && <Link className={ styles.btn + ' ' + styles.ctrl } target="_blank" to={ "/ipconfig/" + objectId }>*/}
								{/*作品设置*/}
								{/*</Link> }*/}
								{['审核中'].indexOf(workStatus) < 0 && <Link to={"/ipinfo/" + objectId} target="_blank"
																		  className={styles.btn + ' ' + styles.edit + ' ' + styles.active}>
									编辑内容
								</Link>}
							</div>
							:
							<div style={{float: 'right', color: '#9b9b9b', paddingRight: '20px', lineHeight: '72px'}}>
								所有版权均已售出</div>
						}
					</section>
				</div>
			</div>
		);
	}
}
