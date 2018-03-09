/**
 * 教育经历表单
 */

import React, {
	Component
} from 'react';

import moment from 'moment';

import PropTypes from 'prop-types';

import styles from './EducationForm.scss';

// ant-design
import {
	DatePicker,	// 日期控件
	Select,	// 选择器控件（其实就是下拉菜单）
	AutoComplete,	// 自动完成 Input
} from 'antd';

import {
	filterEmojiObj,
} from '../../../utils/emojiUtil';
import {
	removeHeadTailSpaceObject,
} from '../../../utils/regExp';

import {
	apiHost,
	httpTimeout,
} from '../../../actions/http.config';

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
	addEducation,
	// education
	changeEducationAddStatus,
} from '../../../actions/MyResume';

@connect(state => ({
	user: state.get('user'),
	myresume: state.get('myresume'),
}), dispatch => bindActionCreators({
	formItemErrorTips: formItemErrorTips,
	// http
	fetchResumeDetail: fetchResumeDetail.bind(this, dispatch),
	addEducation: addEducation.bind(this, dispatch),
	// education
	changeEducationAddStatus: changeEducationAddStatus,
}, dispatch))

export default class EducationForm extends Component {

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
		data: {},
		onConfirm: null,
		onCancel: null,
	};

	constructor(props) {
		super(props);

		// 教育经历表单
		this.educationForm = {
			school: '',
			major: '',
			graduation: '',
			certificate: '',
		};

		this.state = {
			universityDataSource: [],	// 只包含名称的大学联想数据
			majorDataSource: [],	// 只包含名称的专业联想数据
		};

		this.universityAssociateData = [];	// 包含 id 的大学联想数据
		this.majorAssociateData = [];	// 包含 id 的专业联想数据
	}

	componentWillMount() {
		const {
			data,
			mode,
		} = this.props;

		if (data) {
			this.educationForm.id = data.id;
			this.educationForm.school = data.school;
			this.educationForm.major = data.major;
			this.educationForm.graduation = data.graduation;
			this.educationForm.certificate = data.certificate;
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

	// 毕业院校 change
	handleSchoolChange(value) {
		// 清空表单项错误提示
		this._clearFormItemErrorTips();

		this.educationForm.school = value;
		// console.log('【handleSchoolChange】 value', value);

		this._fetchUniversityAssociate(value);
	}

	// 毕业院校 search
	handleSchoolSearch(value) {
		// console.log('【handleSchoolSearch】 value', value);
	}

	// 专业 change
	handleMajorChange(value) {
		// 清空表单项错误提示
		this._clearFormItemErrorTips();

		this.educationForm.major = value;
		// console.log('【handleMajorChange】 value', value);

		if (!this.educationForm.school) {
			// 置空
			this.setState({
				majorDataSource: [],
			});
			this.majorAssociateData = [];
			return;
		}

		// 根据大学名获取大学id
		const universityId = this._findUniversityIdByName(this.educationForm.school);
		if (universityId) {
			// 根据大学id和输入值获取专业
			this._fetchMajorAssociate(value, universityId);
		}
	}

	// 专业 search
	handleMajorSearch(value) {
		// console.log('【handleMajorSearch】 value', value);
	}

	// 毕业日期 change
	handleGraduationChange(date, dateString) {
		// 清空表单项错误提示
		this._clearFormItemErrorTips();

		this.educationForm.graduation = dateString;
		// console.log('【handleGraduationChange】 date', date, 'dateString', dateString);
	}

	// 毕业学历 change
	handleCertificateChange(value) {
		// 清空表单项错误提示
		this._clearFormItemErrorTips();

		this.educationForm.certificate = value;
		// console.log('【handleCertificateChange】 value', value);
	}

	// 教育经历保存按钮点击
	handleEducationSaveClick() {
		const {
			user,
			addEducation,
			mode,
			onConfirm,
		} = this.props;

		if (!this._validateEducationForm(this.educationForm)) {
			return;
		}

		if (onConfirm) {
			onConfirm(this.educationForm);
		}

		if (mode === 'add') {
			const userId = user.get('objectId');	// 获得用户 Id
			this.educationForm.id = userId;	// 把 id 放进去
			addEducation(this.educationForm);	// 条件教育经历
		}
	}

	/**
	 * 校验教育经历表单
	 * @param educationForm
	 */
	_validateEducationForm(educationForm) {
		educationForm = filterEmojiObj(educationForm);
		educationForm = removeHeadTailSpaceObject(educationForm);

		const {
			myresume,
			formItemErrorTips,
		} = this.props;

		if (!educationForm.school) {
			formItemErrorTips('formItem_school', '毕业院校不能为空');
			return false;
		}

		if (!educationForm.major) {
			formItemErrorTips('formItem_major', '专业不能为空');
			return false;
		}

		// if (!educationForm.graduation) {
		// 	formItemErrorTips('formItem_graduation', '毕业日期不能为空');
		// 	return false;
		// }

		// if (!educationForm.certificate) {
		// 	formItemErrorTips('formItem_certificate', '毕业学历不能为空');
		// 	return false;
		// }

		// // 获得教育经历数组
		// const educationArray = myresume.get('education').get('array').toJS();
		// // 重复校验
		// let duplicationCheck = true;
		// educationArray.forEach((item) => {
		// 	console.log('item', item);
		// 	if (item.school === educationForm.school && item.major === educationForm.major && item.certificate === educationForm.certificate) {
		// 		duplicationCheck = false;
		// 	}
		// });
		// if (!duplicationCheck) {
		// 	formItemErrorTips('formItem_school', '该学校专业学位已存在，请不要重复填写');
		// 	return false;
		// }

		return true;
	}

	// 教育经历取消按钮点击
	handleEducationCancelClick() {
		const {
			onCancel,
			formItemErrorTips,
		} = this.props;

		formItemErrorTips('', '');

		if (onCancel) {
			onCancel();
		}
	}

	/**
	 * 拉取大学联想数据
	 * @param key 输入字符
	 */
	_fetchUniversityAssociate(key) {
		const that = this;

		// 如果没有传关键字
		if (!key) {
			// 置空
			that.setState({
				universityDataSource: [],
			});
			that.universityAssociateData = [];
			return;
		}

		$.ajax({
			type: "GET",
			url: `${apiHost}/sns/eduapi/universities?key=${key}`,
			dataType: "jsonp",
			success: function (res) {
				// console.log('拉取大学联想数据 success', res);
				if (res.errno === 0) {
					that.universityAssociateData = res.data;
					const universityDataSource = res.data.map((item) => {
						return item.name;
					});
					that.setState({
						universityDataSource,
					});
				}
			},
			error: function (e) {
				console.error('拉取大学联想数据 error', e);
			},
		});
	}

	/**
	 * 拉取专业联想数据
	 * @param key 输入字符
	 * @param id 大学id
	 */
	_fetchMajorAssociate(key, id) {
		const that = this;

		// 如果没有传关键字
		if (!key) {
			// 置空
			that.setState({
				majorDataSource: [],
			});
			that.majorAssociateData = [];
			return;
		}

		$.ajax({
			type: "GET",
			url: `${apiHost}/sns/eduapi/majors?id=${id}&key=${key}`,
			dataType: "jsonp",
			success: function (res) {
				// console.log('拉取专业联想数据 success', res);
				if (res.errno === 0) {
					that.majorAssociateData = res.data;
					const majorDataSource = res.data.map((item) => {
						return item.name;
					});
					that.setState({
						majorDataSource,
					});
				}
			},
			error: function (e) {
				console.error('拉取专业联想数据 error', e);
			},
		});
	}

	/**
	 * 根据大学名称找到大学id
	 * @param universityName 大学名称
	 * @return {string} universityId 大学id
	 */
	_findUniversityIdByName(universityName) {
		let universityId = '';
		this.universityAssociateData.forEach((item) => {
			if (item.name === universityName) {
				universityId = item.id;
			}
		});
		return universityId;
	}

	render() {

		const {
			myresume,
			mode,
			data,
		} = this.props;

		// 获得表单项错误
		const formItemError = myresume.get('formItemError');
		const formItemErrorId = formItemError.get('formId');	// 表单ID
		const formItemErrorTips = formItemError.get('errorTips');	// 错误提示

		return <section className={styles.educationForm}>
			<section className={styles.representativeWorksEdit}>
				<section className={styles.formSection}>
					<div className={styles.title}>{mode === 'add' ? '添加学历' : '编辑学历'}</div>
					<div className={styles.divider}/>
					{/* row1 */}
					<section className={styles.row1}>
						{/* 毕业院校 */}
						<section className={styles.labelFullWidth}>
							<div className={styles.text}><span className={styles.asterisk}>*</span>毕业院校
							</div>
							<section className={styles.selectWrapper}
									 style={{
										 boxShadow: formItemErrorId === 'formItem_school' && '0 0 0 1px red'
									 }}>
								<AutoComplete id="formItem_school"
											  defaultValue={data.school}
											  className={styles.autoComplete}
											  dataSource={this.state.universityDataSource}
											  placeholder="请输入毕业院校"
											  onChange={this.handleSchoolChange.bind(this)}
											  onSearch={this.handleSchoolSearch.bind(this)}
											  filterOption={true}/>
							</section>
							{/* 错误提示 */}
							{formItemErrorId === 'formItem_school' &&
							<div className={styles.errorTips}>
								{formItemErrorTips}
							</div>
							}
						</section>
					</section>
					{/* row2 */}
					<section className={styles.row2}>
						{/* 专业 */}
						<section className={styles.labelFullWidth}>
							<div className={styles.text}><span className={styles.asterisk}>*</span>专业
							</div>
							<section className={styles.input}
									 style={{
										 boxShadow: formItemErrorId === 'formItem_major' && '0 0 0 1px red'
									 }}>
								<AutoComplete id="formItem_major"
											  defaultValue={data.major}
											  className={styles.autoComplete}
											  dataSource={this.state.majorDataSource}
											  placeholder="请输入专业"
											  onChange={this.handleMajorChange.bind(this)}
											  onSearch={this.handleMajorSearch.bind(this)}
											  filterOption={true}/>
							</section>
							{/* 错误提示 */}
							{formItemErrorId === 'formItem_major' &&
							<div className={styles.errorTips}>
								{formItemErrorTips}
							</div>
							}
						</section>
					</section>
					{/* row3 */}
					<section className={styles.row3}>
						{/* 毕业日期 */}
						<section className={styles.label}>
							<div className={styles.text}><span className={styles.asterisk}>&nbsp;</span>毕业日期
							</div>
							<section className={styles.datePickerWrapper}
									 style={{
										 boxShadow: formItemErrorId === 'formItem_graduation' && '0 0 0 1px red'
									 }}>
								<DatePicker.MonthPicker
									id="formItem_graduation"
									defaultValue={data.graduation ? moment(data.graduation) : undefined}
									placeholder="选择日期"
									style={{
										width: '100%'
									}}
									onChange={this.handleGraduationChange.bind(this)}/>
							</section>
							{/* 错误提示 */}
							{formItemErrorId === 'formItem_graduation' &&
							<div className={styles.errorTips}>
								{formItemErrorTips}
							</div>
							}
						</section>
						{/* 毕业学历 */}
						<section className={styles.label}>
							<div className={styles.text}><span className={styles.asterisk}>&nbsp;</span>毕业学历
							</div>
							<section className={styles.selectWrapper}
									 style={{
										 boxShadow: formItemErrorId === 'formItem_certificate' && '0 0 0 1px red'
									 }}>
								<Select id="formItem_certificate"
										defaultValue={data.certificate}
										className={styles.select}
										placeholder="选择学历"
										onChange={this.handleCertificateChange.bind(this)}>
									<Select.Option value="大专">大专</Select.Option>
									<Select.Option value="本科">本科</Select.Option>
									<Select.Option value="硕士">硕士</Select.Option>
									<Select.Option value="博士">博士</Select.Option>
									<Select.Option value="其他学历">其他学历</Select.Option>
								</Select>
							</section>
							{/* 错误提示 */}
							{formItemErrorId === 'formItem_certificate' &&
							<div className={styles.errorTips}>
								{formItemErrorTips}
							</div>
							}
						</section>
					</section>
					{/* row4 按钮栏 */}
					<section className={styles.row6}>
						<div className={styles.btnSave}
							 onClick={this.handleEducationSaveClick.bind(this)}>保存
						</div>
						<div className={styles.btnCancel}
							 onClick={this.handleEducationCancelClick.bind(this)}>取消
						</div>
					</section>
				</section>
			</section>
		</section>
	}
}
