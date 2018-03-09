/**
 * 代表作品项
 */

import React, {
	Component
} from 'react';

import moment from 'moment';

import PropTypes from 'prop-types';

import styles from './WorkItem.scss';

// 引入代表作品表单
import WorkForm from '../WorkForm/WorkForm';

// ant-design
import {
	Modal,
} from 'antd';

// 自定义模态框
import {
	ConfirmModal,
} from '../../../components';

const confirm = Modal.confirm;	// 确认框

// redux
import {
	bindActionCreators
} from 'redux';

import {
	connect
} from 'react-redux';

// action
import {
	// global
	fetchResumeDetail,
	// work
	changeWorksArrayKeyValueById,
	editWorkById,
	deleteWorkById,
} from '../../../actions/MyResume';

@connect(state => ({
	user: state.get('user'),
	myresume: state.get('myresume'),
}), dispatch => bindActionCreators({
	fetchResumeDetail: fetchResumeDetail.bind(this, dispatch),
	editWorkById: editWorkById.bind(this, dispatch),
	deleteWorkById: deleteWorkById.bind(this, dispatch),
	// works
	changeWorksArrayKeyValueById: changeWorksArrayKeyValueById,
}, dispatch))

export default class WorkItem extends Component {

	// 定义属性类型
	static propTypes = {
		data: PropTypes.object,	// 数据
	};

	// 设置默认属性
	static defaultProps = {
		data: {
			content: {},
		},
	};

	constructor(props) {
		super(props);

		this.state = {
			isShowDeleteConfirmModal: false,	// 是否显示删除确认模态框
		};
	}

	componentWillMount() {
	}

	// 代表作品项 onMouseEnter
	handleWorkItemMouseEnter() {
		const {
			data,
			changeWorksArrayKeyValueById,
		} = this.props;

		// console.log('【handleWorkItemMouseEnter】educationId', educationId);

		changeWorksArrayKeyValueById(data.id, 'hoverStatus', true);
	}

	// 代表作品项 onMouseLeave
	handleWorkItemMouseLeave() {
		const {
			data,
			changeWorksArrayKeyValueById,
		} = this.props;

		// console.log('【handleWorkItemMouseLeave】educationId', educationId);

		changeWorksArrayKeyValueById(data.id, 'hoverStatus', false);
	}

	// 编辑按钮点击
	handleBtnEditClick() {
		// console.log('handleBtnEditClick');

		const {
			data,
			changeWorksArrayKeyValueById,
		} = this.props;

		changeWorksArrayKeyValueById(data.id, 'editStatus', true);
	}

	// 删除按钮点击
	handleBtnDeleteClick() {
		const {
			user,
			data,
			deleteWorkById,
		} = this.props;

		const userId = user.get('objectId');

		this.setState({
			isShowDeleteConfirmModal: true,
		});

		// confirm({
		// 	title: '确认删除该代表作品吗？',
		// 	onOk() {
		// 		deleteWorkById(userId, data.id);
		// 	},
		// 	onCancel() {
		// 	}
		// });
	}

	// 删除确认对话框确认点击事件
	handleDeleteConfirmModalConfirmClick() {
		const {
			user,
			data,
			deleteWorkById,
		} = this.props;

		const userId = user.get('objectId');
		deleteWorkById(userId, data.id);

		this.setState({
			isShowDeleteConfirmModal: false,
		});
	}

	// 删除确认对话框取消点击事件
	handleDeleteConfirmModalCancelClick() {
		this.setState({
			isShowDeleteConfirmModal: false,
		});
	}

	// 表单确认事件
	handleFormConfirm(workForm) {
		const {
			data,
			user,
			editWorkById,
		} = this.props;

		const userId = user.get('objectId');	// userId

		editWorkById({
			id: userId,
			num: data.id,
			content: JSON.stringify(workForm),
		});	// 编辑教育经历
	}

	// 表单取消事件
	handleFormCancel() {
		const {
			data,
			changeWorksArrayKeyValueById,
		} = this.props;

		changeWorksArrayKeyValueById(data.id, 'editStatus', false);	// 关闭编辑状态
		changeWorksArrayKeyValueById(data.id, 'hoverStatus', false); // 关闭 hover 状态
	}

	render() {

		const {
			myresume,
			data,
		} = this.props;

		const worksArraySize = myresume.get('works').get('array').size;
		// console.log('worksArraySize', worksArraySize);

		// console.log('【workItem】data', data);

		// 需要展示的内容
		let time = '';	// 时间
		let resultType = data.content.workType;	// 类别;根据数据自动进行判断，采用最详细的
		let resultNum = '';	// 具有说服力的数字

		// 一系列判断逻辑
		if (data.content.workType === '已上映剧本') {
			time = data.content.workShowDate;	// 上映日期
			if (data.content.workShowType === '院线电影') {
				resultType = data.content.workShowType;	// 上映形式
				if (data.content.workBoxOffice) {
					resultNum = '票房' + data.content.workBoxOffice;	// 票房（选填）
				}
				if (data.content.workRole !== '暂不填写') {
					resultNum += (data.content.workBoxOffice ? '，' : '') + '出任' + data.content.workRole;
				}
			}
			if (data.content.workShowType === '电视剧') {
				resultType = data.content.workShowType;	// 上映形式
				resultNum = '主要播放平台：' + data.content.workMainPlayPlatform;	// 主要播放平台
				if (data.content.workAudienceRating) {
					resultNum += '，收视率' + data.content.workAudienceRating;	// 收视率（选填）
				}
				if (data.content.workRole !== '暂不填写') {
					resultNum += '，出任' + data.content.workRole;
				}
			}
			if (data.content.workShowType === '网络大电影' || data.content.workShowType === '网剧') {
				resultType = data.content.workShowType;		// 上映形式
				resultNum = '主要播放平台：' + data.content.workMainPlayPlatform;	// 主要播放平台
				if (data.content.workPlayAmount) {
					resultNum += '，播放量' + data.content.workPlayAmount;	// 播放量（选填）
				}
				if (data.content.workRole !== '暂不填写') {
					resultNum += '，出任' + data.content.workRole;
				}
			}
		}
		if (data.content.workType === '即将上映剧本') {
			time = data.content.workExpectedShowDate;	// 预计上映日期
			resultType = data.content.workShowType;	// 上映形式
			resultNum = '即将上映';
			if (data.content.workRole !== '暂不填写') {
				resultNum += '，出任' + data.content.workRole;
			}
		}
		if (data.content.workType === '获奖/成交剧本') {
			resultType = data.content.workPlayType + '剧本';	// 剧本类别
			resultNum = data.content.workAwardsOrDealDetail;	// 担任角色
		}
		if (data.content.workType === '出版作品') {
			time = data.content.workFirstPublishDate;	// 首次发行时间
			resultNum = '出版社：' + data.content.workPublisher;
			if (data.content.workISBN) {
				resultNum += '，ISBN：' + data.content.workISBN;	// ISBN号（选填）
			}
			if (data.content.workCirculation) {
				resultNum += '，发行量' + data.content.workCirculation;	// 发行量（选填）
			}
		}
		if (data.content.workType === '网络文学') {
			time = data.content.workFirstOutsideDate;	// 首次发表时间
			resultNum = '首发网站：' + data.content.workFirstPubWebsite;	// 首发网站
			if (data.content.workClickRate) {
				resultNum += '，点击量' + data.content.workClickRate;	// 点击量
			}
		}
		if (time) {
			const timeArray = time.split('-');
			time = timeArray[0] + '年' + timeArray[1].replace(/^0/, '') + '月';
		}

		return <section
			className={styles.workItem}
			key={data.id}
			onMouseEnter={this.handleWorkItemMouseEnter.bind(this, data.id)}
			onMouseLeave={this.handleWorkItemMouseLeave.bind(this, data.id)}>

			{/* 删除确认对话框 */}
			{this.state.isShowDeleteConfirmModal &&
			<ConfirmModal tips="确定删除该代表作品吗？"
						  onConfirm={this.handleDeleteConfirmModalConfirmClick.bind(this)}
						  onCancel={this.handleDeleteConfirmModalCancelClick.bind(this)}/>
			}

			{/* 正常形态 */}
			{!data.editStatus &&
			<section className={styles.normal}>
				{/* 按钮栏，根据 redux 里的 hoverStatus 来判断是否显示编辑栏 */}
				{data.hoverStatus &&
				<section className={styles.btnRow}>
					<div className={styles.btnEdit}
						 onClick={this.handleBtnEditClick.bind(this)}>
						<i className="iconfont icon-bianji1"
						   style={{
							   marginRight: '5px',
							   fontSize: '12px'
						   }}/>
						编辑
					</div>
					<div className={styles.btnDelete}
						 onClick={this.handleBtnDeleteClick.bind(this)}>
						<i className="iconfont icon-shanchu"
						   style={{
							   marginRight: '5px',
							   fontSize: '12px'
						   }}/>
						删除
					</div>
				</section>
				}
				{/* 标题 */}
				<div className={styles.title}>{time ? time + ' ——' : ''}《{data.content.workTitle}》</div>
				{/* 类型/票房/职务 */}
				<div className={styles.row2}>
					{resultType}&nbsp;&nbsp;|&nbsp;&nbsp;{resultNum}
					{/*{resultType &&*/}
					{/*<div className={styles.item}>{resultType}</div>*/}
					{/*}*/}
					{/*{resultNum &&*/}
					{/*<div className={styles.item}>{resultNum}</div>*/}
					{/*}*/}
				</div>
				{/* 描述 */}
				<div className={styles.desc}>{data.content.workDesc}
				</div>
			</section>
			}
			{data.editStatus &&
			<WorkForm mode="edit"
					  data={data}
					  onConfirm={this.handleFormConfirm.bind(this)}
					  onCancel={this.handleFormCancel.bind(this)}/>
			}
		</section>;
	}
}
