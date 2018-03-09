'use strict';

/************************* React ***************************/

import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	Link
} from 'react-router';

import {
	Progress
} from '../../components';

import Glyphicon from 'react-bootstrap/lib/Glyphicon';

import IPDetail from '../IPDetail/IPDetail';

/************************* 样式和图片 ***************************/

import styles from './Done.scss';
import timeImg from './green_time.svg';

/************************* Util ***************************/

import {
	query,
} from '../../utils/url';

/************************* Redux ***************************/

import {
	bindActionCreators
} from 'redux';
import {
	connect
} from 'react-redux';

import {
	fetchIP,
	createIP,
	updateIP
} from '../../actions/HTTP';

@connect(state => ({
		user: state.get('user'),
		ip: state.get('ipInfo')
	})
	// , dispatch => bindActionCreators({
	// 	fetchIP: fetchIP.bind(this, dispatch)
	// }, dispatch)
)
export default class Done extends Component {

	// componentWillMount() {

	// 	const {
	// 		update,
	// 		fetchIP
	// 	} = this.props;

	// 	fetchIP(this.getId());
	// }

	// getId = () => {
	// 	const {
	// 		params,
	// 		objectId
	// 	} = this.props;
	// 	return params && params.id || objectId;
	// }

	componentWillMount() {

		const {
			ip
		} = this.props;

		document.title = '编辑-' + ip.get('title');
	}

	/**
	 *  从location.href中获得id
	 *  location.href 格式为 http://waka.yunlaiwu.com:8001/#/ipinfo/59014ff7da2f60005de484e7?_k=mrbp1t
	 *
	 *  @return {string}
	 */
	getIdFromLocationHref() {
		let id;
		const hrefArr = location.href.split('/');	// 以 / 分割当前url
		if (hrefArr instanceof Array) {
			const lastString = hrefArr[hrefArr.length - 1];	// 获得最后一个字符串
			if (lastString) {
				const tempArr = lastString.split('?');	// 以 ? 分割当前字符串
				if (tempArr instanceof Array) {
					id = tempArr[0];
				}
			}
		}
		return id;
	}

	render() {


		const {
			user,
			ip
		} = this.props;

		const isValidate = IPDetail.validateDetail(ip.toObject());

		const workType = ip.get('workType');	// 作品类型 String 需要判断是否是 电影剧本
		const outline = ip.get('outline');	// 故事梗概 Array
		// const rawFile = ip.get('rawFile');	// 原文 String 现在不需要上传原文也可以显示新编剧大赛引流的提示了
		// console.log('workType', workType);
		// console.log('outline', outline);
		// console.log('rawFile', rawFile);

		// 得到两天之后的日期
		const curDate = new Date();
		curDate.setDate(curDate.getDate() + 2);
		const twoDaysLater = curDate;

		return (
			<div className={ styles.container + ' clearfix' }>
				<Progress step={ 3 } GG={ isValidate.length > 0 }/>
				<div className={ styles.form + ' clearfix' }>

					{/* time img */}
					<img
						className={styles.timeImg}
						src={timeImg}
						alt=""/>

					{
						user.get('authState') === 'authed' &&
						<div>

							{ window.channel === 'newwriter' &&
							<h1>作品已提交审核，审核通过后即会参赛并同时展示在云莱坞平台</h1>
							}

							{window.channel !== 'newwriter' &&
							<h1>恭喜你，作品已经提交审核</h1>
							}

							<p>预计{twoDaysLater.getFullYear()}年{twoDaysLater.getMonth() + 1}月{twoDaysLater.getDate()}日审核完成，审核通过后就可以展示出售了</p>

							<p>作品已保存到[我的小站] >&nbsp;
								<Link
									to={ "/preview/" + ip.get('objectId') }
									target="_blank"
									className={styles.blueLink}
									style={{
										color: '#707070'
									}}>
									我的作品
								</Link>
							</p>

							{/*<p>请耐心等待，48小时审核通过后就会发布展示了，先<Link to={ "/preview/" + ip.get('objectId') }*/}
							{/*target="_blank">预览</Link></p>*/}
						</div>
					}
					{
						user.get('authState') === 'failauth' &&
						<div>
							<h1>由于您的身份认证未通过，作品暂时无法提交审核，<a target="_blank"
														  href="http://www.yunlaiwu.com/auth/index">免费认证</a></h1>
							<p>当前作品已保存到<Link to="/iplist">我的作品</Link>里，身份认证通过后将自动为您提交审核</p>
						</div>
					}
					{
						user.get('authState') === 'waitauth' &&
						<div>
							<h1>由于您的身份认证正在审核中，作品暂时无法提交审核，<a target="_blank" href="http://www.yunlaiwu.com/auth/index">免费认证</a>
							</h1>
							<p>当前作品已保存到<Link to="/iplist">我的作品</Link>里，身份认证通过后将自动为您提交审核</p>
						</div>
					}
					{
						user.get('authState') === 'unauth' &&
						<div>
							<h1>由于您未完成身份认证，作品暂时无法提交审核，<a target="_blank"
														 href="http://www.yunlaiwu.com/auth/index">免费认证</a></h1>
							<p>当前作品已保存到<Link to="/iplist">我的作品</Link>里，身份认证通过后将自动为您提交审核</p>
						</div>
					}

					{/* 新编剧大赛引流 */}
					{/* 必须符合以下条件 */}
					{/* 1.作品类型为电影剧本 */}
					{/* 2.填写了故事梗概和原文 */}
					{workType === '电影剧本' && outline.size > 0 &&
					<div
						className={styles.activityNewWriter}>
						云莱坞·中国新编剧”大赛，100万纯奖金致新生代编剧之星，
						<span
							className={styles.activityNewWriterLink}
							onClick={() => {
								_hmt.push(['_trackEvent', '新编剧大赛引流,作家后台推广', 'click']);
								window.open('http://www.yunlaiwu.com/activity/newwriter');
							}}>
						立即报名
						</span>
						>
					</div>
					}


					{/* 被砍掉的版权保护链接 */}
					{/*{*/}
					{/*ip.get('dciCode') ?*/}
					{/*(*/}
					{/*ip.get('rawFileChange') && user.get('authState') == 'authed' ?*/}
					{/*<div>*/}
					{/*<p className={ styles.protect }><Glyphicon glyph="info-sign"*/}
					{/*className={ styles.signIcon }/>您更新了作品信息，请重新申请版权保护*/}
					{/*</p>*/}
					{/*<a className={ styles.dcibtn }*/}
					{/*href="http://banquanbaohu.yunlaiwu.com/copy/workregister" target="_blank">免费申请版权保护</a>*/}
					{/*</div>*/}
					{/*:*/}
					{/*null*/}
					{/*)*/}
					{/*:*/}
					{/*(*/}
					{/*user.get('authState') == 'authed' &&*/}
					{/*<div>*/}
					{/*<p className={ styles.protect }><Glyphicon glyph="info-sign"*/}
					{/*className={ styles.signIcon }/>作品未受版权保护，有被盗用的风险*/}
					{/*</p>*/}
					{/*<a className={ styles.dcibtn }*/}
					{/*href="http://banquanbaohu.yunlaiwu.com/copy/workregister" target="_blank">免费申请版权保护</a>*/}
					{/*</div>*/}
					{/*)*/}
					{/*}*/}

				</div>
			</div>
		);
	}
}
