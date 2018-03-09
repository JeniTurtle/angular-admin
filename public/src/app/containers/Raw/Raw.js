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
import {
	bindActionCreators
} from 'redux';
import {
	push
} from 'react-router-redux';
import {
	Map
} from 'immutable';
import {
	getPathFromLocation
} from '../../utils/funcs';
import {
	createIP,
	updateIP
} from '../../actions/HTTP';
import {
	showWarning,
	showToast
} from '../../actions/Popups';
import detailDefaultProps from '../IPDetail/defaultProps';
import {
	update
} from '../../actions/IPInfo';
import styles from './Raw.scss';
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
	Progress
} from '../../components';
import IPDetail from '../IPDetail/IPDetail';

@connect(state => state.get('ipInfo').set('user', state.get('user')).toObject(), dispatch => bindActionCreators({
	createIP: createIP.bind(this, dispatch),
	updateIP: updateIP.bind(this, dispatch),
	update,
	push,
	showWarning,
	showToast
}, dispatch))

export default class Raw extends Component {

	static get defaultProps() {
		return {
			rawFile: '',
			title: ''
		};
	}

	static propTypes = {
		rawFile: PropTypes.string,
		title: PropTypes.string
	}

	constructor(props) {
		super(props);

		const {
			location
		} = props;

		this.isPureRaw = getPathFromLocation(location) === 'praw';
	}

	componentWillMount() {

		const {
			update,
			workType,
			fetchIP,
			push,
			showWarning,
			publishedIp,
			title
		} = this.props;

		if (!workType) {
			push('/');
		}

		!!publishedIp && showWarning('温馨提示：作品已展示在云莱坞平台，修改信息后仅保存并不会更新展示，<b style="color: red">如需更新展示请再次提交审核！</b>', 'warning', -1);

		document.title = '编辑-' + title;

		window.scrollTo(0, 0);

	}

	getId = () => {
		const {
			params,
			objectId
		} = this.props;
		return params && params.id || objectId;
	}

	isCartoon = () => {
		const {
			workType
		} = this.props;

		const cartoonWorkType = ['长篇漫画', '中篇漫画', '短篇漫画'];

		return cartoonWorkType.indexOf(workType) > -1;
	}

	next = () => {
		const {
			rawFile,
			showWarning
		} = this.props;

		if (rawFile || (!this.isPureRaw && window.channel !== 'newwriter' && IPDetail.validateDetail(this.props).length == 0)) {
			this.commit();
		} else {
			showWarning('原文不能为空', 'danger');
		}
	}

	commit = () => {


		const {
			push,
			updateIP,
			showToast,
			rawFile,
			update,
			user
		} = this.props;

		showToast('提交中', 'loading');

		updateIP(this.getId(), this.isPureRaw ? Object.assign({
			rawFile
		}, {
			biographies: [],
			outline: [],
			probation: '',
			cartoonProbation: [],
			cartoonBiography: [],
			biography: ''
		}) : {
			rawFile
		}, true, user.get('authState') != 'authed').then(suc => {
			if (suc) {
				// showToast('提交成功', 'success');
				showToast('保存中', 'loading', 1);
				push('/done/' + this.getId());

			} else {
				showToast('提交失败', 'fail');
			}

		}, () => {
			showToast('提交失败', 'fail');
		});
	}

	onChange = (link, file) => {
		const {
			update
		} = this.props;

		update('rawFile', link);
		update('rawFileChange', true)
	}

	render() {

		const {
			rawFile,
			title,
			update
		} = this.props;

		const allowTypes = this.isCartoon() ? ['pdf', 'zip'] : ['doc', 'docx', 'pdf', 'txt'];

		return (
			<div className={ styles.container + ' clearfix' }>
				<Progress step={ 2 } GG={ this.isPureRaw ? "/ipdetail/" + this.getId() : false }/>
				<div className={ styles.form + ' clearfix' }>
					<div className="clearfix">
						<div className="col-sm-2">
							<Label style={{ fontSize: '16px' }} required={ this.isPureRaw ? true : false }>上传原文</Label>
						</div>
						<div className="col-sm-10 clearfix">
							<Uploader maxSize={ 50000000 } file={ rawFile } displayName={ title } buttonName="上传原文" retryName="重新上传" tips={ '仅支持' + allowTypes.join('、') + '，大小50M以内' } onChange={ this.onChange } types={ allowTypes }/>
						</div>
					</div>
					{ window.channel == 'newwriter' && <p style={{ color: '#777', padding: '5px 14px'}}>温馨提示：参加新编剧大赛的作品需要具备原文</p> }
					<div className={ styles.done } onClick={ this.next }>提交审核</div>
					{ /* (!this.isPureRaw && window.channel !== 'newwriter') && <div className={ styles.tmpDone } onClick={ this.commit }>提交审核，以后再传</div> */ }
					<Link className={ styles.pre } to={ "/ipdetail/" + this.getId() }>&lt;返回上一步</Link>
				</div>
			</div>
		);
	}
}
