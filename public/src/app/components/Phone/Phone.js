import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import styles from './Phone.scss';
import iphoneImg from './iphone.png';
import {
	connect
} from 'react-redux';

const targetOrigin = 'http://www.yunlaiwu.com';

const filterProps = [
	'title',
	'realAuthor',
	'cat',
	'workType',
	'workState',
	'coreSellPoint',
	'desc',
	'tags',
	'biographies',
	'outline',
	'anotherFilm',
	'audience',
	'workValue',
	'workLength',
	'workPV',
	'moreInformation',
	'probation',
	'cartoonProbation',
	'cartoonBiography',
	'relatedIndex'
];

@connect(state => state.get('ipInfo').toJS())

export default class Phone extends Component {

	shouldComponentUpdate(nextProps, nextState) {

		for (let i in this.props) {
			if (JSON.stringify(this.props[i]) != JSON.stringify(nextProps[i])) {
				let j = i;
				if (i == 'coreSellPoint') j = 'coreSellingPoint';
				if (i == 'biographies') {
					this.sendMessage({
						biography: nextProps['biographies'].join('\n')
					});
					return false;
				}

				if (i == 'workType') {
					this.submit(nextProps);
					return false;
				}

				this.sendMessage({
					[j]: nextProps[i]
				});
			}
		}
		return false;
	}

	//利用一个hidden form，把数据post到iframe里
	componentDidMount() {

		this.submit(this.props);

	}

	submit = props => {
		let mockData = filterProps.map(k => [k, props[k]]).reduce((pre, cur) => {
			pre[cur[0]] = cur[1];
			return pre;
		}, {});

		mockData.author = [{
			objectId: 0
		}];

		mockData.selling = [];
		mockData.frozenChs = [];
		mockData.finishedChs = [];

		mockData.title = mockData.title || '作品标题';
		mockData.workType = mockData.workType || '未填写';
		mockData.workState = mockData.workState || '未填写';
		mockData.coreSellPoint = mockData.coreSellPoint || '未填写';
		mockData.desc = mockData.desc || '未填写';
		mockData.coreSellingPoint = mockData.coreSellPoint;
		if (!mockData.biography) mockData.biography = '未填写';
		if (!mockData.cat || !mockData.cat.length) mockData.cat = ['未填写'];
		if (!mockData.tags || !mockData.tags.join('').length) mockData.tags = ['未填写'];
		if (!mockData.outline || !mockData.outline.join('').length) mockData.outline = ['未填写'];
		if (!mockData.selfPrice) mockData.selfPrice = '未填写';
		//shit
		if (mockData.cartoonBiography && mockData.cartoonBiography.length && !mockData.cartoonBiography[0].lengendName) mockData.cartoonBiography[0].lengendName = '姓名';

		this.refs.hiddenTransfer.value = JSON.stringify(mockData);
		this.refs.hiddenForm.submit();
	}

	sendMessage(data) {
		let win = this.refs.frame.contentWindow;
		if (win) {
			win.postMessage(data, targetOrigin);
		} else {
			throw 'iframe is not loaded';
		}
	}

	render() {

		return (
			<div className="col-sm-4">
				<div className={ styles.container }>
					<img src={ iphoneImg } className={ styles.iphoneImg } />
					<iframe ref="frame" name="phoneFrame" className={ styles.frame } frameBorder="no" src="about:blank"></iframe>
					<p className={ styles.title }>实时预览</p>
				</div>
				<form style={ {display: 'none'} } method="POST" ref="hiddenForm" target="phoneFrame" action={  targetOrigin + "/mobile/detail?time=" + (+new Date) }>
					<input ref="hiddenTransfer" type="text" name="data" />
				</form>
			</div>
		);
	}

}
