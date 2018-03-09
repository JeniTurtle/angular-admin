/**
 * Created by waka on 2017/4/5.
 */

/********************************** React ****************************************/

import React, {
	Component,
} from 'react';

import PropTypes from 'prop-types';

// CSS modules
import styles from './ModalAddMagnumOpusItem.scss';

// 公共组件
import {
	Modal,	// 模态框
} from '../../../commonComponents';

// 引入代表作品表单
import HisworkForm from './HisworkForm/HisworkForm';

/********************************** Redux ****************************************/

import {
	bindActionCreators
} from 'redux';

import {
	connect
} from 'react-redux';

// 引入action
import {
	addHistory,	// 创建代表作品
	updateHistory,	// 更新代表作品
} from '../../../actions/HTTP';

import {	// 弹出层
	showWarning,
} from '../../../actions/Popups';

import {
	setModalAddRepresentativeWorksError,	// 设置添加代表作品对话框错误
	setModalAddRepresentativeWorksData,	// 设置添加代表作品对话框数据
} from '../../../actions/PersonalInfo';

@connect(state => ({
	user: state.get('user'),
	personalInfo: state.get('personalInfo'),
}), dispatch => bindActionCreators({
	addHistory: addHistory.bind(this, dispatch),
	updateHistory: updateHistory.bind(this, dispatch),
	setModalAddRepresentativeWorksError,
	setModalAddRepresentativeWorksData,
	showWarning,
}, dispatch))

/**
 * 添加代表作品对话框
 */
export default class ModalAddMagnumOpusItem extends Component {

	// 定义属性类型
	static propTypes = {
		type: PropTypes.string,	// 类型：添加 add , 还是编辑 edit
		hisworkIndex: PropTypes.number,	// index
		hisworkItemData: PropTypes.object,	// 代表作品列表数据
		isShow: PropTypes.bool,	// 是否显示
		onOK: PropTypes.func,	// 确定
		onCancel: PropTypes.func,	// 取消
		onAddHiswork: PropTypes.func,	// 添加代表项
		isShowAddHiswork: PropTypes.bool,	// 是否显示添加代表作按钮
	};

	// 设置默认属性
	static defaultProps = {
		type: 'add',
		hisworkIndex: 1,
		hisworkItemData: {},
		isShow: false,
		onOK: null,
		onCancel: null,
		onAddHiswork: null,
		isShowAddHiswork: true,
	};

	constructor() {
		super();

		// 要提交的表单数据
		this.formData = {
			title: '',
			workType: '',
			publisher: '',
			publishTime: '',
			achievement: '',
		};
		this.isTitleError = false;
		this.isPublishError = false;
		this.isAchievementError = false;

		this.state = {
			hisworkForms: [null],	// 代表作品表单们，先扔进去一个值
			errorTips: '',	// 错误提示
			titleErrorTips: '',
			publisherErrorTips: '',
			achievementErrorTips: '',
		}
	}

	/**
	 * 确定
	 */
	handleConfirm() {

		// 获得 ability 字段和 type 字段
		const ability = this.props.user.get('ability');
		const type = this.props.user.get('type');
		// console.log('ability', ability);
		// console.log('type', type);

		// 判断该用户是否是 机构
		if (ability >= 1 && type === 2) {
			const username = this.props.user.get('username');
			this.props.setModalAddRepresentativeWorksData({
				author: username
			});
		}

		const modalAddRepresentativeWorksData = this.props.personalInfo.get('modalAddRepresentativeWorksData');
		// console.log('添加代表作品对话框数据 modalAddRepresentativeWorksData', modalAddRepresentativeWorksData);

		// 如果代表作品为空
		if (!modalAddRepresentativeWorksData) {
			this.props.setModalAddRepresentativeWorksData({});	// 创建新的代表作品
			this.props.setModalAddRepresentativeWorksError('请填写标题', 1);	// 错误提示
			return;
		}

		// 判断为空
		if (!modalAddRepresentativeWorksData.title) {
			this.props.setModalAddRepresentativeWorksError('请填写标题', 1);
			return;
		}
		if (!modalAddRepresentativeWorksData.workType) {
			this.props.setModalAddRepresentativeWorksError('请选择类别', 2);
			return;
		}
		if (!modalAddRepresentativeWorksData.publisher) {
			this.props.setModalAddRepresentativeWorksError('请填写出版社/首发网站/发行方', 3);
			return;
		}

		// 判断字数是否超标
		if (this.isTitleError) {
			this.props.setModalAddRepresentativeWorksError('标题字数过多', 1);
			return;
		}
		if (this.isPublishError) {
			this.props.setModalAddRepresentativeWorksError('出版社/首发网站/发行方字数过多', 4);
			return;
		}
		if (this.isAchievementError) {
			this.props.setModalAddRepresentativeWorksError('获得成就字数过多', 5);
			return;
		}

		// 如果hisworksId存在
		if (modalAddRepresentativeWorksData.hisworkId) {
			// 更新
			this.props.updateHistory(modalAddRepresentativeWorksData.hisworkId, modalAddRepresentativeWorksData);
		} else {
			// 添加
			this.props.addHistory(modalAddRepresentativeWorksData);
		}

	}

	/**
	 * 取消
	 */
	handleCancel() {
		if (this.props.onCancel) {
			this.props.onCancel();
		}
	}

	componentWillMount() {
		// 当传进来的hisworkItemData不为空 并且 state中hisworkForms的第一个值为null时
		if (this.props.hisworkItemData !== {} && this.state.hisworkForms[0] === null) {
			let hisworkForms = [this.props.hisworkItemData];
			this.setState(() => {
				return {
					hisworkForms: hisworkForms
				}
			})
		}
	}

	render() {

		const {
			hisworkItemData
		} = this.props;

		// 初始化提交数据
		if (!this.formData.title && hisworkItemData) {
			this.formData.title = hisworkItemData.title;
		}
		if (!this.formData.workType && hisworkItemData) {
			this.formData.workType = hisworkItemData.workType;
		}
		if (!this.formData.publisher && hisworkItemData) {
			this.formData.publisher = hisworkItemData.publisher;
		}
		if (!this.formData.publishTime && hisworkItemData) {
			this.formData.publishTime = hisworkItemData.publishTime;
		}
		if (!this.formData.achievement && hisworkItemData) {
			this.formData.achievement = hisworkItemData.achievement;
		}

		const modalAddRepresentativeWorksError = this.props.personalInfo.get('modalAddRepresentativeWorksError');
		// console.log('添加代表作品对话框错误 modalAddRepresentativeWorksError', modalAddRepresentativeWorksError);

		return (
			<Modal
				isShow={this.props.isShow}
				title={this.props.type === 'add'
					? "增加代表作品"
					: "编辑代表作品"
				}
				content="请填写您的主要代表作品，历史编剧作品更佳（可填写无署名权的历史编剧作品）"
				errorTips={modalAddRepresentativeWorksError && modalAddRepresentativeWorksError.errorTips}
				width={660}
				onOK={this.handleConfirm.bind(this)}
				onCancel={this.handleCancel.bind(this)}>
				<section
					className={styles.hisworksForm}
					// 当代表作品项大于1时再让其滚动，解决下拉select被遮盖的问题
					style={{
						maxHeight: this.state.hisworkForms instanceof Array && this.state.hisworkForms.length > 1 ? 506 + 'px' : null,
						overflowY: this.state.hisworkForms instanceof Array && this.state.hisworkForms.length > 1 ? 'scroll' : 'inherit'
					}}>
					{this.state.hisworkForms instanceof Array && this.state.hisworkForms.map((hisworkItemData, index) => {
						return <HisworkForm
							key={index}
							hisworkIndex={this.props.type === 'add' ? null : this.props.hisworkIndex}
							hisworkItemData={this.props.type === 'edit' ? hisworkItemData : null}
							onChange={(formData) => {
								this.formData = formData;
							}}
							onError={(errorTips, isError) => {
								this.setState(() => {
									return {
										errorTips: isError ? errorTips : ''
									}
								});
							}}
							titleErrorTips={this.state.titleErrorTips}
							onTitleError={(errorTips, isError) => {
								this.isTitleError = isError;
							}}
							publisherErrorTips={this.state.publisherErrorTips}
							onPublishError={(errorTips, isError) => {
								this.isPublishError = isError;
							}}
							achievementErrorTips={this.state.achievementErrorTips}
							onAchievementError={(errorTips, isError) => {
								this.isAchievementError = isError;
							}}
						/>
					})}
				</section>

				{/* 添加代表作 */}
				{/*<div className={styles.addMagnumOpusItem}>*/}
				{/*<div className={styles.button}*/}
				{/*onClick={this.handleAddHiswork.bind(this)}>*/}
				{/*添加代表作*/}
				{/*</div>*/}
				{/*</div>*/}

			</Modal>
		);
	}
};
