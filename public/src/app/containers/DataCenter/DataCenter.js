import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import styles from './DataCenter.scss';
import Table from 'react-bootstrap/lib/Table';
import {
	Link
} from 'react-router';
import {
	connect
} from 'react-redux';
import {
	Loading
} from '../../components';
import {
	fetchHistories,
	fetchMergeIPs
} from '../../actions/HTTP';
import {
	Pagination,
	Nav
} from '../../components';
import IPDetail from '../IPDetail/IPDetail';
import {
	showWarning
} from '../../actions/Popups';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Button from 'react-bootstrap/lib/Button';
import moment from 'moment';
import {
	getCookie
} from '../../utils/funcs';
import {
	defaultRanges,
	Calendar,
	DateRange
} from 'react-date-range/lib';

const customRanges = {
	'过去7天': defaultRanges['Last 7 Days'],
	'过去30天': defaultRanges['Last 30 Days']
};

const pageCount = 20;

const averageExplode = 6547;

@connect(state => ({
	ips: state.get('ips'),
	user: state.get('user'),
	histories: state.get('histories')
}))

export default class DataCenter extends Component {

	static get defaultProps() {

		return {
			ips: {
				data: [],
				count: -1
			},
			histories: {
				list: [],
				totalCount: 0
			}
		};

	}

	static propTypes = {
		ips: PropTypes.object,
		histories: PropTypes.object
	}

	constructor() {
		super();

		this.state = {
			accessRange: {},
			explodeRange: {},
			focusRange: {},
			accessRangeShow: false,
			explodeRangeShow: false,
			focusRangeShow: false,
			accessChart: null,
			explodeChart: null,
			focusChart: null,
			ranks: [],
			personRanks: [],
			pn: 0
		};

		this.showCourage = false;
	}

	componentWillMount() {

		const {
			dispatch
		} = this.props;

		dispatch(fetchMergeIPs(dispatch, 0, pageCount));
		dispatch(fetchHistories(dispatch));

		// this.handleChange('accessRange', {
		// 	startDate: customRanges['过去7天'].startDate(moment(new Date)),
		// 	endDate: customRanges['过去7天'].endDate(moment(new Date))
		// });
		// this.handleChange('explodeRange', customRanges['过去7天']);
		// this.handleChange('focusRange', customRanges['过去7天']);

		//昨天的数据没有就展示前天的数据

		let getRanks = (key, path, pn = 0, rn = 10) => {
			$.ajax({
				url: 'http://api.yunlaiwu.com/sns/statis/' + path + '?pn=' + pn + '&rn=' + rn,
				data: {
					token: getCookie('X-AVOSCloud-Session-Token')
				},
				dataType: 'json'
			})
				.then(data => {
					if (data.errno === 0) {

						if (!data.data.length) {
							$.ajax({
								url: 'http://api.yunlaiwu.com/sns/statis/' + path + '?pn=' + pn + '&rn=' + rn,
								data: {
									token: getCookie('X-AVOSCloud-Session-Token'),
									date: moment(+new Date - 2 * 24 * 60 * 60 * 1000).format('YMMDD')
								},
								dataType: 'json'
							})
								.then(data => {
									if (data.errno === 0) {
										this.setState({
											[key]: data.data
										});
									}
								});
						} else {
							this.setState({
								[key]: data.data
							});
						}
					}
				});
		}

		getRanks('ranks', 'iphot');
		getRanks('personRanks', 'myiphot', 0, 20);

	}

	shouldComponentUpdate(nextProps, nextState) {

		const messageProps = {
			loadingState: ['作品列表加载中', '作品列表加载成功', '作品列表加载失败']
		};

		const messageKeys = Object.keys(messageProps);

		const {
			dispatch,
			ips
		} = this.props;

		let {
			accessChart,
			explodeChart,
			focusChart,
			accessRange,
			explodeRange,
			focusRange,
		} = this.state;

		// messageKeys.forEach(function(item) {

		// 	if (nextProps.ips.get(item) != ips.get(item)) {

		// 		switch (nextProps.ips.get(item)) {

		// 			case 'start':
		// 				dispatch(showWarning(messageProps[item][0], 'warning'), -1);
		// 				return;
		// 			case 'success':
		// 				dispatch(showWarning(messageProps[item][1], 'success'));
		// 				return;
		// 			case 'fail':
		// 				dispatch(showWarning(messageProps[item][2], 'danger'));
		// 				return;

		// 		}

		// 	}

		// });

		if (JSON.stringify(nextState['accessRange']) !== JSON.stringify(accessRange)) {

			this.getData((data, result) => {

				let cacheBuyerData = 0;
				let cacheUserData = 0;

				data.legend = {
					data: ['制片人', '所有用户']
				};

				data.series = [{
					name: '制片人',
					type: 'line',
					data: nextState['accessRange'].dates.map(item => result[item] ? (cacheBuyerData = result[item]['visitNumberForCopyrightSiteByBuyer']) : cacheBuyerData)
				}, {
					name: '所有用户',
					type: 'line',
					data: nextState['accessRange'].dates.map(item => result[item] ? (cacheUserData = result[item]['visitNumberForCopyrightSiteByUser']) : cacheUserData)
				}];

				if (!accessChart) {
					accessChart = echarts.init(this.refs.access);
					this.setState({
						accessChart
					});
				}

				accessChart.setOption(data);

				if (!this.showCourage) {
					// setTimeout(() => dispatch(showWarning('截至今日共' + cacheUserData + '人访问您的作家小站。请完善自己的作品，获得更多访问和关注！', 'success', 3000)), 3000);
					this.showCourage = true;
				}


			}, nextState['accessRange']);

		}

		// if (JSON.stringify(nextState['explodeRange']) !== JSON.stringify(explodeRange)) {

		// 	this.getData((data, result) => {

		// 		let cacheBuyerData = 0;
		// 		let cacheUserData = 0;

		// 		data.legend = {
		// 			data: ['制片人', '所有用户', '成交IP平均值']
		// 		};

		// 		data.series = [{
		// 			name: '制片人',
		// 			type: 'line',
		// 			data: nextState['explodeRange'].dates.map(item => result[item] ? (cacheBuyerData = result[item]['showNumberForAllIpToBuyer']) : cacheBuyerData)
		// 		}, {
		// 			name: '所有用户',
		// 			type: 'line',
		// 			data: nextState['explodeRange'].dates.map(item => result[item] ? (cacheUserData = result[item]['showNumberForAllIpToUser']) : cacheUserData)
		// 		}, {
		// 			name: '成交IP平均值',
		// 			type: 'line',
		// 			data: nextState['explodeRange'].dates.map(() => averageExplode)
		// 		}];

		// 		if (!explodeChart) {
		// 			explodeChart = echarts.init(this.refs.explode);
		// 			this.setState({
		// 				explodeChart
		// 			});
		// 		}

		// 		explodeChart.setOption(data);


		// 	}, nextState['explodeRange']);

		// }

		if (JSON.stringify(nextState['focusRange']) !== JSON.stringify(focusRange)) {

			this.getData((data, result) => {

				let cacheBuyerData = 0;
				let cacheUserData = 0;
				let cacheBuyerIPData = 0;
				let cacheUserIPData = 0;

				data.legend = {
					data: ['关注你的制片人', '关注你的用户', '关注你作品的制片人', '关注你作品的用户']
				};

				data.series = [{
					name: '关注你的制片人',
					type: 'line',
					data: nextState['focusRange'].dates.map(item => result[item] ? (cacheBuyerData = result[item]['followNumberForCopyrightToBuyer']) : cacheBuyerData)
				}, {
					name: '关注你的用户',
					type: 'line',
					data: nextState['focusRange'].dates.map(item => result[item] ? (cacheUserData = result[item]['followNumberForCopyrightToUser']) : cacheUserData)
				}, {
					name: '关注你作品的制片人',
					type: 'line',
					data: nextState['focusRange'].dates.map(item => result[item] ? (cacheBuyerIPData = result[item]['followNumberForAllIpToBuyer']) : cacheBuyerIPData)
				}, {
					name: '关注你作品的用户',
					type: 'line',
					data: nextState['focusRange'].dates.map(item => result[item] ? (cacheUserIPData = result[item]['followNumberForAllIpToUser']) : cacheUserIPData)
				}];

				if (!focusChart) {
					focusChart = echarts.init(this.refs.focus);
					this.setState({
						focusChart
					});
				}

				focusChart.setOption(data);


			}, nextState['focusRange']);

		}

		return true;

	}

	getData = (cb, range) => {

		$.ajax({
			url: 'http://api.yunlaiwu.com/sns/statis/userstatis',
			data: {
				token: getCookie('X-AVOSCloud-Session-Token'),
				start: range['startDate'].format('YMMDD'),
				end: range['endDate'].format('YMMDD')
			},
			dataType: 'json'
		})
			.then(data => {
				if (data.errno === 0) {

					let result = {};

					data.data.forEach(item => {
						result[item.date] = item
					});

					cb && cb({
						tooltip: {
							trigger: 'axis'
						},
						toolbox: {
							feature: {
								// saveAsImage: {}
							}
						},
						grid: {
							left: '3%',
							right: '4%',
							bottom: '3%',
							containLabel: true
						},
						xAxis: [{
							type: 'category',
							boundaryGap: false,
							data: range.dates
						}],
						yAxis: [{
							type: 'value'
						}]
					}, result);
				}
			});

	}

	load = pn => {

		const {
			dispatch
		} = this.props;

		this.setState({
			pn: pn - 1
		});

		dispatch(fetchMergeIPs(dispatch, pn - 1, pageCount));
	}

	handleChange = (which, payload) => {

		if (/Range$/.test(which)) {
			let dateArray = [];
			let currentDate = payload.startDate.toDate();
			while (currentDate <= payload.endDate.toDate()) {
				dateArray.push(moment(new Date(currentDate)).format('YMMDD'));
				currentDate = new Date(new Date(+currentDate + 24 * 60 * 60 * 1000));
			}
			payload.dates = dateArray;
		}
		this.setState({
			[which]: payload
		});
	}

	render() {

		const {
			user,
			ips,
			histories,
			path
		} = this.props;

		const whetherOK = ips && ips.get('loadingState') == 'success';

		const {
			accessRange,
			explodeRange,
			focusRange,
			accessRangeShow,
			explodeRangeShow,
			focusRangeShow,
			ranks,
			personRanks,
			pn
		} = this.state;
		const format = 'YMMDD';

		return (
			<div className={ styles.container }>
				<section className={styles.nav}>
					<Nav path={path}/>
				</section>
				<div className={ styles.contentContainer + ' pull-right'}>
					<h1>健康分析</h1>
					<h2>作者信息（完整度<span
						style={ {color: '#0037ff'} }>{ ([user.get('avatar'), user.get('desc')].reduce((total, item) => total + (!!item ? 1 : 0), 0) * 100 / 2).toFixed(0) + '%' }</span>）
					</h2>
					{
						user.get('username') &&
						<Table striped bordered condensed hover>
							<thead>
							<tr>
								<th>姓名</th>
								<th>头像</th>
								<th>简介</th>
							</tr>
							</thead>
							<tbody>
							<tr>
								<td>{ user.get('username') }</td>
								<td>{ !!user.get('avatar') ? <Glyphicon glyph="ok" style={ {color: '#0037ff'} }/> :
									<span><Glyphicon glyph="remove" style={ {color: '#ffac00'} }/><Link target="_blank"
																										to="/">设置头像</Link></span> }</td>
								<td>{ !!user.get('desc') ? <Glyphicon glyph="ok" style={ {color: '#0037ff'} }/> :
									<span><Glyphicon glyph="remove" style={ {color: '#ffac00'} }/><Link target="_blank"
																										to="/">设置个人简介</Link></span> }</td>
							</tr>
							</tbody>
						</Table>
					}
					{/*
					 <h2>作品信息<span style={ { 'fontSize': '14px' } }>（没有故事梗概而仅有原文的作品，云莱坞不会在推荐列表里推送，制片人无法看到该作品。）</span></h2>
					 {
					 whetherOK ?
					 <Table striped bordered condensed hover>
					 <thead>
					 <tr>
					 <th>作品名称</th>
					 <th>故事梗概</th>
					 <th>试读内容</th>
					 <th>原文全文</th>
					 <th>DCI登记</th>
					 <th>作品状态</th>
					 <th>信息完整度</th>
					 </tr>
					 </thead>
					 <tbody>
					 {
					 ips.get('data').map((item, index) => {
					 return (
					 <tr key = { index }>
					 <td>{ item.get('title') }</td>
					 <td>{ IPDetail.validateDetail(item.toObject()).length < 1 ? <Glyphicon glyph="ok" style={ { color: '#0037ff' } } /> : <span><Glyphicon glyph="remove" style={ { color: '#ffac00' } } /><Link target="_blank" to={ "/ipinfo/" + item.get('objectId') }>编辑</Link></span> }</td>
					 <td>{ !!item.get('probation') ?  <Glyphicon glyph="ok" style={ { color: '#0037ff' } } /> : <span><Glyphicon glyph="remove" style={ { color: '#ffac00' } } /><Link target="_blank" to={ "/ipinfo/" + item.get('objectId') }>编辑</Link></span> }</td>
					 <td>{ !!item.get('rawFile') ?  <Glyphicon glyph="ok" style={ { color: '#0037ff' } } /> : <span><Glyphicon glyph="remove" style={ { color: '#ffac00' } } /><Link target="_blank" to={ "/ipinfo/" + item.get('objectId') }>编辑</Link></span> }</td>
					 <td>{ !!item.get('dciCode') ?  <Glyphicon glyph="ok" style={ { color: '#0037ff' } } /> : <span><Glyphicon glyph="remove" style={ { color: '#ffac00' } } /><a target="_blank" href="http://banquanbaohu.yunlaiwu.com/copy/workregister">编辑</a></span> }</td>
					 <td>{ ['编辑中', '审核中', '已发布', '未过审', '已发布'][item.get('status')] || '编辑中' }</td>
					 <td style={ { color: '#0037ff' } }>{ ([
					 (item.get('outline') && item.get('outline').join('').length > 0),
					 (!!item.get('biography') || (!!item.get('cartoonBiography') && item.get('cartoonBiography').length) ),
					 !!item.get('probation'), !!item.get('rawFile'), !!item.get('dciCode')].reduce((total, item) => total + (!!item ? 1 : 0), 0) * 100 / 5).toFixed(0) + '%' }</td>
					 </tr>
					 );
					 })
					 }
					 </tbody>
					 </Table>
					 :
					 <div style={ { height: '100px', width: '100%', position: 'relative'} }>
					 <Loading />
					 </div>
					 }
					 {
					 ips.get('count') > pageCount &&
					 <div style={ { marginLeft: '-40px'} }>
					 <Pagination pageCount={ pageCount } handleTurn={ this.load } total={ ips.get('count') } curPage={ pn + 1 } style={ { border: 'none', paddingRight: '40px' } }/>
					 </div>
					 }
					 */}
					<h1>图表分析</h1>
					<h2>作家小站累计访问量</h2>
					<div style={ {textAlign: 'center'} }>时间区间：
						<div style={ {display: 'inline'} }>
							<input
								size={ 8 }
								type='text'
								readOnly
								value={ accessRange['startDate'] && accessRange['startDate'].format(format).toString() }
							/>
							&nbsp;&nbsp;到&nbsp;&nbsp;
							<input
								size={ 8 }
								type='text'
								readOnly
								value={ accessRange['endDate'] && accessRange['endDate'].format(format).toString() }
							/>
							<span style={ {
								padding: '0 10px',
								cursor: 'pointer',
								color: '#0037ff',
								display: !accessRangeShow ? 'inline-block' : 'none'
							} } onClick={ this.handleChange.bind(this, 'accessRangeShow', true) }>修改</span>
							<span style={ {
								padding: '0 10px',
								cursor: 'pointer',
								color: '#0037ff',
								display: accessRangeShow ? 'inline-block' : 'none'
							} } onClick={ this.handleChange.bind(this, 'accessRangeShow', false) }>隐藏</span>
						</div>
						<div style={ {display: accessRangeShow ? 'block' : 'none'} }>
							<DateRange style={{margin: '0 auto', width: '600px'}}
									   startDate={ customRanges['过去7天'].startDate(moment(new Date)) }
									   endDate={ customRanges['过去7天'].endDate(moment(new Date)) }
									   linkedCalendars={ true }
									   ranges={ customRanges }
									   onInit={ this.handleChange.bind(this, 'accessRange') }
									   onChange={ this.handleChange.bind(this, 'accessRange') }
									   theme={{
										   Calendar: {width: 200},
										   PredefinedRanges: {marginLeft: 10, marginTop: 10}
									   }}
							/>
						</div>
					</div>
					<div ref="access" className={ styles.chart }>
						<Loading />
					</div>
					{/*
					 <h2>所有作品累计曝光量</h2>
					 <div style={ { textAlign: 'center' } }>时间区间：
					 <div style={ { display: 'inline' } }>
					 <input
					 size={ 8 }
					 type='text'
					 readOnly
					 value={ explodeRange['startDate'] && explodeRange['startDate'].format(format).toString() }
					 />
					 &nbsp;&nbsp;到&nbsp;&nbsp;
					 <input
					 size={ 8 }
					 type='text'
					 readOnly
					 value={ explodeRange['endDate'] && explodeRange['endDate'].format(format).toString() }
					 />
					 <span style={ { padding: '0 10px', cursor: 'pointer', color: '#0037ff', display: !explodeRangeShow ? 'inline-block' : 'none' } } onClick={ this.handleChange.bind(this, 'explodeRangeShow', true) }>修改</span>
					 <span style={ { padding: '0 10px', cursor: 'pointer', color: '#0037ff', display: explodeRangeShow ? 'inline-block' : 'none' } } onClick={ this.handleChange.bind(this, 'explodeRangeShow', false) }>隐藏</span>
					 </div>
					 <div style={ { display: explodeRangeShow ? 'block' : 'none' } }>
					 <DateRange style={{ margin: '0 auto', width: '600px' }}
					 startDate={ customRanges['过去7天'].startDate(moment(new Date)) }
					 endDate={ customRanges['过去7天'].endDate(moment(new Date)) }
					 linkedCalendars={ true }
					 ranges={ customRanges }
					 onInit={ this.handleChange.bind(this, 'explodeRange') }
					 onChange={ this.handleChange.bind(this, 'explodeRange') }
					 theme={{
					 Calendar : { width: 200 },
					 PredefinedRanges : { marginLeft: 10, marginTop: 10 }
					 }}
					 />
					 </div>
					 </div>
					 <div ref="explode" className={ styles.chart }>
					 <Loading />
					 </div>
					 */}
					<h2>累计关注数</h2>
					<div style={ {textAlign: 'center'} }>时间区间：
						<div style={ {display: 'inline'} }>
							<input
								type='text'
								readOnly
								value={ focusRange['startDate'] && focusRange['startDate'].format(format).toString() }
							/>
							&nbsp;&nbsp;到&nbsp;&nbsp;
							<input
								type='text'
								readOnly
								value={ focusRange['endDate'] && focusRange['endDate'].format(format).toString() }
							/>
							<span style={ {
								padding: '0 10px',
								cursor: 'pointer',
								color: '#0037ff',
								display: !focusRangeShow ? 'inline-block' : 'none'
							} } onClick={ this.handleChange.bind(this, 'focusRangeShow', true) }>修改</span>
							<span style={ {
								padding: '0 10px',
								cursor: 'pointer',
								color: '#0037ff',
								display: focusRangeShow ? 'inline-block' : 'none'
							} } onClick={ this.handleChange.bind(this, 'focusRangeShow', false) }>隐藏</span>
						</div>
						<div style={ {display: focusRangeShow ? 'block' : 'none'} }>
							<DateRange style={{margin: '0 auto', width: '600px'}}
									   startDate={ customRanges['过去7天'].startDate(moment(new Date)) }
									   endDate={ customRanges['过去7天'].endDate(moment(new Date)) }
									   linkedCalendars={ true }
									   ranges={ customRanges }
									   onInit={ this.handleChange.bind(this, 'focusRange') }
									   onChange={ this.handleChange.bind(this, 'focusRange') }
									   theme={{
										   Calendar: {width: 200},
										   PredefinedRanges: {marginLeft: 10, marginTop: 10}
									   }}
							/>
						</div>
					</div>
					<div ref="focus" className={ styles.chart }>
						<Loading />
					</div>
					<h1>平台作品热度排行榜</h1>
					{
						ranks.length > 0 ?
							<Table striped bordered condensed hover>
								<thead>
								<tr>
									<th>排名</th>
									<th>作品名称</th>
									<th>作者</th>
								</tr>
								</thead>
								<tbody>
								{
									ranks.map((rank, index) =>
										<tr key={ index }>
											<td>{ index + 1 }</td>
											<td><a target="_blank"
												   href={ "http://yunlaiwu.com/detail?id=" + rank.objectId }>{ rank.title }</a>
											</td>
											<td>{ rank.username }</td>
										</tr>
									)
								}
								</tbody>
							</Table>
							:
							<div style={ {height: '200px', position: 'relative'} }>
								<Loading />
							</div>
					}
					{ personRanks.length > 0 && <h1>您的作品热度排行榜</h1> }
					{
						personRanks.length > 0 &&
						<Table striped bordered condensed hover>
							<thead>
							<tr>
								<th>名次</th>
								<th>作品名称</th>
								<th>平台排名</th>
								<th>操作</th>
							</tr>
							</thead>
							<tbody>
							{
								personRanks.map((rank, index) =>
									<tr key={ index }>
										<td>{ index + 1 }</td>
										<td>{ rank.title }</td>
										<td>{ rank.pagerankOrder }</td>
										<td><Link target="_blank" to={ "/datadetail/" + rank.ipId }>查看详情</Link></td>
									</tr>
								)
							}
							</tbody>
						</Table>
					}
				</div>
			</div>
		);
	}

}
