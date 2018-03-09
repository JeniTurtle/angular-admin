import React, {
	Component,
} from 'react';

import PropTypes from 'prop-types';

import {
	render
} from 'react-dom';

import {
	Site,
	Pagination,
	Textfield,
	Selections,
	Tabs,
	Label,
	Tab,
	Confirm,
	Loading
} from '../../components';

import {
	connect
} from 'react-redux';

import {
	showWarning
} from '../../actions/Popups';

import Modal from 'react-bootstrap/lib/Modal';
import Button from 'react-bootstrap/lib/Button';
import FormControl from 'react-bootstrap/lib/FormControl';

import {
	fetchHistories,
	updateHistory,
	addHistory,
	deleteHistory
} from '../../actions/HTTP';
import styles from './HistoryList.scss';

import validation from '../../utils/validation';

import emptyHolder from './empty.png';

const pageCount = 20;

const textWorkType = ['电影剧本','电视剧本','网剧剧本','网络大电影剧本', '长篇小说', '中篇小说', '短篇小说', '真实故事'];
const cartoonWorkType = ['长篇漫画', '中篇漫画', '短篇漫画'];

@connect(state => ({
	histories: state.histories
}))

export default class HistoryList extends Component {

	constructor(props) {

		super();

		this.state = {
			modalShow: false,
			modalWorkType: '',
			modalTitle: '',
			modalPublisher: '',
			modalPublishTime: '',
			modalTransType: '',
			modalTransTitle: '',
			modalTransTime: '',

			confirmShow: false,

			pn: 0
		}

	}

	componentWillMount() {
		const {
			dispatch
		} = this.props;

		dispatch(fetchHistories(dispatch, 0, pageCount));
	}

	shouldComponentUpdate(nextProps, nextState) {

		const messageProps = {
			loadingState: ['作品列表加载中', '作品列表加载成功', '作品列表加载失败'],
			proccessingAddHistory: ['作品添加中', '作品添加成功', '作品添加失败'],
			proccessingUpdateHistory: ['作品信息更新中', '作品信息更新成功', '作品信息更新失败'],
			processingDelHistory: ['作品删除中', '作品删除成功', '作品删除失败']
		};

		const messageKeys = Object.keys(messageProps);

		const {
			dispatch,
			histories
		} = this.props;

		messageKeys.forEach(function(item) {

			if (nextProps.histories.get(item) != histories.get(item)) {

				switch (nextProps.histories.get(item)) {

					case 'start':
						dispatch(showWarning(messageProps[item][0], 'warning'), -1);
						return;
					case 'success':
						dispatch(showWarning(messageProps[item][1], 'success'));
						return;
					case 'fail':
						dispatch(showWarning(messageProps[item][2], 'danger'));
						return;

				}

			}

		});

		return true;

	}

	update = (key, value) => {

		this.setState({
			[key]: value
		});

	}

	handleAdd = () => {
		this.setState({
			modalShow: true,
			modalWorkType: '',
			modalTitle: '',
			modalPublisher: '',
			modalPublishTime: '',
			modalTransType: '',
			modalTransTitle: '',
			modalTransTime: ''
		});
	}

	handleEdit = index => {
		const {
			histories
		} = this.props;

		const history = histories.get('list').get(index);
		let newStates = {};
		history.map((item, i) => newStates['modal' + i[0].toUpperCase() + i.substr(1)] = item)

		this.setState(Object.assign(newStates, {
			modalShow: true,
			modalId: history.hisworksId
		}));
	}

	handleRemove = index => {
		const {
			histories
		} = this.props;

		this.setState({
			confirmShow: true,
			modalId: histories.get('list').get(index).get('hisworksId')
		});
	}

	close = () => {
		this.setState({
			modalShow: false
		});
	}

	save = () => {

		const {
			modalId,
			modalWorkType,
			modalTitle,
			modalPublisher,
			modalPublishTime,
			modalTransType,
			modalTransTitle,
			modalTransTime,

			pn
		} = this.state;

		const strategy = {

			modalWorkType: {
				required: true,
				name: '作品类型'
			},

			modalTitle: {
				required: true,
				name: '作品名称',
				maxLength: 15
			},

			modalPublisher: {
				required: true,
				name: '发行方'
			}

		};

		const {
			dispatch
		} = this.props;

		const validationResult = validation(strategy, this.state);

		if (validationResult.length) {

			dispatch(showWarning(validationResult[0], 'danger'));

			return false;
		}

		this.close();

		const savedContent = {
			workType: modalWorkType,
			title: modalTitle,
			publisher: modalPublisher,
			publishTime: modalPublishTime,
			transType: modalTransType,
			transTitle: modalTransTitle,
			transTime: modalTransTime
		}

		if (modalId) {
			dispatch(updateHistory(dispatch, modalId, savedContent, pn, pageCount));
		} else {
			dispatch(addHistory(dispatch, savedContent, pn, pageCount));
		}


	}

	closeConfirm = () => {
		this.setState({
			confirmShow: false
		});
	}

	okConfirm = () => {

		const {
			dispatch
		} = this.props;

		const {
			modalId,
			pn
		} = this.state;

		this.closeConfirm();
		dispatch(deleteHistory(dispatch, modalId, pn, pageCount));
	}

	load = p => {
		const {
			dispatch
		} = this.props;

		const {
			pn
		} = this.state;

		dispatch(fetchHistories(dispatch, p === undefined ? pn : p - 1, pageCount));
		this.setState({
			pn: p === undefined ? pn : p - 1
		});
	}

	render() {

		const {
			histories
		} = this.props;

		const self = this;

		const {
			modalId,
			modalShow,
			modalWorkType,
			modalTitle,
			modalPublisher,
			modalPublishTime,
			modalTransType,
			modalTransTitle,
			modalTransTime,

			pn,

			confirmShow
		} = this.state;

		const whetherOK = histories && histories.get('loadingState') == 'success';

		const selectType = textWorkType.indexOf(modalWorkType) > -1 ? 0 : (cartoonWorkType.indexOf(modalWorkType) > -1 ? 1 : -1);

		return (
			<div className={ styles.container }>

				<Site />
				<div className={ styles.ctrl }>
					<b>代表作品</b>
					<span className={ styles.add } onClick={ this.handleAdd }>添加代表作品</span>
				</div>
				{
					whetherOK ?
					<div>

						{ histories.get('list').filter(h => h.get('status') < 3).length > 0 ? histories.get('list').filter(h => h.get('status') < 3).map((h, index) =>
							<div key={ index } className={ styles.history }>
								<h2>{ h.get('title') }</h2>
								<p><b>作品类型：</b>{ h.get('workType') }</p>
								<p><b>发行时间：</b>{ h.get('publishTime') }</p>
								<p><b>发 行 方：</b>{ h.get('publisher') }</p>
								<p><b>审核状态：</b>{ h.get('status') == 0 ? '审核中' : ( h.get('status') == 1 ? '通过' : '失败' + (h.get('reason') ? '（原因：' + h.get('reason') + '）' : '') ) }</p>
								<div onClick={ self.handleEdit.bind(self, index) } className={ styles.edit }>编辑</div>
								<div onClick={ self.handleRemove.bind(self, index) } className={ styles.remove }>删除</div>
							</div>
						) : <div className={ styles.emptyHolder }>
							<img src={ emptyHolder } />
						</div> }

						{
							histories.get('totalCount') > pageCount && <Pagination pageCount={ pageCount } handleTurn={ this.load } total={ histories.get('totalCount') } curPage={ pn + 1 }/>
						}

						<Modal show={ modalShow } className={ styles.modal } onHide={ this.close }>
							<Modal.Header closeButton>
								<Modal.Title>添加代表作品</Modal.Title>
							</Modal.Header>
							<Modal.Body>
								<Label required={ true }>作品类型</Label>
								<Tabs tabs={ ['文学作品', '漫画作品'] } values={ [0, 1] } selected={ selectType } name="workType">
									<Tab>
										<Selections selections={ textWorkType } value={ modalWorkType } onChange={ value => this.update('modalWorkType', value) }/>
									</Tab>
									<Tab>
										<Selections selections={ cartoonWorkType } value={ modalWorkType } onChange={ value => this.update('modalWorkType', value) }/>
									</Tab>
								</Tabs>
								<Textfield required={ true } label="作品名称" value={ modalTitle } onChange={ value => this.update('modalTitle', value) } maxLength={ 15 }/>
								<Textfield required={ true } label="出版方（包括文学网站）" value={ modalPublisher } onChange={ value => this.update('modalPublisher', value) }/>
								<Textfield required={ true } label="发行时间（包括连载时间段）" value={ modalPublishTime } onChange={ value => this.update('modalPublishTime', value) }/>
								<Textfield label="改编形式" value={ modalTransType } onChange={ value => this.update('modalTransType', value) }/>
								<Textfield label="改编作品名称" value={ modalTransTitle } onChange={ value => this.update('modalTransTitle', value) }/>
								<Textfield label="改编上映时间" value={ modalTransTime } onChange={ value => this.update('modalTransTime', value) }/>
							</Modal.Body>
							<Modal.Footer>
								<Button className="ok" onClick={ this.save }>提交审核</Button>
								<Button onClick={ this.close }>取消</Button>
							</Modal.Footer>
						</Modal>

						<Confirm title="确认删除作品" content="确认删除该作品信息么？该操作不可撤销！" closeText="取消" okText="确认" show={ confirmShow } onClose={ this.closeConfirm } onOK={ this.okConfirm }/>
					</div>
					:
					<div>
						<div className={ styles.loadingContainer }><Loading /></div>
					</div>
				}
			</div>
		);

	}

}
