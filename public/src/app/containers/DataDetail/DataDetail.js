import React, {
	Component,
} from 'react';
import styles from '../DataCenter/DataCenter.scss';
import styles2 from './DataDetail.scss';
import Table from 'react-bootstrap/lib/Table';
import {
	Loading
} from '../../components';
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

const avgTimePlatform = 51;

export default class DataDetail extends Component {

	constructor() {
		super();

		this.state = {
			showRange: {},
			clickRange: {},
			focusRange: {},
			timeRange: {},
			showRangeShow: false,
			clickRangeShow: false,
			focusRangeShow: false,
			timeRangeShow: false,
			timeChart: null,
			showChart: null,
			clickChart: null,
			focusChart: null,
			detailData: null
		};
	}

	componentWillMount() {

		const {
			params
		} = this.props;

		$.ajax({
			url: 'http://api.yunlaiwu.com/sns/statis/ipstatis',
			data: {
				token: getCookie('X-AVOSCloud-Session-Token'),
				start: moment(+new Date - 24 * 60 * 60 * 1000).format('YMMDD'),
				end: moment(+new Date - 24 * 60 * 60 * 1000).format('YMMDD'),
				ipId: params.id
			},
			dataType: 'json'
		})
			.then(data => {
				if (data.errno === 0) {

					if (!data.data.length) {
						$.ajax({
							url: 'http://api.yunlaiwu.com/sns/statis/ipstatis',
							data: {
								token: getCookie('X-AVOSCloud-Session-Token'),
								start: moment(+new Date - 2 * 24 * 60 * 60 * 1000).format('YMMDD'),
								end: moment(+new Date - 2 * 24 * 60 * 60 * 1000).format('YMMDD'),
								ipId: params.id
							},
							dataType: 'json'
						})
							.then(data => {
								if (data.errno === 0) {
									this.setState({
										detailData: data.data.pop()
									});
								}
							});
					} else {
						this.setState({
							detailData: data.data.pop()
						});
					}
				}
			});
	}

	shouldComponentUpdate(nextProps, nextState) {

		let {
			showChart,
			clickChart,
			focusChart,
			timeChart,
			showRange,
			clickRange,
			focusRange,
			timeRange
		} = this.state;

		// if (JSON.stringify(nextState['showRange']) !== JSON.stringify(showRange)) {

		// 	this.getData((data, result) => {

		// 		let cacheBuyerData = 0;
		// 		let cacheUserData = 0;

		// 		data.legend = {
		// 			data: ['制片人', '所有用户']
		// 		};

		// 		data.series = [{
		// 			name: '制片人',
		// 			type: 'line',
		// 			data: nextState['showRange'].dates.map(item => result[item] ? (cacheBuyerData = result[item]['showNumberToBuyer']) : cacheBuyerData)
		// 		}, {
		// 			name: '所有用户',
		// 			type: 'line',
		// 			data: nextState['showRange'].dates.map(item => result[item] ? (cacheUserData = result[item]['showNumberToUser']) : cacheUserData)
		// 		}];

		// 		if (!showChart) {
		// 			showChart = echarts.init(this.refs.show);
		// 			this.setState({
		// 				showChart
		// 			});
		// 		}

		// 		showChart.setOption(data);

		// 	}, nextState['showRange']);

		// }

		if (JSON.stringify(nextState['clickRange']) !== JSON.stringify(clickRange)) {

			this.getData((data, result) => {

				let cacheBuyerData = 0;
				let cacheUserData = 0;

				data.legend = {
					data: ['制片人', '所有用户', '成交IP平均值']
				};

				data.series = [{
					name: '制片人',
					type: 'line',
					data: nextState['clickRange'].dates.map(item => result[item] ? (cacheBuyerData = result[item]['clickNumberToBuyer']) : cacheBuyerData)
				}, {
					name: '所有用户',
					type: 'line',
					data: nextState['clickRange'].dates.map(item => result[item] ? (cacheUserData = result[item]['clickNumberToUser']) : cacheUserData)
				}];

				if (!clickChart) {
					clickChart = echarts.init(this.refs.click);
					this.setState({
						clickChart
					});
				}

				clickChart.setOption(data);


			}, nextState['clickRange']);

		}

		if (JSON.stringify(nextState['focusRange']) !== JSON.stringify(showRange)) {

			this.getData((data, result) => {

				let cacheBuyerData = 0;
				let cacheUserData = 0;

				data.legend = {
					data: ['制片人', '所有用户']
				};

				data.series = [{
					name: '制片人',
					type: 'line',
					data: nextState['focusRange'].dates.map(item => result[item] ? (cacheBuyerData = result[item]['followNumberToBuyer']) : cacheBuyerData)
				}, {
					name: '所有用户',
					type: 'line',
					data: nextState['focusRange'].dates.map(item => result[item] ? (cacheUserData = result[item]['followNumberToUser']) : cacheUserData)
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

		if (JSON.stringify(nextState['timeRange']) !== JSON.stringify(timeRange)) {

			this.getData((data, result) => {

				let cacheTimeData = 0;

				data.legend = {
					data: ['总时长（秒）']
				};

				data.series = [{
					name: '总时长（秒）',
					type: 'line',
					data: nextState['timeRange'].dates.map(item => result[item] ? (cacheTimeData = result[item]['totalTimeToUser'] / 1000) : cacheTimeData)
				}];

				if (!timeChart) {
					timeChart = echarts.init(this.refs.time);
					this.setState({
						timeChart
					});
				}

				timeChart.setOption(data);

			}, nextState['timeRange']);

		}

		return true;

	}

	getData = (cb, range) => {
		const {
			params
		} = this.props;


		$.ajax({
			url: 'http://api.yunlaiwu.com/sns/statis/ipstatis',
			data: {
				token: getCookie('X-AVOSCloud-Session-Token'),
				start: range['startDate'].format('YMMDD'),
				end: range['endDate'].format('YMMDD'),
				ipId: params.id
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
								saveAsImage: {}
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
			showRange,
			clickRange,
			focusRange,
			timeRange,
			showRangeShow,
			clickRangeShow,
			focusRangeShow,
			timeRangeShow,
			detailData
		} = this.state;
		const format = 'YMMDD';

		return (
			<div className={styles2.container}>
				<h1>作品分析</h1>
				{/*
					<h2>作品展现量</h2>
					<div style={ { textAlign: 'center' } }>时间区间：
						<div style={ { display: 'inline' } }>
							<input
								size={ 8 }
								type='text'
								readOnly
								value={ showRange['startDate'] && showRange['startDate'].format(format).toString() }
								/>
							&nbsp;&nbsp;到&nbsp;&nbsp;
							<input
								size={ 8 }
								type='text'
								readOnly
								value={ showRange['endDate'] && showRange['endDate'].format(format).toString() }
								/>
							<span style={ { padding: '0 10px', cursor: 'pointer', color: '#0037ff', display: !showRangeShow ? 'inline-block' : 'none' } } onClick={ this.handleChange.bind(this, 'showRangeShow', true) }>修改</span>
							<span style={ { padding: '0 10px', cursor: 'pointer', color: '#0037ff', display: showRangeShow ? 'inline-block' : 'none' } } onClick={ this.handleChange.bind(this, 'showRangeShow', false) }>隐藏</span>
						</div>
						<div style={ { display: showRangeShow ? 'block' : 'none' } }>
							<DateRange style={{ margin: '0 auto', width: '600px' }}
								startDate={ customRanges['过去7天'].startDate(moment(new Date)) }
								endDate={ customRanges['过去7天'].endDate(moment(new Date)) }
								linkedCalendars={ true }
								ranges={ customRanges }
								onInit={ this.handleChange.bind(this, 'showRange') }
								onChange={ this.handleChange.bind(this, 'showRange') }
								theme={{
									Calendar : { width: 200 },
									PredefinedRanges : { marginLeft: 10, marginTop: 10 }
								}}
								/>
						</div>
					</div>
					<div ref="show" className={ styles.chart }>
						<Loading />
					</div>
				*/}
				<h2>作品累计点击量</h2>
				<div style={{textAlign: 'center'}}>时间区间：
					<div style={{display: 'inline'}}>
						<input
							size={8}
							type='text'
							readOnly
							value={clickRange['startDate'] && clickRange['startDate'].format(format).toString()}
						/>
						&nbsp;&nbsp;到&nbsp;&nbsp;
						<input
							size={8}
							type='text'
							readOnly
							value={clickRange['endDate'] && clickRange['endDate'].format(format).toString()}
						/>
						<span style={{
							padding: '0 10px',
							cursor: 'pointer',
							color: '#0037ff',
							display: !clickRangeShow ? 'inline-block' : 'none'
						}} onClick={this.handleChange.bind(this, 'clickRangeShow', true)}>修改</span>
						<span style={{
							padding: '0 10px',
							cursor: 'pointer',
							color: '#0037ff',
							display: clickRangeShow ? 'inline-block' : 'none'
						}} onClick={this.handleChange.bind(this, 'clickRangeShow', false)}>隐藏</span>
					</div>
					<div style={{display: clickRangeShow ? 'block' : 'none'}}>
						<DateRange style={{margin: '0 auto', width: '600px'}}
								   startDate={customRanges['过去7天'].startDate(moment(new Date))}
								   endDate={customRanges['过去7天'].endDate(moment(new Date))}
								   linkedCalendars={true}
								   ranges={customRanges}
								   onInit={this.handleChange.bind(this, 'clickRange')}
								   onChange={this.handleChange.bind(this, 'clickRange')}
								   theme={{
									   Calendar: {width: 200},
									   PredefinedRanges: {marginLeft: 10, marginTop: 10}
								   }}
						/>
					</div>
				</div>
				<div ref="click" className={styles.chart}>
					<Loading/>
				</div>
				<h2>作品累计关注数</h2>
				<div style={{textAlign: 'center'}}>时间区间：
					<div style={{display: 'inline'}}>
						<input
							size={8}
							type='text'
							readOnly
							value={focusRange['startDate'] && focusRange['startDate'].format(format).toString()}
						/>
						&nbsp;&nbsp;到&nbsp;&nbsp;
						<input
							size={8}
							type='text'
							readOnly
							value={focusRange['endDate'] && focusRange['endDate'].format(format).toString()}
						/>
						<span style={{
							padding: '0 10px',
							cursor: 'pointer',
							color: '#0037ff',
							display: !focusRangeShow ? 'inline-block' : 'none'
						}} onClick={this.handleChange.bind(this, 'focusRangeShow', true)}>修改</span>
						<span style={{
							padding: '0 10px',
							cursor: 'pointer',
							color: '#0037ff',
							display: focusRangeShow ? 'inline-block' : 'none'
						}} onClick={this.handleChange.bind(this, 'focusRangeShow', false)}>隐藏</span>
					</div>
					<div style={{display: focusRangeShow ? 'block' : 'none'}}>
						<DateRange style={{margin: '0 auto', width: '600px'}}
								   startDate={customRanges['过去7天'].startDate(moment(new Date))}
								   endDate={customRanges['过去7天'].endDate(moment(new Date))}
								   linkedCalendars={true}
								   ranges={customRanges}
								   onInit={this.handleChange.bind(this, 'focusRange')}
								   onChange={this.handleChange.bind(this, 'focusRange')}
								   theme={{
									   Calendar: {width: 200},
									   PredefinedRanges: {marginLeft: 10, marginTop: 10}
								   }}
						/>
					</div>
				</div>
				<div ref="focus" className={styles.chart}>
					<Loading/>
				</div>
				<h2>作品累计获得的总阅读时长</h2>
				<div style={{textAlign: 'center'}}>时间区间：
					<div style={{display: 'inline'}}>
						<input
							size={8}
							type='text'
							readOnly
							value={timeRange['startDate'] && timeRange['startDate'].format(format).toString()}
						/>
						&nbsp;&nbsp;到&nbsp;&nbsp;
						<input
							size={8}
							type='text'
							readOnly
							value={timeRange['endDate'] && timeRange['endDate'].format(format).toString()}
						/>
						<span style={{
							padding: '0 10px',
							cursor: 'pointer',
							color: '#0037ff',
							display: !timeRangeShow ? 'inline-block' : 'none'
						}} onClick={this.handleChange.bind(this, 'timeRangeShow', true)}>修改</span>
						<span style={{
							padding: '0 10px',
							cursor: 'pointer',
							color: '#0037ff',
							display: timeRangeShow ? 'inline-block' : 'none'
						}} onClick={this.handleChange.bind(this, 'timeRangeShow', false)}>隐藏</span>
					</div>
					<div style={{display: timeRangeShow ? 'block' : 'none'}}>
						<DateRange style={{margin: '0 auto', width: '600px'}}
								   startDate={customRanges['过去7天'].startDate(moment(new Date))}
								   endDate={customRanges['过去7天'].endDate(moment(new Date))}
								   linkedCalendars={true}
								   ranges={customRanges}
								   onInit={this.handleChange.bind(this, 'timeRange')}
								   onChange={this.handleChange.bind(this, 'timeRange')}
								   theme={{
									   Calendar: {width: 200},
									   PredefinedRanges: {marginLeft: 10, marginTop: 10}
								   }}
						/>
					</div>
				</div>
				<div ref="time" className={styles.chart}>
					<Loading/>
				</div>
				<h2>作品获得的制片方行为</h2>
				{
					detailData ?
						<Table striped bordered condensed hover>
							<thead>
							<tr>
								<th>制片方行为</th>
								<th>次数</th>
								<th>具体说明</th>
								<th>建议操作</th>
							</tr>
							</thead>
							<tbody>
							<tr>
								<td>作品试读</td>
								<td>{detailData.toreadNumberToBuyer}人</td>
								<td>
									您的作品制片方的平均阅读时间为{Math.round(detailData.avgTimeToBuyer / 1000)}秒，平台的平均阅读时间为{avgTimePlatform}秒
								</td>
								<td>请完善您的作品信息和试读内容</td>
							</tr>
							<tr>
								<td>索要全文</td>
								<td>{detailData.askNumberToBuyer}人</td>
								<td>快速响应制片方索要全文的请求，可以大幅提高作品出售的概率</td>
								<td>打开push，及时获取信息</td>
							</tr>
							<tr>
								<td>线上沟通</td>
								<td>{detailData.contactNumberToBuyer}人</td>
								<td>快速响应制片方的沟通信息，可以大幅提高作品出售的概率</td>
								<td>打开push，及时获取信息</td>
							</tr>
							<tr>
								<td>邀约/出价</td>
								<td>{detailData.inviteNumberToBuyer}人</td>
								<td></td>
								<td>在APP的发现中，主动投稿给制片人</td>
							</tr>
							</tbody>
						</Table>
						:
						<div style={{height: '200px', position: 'relative'}}>
							<Loading/>
						</div>
				}
			</div>
		);
	}

}
