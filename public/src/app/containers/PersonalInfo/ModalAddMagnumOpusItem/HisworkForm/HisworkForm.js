/**
 * Created by BadWaka on 2017/4/20.
 */

/********************************** React ****************************************/

import React, {
	Component,
} from 'react';

import PropTypes from 'prop-types';

// CSS modules
import styles from './HisworkForm.scss';

// 公共组件
import {
	CheckBoxButtons,
	DatePicker,	// 时间选择器
	FormItem,	// 表单项
	Input,	// 输入框
	Textarea,	// 文本域
} from '../../../../commonComponents';

/********************************** Redux ****************************************/

import {
	bindActionCreators
} from 'redux';

import {
	connect
} from 'react-redux';

import {
	showWarning,	// 警告栏
} from '../../../../actions/Popups';

import {
	setModalAddRepresentativeWorksError,	// 设置添加代表作品对话框错误
	setModalAddRepresentativeWorksData,
} from '../../../../actions/PersonalInfo';

@connect(state => ({
	user: state.get('user'),
	personalInfo: state.get('personalInfo'),
}), dispatch => bindActionCreators({
	setModalAddRepresentativeWorksError,
	setModalAddRepresentativeWorksData,
	showWarning,
}, dispatch))

/**
 * 代表作品表单
 */
export default class HisworkForm extends Component {

	// 定义属性类型
	static propTypes = {
		hisworkItemData: PropTypes.object,	// 代表作品项数据
		hisworkIndex: PropTypes.number,	// 代表作品下标
		onChange: PropTypes.func,	// 当改变发生
		onError: PropTypes.func,	// 当错误发生
		titleErrorTips: PropTypes.string,	// 标题错误提示
		onTitleError: PropTypes.func,	// 标题错误
		publisherErrorTips: PropTypes.string,	// 出版社错误提示
		onPublishError: PropTypes.func,	// 发行发错误
		achievementErrorTips: PropTypes.string,	// 获得成就错误提示
		onAchievementError: PropTypes.func,	// 获得成就错误
	};

	// 设置默认属性
	static defaultProps = {
		hisworkItemData: {},
		hisworkIndex: null,
		onChange: null,
		onError: null,
		titleErrorTips: '',
		publisherErrorTips: '',
		achievementErrorTips: '',
	};

	constructor(props) {
		super(props);

		// 要提交的表单数据
		this.formData = {
			title: '',
			workType: '',
			publisher: '',
			publishTime: '',
			achievement: '',
			// 临时
			year: '',
			month: ''
		};

		this.state = {
			titleErrorTips: props.titleErrorTips,
			publisherErrorTips: props.publisherErrorTips,
			achievementErrorTips: props.achievementErrorTips,
		};
	}

	/**
	 * 当改变发生
	 */
	handleChange() {

		this.props.setModalAddRepresentativeWorksError('', 0);

		this.formData.publishTime = this.formData.year + '/' + this.formData.month;

		// console.log('this.formData', this.formData);

		if (this.props.onChange) {
			this.props.onChange(this.formData, this.props.hisworkItemData ? this.props.hisworkItemData.hisworksId : null);
		}
	}

	handleError(errorTips, isError) {
		// console.log('errorTips', errorTips, 'isError', isError);
		if (this.props.onError) {
			this.props.onError(errorTips, isError);
		}
	}

	componentWillUnmount() {
		this.props.setModalAddRepresentativeWorksError('', 0);
		this.props.setModalAddRepresentativeWorksData();
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

		const modalAddRepresentativeWorksData = this.props.personalInfo.get('modalAddRepresentativeWorksData');
		// console.log('添加代表作品对话框数据 modalAddRepresentativeWorksData', modalAddRepresentativeWorksData);

		// 作品类型数组
		let workTypeArray = [
			{text: '长篇小说', isChecked: false},
			{text: '中篇小说', isChecked: false},
			{text: '短篇小说', isChecked: false},
			{text: '网络大电影剧本', isChecked: false},
			{text: '网剧剧本', isChecked: false},
			{text: '电影剧本', isChecked: false},
			{text: '电视剧本', isChecked: false},
			{text: '真实故事', isChecked: false},
			{text: '长篇漫画', isChecked: false},
			{text: '中篇漫画', isChecked: false},
			{text: '短篇漫画', isChecked: false},
		];
		// 如果外部传入了作品类型
		if (this.formData.workType) {
			for (let i = 0; i < workTypeArray.length; i++) {
				// 遍历数组找到text相符的那一项
				if (this.formData.workType === workTypeArray[i].text) {
					// 选中状态置为true
					workTypeArray[i].isChecked = true;
				}
			}
		}

		return (
			<section className={styles.hisworkForm}>
				{/* 主体 */}
				<div className={styles.hisworkIndex}>
					代表作品{this.props.hisworkIndex !== null
					? this.props.hisworkIndex + 1
					: ''}
				</div>
				{/* 标题 */}
				<div className={styles.title}>
					<FormItem isMust={true} label="标题：">
						<Input
							borderColor={(modalAddRepresentativeWorksError && modalAddRepresentativeWorksError.errorNumber === 1) ? '#FF3B30' : null}
							value={hisworkItemData ? hisworkItemData.title : ''}
							onChange={(value) => {
								this.formData.title = value;
								this.handleChange();

								this.props.setModalAddRepresentativeWorksData({
									title: value
								});
							}}
							onError={(isError) => {
								if (this.props.onError) {
									this.props.onError('标题字数过多', isError);
								}
								if (this.props.onTitleError) {
									this.props.onTitleError('标题字数过多', isError);
								}
								this.setState(() => {
									return {
										titleErrorTips: isError ? '字数过多' : ''
									}
								})
							}}
							placeholder="例：建党伟业，请勿输入《》"
							maxWordsCount={20}/>
						{/* 错误提示 */}
						<div className={styles.errorTips}>
							{this.state.titleErrorTips}
						</div>
					</FormItem>
				</div>
				{/* 类别 */}
				<div className={styles.category}>
					<FormItem isMust={true} label="类别：">
						<div className={styles.checkBoxButtons}
							 style={{
								 borderColor: (modalAddRepresentativeWorksError && modalAddRepresentativeWorksError.errorNumber === 2) ? '#FF3B30' : '#fff'
							 }}>
							<CheckBoxButtons
								isSingle={true}
								dataArray={workTypeArray}
								onChange={(string) => {
									this.formData.workType = string;
									this.handleChange();
									this.props.setModalAddRepresentativeWorksData({
										workType: string,
									});
								}}/>
						</div>
					</FormItem>
				</div>
				{/* 出版社/首发网站/发行方 */}
				<div className={styles.publisher}>
					<FormItem isMust={true} label="出版社/首发网站/发行方：">
						<Input
							borderColor={(modalAddRepresentativeWorksError && modalAddRepresentativeWorksError.errorNumber === 3) ? '#FF3B30' : null}
							value={hisworkItemData ? hisworkItemData.publisher : ''}
							placeholder="例：中国电影集团公司"
							maxWordsCount={20}
							onChange={(value) => {
								this.formData.publisher = value;
								this.handleChange();
								this.props.setModalAddRepresentativeWorksData({
									publisher: value,
								});
							}}
							onError={(isError) => {
								if (this.props.onError) {
									this.props.onError('出版社/首发网站/发行方字数过多', isError);
								}
								if (this.props.onPublishError) {
									this.props.onPublishError('出版社/首发网站/发行方字数过多', isError);
								}
							}}
						/>
					</FormItem>
				</div>
				{/* 出版/上映时间 */}
				<div className={styles.time}>
					<FormItem label="出版/上映时间">
						<div className={styles.dateItem}>
							<DatePicker
								value={hisworkItemData ? hisworkItemData.publishTime.split('/')[0] : ''}
								text="年"
								type='year'
								onChange={(value) => {
									this.formData.year = value;
									this.handleChange();
									try {
										const month = modalAddRepresentativeWorksData.publishTime.split('/')[1];
										const publishTime = value + '/' + month;
										this.props.setModalAddRepresentativeWorksData({
											publishTime
										});
									} catch (e) {
										// console.info(e);
										const publishTime = value + '/';
										this.props.setModalAddRepresentativeWorksData({
											publishTime
										});
									}
								}}/>
						</div>
						<div className={styles.dateItem}>
							<DatePicker
								value={hisworkItemData ? hisworkItemData.publishTime.split('/')[1] : ''}
								text="月"
								type="month"
								onChange={(value) => {
									this.formData.month = value;
									this.handleChange();
									try {
										const year = modalAddRepresentativeWorksData.publishTime.split('/')[0];
										const publishTime = year + '/' + value;
										this.props.setModalAddRepresentativeWorksData({
											publishTime
										});
									} catch (e) {
										// console.info(e);
										const publishTime = '/' + value;
										this.props.setModalAddRepresentativeWorksData({
											publishTime
										});
									}
								}}/>
						</div>
					</FormItem>
				</div>
				{/* 获得成就 */}
				<div className={styles.achievement}>
					<FormItem label="获得成就：">
						<Textarea
							borderColor={(modalAddRepresentativeWorksError && modalAddRepresentativeWorksError.errorNumber === 5) ? '#FF3B30' : null}
							value={hisworkItemData ? hisworkItemData.achievement : ''}
							// 这两个参数用来微调居中
							paddingTop={11}
							wordsCountBottom={12}
							placeholder="文学奖项或票房、点击量等"
							maxWordsCount={100}
							onChange={(value) => {
								this.formData.achievement = value;
								this.handleChange();
								this.props.setModalAddRepresentativeWorksData({
									achievement: value,
								});
							}}
							onError={(isError) => {
								if (this.props.onError) {
									this.props.onError('获得成就字数过多', isError);
								}
								if (this.props.onAchievementError) {
									this.props.onAchievementError('获得成就字数过多', isError);
								}
							}}
						/>
						{/* 错误提示 */}
						<div className={styles.errorTips}>
							{this.state.achievementErrorTips}
						</div>
					</FormItem>
				</div>
			</section>
		);
	}
};
