/**
 * 代表作品表单
 */

import React, {
	Component
} from 'react';

import moment from 'moment';

import PropTypes from 'prop-types';

import styles from './WorkForm.scss';

// ant-design
import {
	DatePicker,	// 日期控件
	Input,	// 输入框控件
	Select,	// 选择器控件（其实就是下拉菜单）
} from 'antd';

// util
import {
	getLengthOfStringRemoveSpecialChar,
} from '../../../utils/stringUtil';
import {
	filterEmojiObj,
} from '../../../utils/emojiUtil';
import {
	removeHeadTailSpaceObject,
} from '../../../utils/regExp';

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
	formItemErrorTips,
	// HTTP
	fetchResumeDetail,
	// works
	changeWorksAddStatus,
} from '../../../actions/MyResume';

@connect(state => ({
	user: state.get('user'),
	myresume: state.get('myresume'),
}), dispatch => bindActionCreators({
	formItemErrorTips: formItemErrorTips,
	// http
	fetchResumeDetail: fetchResumeDetail.bind(this, dispatch),
	// works
	changeWorksAddStatus: changeWorksAddStatus,
}, dispatch))

export default class WorkForm extends Component {

	// 定义属性类型
	static propTypes = {
		mode: PropTypes.string,	// 模式: add/edit 添加/编辑
		data: PropTypes.object,	// 数据
		onConfirm: PropTypes.func,	// 确定时间回调
		onCancel: PropTypes.func,	// 取消事件回调
	};

	// 设置默认属性
	static defaultProps = {
		mode: 'add',	// 默认添加
		data: {
			content: {},
		},
		onConfirm: null,
		onCancel: null,
	};

	constructor(props) {
		super(props);

		// 代表作品表单
		this.workForm = {
			// 必填项
			workType: '',	// 作品形式
			workTitle: '',	// 作品标题
			workDesc: '',	// 作品描述

			// 已上映剧本
			workShowType: '',	// 上映形式
			workRole: '',	// 担任角色
			workShowDate: '',	// 上映日期
			workMainPlayPlatform: '',	// 主要播放平台
			workBoxOffice: '',	// 票房（选填）
			workAudienceRating: '',	// 收视率（选填）
			workPlayAmount: '',	// 播放量（选填）

			// 即将上映日期
			workExpectedShowDate: '',	// 预计上映日期

			// 获奖/成交剧本
			workPlayType: '',	// 剧本类别
			workAwardsOrDealDetail: '',	// 获得奖项或交易详情

			// 出版作品
			workFirstPublishDate: '',	// 首次发行时间
			workPublisher: '',	// 出版社
			workISBN: '',	// ISBN 号（选填）
			workCirculation: '',	// 发行量（选填）

			// 网络文学
			workFirstOutsideDate: '',	// 首次发表时间
			workFirstPubWebsite: '',	// 首发网站
			workClickRate: '',	// 点击量（选填）
		};

		this.state = {
			workType: '',	// 作品形式是联动的基础，所以需要放在 state 里
			workShowType: '',
		};
	}

	componentWillMount() {
		const {
			data,
		} = this.props;

		this.workForm = data.content;
		this.setState(() => {
			return {
				workType: data.content.workType
			}
		});

		if (data.content.workShowType) {
			this.setState(() => {
				return {
					workShowType: data.content.workShowType
				}
			});
		}
	}

	// 全局

	// 清空表单项错误提示
	_clearFormItemErrorTips() {
		const {
			myresume,
			formItemErrorTips,
		} = this.props;

		// 获得错误提示表单项ID
		const formId = myresume.get('formItemError').get('formId');	// 表单ID

		// 如果该表单项ID存在，清空表单项错误提示
		if (formId) {
			formItemErrorTips('', '');
		}
	}

	// 作品形式 change
	handleWorkTypeChange(value) {
		// 清空表单项错误提示
		this._clearFormItemErrorTips();

		this.workForm.workType = value;
		this.setState({
			workType: value,
		});
	}

	// 作品标题 change
	handleWorkTitleChange(e) {
		// 清空表单项错误提示
		this._clearFormItemErrorTips();

		this.workForm.workTitle = e.target.value;
	}

	// 作品描述 change
	handleWorkDescChange(e) {
		// 清空表单项错误提示
		this._clearFormItemErrorTips();

		this.workForm.workDesc = e.target.value;
	}

	// ******** 已上映剧本 ******* //

	// 上映形式 change
	handleWorkShowTypeChange(value) {
		// 清空表单项错误提示
		this._clearFormItemErrorTips();

		this.workForm.workShowType = value;
		this.setState({
			workShowType: value,
		});
	}

	// 担任角色 change
	handleWorkRoleChange(value) {
		// 清空表单项错误提示
		this._clearFormItemErrorTips();

		this.workForm.workRole = value;
	}

	// 上映日期 change
	handleWorkShowDateChange(date, dateString) {
		// 清空表单项错误提示
		this._clearFormItemErrorTips();

		this.workForm.workShowDate = dateString;
		// console.log('【handleGraduationChange】 date', date, 'dateString', dateString);
	}

	// 主要播放平台 change
	handleWorkMainPlayPlatformChange(e) {
		// 清空表单项错误提示
		this._clearFormItemErrorTips();

		this.workForm.workMainPlayPlatform = e.target.value;
	}

	// 票房 change
	handleWorkBoxOfficeChange(e) {
		// 清空表单项错误提示
		this._clearFormItemErrorTips();

		this.workForm.workBoxOffice = e.target.value;
	}

	// 收视率 change
	handleWorkAudienceRatingChange(e) {
		// 清空表单项错误提示
		this._clearFormItemErrorTips();

		this.workForm.workAudienceRating = e.target.value;
	}

	// 播放量 change
	handleWorkPlayAmountChange(e) {
		// 清空表单项错误提示
		this._clearFormItemErrorTips();

		this.workForm.workPlayAmount = e.target.value;
	}

	// ******** 即将上映剧本 ******* //

	// 预计上映日期 change
	handleWorkExpectedShowDateChange(date, dateString) {
		// 清空表单项错误提示
		this._clearFormItemErrorTips();

		this.workForm.workExpectedShowDate = dateString;
		// console.log('【handleGraduationChange】 date', date, 'dateString', dateString);
	}

	// ******** 获奖/成交剧本 ******* //

	// 剧本类别 change
	handlePlayTypeChange(value) {
		// 清空表单项错误提示
		this._clearFormItemErrorTips();

		this.workForm.workPlayType = value;
	}

	// 获得奖项或交易详情 change
	handleAwardsOrDealDetailChange(e) {
		// 清空表单项错误提示
		this._clearFormItemErrorTips();

		this.workForm.workAwardsOrDealDetail = e.target.value;
	}

	// ******** 出版作品 ******* //

	// 首次发行时间 change
	handleWorkFirstPublishDateChange(date, dateString) {
		// 清空表单项错误提示
		this._clearFormItemErrorTips();

		this.workForm.workFirstPublishDate = dateString;
		// console.log('【handleGraduationChange】 date', date, 'dateString', dateString);
	}

	// 出版社 change
	handleWorkPublisherChange(e) {
		// 清空表单项错误提示
		this._clearFormItemErrorTips();

		this.workForm.workPublisher = e.target.value;
	}

	// ISBN号 change
	handleWorkISBNChange(e) {
		// 清空表单项错误提示
		this._clearFormItemErrorTips();

		this.workForm.workISBN = e.target.value;
	}

	// 发行量 change
	handleWorkCirculationChange(e) {
		// 清空表单项错误提示
		this._clearFormItemErrorTips();

		this.workForm.workCirculation = e.target.value;
	}

	// ******** 网路文学 ******* //

	// 首次发表时间 change
	handleWorkFirstOutsideDateChange(date, dateString) {
		// 清空表单项错误提示
		this._clearFormItemErrorTips();

		this.workForm.workFirstOutsideDate = dateString;
		// console.log('【handleGraduationChange】 date', date, 'dateString', dateString);
	}

	// 首发网站 change
	handleWorkFirstPubWebsiteChange(e) {
		// 清空表单项错误提示
		this._clearFormItemErrorTips();

		this.workForm.workFirstPubWebsite = e.target.value;
	}

	// 点击量 change
	handleWorkClickRateChange(e) {
		// 清空表单项错误提示
		this._clearFormItemErrorTips();

		this.workForm.workClickRate = e.target.value;
	}

	// 代表作品保存按钮点击
	handleWorkSaveClick() {
		// console.log('this.workForm', this.workForm);

		// // 过滤 emoji
		// this.workForm = filterEmojiObj(this.workForm);
		// console.log('this.workForm 【after】', this.workForm);

		const {
			onConfirm,
		} = this.props;

		if (!this._validateWorkForm(this.workForm)) {
			return;
		}

		const newWorkForm = this._exclusiveWorkForm(this.workForm);

		if (onConfirm) {
			onConfirm(newWorkForm);
			this.workForm = {};	// 清空表单
		}
	}

	/**
	 * 校验代表作品表单
	 * @param workForm
	 */
	_validateWorkForm(workForm) {

		// 字符串去除空格和回车校验
		// const testStr = '11111 11111\n11111 11111';
		// console.log('testStr.length', testStr.length);
		// console.log('testStr.length2', getLengthOfStringRemoveSpecialChar(testStr, /\s/g));
		workForm = filterEmojiObj(workForm);	// 过滤 emoji
		workForm = removeHeadTailSpaceObject(workForm);

		const {
			data,
			myresume,
			formItemErrorTips,
		} = this.props;

		// 获得代表作品数组
		const worksArray = myresume.get('works').get('array');
		// 获得代表作品标题数组
		const workTitleArray = worksArray.map((item) => {
			item = item.toJS();
			return item.content.workTitle;
		}).toJS();
		// 如果是编辑态，已经传入了 workTitle
		if (data.content.workTitle) {
			const index = workTitleArray.indexOf(data.content.workTitle);
			if (index !== -1) {
				// 删除该 workTitle
				workTitleArray.splice(index, 1);
			}
		}

		if (!workForm.workType) {
			formItemErrorTips('formItem_workType', '作品形式不能为空');
			return false;
		}

		// 作品形式筛选
		if (workForm.workType === '已上映剧本') {

			if (!workForm.workShowType) {
				formItemErrorTips('formItem_workShowType', '上映形式不能为空');
				return false;
			}

			if (!workForm.workRole) {
				formItemErrorTips('formItem_workRole', '担任角色不能为空');
				return false;
			}

			if (!workForm.workShowDate) {
				formItemErrorTips('formItem_workShowDate', '上映日期不能为空');
				return false;
			}

			// 上映形式筛选
			if (workForm.workShowType === '电视剧' || workForm.workShowType === '网络大电影' || workForm.workShowType === '网剧') {

				if (!workForm.workMainPlayPlatform) {
					formItemErrorTips('formItem_workMainPlayPlatform', '主要播放平台不能为空');
					return false;
				}

			}
		}

		if (workForm.workType === '即将上映剧本') {

			if (!workForm.workShowType) {
				formItemErrorTips('formItem_workShowType', '上映形式不能为空');
				return false;
			}

			if (!workForm.workRole) {
				formItemErrorTips('formItem_workRole', '担任角色不能为空');
				return false;
			}

			if (!workForm.workExpectedShowDate) {
				formItemErrorTips('formItem_workExpectedShowDate', '预计上映日期不能为空');
				return false;
			}

		}

		if (workForm.workType === '获奖/成交剧本') {

			if (!workForm.workPlayType) {
				formItemErrorTips('formItem_workPlayType', '剧本类别不能为空');
				return false;
			}

			if (!workForm.workAwardsOrDealDetail) {
				formItemErrorTips('formItem_workAwardsOrDealDetail', '获得奖项或交易详情不能为空');
				return false;
			}

			if (getLengthOfStringRemoveSpecialChar(workForm.workAwardsOrDealDetail, /\s/g) > 50) {
				formItemErrorTips('formItem_workAwardsOrDealDetail', '获得奖项或交易详情不能超过50字');
				return false;
			}

		}

		if (workForm.workType === '出版作品') {

			if (!workForm.workFirstPublishDate) {
				formItemErrorTips('formItem_workFirstPublishDate', '首次发行时间不能为空');
				return false;
			}

			if (!workForm.workPublisher) {
				formItemErrorTips('formItem_workPublisher', '出版社不能为空');
				return false;
			}

		}

		if (workForm.workType === '网络文学') {

			if (!workForm.workFirstOutsideDate) {
				formItemErrorTips('formItem_workFirstOutsideDate', '首次发表时间不能为空');
				return false;
			}

			if (!workForm.workFirstPubWebsite) {
				formItemErrorTips('formItem_workFirstPubWebsite', '首发网站不能为空');
				return false;
			}

		}

		if (!workForm.workTitle) {
			formItemErrorTips('formItem_workTitle', '作品标题不能为空');
			return false;
		}

		if (workTitleArray.indexOf(workForm.workTitle) !== -1) {
			formItemErrorTips('formItem_workTitle', '已有同名作品');
			return false;
		}

		if (workForm.workTitle.length > 15) {
			formItemErrorTips('formItem_workTitle', '作品标题不能超过15字');
			return false;
		}

		if (!workForm.workDesc) {
			formItemErrorTips('formItem_workDesc', '作品描述不能为空');
			return false;
		}

		if (getLengthOfStringRemoveSpecialChar(workForm.workDesc, /\s/g) > 100) {
			formItemErrorTips('formItem_workDesc', '作品描述不能超过100字');
			return false;
		}

		return true;
	}

	/**
	 * 代表作品表单排他性 （因为不同类型需要不同字段，当校验完成后，将该类型之外的其他字段全部删除）
	 * @param workForm
	 */
	_exclusiveWorkForm(workForm) {
		const newWorkForm = {
			// 必填项
			workType: workForm.workType,	// 作品形式
			workTitle: workForm.workTitle,	// 作品标题
			workDesc: workForm.workDesc,	// 作品描述
		};
		if (workForm.workType === '已上映剧本') {
			newWorkForm.workShowType = workForm.workShowType;
			newWorkForm.workRole = workForm.workRole;
			newWorkForm.workShowDate = workForm.workShowDate;
			if (workForm.workShowType === '院线电影') {
				newWorkForm.workBoxOffice = workForm.workBoxOffice;
			}
			if (workForm.workShowType === '电视剧') {
				newWorkForm.workMainPlayPlatform = workForm.workMainPlayPlatform;
				newWorkForm.workAudienceRating = workForm.workAudienceRating;
			}
			if (workForm.workShowType === '网络大电影' || workForm.workShowType === '网剧') {
				newWorkForm.workMainPlayPlatform = workForm.workMainPlayPlatform;
				newWorkForm.workPlayAmount = workForm.workPlayAmount;
			}
		}
		if (workForm.workType === '即将上映剧本') {
			newWorkForm.workShowType = workForm.workShowType;
			newWorkForm.workRole = workForm.workRole;
			newWorkForm.workExpectedShowDate = workForm.workExpectedShowDate;
		}
		if (workForm.workType === '获奖/成交剧本') {
			newWorkForm.workPlayType = workForm.workPlayType;
			newWorkForm.workAwardsOrDealDetail = workForm.workAwardsOrDealDetail;
		}
		if (workForm.workType === '出版作品') {
			newWorkForm.workFirstPublishDate = workForm.workFirstPublishDate;
			newWorkForm.workPublisher = workForm.workPublisher;
			newWorkForm.workISBN = workForm.workISBN;
			newWorkForm.workCirculation = workForm.workCirculation;
		}
		if (workForm.workType === '网络文学') {
			newWorkForm.workFirstOutsideDate = workForm.workFirstOutsideDate;
			newWorkForm.workFirstPubWebsite = workForm.workFirstPubWebsite;
			newWorkForm.workClickRate = workForm.workClickRate;
		}
		return newWorkForm;
	}

	// 教育经历取消按钮点击
	handleWorkCancelClick() {
		const {
			mode,
			onCancel,
			formItemErrorTips,
			changeWorksAddStatus,
		} = this.props;

		formItemErrorTips('', '');

		if (mode === 'add') {
			changeWorksAddStatus(false);
		}

		if (onCancel) {
			onCancel();
			this.workForm = {};	// 清空表单
		}
	}

	render() {

		const {
			myresume,
			data,
			mode,
		} = this.props;

		// console.log('【workForm】data', data.content);

		// 获得表单项错误
		const formItemError = myresume.get('formItemError');
		const formItemErrorId = formItemError.get('formId');	// 表单ID
		const formItemErrorTips = formItemError.get('errorTips');	// 错误提示

		return <section className={styles.workForm}>
			<section className={styles.formSection}>
				<div className={styles.title}>{mode === 'add' ? '添加作品' : '编辑作品'}</div>
				<div className={styles.divider}/>
				{/* 作品形式 */}
				<section className={styles.row1}>
					{/* 作品形式 */}
					<section className={styles.label}>
						<div className={styles.text}><span className={styles.asterisk}>*</span>作品形式
						</div>
						<section className={styles.selectWrapper}
								 style={{
									 boxShadow: formItemErrorId === 'formItem_workType' && '0 0 0 1px red'
								 }}>
							<Select id="formItem_workType"
									defaultValue={data.content.workType}
									className={styles.select}
									placeholder="选择形式"
									onChange={this.handleWorkTypeChange.bind(this)}>
								<Select.Option value="已上映剧本">已上映剧本</Select.Option>
								<Select.Option value="即将上映剧本">即将上映剧本</Select.Option>
								<Select.Option value="获奖/成交剧本">获奖/成交剧本</Select.Option>
								<Select.Option value="出版作品">出版作品</Select.Option>
								<Select.Option value="网络文学">网络文学</Select.Option>
							</Select>
						</section>
						{/* 错误提示 */}
						{formItemErrorId === 'formItem_workType' &&
						<div className={styles.errorTips}>
							{formItemErrorTips}
						</div>
						}
					</section>
				</section>

				{/* ----- 已上映剧本 || 即将上映剧本 ----- */}
				{(this.state.workType === '已上映剧本' || this.state.workType === '即将上映剧本') &&
				<section>
					{/* 上映形式 担任角色 */}
					<section className={styles.row1}>
						{/* 上映形式 */}
						<section className={styles.label}>
							<section className={styles.selectWrapper2}
									 style={{
										 boxShadow: formItemErrorId === 'formItem_workShowType' && '0 0 0 1px red'
									 }}>
								<Select id="formItem_workShowType"
										defaultValue={data.content.workShowType}
										className={styles.select}
										onChange={this.handleWorkShowTypeChange.bind(this)}
										placeholder="上映形式">
									<Select.Option value="院线电影">院线电影</Select.Option>
									<Select.Option value="电视剧">电视剧</Select.Option>
									<Select.Option value="网络大电影">网络大电影</Select.Option>
									<Select.Option value="网剧">网剧</Select.Option>
								</Select>
							</section>
							{/* 错误提示 */}
							{formItemErrorId === 'formItem_workShowType' &&
							<div className={styles.errorTipsAlone}>
								{formItemErrorTips}
							</div>
							}
						</section>
						{/* 担任角色 */}
						{this.state.workShowType &&
						<section className={styles.label}>
							<section className={styles.selectWrapper2}
									 style={{
										 boxShadow: formItemErrorId === 'formItem_workRole' && '0 0 0 1px red'
									 }}>
								<Select id="formItem_workRole"
										defaultValue={data.content.workRole}
										className={styles.select}
										onChange={this.handleWorkRoleChange.bind(this)}
										placeholder="担任角色">
									<Select.Option value="第一编剧">第一编剧</Select.Option>
									<Select.Option value="联合编剧">联合编剧</Select.Option>
									<Select.Option value="暂不填写">暂不填写</Select.Option>
								</Select>
							</section>
							{/* 错误提示 */}
							{formItemErrorId === 'formItem_workRole' &&
							<div className={styles.errorTipsAlone}>
								{formItemErrorTips}
							</div>
							}
						</section>
						}
					</section>

					{/* ----- 已上映剧本 ----- */}
					{this.state.workType === '已上映剧本' && this.state.workShowType &&
					<section>
						{/* 上映日期 主要播放平台 */}
						<section className={styles.row1}>
							{/* 上映日期 */}
							<section className={styles.label}>
								<section className={styles.selectWrapper2}
										 style={{
											 boxShadow: formItemErrorId === 'formItem_workShowDate' && '0 0 0 1px red'
										 }}>
									<DatePicker.MonthPicker
										id="formItem_workShowDate"
										defaultValue={data.content.workShowDate ? moment(data.content.workShowDate) : undefined}
										placeholder="上映日期"
										style={{
											width: '100%'
										}}
										disabledDate={(current) => {
											// 今天之后的日期不能选
											return current && current.valueOf() > Date.now();
										}}
										onChange={this.handleWorkShowDateChange.bind(this)}/>
								</section>
								{/* 错误提示 */}
								{formItemErrorId === 'formItem_workShowDate' &&
								<div className={styles.errorTipsAlone}>
									{formItemErrorTips}
								</div>
								}
							</section>
							{/* 主要播放平台 */}
							{(this.state.workShowType === '电视剧' || this.state.workShowType === '网络大电影' || this.state.workShowType === '网剧') &&
							<section className={styles.label}>
								<Input id="formItem_workMainPlayPlatform"
									   defaultValue={data.content.workMainPlayPlatform}
									   className={styles.select}
									   onChange={this.handleWorkMainPlayPlatformChange.bind(this)}
									   placeholder="主要播放平台"
									   style={{
										   borderColor: formItemErrorId === 'formItem_workMainPlayPlatform' && 'red'
									   }}/>
								{/* 错误提示 */}
								{formItemErrorId === 'formItem_workMainPlayPlatform' &&
								<div className={styles.errorTipsAlone}>
									{formItemErrorTips}
								</div>
								}
							</section>
							}
						</section>
						{/* 票房 */}
						{this.state.workShowType === '院线电影' &&
						<section className={styles.row1}>
							{/* 票房 */}
							<section className={styles.labelFullWidth}>
								<Input id="formItem_workBoxOffice"
									   defaultValue={data.content.workBoxOffice}
									   className={styles.select}
									   onChange={this.handleWorkBoxOfficeChange.bind(this)}
									   placeholder="票房（选填）"
									   style={{
										   borderColor: formItemErrorId === 'formItem_workBoxOffice' && 'red'
									   }}/>
								{/* 错误提示 */}
								{formItemErrorId === 'formItem_workBoxOffice' &&
								<div className={styles.errorTipsAlone}>
									{formItemErrorTips}
								</div>
								}
							</section>
						</section>
						}
						{/* 收视率 */}
						{this.state.workShowType === '电视剧' &&
						<section className={styles.row1}>
							{/* 收视率 */}
							<section className={styles.labelFullWidth}>
								<Input id="formItem_workAudienceRating"
									   defaultValue={data.content.workAudienceRating}
									   className={styles.select}
									   onChange={this.handleWorkAudienceRatingChange.bind(this)}
									   placeholder="收视率（选填）"
									   style={{
										   borderColor: formItemErrorId === 'formItem_workAudienceRating' && 'red'
									   }}/>
								{/* 错误提示 */}
								{formItemErrorId === 'formItem_workAudienceRating' &&
								<div className={styles.errorTipsAlone}>
									{formItemErrorTips}
								</div>
								}
							</section>
						</section>
						}
						{/* 播放量 */}
						{(this.state.workShowType === '网络大电影' || this.state.workShowType === '网剧') &&
						<section className={styles.row1}>
							{/* 收视率 */}
							<section className={styles.labelFullWidth}>
								<Input id="formItem_workPlayAmount"
									   defaultValue={data.content.workPlayAmount}
									   className={styles.select}
									   onChange={this.handleWorkPlayAmountChange.bind(this)}
									   placeholder="播放量（选填）"
									   style={{
										   borderColor: formItemErrorId === 'formItem_workPlayAmount' && 'red'
									   }}/>
								{/* 错误提示 */}
								{formItemErrorId === 'formItem_workPlayAmount' &&
								<div className={styles.errorTipsAlone}>
									{formItemErrorTips}
								</div>
								}
							</section>
						</section>
						}
					</section>
					}

					{/* ----- 即将上映剧本 ----- */}
					{this.state.workType === '即将上映剧本' &&
					// 预计上映日期
					<section className={styles.row1}>
						{/* 预计上映日期 */}
						<section className={styles.label}>
							<section className={styles.selectWrapper2}
									 style={{
										 boxShadow: formItemErrorId === 'formItem_workExpectedShowDate' && '0 0 0 1px red'
									 }}>
								<DatePicker.MonthPicker
									id="formItem_workExpectedShowDate"
									defaultValue={data.content.workExpectedShowDate ? moment(data.content.workExpectedShowDate) : undefined}
									placeholder="预计上映日期"
									style={{
										width: '100%'
									}}
									disabledDate={(current) => {
										// 今天之前的日期不能选
										return current && current.valueOf() < Date.now();
									}}
									onChange={this.handleWorkExpectedShowDateChange.bind(this)}/>
							</section>
							{/* 错误提示 */}
							{formItemErrorId === 'formItem_workExpectedShowDate' &&
							<div className={styles.errorTipsAlone}>
								{formItemErrorTips}
							</div>
							}
						</section>
					</section>
					}

				</section>
				}

				{/* ----- 获奖/成交剧本 ----- */}
				{this.state.workType === '获奖/成交剧本' &&
				<section>
					{/* 剧本类别 */}
					<section className={styles.row1}>
						{/* 剧本类别 */}
						<section className={styles.label}>
							<section className={styles.selectWrapper2}
									 style={{
										 boxShadow: formItemErrorId === 'formItem_workPlayType' && '0 0 0 1px red'
									 }}>
								<Select id="formItem_workPlayType"
										defaultValue={data.content.workPlayType}
										className={styles.select}
										onChange={this.handlePlayTypeChange.bind(this)}
										placeholder="剧本类别">
									<Select.Option value="院线电影">院线电影</Select.Option>
									<Select.Option value="电视剧">电视剧</Select.Option>
									<Select.Option value="网络大电影">网络大电影</Select.Option>
									<Select.Option value="网剧">网剧</Select.Option>
								</Select>
							</section>
							{/* 错误提示 */}
							{formItemErrorId === 'formItem_workPlayType' &&
							<div className={styles.errorTipsAlone}>
								{formItemErrorTips}
							</div>
							}
						</section>
					</section>
					{/* 获得奖项或交易详情 */}
					<section className={styles.row1}>
						{/* 获得奖项或交易详情 */}
						<section className={styles.labelFullWidth}>
							<Input id="formItem_workAwardsOrDealDetail"
								   defaultValue={data.content.workAwardsOrDealDetail}
								   className={styles.textarea2}
								   placeholder="获得奖项或交易详情，50字以内"
								   onChange={this.handleAwardsOrDealDetailChange.bind(this)}
								   type="textarea"
								   rows={3}
								   autosize={{
									   minRows: 3,
									   maxRows: 4
								   }}
								   style={{
									   borderColor: formItemErrorId === 'formItem_workAwardsOrDealDetail' && 'red'
								   }}/>
							{/* 错误提示 */}
							{formItemErrorId === 'formItem_workAwardsOrDealDetail' &&
							<div className={styles.errorTipsTextArea}>
								{formItemErrorTips}
							</div>
							}
						</section>
					</section>
				</section>
				}

				{/* ----- 出版作品 ----- */}
				{this.state.workType === '出版作品' &&
				<section>
					{/* 首次发行时间 出版社 */}
					<section className={styles.row1}>
						{/* 首次发行时间 */}
						<section className={styles.label}>
							<section className={styles.selectWrapper2}
									 style={{
										 boxShadow: formItemErrorId === 'formItem_workFirstPublishDate' && '0 0 0 1px red'
									 }}>
								<DatePicker.MonthPicker
									id="formItem_workFirstPublishDate"
									defaultValue={data.content.workFirstPublishDate ? moment(data.content.workFirstPublishDate) : undefined}
									placeholder="首次发行时间"
									style={{
										width: '100%'
									}}
									disabledDate={(current) => {
										// 今天之后的日期不能选
										return current && current.valueOf() > Date.now();
									}}
									onChange={this.handleWorkFirstPublishDateChange.bind(this)}/>
							</section>
							{/* 错误提示 */}
							{formItemErrorId === 'formItem_workFirstPublishDate' &&
							<div className={styles.errorTipsAlone}>
								{formItemErrorTips}
							</div>
							}
						</section>
						{/* 出版社 */}
						<section className={styles.label}>
							<Input id="formItem_workPublisher"
								   defaultValue={data.content.workPublisher}
								   className={styles.select}
								   onChange={this.handleWorkPublisherChange.bind(this)}
								   placeholder="出版社"
								   style={{
									   borderColor: formItemErrorId === 'formItem_workPublisher' && 'red'
								   }}/>
							{/* 错误提示 */}
							{formItemErrorId === 'formItem_workPublisher' &&
							<div className={styles.errorTipsAlone}>
								{formItemErrorTips}
							</div>
							}
						</section>
					</section>
					{/* ISBN号 发行量 */}
					<section className={styles.row1}>
						{/* ISBN号 */}
						<section className={styles.label}>
							<Input id="formItem_workISBN"
								   defaultValue={data.content.workISBN}
								   className={styles.select}
								   onChange={this.handleWorkISBNChange.bind(this)}
								   placeholder="ISBN号（选填）"
								   style={{
									   borderColor: formItemErrorId === 'formItem_workISBN' && 'red'
								   }}/>
							{/* 错误提示 */}
							{formItemErrorId === 'formItem_workISBN' &&
							<div className={styles.errorTipsAlone}>
								{formItemErrorTips}
							</div>
							}
						</section>
						{/* 发行量 */}
						<section className={styles.label}>
							<Input id="formItem_workCirculation"
								   defaultValue={data.content.workCirculation}
								   className={styles.select}
								   onChange={this.handleWorkCirculationChange.bind(this)}
								   placeholder="发行量（选填）"
								   style={{
									   borderColor: formItemErrorId === 'formItem_workCirculation' && 'red'
								   }}/>
							{/* 错误提示 */}
							{formItemErrorId === 'formItem_workCirculation' &&
							<div className={styles.errorTipsAlone}>
								{formItemErrorTips}
							</div>
							}
						</section>
					</section>
				</section>
				}

				{/* ----- 网络文学 ----- */}
				{this.state.workType === '网络文学' &&
				<section>
					{/* 首次发表时间 出版社 */}
					<section className={styles.row1}>
						{/* 首次发表时间 */}
						<section className={styles.label}>
							<section className={styles.selectWrapper2}
									 style={{
										 boxShadow: formItemErrorId === 'formItem_workFirstOutsideDate' && '0 0 0 1px red'
									 }}>
								<DatePicker.MonthPicker
									id="formItem_workFirstOutsideDate"
									defaultValue={data.content.workFirstOutsideDate ? moment(data.content.workFirstOutsideDate) : undefined}
									placeholder="首次发表时间"
									style={{
										width: '100%'
									}}
									onChange={this.handleWorkFirstOutsideDateChange.bind(this)}/>
							</section>
							{/* 错误提示 */}
							{formItemErrorId === 'formItem_workFirstOutsideDate' &&
							<div className={styles.errorTipsAlone}>
								{formItemErrorTips}
							</div>
							}
						</section>
						{/* 首发网站 */}
						<section className={styles.label}>
							<Input id="formItem_workFirstPubWebsite"
								   defaultValue={data.content.workFirstPubWebsite}
								   className={styles.select}
								   onChange={this.handleWorkFirstPubWebsiteChange.bind(this)}
								   placeholder="首发网站"
								   style={{
									   borderColor: formItemErrorId === 'formItem_workFirstPubWebsite' && 'red'
								   }}/>
							{/* 错误提示 */}
							{formItemErrorId === 'formItem_workFirstPubWebsite' &&
							<div className={styles.errorTipsAlone}>
								{formItemErrorTips}
							</div>
							}
						</section>
					</section>
					{/* 点击量 */}
					<section className={styles.row1}>
						{/* 点击量 */}
						<section className={styles.labelFullWidth}>
							<Input id="formItem_workClickRate"
								   defaultValue={data.content.workClickRate}
								   className={styles.select}
								   onChange={this.handleWorkClickRateChange.bind(this)}
								   placeholder="点击量（选填）"
								   style={{
									   borderColor: formItemErrorId === 'formItem_workClickRate' && 'red'
								   }}/>
							{/* 错误提示 */}
							{formItemErrorId === 'formItem_workClickRate' &&
							<div className={styles.errorTipsAlone}>
								{formItemErrorTips}
							</div>
							}
						</section>
					</section>
				</section>
				}

				{/* 作品标题 */}
				<section className={styles.row1}>
					{/* 作品标题 */}
					<section className={styles.labelFullWidth}>
						<div className={styles.text}><span className={styles.asterisk}>*</span>作品标题
						</div>
						<Input id="formItem_workTitle"
							   defaultValue={data.content.workTitle}
							   className={styles.input}
							   onChange={this.handleWorkTitleChange.bind(this)}
							   placeholder="15字以内"
							   style={{
								   borderColor: formItemErrorId === 'formItem_workTitle' && 'red'
							   }}/>
						{/* 错误提示 */}
						{formItemErrorId === 'formItem_workTitle' &&
						<div className={styles.errorTips}>
							{formItemErrorTips}
						</div>
						}
					</section>
				</section>
				{/* 作品描述 */}
				<section className={styles.row1}>
					{/* 作品描述 */}
					<section className={styles.labelFullWidth}>
						<div className={styles.text}><span className={styles.asterisk}>*</span>作品描述
						</div>
						<Input id="formItem_workDesc"
							   defaultValue={data.content.workDesc}
							   className={styles.textarea}
							   placeholder="出品方、主创团队、作品简介等，100字以内"
							   onChange={this.handleWorkDescChange.bind(this)}
							   type="textarea"
							   rows={4}
							   autosize={{
								   minRows: 6,
								   maxRows: 10
							   }}
							   style={{
								   borderColor: formItemErrorId === 'formItem_workDesc' && 'red'
							   }}/>
						{/* 错误提示 */}
						{formItemErrorId === 'formItem_workDesc' &&
						<div className={styles.errorTipsTextArea}>
							{formItemErrorTips}
						</div>
						}
					</section>
				</section>
				{/* row4 按钮栏 */}
				<section className={styles.row6}>
					<div className={styles.btnSave}
						 onClick={this.handleWorkSaveClick.bind(this)}>保存
					</div>
					<div className={styles.btnCancel}
						 onClick={this.handleWorkCancelClick.bind(this)}>取消
					</div>
				</section>
			</section>
		</section>
	}
}
