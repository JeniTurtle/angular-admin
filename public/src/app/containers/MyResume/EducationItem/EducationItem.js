/**
 * 教育经历项
 */

import React, {
	Component
} from 'react';

import moment from 'moment';

import PropTypes from 'prop-types';

import styles from './EducationItem.scss';

// 引入教育表单
import EducationForm from '../EducationForm/EducationForm';

// ant-design
import {
	Modal,
} from 'antd';

const confirm = Modal.confirm;	// 确认框

import {
	ConfirmModal,
} from '../../../components';

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
	// education
	changeEducationArrayKeyValueById,
	editEducationById,
	deleteEducationById,
} from '../../../actions/MyResume';

@connect(state => ({
	user: state.get('user'),
	myresume: state.get('myresume'),
}), dispatch => bindActionCreators({
	fetchResumeDetail: fetchResumeDetail.bind(this, dispatch),
	editEducationById: editEducationById.bind(this, dispatch),
	deleteEducationById: deleteEducationById.bind(this, dispatch),
	// education
	changeEducationArrayKeyValueById: changeEducationArrayKeyValueById,
}, dispatch))

export default class EducationItem extends Component {

	// 定义属性类型
	static propTypes = {
		data: PropTypes.object,	// 数据
	};

	// 设置默认属性
	static defaultProps = {
		data: {},
	};

	constructor(props) {
		super(props);

		this.state = {
			isShowDeleteConfirmModal: false,
		}
	}

	componentWillMount() {
	}

	// 教育项 onMouseEnter
	handleEducationItemMouseEnter(educationId) {
		const {
			changeEducationArrayKeyValueById,
		} = this.props;

		// console.log('【handleEducationItemMouseEnter】educationId', educationId);

		changeEducationArrayKeyValueById(educationId, 'hoverStatus', true);
	}

	// 教育项 onMouseLeave
	handleEducationItemMouseLeave(educationId) {
		const {
			changeEducationArrayKeyValueById,
		} = this.props;

		// console.log('【handleEducationItemMouseLeave】educationId', educationId);

		changeEducationArrayKeyValueById(educationId, 'hoverStatus', false);
	}

	// 编辑按钮点击
	handleBtnEditClick() {
		const {
			data,
			changeEducationArrayKeyValueById,
		} = this.props;

		changeEducationArrayKeyValueById(data.id, 'editStatus', true);
	}

	// 删除按钮点击
	handleBtnDeleteClick() {
		const {
			user,
			data,
			deleteEducationById,
		} = this.props;

		const userId = user.get('objectId');

		this.setState({
			isShowDeleteConfirmModal: true,
		});

		// confirm({
		// 	title: '确认删除该教育经历吗？',
		// 	onOk() {
		// 		deleteEducationById(userId, data.id);
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
			deleteEducationById,
		} = this.props;

		const userId = user.get('objectId');
		deleteEducationById(userId, data.id);

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
	handleFormConfirm(educationForm) {
		const {
			user,
			editEducationById,
		} = this.props;

		educationForm.num = educationForm.id;	// 把 educationId 塞到 num 字段里
		educationForm.id = user.get('objectId');	// 把 userId 塞到 id 字段里
		editEducationById(educationForm);	// 编辑教育经历
	}

	// 表单取消事件
	handleFormCancel() {
		const {
			data,
			changeEducationArrayKeyValueById,
		} = this.props;

		changeEducationArrayKeyValueById(data.id, 'editStatus', false);	// 关闭编辑状态
		changeEducationArrayKeyValueById(data.id, 'hoverStatus', false); // 关闭 hover 状态
	}

	render() {

		const {
			myresume,
			data,
		} = this.props;

		const educationArraySize = myresume.get('education').get('array').size;
		// console.log('educationArraySize', educationArraySize);

		// console.log('【educationItem】data', data);

		return <section
			className={styles.educationItem}
			key={data.id}
			onMouseEnter={this.handleEducationItemMouseEnter.bind(this, data.id)}
			onMouseLeave={this.handleEducationItemMouseLeave.bind(this, data.id)}>

			{/* 删除教育经历确认对话框 */}
			{this.state.isShowDeleteConfirmModal &&
			<ConfirmModal tips="确定删除该教育经历吗？"
						  onConfirm={this.handleDeleteConfirmModalConfirmClick.bind(this)}
						  onCancel={this.handleDeleteConfirmModalCancelClick.bind(this)}/>
			}

			{/* 正常状态 */}
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
				<div className={styles.title}>{data.school}</div>
				{/* 类型/票房/职务 */}
				<div className={styles.row2}>
					<div className={styles.item}>{data.major}&nbsp;&nbsp;|&nbsp;&nbsp;</div>
					<div className={styles.item}>{data.certificate}&nbsp;&nbsp;|&nbsp;&nbsp;</div>
					<div className={styles.item}>{data.graduation.split('-')[0]}年毕业</div>
				</div>
			</section>
			}
			{data.editStatus &&
			<EducationForm mode="edit"
						   data={data}
						   onConfirm={this.handleFormConfirm.bind(this)}
						   onCancel={this.handleFormCancel.bind(this)}/>
			}
		</section>;
	}
}
