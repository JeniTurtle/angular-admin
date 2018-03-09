/**
 * Created by waka on 2017/3/31.
 */

/********************************** React ****************************************/

import React, {
	Component,
} from 'react';

import PropTypes from 'prop-types';

// CSS modules
import styles from './BaseInfo.scss';

// 内部组件
import InfoTitle from '../common/InfoTitle/InfoTitle';	// 信息标题
import InfoItem from '../common/InfoItem/InfoItem';	// 信息项
import MagnumOpus from './MagnumOpus/MagnumOpus';	// 代表作品

// 公共组件
import {
	Input,	// 输入框
	RadioGroup,	// 单选项组
	Textarea,	// 文本域
} from '../../../commonComponents';

/********************************** Immutable ****************************************/

import {
	fromJS
} from 'immutable';

import ImmutablePropTypes from 'react-immutable-proptypes';

/**
 * 基本信息
 *
 * 两种状态：只读状态和编辑状态，他们的样式不同
 */
export default class BaseInfo extends Component {

	// 定义属性类型
	static propTypes = {
		isEditStatus: PropTypes.bool,	// 是否是编辑状态
		sex: PropTypes.string,	// 性别
		onSexChange: PropTypes.func,	// 性别切换
		email: PropTypes.string,	// 邮箱
		emailErrorTips: PropTypes.string,	// 邮箱错误提示
		onEmailChange: PropTypes.func,	// 邮箱change
		onEmailError: PropTypes.func,	// 邮箱输入错误
		magnumOpus: ImmutablePropTypes.listOf(PropTypes.object),	// 代表作品
		desc: PropTypes.string,	// 个人简介
		descErrorTips: PropTypes.string,	// 个人简介错误提示
		onDescChange: PropTypes.func,	// 个人简介change
		onDescError: PropTypes.func,	// 个人简介输入错误
		onEditClick: PropTypes.func,	// 编辑按钮点击事件
		onOK: PropTypes.func,	// 确定按钮点击事件
		onCancel: PropTypes.func,	// 取消按钮点击事件
		onDeleteMagnumOpusItem: PropTypes.func,	// 删除代表作品项
		onEditMagnumOpusItem: PropTypes.func,	// 编辑代表作品项
		onAddMagnumOpusItem: PropTypes.func,	// 添加代表作
	};

	// 设置默认属性
	static defaultProps = fromJS({
		isEditStatus: false,
		sex: '',
		email: '',
		emailErrorTips: '',
		magnumOpus: [],
		desc: '',
		descErrorTips: '',
		onEditClick: null,
		onOK: null,
		onCancel: null,
	}).toObject();

	componentWillMount() {
	}

	componentWillUpdate() {
	}

	componentDidUpdate() {
	}

	handleEditBtnClick() {
		if (this.props.onEditClick) {
			this.props.onEditClick();
		}
	}

	handleOKBtnClick() {
		if (this.props.onOK) {
			this.props.onOK();
		}
	}

	handleCancelBtnClick() {
		if (this.props.onCancel) {
			this.props.onCancel();
		}
	}

	render() {

		const sex = this.props.sex;

		let checkedIndex = null;
		if (sex === '女') {
			checkedIndex = 1;
		} else if (sex === '男') {
			checkedIndex = 0;
		}

		return (
			<section className={styles.baseInfo}>

				{/* 基本信息 */}
				{this.props.isEditStatus

					// 编辑状态
					? <div className={styles.editStatus}>
						{/* 标题 */}
						<InfoTitle title="基本信息"/>
						{/* 性别 */}
						<div className={styles.sex}>
							<span>性别：</span>
							<div className={styles.radioGroup}>
								<RadioGroup
									texts={['男', '女']}
									checkedIndex={checkedIndex}
									onChange={(index) => {
										if (this.props.onSexChange) {
											this.props.onSexChange(index);
										}
									}}/>
							</div>
						</div>

						{/* 工作邮箱 */}
						<div className={styles.email}>
							<span>工作邮箱：</span>
							<div className={styles.input}>
								<Input
									borderColor={this.props.emailErrorTips ? '#FF3B30' : null}
									value={this.props.email}
									placeholder="请填写常用邮箱，以免错过重要信息"
									fontSize={16}
									onChange={(text) => {
										if (this.props.onEmailChange) {
											this.props.onEmailChange(text);
										}

									}}
									onError={(isError) => {
										if (this.props.onEmailError) {
											this.props.onEmailError(isError);
										}
									}}/>
								{
									// emall error tips
									this.props.emailErrorTips &&
									<div className={styles.tips}>
										{this.props.emailErrorTips}
									</div>
								}

							</div>
						</div>

						{/* 代表作品 */}
						<div className={styles.magnumOpus}>
							<MagnumOpus
								magnumOpus={this.props.magnumOpus}
								onAddMagnumOpusItem={() => {
									if (this.props.onAddMagnumOpusItem) {
										this.props.onAddMagnumOpusItem();
									}
								}}
								onDelete={(index, magnumOpusItem) => {
									if (this.props.onDeleteMagnumOpusItem) {
										this.props.onDeleteMagnumOpusItem(index, magnumOpusItem);
									}
								}}
								onEdit={(index, magnumOpusItem) => {
									if (this.props.onEditMagnumOpusItem) {
										this.props.onEditMagnumOpusItem(index, magnumOpusItem);
									}
								}}/>
						</div>

						{/* 个人简介 */}
						<div className={styles.personalProfile}>
							<span>个人简介：</span>
							<div className={styles.textarea}>
								<Textarea
									textareaHeight={this.props.desc ? 120 : 40}
									borderColor={this.props.descErrorTips ? '#FF3B30' : null}
									value={this.props.desc}
									maxWordsCount={100}
									placeholder='介绍一下自己，让更多人了解您'
									fontSize={16}
									onChange={(text) => {
										if (this.props.onDescChange) {
											this.props.onDescChange(text);
										}
									}}
									onError={(isError) => {
										if (this.props.onDescError) {
											this.props.onDescError(isError);
										}
									}}/>
								{
									// desc error tips
									this.props.descErrorTips &&
									<div className={styles.tips}>
										{this.props.descErrorTips}
									</div>
								}
							</div>
						</div>

						{/* 按钮组 */}
						<div className={styles.btnGroup}>
							<div className={styles.saveBtn}
								 onClick={this.handleOKBtnClick.bind(this)}>保存
							</div>
							<div className={styles.cancelBtn}
								 onClick={this.handleCancelBtnClick.bind(this)}>取消
							</div>
						</div>

					</div>

					// 只读状态
					: <div className={styles.readOnlyStatus}>
						<InfoTitle title="基本信息"
								   btnText="编辑"
								   onRightClick={this.handleEditBtnClick.bind(this)}/>
						<InfoItem title="性别：" content={this.props.sex}/>
						<InfoItem title="工作邮箱：" content={this.props.email}/>
						{this.props.magnumOpus.size > 0
							? <div className={styles.magnumOpus}>
								<MagnumOpus
									magnumOpus={this.props.magnumOpus}
									isShowAddBtn={false}
									isShowRightBtns={false}
									onAddMagnumOpusItem={() => {
										if (this.props.onAddMagnumOpusItem) {
											this.props.onAddMagnumOpusItem();
										}
									}}
									onDelete={(index) => {
										if (this.props.onDeleteMagnumOpusItem) {
											this.props.onDeleteMagnumOpusItem(index);
										}
									}}
									onEdit={(index) => {
										if (this.props.onEditMagnumOpusItem) {
											this.props.onEditMagnumOpusItem(index);
										}
									}}/>
							</div>
							: <InfoItem title="代表作品：" content="建议您填写，更容易受到影视方的青睐" contentColor="#999BA0"/>
						}
						{this.props.desc
							? <div className={styles.desc}>
								<div className={styles.title}>个人简介：</div>
								<div className={styles.content}>{this.props.desc}</div>
							</div>
							: <InfoItem title="代表作品：" content="介绍一下自己，让更多人了解您" contentColor="#999BA0"/>
						}

					</div>
				}
			</section>
		);
	}
};
