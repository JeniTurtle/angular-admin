/**
 * 我的简历
 */

import React, {
	Component
} from 'react';

import PropTypes from 'prop-types';

// 样式
import styles from './MyResume.scss';

// 组件

// ant-design
import {
	DatePicker,	// 日期控件
	Input,	// 输入框控件
	Select,	// 选择器控件（其实就是下拉菜单）
	Cascader,	// 级联选择器，为了城市选择器
	Modal,	// 模态框
	Spin,	// 加载中
	message,
} from 'antd';
import cascaderCityOptions from '../../components/Cascader/cascader-address-options'; // 级联选择器城市配置

// 第三方组件
import ReactCrop from 'react-image-crop';	// 图片截取器

// 自定义组件
import {
	MultiSelect,	// 多选框
} from '../../commonComponents';
import SpinCustom from '../../commonComponents/Spin/Spin';	// 自定义加载中...
import {
	Nav,	// 左侧导航
} from '../../components';
import Modal2 from '../../components/Modal/Modal';	// 模态框2，防止与AntDesign Modal冲突
import EducationItem from './EducationItem/EducationItem';	// 教育项
import EducationForm from './EducationForm/EducationForm';	// 教育表单
import WorkItem from './WorkItem/WorkItem';	// 代表作品项
import WorkForm from './WorkForm/WorkForm';	// 代表作品表单

// 工具
import moment from 'moment';
import {
	Map,
} from 'immutable';	// Immutable
import {
	getAge,	// 获得年龄
} from '../../utils/date';
import {
	getCookie,	// 获得 cookie
} from '../../utils/funcs';
import {
	scrollToAnchor,	// 跳转到锚点
} from '../../utils/anchor';
import {
	getLengthOfStringRemoveSpecialChar,
} from '../../utils/stringUtil';
import {
	filterEmojiObj,
} from '../../utils/emojiUtil';
import constant from '../../utils/constant';
import store from 'store';
import {
	isCurrentUserHasResumePermission,
} from '../../utils/myResumeUtil';
import {
	removeHeadTailSpace,	// 去除首尾空格
	removeHeadTailSpaceObject,
} from '../../utils/regExp';

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
	changeResumeAnchor,
	generateResumePdf,
	// HTTP
	fetchResumeDetail,
	saveResumeBaseInfo,
	uploadAvatar,
	// baseInfo
	changeBaseInfoEditStatus,
	changeBaseInfoEditForm,
	changeUploadAvatar,
	// works
	changeWorksAddStatus,
	changeWorksArray,
	addWork,
	// education
	changeEducationAddStatus,
	changeEducationArray,
	changeEducationArrayKeyValueById,
} from '../../actions/MyResume';

@connect(state => ({
	user: state.get('user'),
	myresume: state.get('myresume'),
}), dispatch => bindActionCreators({
	// global
	formItemErrorTips: formItemErrorTips,
	generateResumePdf: generateResumePdf.bind(this, dispatch),
	changeResumeAnchor: changeResumeAnchor,
	// http
	fetchResumeDetail: fetchResumeDetail.bind(this, dispatch),
	saveResumeBaseInfo: saveResumeBaseInfo.bind(this, dispatch),
	uploadAvatar: uploadAvatar.bind(this, dispatch),
	// baseInfo
	changeBaseInfoEditStatus: changeBaseInfoEditStatus,
	changeBaseInfoEditForm: changeBaseInfoEditForm,
	changeUploadAvatar: changeUploadAvatar,
	// works
	changeWorksAddStatus: changeWorksAddStatus,
	changeWorksArray: changeWorksArray,
	addWork: addWork.bind(this, dispatch),
	// educations
	changeEducationAddStatus: changeEducationAddStatus,
	changeEducationArray: changeEducationArray,
	changeEducationArrayKeyValueById: changeEducationArrayKeyValueById,
}, dispatch))

/**
 * 我的简历
 */
export default class MyResume extends Component {
	constructor(props) {
		super(props);

		// 基本信息表单
		this.baseInfoForm = {
			name: '',
			city: '',
			sex: '',
			birth: '',
			freetime: '',
			class: '',
			type: '',
			intro: '',
		};

		this.state = {
			freetime: '',	// 档期
			isBaseInfoHover: false,	// 基本信息 hover
			isAvatarHover: false,	// 头像 hover
			isShowBaseInfoTipsModal: false,	// 是否显示基本信息提示模态框
			isShowAuthTipsModal: false,	// 是否显示认证弹窗
			isShowNoPermissionTipsModal: true,	// 是否显示没有权限提示对话框，这个默认是 true
		};

		// 是否是第一次填写基本信息表单，用来判断是否显示基本信息提示模态框
		this.isFirstFillnIBaseInfoForm = false;
	}

	componentWillMount() {
		const {
			user,
			fetchResumeDetail,
		} = this.props;

		const userId = user.get('objectId');	// 获得用户 Id
		fetchResumeDetail(userId);	// 获取简历详情

		// 如果之前没有进去过我的简历
		if (!store.get(constant.isEnterMyResume)) {
			// 在渲染我的简历页面时，将是否进去过我的简历标识置为 true
			store.set(constant.isEnterMyResume, true);
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

	// 校验权限
	verifyPermission() {
		const {
			user,
		} = this.props;

		// 校验认证状态
		const authState = user.get('authState');
		if (authState !== 'authed') {
			this.setState({
				isShowAuthTipsModal: true,
			});
			return false;
		}

		// 校验权限
		let isShowResume = false;	// 是否显示简历
		if (isCurrentUserHasResumePermission(user.toJS())) {
			isShowResume = true;
		}
		if (user.get('type') === 2) {
			// 影视机构无权限
			isShowResume = false;
		}
		if (!isShowResume) {
			this.setState({
				isShowNoPermissionTipsModal: true,
			});
		}
		return isShowResume;
	}

	// 关闭没有权限提示框
	handleCloseNoPermissionTipsModal() {
		this.setState({
			isShowNoPermissionTipsModal: false,
		});
	}

	// 改变简历锚点
	handleChangeRemuseAnchor(anchorNumber) {
		// console.log('anchorNumber', anchorNumber);

		const {
			changeResumeAnchor,
		} = this.props;

		// 切换至常态
		changeResumeAnchor(anchorNumber);

		switch (anchorNumber) {
			case 0:
				scrollToAnchor('baseInfoAnchor');
				break;
			case 1:
				scrollToAnchor('representativeWorksAnchor');
				break;
			case 2:
				scrollToAnchor('educationAnchor');
				break;
			default:
				break;
		}
	}

	// 简历下载点击
	handleResumeDownloadClick() {
		// console.log('简历下载');
		const {
			user,
			generateResumePdf,
		} = this.props;

		// 校验
		if (!this.verifyPermission()) {
			return false;
		}

		const userId = user.get('objectId');
		const username = user.get('username');
		generateResumePdf(userId, username);
	}

	// 简历预览点击
	handleResumePreviewClick() {
		const {
			user,
		} = this.props;

		// 校验
		if (!this.verifyPermission()) {
			return false;
		}

		const userId = user.get('objectId');

		// 默认正式环境
		let path = `http://www.yunlaiwu.com/resumedisplay?id=${userId}`;
		// 本地开发环境
		if (window.NODE_SERVER_ENV === 'development') {
			path = `http://waka.yunlaiwu.com:3000/resumedisplay?id=${userId}`;
		}
		// 测试环境
		if (window.NODE_SERVER_ENV === 'test') {
			// path = `http://testapi.yunlaiwu.com:8032/resumedisplay?id=${userId}`;
		}

		window.open(path);
	}

	// 关闭认证弹窗
	handleCloseAuthTipsModal() {
		this.setState({
			isShowAuthTipsModal: false,
		});
	}

	// 基本信息

	// 关闭基本信息提示模态框
	handleCloseBaseInfoTipsModal() {
		this.setState({
			isShowBaseInfoTipsModal: false,
		});
	}

	// 基本信息提示模态框知道了点击
	handleBaseInfoTipsModalAlreadyKnownClick() {
		const {
			user,
			saveResumeBaseInfo,
		} = this.props;

		const userId = user.get('objectId');	// 获得用户 Id
		this.baseInfoForm.id = userId;	// 把 id 放进去

		// 保存基本信息
		saveResumeBaseInfo(this.baseInfoForm);

		// 关闭模态框
		this.setState({
			isShowBaseInfoTipsModal: false,
		});
	}

	// 头像点击事件
	handleAvatarClick() {
		const {
			user,
			changeUploadAvatar,
		} = this.props;

		// 校验
		if (!this.verifyPermission()) {
			return false;
		}

		changeUploadAvatar({
			isShowModal: true,
		});
	}

	// 头像蒙层 MouseEnter
	handleAvatarMaskMouseEnter() {
		this.setState({
			isAvatarHover: true,
		});
	}

	// 头像蒙层 MouseLeave
	handleAvatarMaskMouseLeave() {
		this.setState({
			isAvatarHover: false,
		});
	}

	// 选择图片
	handleSelectImgChange(e) {

		const {
			changeUploadAvatar,
		} = this.props;

		// 校验文件扩展名是否正确
		const validEx = ['.jpg', '.png', '.jpeg', '.gif'];
		let extension = e.currentTarget.value;	// 这里拿到的是个路径
		extension = e.currentTarget.value.substr(e.currentTarget.value.lastIndexOf(".")).toLowerCase();	// 这里拿到的是个扩展名 .png
		changeUploadAvatar({
			imgExtension: extension,
		});
		// console.log('图片扩展名 extension', extension);
		if (validEx.indexOf(extension) === -1) {
			console.error('文件扩展名错误');
			return;
		}

		// 判断是否拿到文件
		let fileList = e.currentTarget.files;
		// console.log('fileList', fileList);
		if (!fileList || !fileList[0]) {
			console.error('fileList 中没有文件');
			return;
		}

		// 拿到文件后显示图片裁剪框
		changeUploadAvatar({
			isShowReactCrop: true,
		});
		// 使用 FileReader 读取文件
		let reader = new FileReader();
		const that = this;
		// 监听文件加载完成的回调
		reader.addEventListener('load', function () {
			// 这里可以拿到图片数据 reader.result 是特别特别长的一个 base64 字符串
			changeUploadAvatar({
				imgData: reader.result,
			});
		});
		reader.readAsDataURL(fileList[0]);	// 读取图片

		// 需要清空，防止重复提交同一个照片时不触发change事件
		e.currentTarget.value = '';
	}

	// 裁剪完成的回调
	handleReactCropComplete(crop, pixelCrop) {
		const {
			changeUploadAvatar,
		} = this.props;

		// 这里可以拿到裁剪完成的 crop 对象，是一个包含一些位置参数的对象
		changeUploadAvatar({
			crop: crop,
		});
	}

	// 上传头像模态框 确定
	handleUploadAvatarModalOk() {
		// console.log('上传头像模态框 确定');

		const {
			user,
			uploadAvatar,
			changeUploadAvatar,
			myresume,
		} = this.props;
		const userId = user.get('objectId');

		let crop = myresume.get('uploadAvatar').get('crop').toJS();
		const imgData = myresume.get('uploadAvatar').get('imgData');
		const imgExtension = myresume.get('uploadAvatar').get('imgExtension');	// 图片扩展名
		// console.log('裁剪 crop', crop);

		let image = new Image();	// 就是相当于新建了一个 <img> 标签
		const that = this;

		// 监听图片加载完毕
		image.addEventListener('load', function () {

			// 没有移动时，设置默认值
			if (!crop) {
				crop = {
					x: 0,
					y: 0,
					width: image.height >= image.width ? 75 : image.height * 100 / image.width
				};
			}

			// 在画布上画出图像
			let canvas = document.createElement('canvas');
			let cropWidth = (crop.width / 100) * image.width;
			let cropHeight = cropWidth;
			let cropX = (crop.x / 100) * image.width;
			let cropY = (crop.y / 100) * image.height;
			canvas.width = cropWidth;
			canvas.height = cropHeight;
			let ctx = canvas.getContext('2d');
			ctx.drawImage(image, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);

			let type = 'image/png';
			if (/jpg/.test(imgExtension) || /jpeg/.test(imgExtension)) {
				type = 'image/jpeg';
			}
			// 转换成 Blob 格式上传
			canvas.toBlob(b => {
				if (!b) {
					message.error('请选择图片');
					return;
				}
				// console.log('blob', b);
				let fd = new FormData();
				fd.append('avatar', b);
				fd.append('token', getCookie('X-AVOSCloud-Session-Token'));
				fd.append('userId', userId);
				fd.append('imgExtension', imgExtension);
				uploadAvatar(fd, userId);
			}, type);
		});
		// 加载图片
		image.src = imgData;
	}

	// 上传头像模态框 取消
	handleUploadAvatarModalCancel() {
		const {
			changeUploadAvatar,
		} = this.props;

		changeUploadAvatar({
			isShowModal: false,
			isShowReactCrop: false,
			crop: {
				x: 0,
				y: 0,
				width: 75,	// 宽度
				height: 75,
				aspect: 1,	// 宽高比
			},	// 裁剪参数对象
			imgData: '',	// 图像数据
			imgExtension: '',	// 文件扩展名
		});
	}

	// 基本信息编辑按钮点击事件
	handleBaseInfoEditClick() {
		const {
			myresume,
			user,
			changeBaseInfoEditStatus,
		} = this.props;

		// 校验
		if (!this.verifyPermission()) {
			return false;
		}

		// 关闭 hover 态
		this.setState({
			isBaseInfoHover: false
		});

		// 切换至编辑态
		changeBaseInfoEditStatus(true);
	}

	// 姓名 change
	handleNameChange(e) {
		// 清空表单项错误提示
		this._clearFormItemErrorTips();

		this.baseInfoForm.name = e.target.value;
	}

	// 所在城市 change
	handleCityChange(value, selectedOptions) {
		// 清空表单项错误提示
		this._clearFormItemErrorTips();

		// console.log('【handleCityChange】value', value, 'selectedOptions', selectedOptions);

		this.baseInfoForm.city = value.join('-');
	}

	// 性别 change
	handleSexChange(value) {
		// 清空表单项错误提示
		this._clearFormItemErrorTips();

		this.baseInfoForm.sex = value === '男' ? 1 : value === '女' ? 2 : 0;
	}

	// 出生日期 change
	handleBirthdayChange(date, dateStr) {
		// 清空表单项错误提示
		this._clearFormItemErrorTips();

		// console.log('date', date, 'dateStr', dateStr);
		this.baseInfoForm.birth = dateStr;
	}

	// 档期 change
	handleFreetimeChange(value) {
		// 清空表单项错误提示
		this._clearFormItemErrorTips();

		// 更新一下状态，这里有一个联动
		this.setState({
			freetime: value,
		});

		if (value === '随时有档期') {
			this.baseInfoForm.freetime = value;
		} else if (value === '指定日期') {
			// 如果原数据是 '随时有档期' 则清空，实现切换功能
			if (this.baseInfoForm.freetime === '随时有档期' || this.baseInfoForm.freetime === '暂不填写') {
				this.baseInfoForm.freetime = '';
			}
		} else if (value === '暂不填写') {
			this.baseInfoForm.freetime = value;
		}
	}

	// 档期-指定日期 change
	handleFreetimePointTimeChange(date, dateStr) {
		// 清空表单项错误提示
		this._clearFormItemErrorTips();

		this.baseInfoForm.freetime = dateStr;
	}

	// 擅长类别 change
	handleGoodAtCategoryChange(value) {
		// 清空表单项错误提示
		this._clearFormItemErrorTips();

		// console.log('【handleGoodAtCategoryChange】 value', value);
		this.baseInfoForm.class = value.join('、');
	}

	// 擅长类型 change
	handleGoodAtTypeChange(value) {
		// 清空表单项错误提示
		this._clearFormItemErrorTips();

		// console.log('【handleGoodAtTypeChange】 value', value);
		this.baseInfoForm.type = value.join('、');
	}

	// 个人介绍 change
	handleIntroChange(e) {
		// 清空表单项错误提示
		this._clearFormItemErrorTips();

		this.baseInfoForm.intro = e.target.value;
	}

	// 基本信息保存按钮点击
	handleBaseInfoSaveClick() {
		const {
			user,
			saveResumeBaseInfo,
		} = this.props;

		// console.log('this.baseInfoForm', this.baseInfoForm);

		// 校验
		if (!this._validateBaseInfoForm(this.baseInfoForm)) {
			return;
		}

		const userId = user.get('objectId');	// 获得用户 Id
		this.baseInfoForm.id = userId;	// 把 id 放进去

		// 判断是否是第一次保存基本信息
		if (this.isFirstFillnIBaseInfoForm) {
			// 是的话显示基本信息提示框
			this.setState({
				isShowBaseInfoTipsModal: true,
			});
		} else {
			// 保存基本信息
			saveResumeBaseInfo(this.baseInfoForm);
		}
	}

	/**
	 * 校验基本信息表单
	 * @param baseInfoForm
	 */
	_validateBaseInfoForm(baseInfoForm) {

		baseInfoForm = filterEmojiObj(baseInfoForm);

		baseInfoForm = removeHeadTailSpaceObject(baseInfoForm);

		const {
			formItemErrorTips,
		} = this.props;

		if (!baseInfoForm.name) {
			formItemErrorTips('formItem_name', '姓名不能为空');
			return false;
		}

		if (getLengthOfStringRemoveSpecialChar(baseInfoForm.name, /\s/g) > 20) {
			formItemErrorTips('formItem_name', '姓名不能超过20个字符');
			return false;
		}

		if (!baseInfoForm.city) {
			formItemErrorTips('formItem_city', '城市不能为空');
			return false;
		}

		if (!baseInfoForm.sex) {
			formItemErrorTips('formItem_sex', '性别不能为空');
			return false;
		}

		// if (!baseInfoForm.birth) {
		// 	formItemErrorTips('formItem_birth', '出生日期不能为空');
		// 	return false;
		// }

		if (!baseInfoForm.freetime) {
			formItemErrorTips('formItem_freetime', '档期不能为空');
			return false;
		}

		if (!baseInfoForm.class) {
			formItemErrorTips('formItem_class', '擅长类别不能为空');
			return false;
		}

		if (!baseInfoForm.type) {
			formItemErrorTips('formItem_type', '擅长类型不能为空');
			return false;
		}

		if (!baseInfoForm.intro) {
			formItemErrorTips('formItem_intro', '个人介绍不能为空');
			return false;
		}

		if (getLengthOfStringRemoveSpecialChar(baseInfoForm.intro, /\s/g) > 100) {
			formItemErrorTips('formItem_intro', '个人介绍不能超过100个字符');
			return false;
		}

		// console.log('baseInfoForm', baseInfoForm);

		return true;
	}

	// 基本信息取消按钮点击
	handleBaseInfoCancelClick() {
		const {
			changeBaseInfoEditStatus,
		} = this.props;

		this._clearFormItemErrorTips();
		this.setState({
			freetime: ''
		});

		// 切换至常态
		changeBaseInfoEditStatus(false);
	}

	// 代表作品

	// 代表作品添加按钮点击事件
	handleWorksAddBtnClick() {
		const {
			user,
			changeWorksAddStatus,
		} = this.props;

		// 校验
		if (!this.verifyPermission()) {
			return false;
		}

		// 切换至编辑状态
		changeWorksAddStatus(true);
	}

	// 增加代表作品保存按钮点击
	handleAddWorkSaveClick(workForm) {
		// console.log('workForm', workForm);

		const {
			user,
			addWork,
		} = this.props;

		const userId = user.get('objectId');

		addWork({
			id: userId,
			content: JSON.stringify(workForm),
		});
	}

	// 增加代表作品取消按钮点击
	handleAddWorkCancelClick() {

	}

	// 教育经历

	// 教育经历添加按钮点击事件
	handleEducationAddBtnClick() {
		const {
			user,
			changeEducationAddStatus,
		} = this.props;

		// 校验
		if (!this.verifyPermission()) {
			return false;
		}

		// 切换至添加教育经历状态
		changeEducationAddStatus(true);
	}

	// 添加教育经历取消点击事件
	handleAddEducationCancel() {
		const {
			changeEducationAddStatus,
		} = this.props;

		// 切换至常态
		changeEducationAddStatus(false);
	}

	render() {

		const {
			user,
			path,
			myresume,
		} = this.props;
		// console.log('user', user.toJS());

		const {
			isAvatarHover,
		} = this.state;
		// console.log('userId', user.get('objectId'));
		// console.log('myresume', myresume.toJS());

		let isShowResume = false;	// 是否显示简历
		let resumeErrorTips = '很抱歉，简历功能暂未开放';
		if (isCurrentUserHasResumePermission(user.toJS())) {
			isShowResume = true;
		}
		if (user.get('type') === 2) {
			resumeErrorTips = '很抱歉，简历功能暂不对版权机构代理人用户开放';
			isShowResume = false;
		}

		// 生成 PDF 结果
		const generateResumePdfResult = myresume.get('generateResumePdfResult');
		// console.log('生成 PDF 结果 generateResumePdfResult', generateResumePdfResult);

		// 获得简历详情
		const resumeDetail = myresume.get('resumeDetail');
		// console.log('resumeDetail', resumeDetail, typeof resumeDetail);

		// 获得简历详情状态
		const resumeDetailStatus = myresume.get('resumeDetailStatus');

		// 获得基本信息保存结果
		const baseInfoEditSaveResult = myresume.get('baseInfoEdit').get('saveResult');

		// 获得上传头像上传结果
		const uploadAvatarUploadResult = myresume.get('uploadAvatar').get('uploadResult');

		// 获得添加代表作品结果
		const addWorkResult = myresume.get('works').get('addWorkResult');

		// 获得编辑代表作品结果
		const editWorkByIdResult = myresume.get('works').get('editWorkByIdResult');

		// 获得删除代表作品结果
		const deleteWorkByIdResult = myresume.get('works').get('deleteWorkByIdResult');

		// 获得添加教育经历结果
		const addEducationResult = myresume.get('education').get('addEducationResult');

		// 获得编辑教育经历结果
		const editEducationByIdResult = myresume.get('education').get('editEducationByIdResult');

		// 获得删除教育经历结果
		const deleteEducationByIdResult = myresume.get('education').get('deleteEducationByIdResult');

		// 头像
		let avatar = 'https://yunlaiwu0.cn-bj.ufileos.com/resume_default_avatar.svg';	// 默认头像地址
		if (resumeDetail instanceof Map && resumeDetail.get('avatar')) {
			avatar = resumeDetail.get('avatar');
		}

		// 根据出生日期计算年龄
		let age = '';
		if (resumeDetail instanceof Map && resumeDetail.get('birth')) {
			age = getAge(resumeDetail.get('birth'));
		}

		// 档期；如果是日期的话需要加点东西
		let freetime = '';
		if (resumeDetail instanceof Map) {
			freetime = resumeDetail.get('freetime');
			// 校验档期是否是年月格式 xxxx-xx
			const regExpResult = /^\d{4}-\d{2}/.test(freetime);
			if (regExpResult) {
				const strArr = freetime.split('-');
				freetime = strArr[0] + '年' + strArr[1].replace(/^0/, '') + '月以后有档期';
			}
		}

		// 获得简历百分比
		const resumePercent = myresume.get('resumePercent');

		// 获得基本信息编辑状态
		let baseInfoEditStatus = myresume.get('baseInfoEdit').get('status');
		// baseInfoEditStatus = true;

		// 如果当前是非编辑状态并且简历详情存在，为什么一定要在非编辑状态呢？因为在编辑态表单频繁变动，无限 render，就没有作用了
		if (baseInfoEditStatus === false && resumeDetail) {
			this.baseInfoForm = {
				name: resumeDetail.get('name'),
				city: resumeDetail.get('city') ? resumeDetail.get('city') : '工作地不限',
				sex: resumeDetail.get('sex'),
				birth: resumeDetail.get('birth'),
				freetime: resumeDetail.get('freetime'),
				class: resumeDetail.get('class'),
				type: resumeDetail.get('type'),
				intro: resumeDetail.get('intro'),
			}
		}
		// 根据姓名是否填写来判断是否是第一次填写基本信息表单
		const resumeDetailName = resumeDetail.get('name');
		// console.log('resumeDetailName', resumeDetailName);
		this.isFirstFillnIBaseInfoForm = resumeDetailName === '';

		// 获得代表作品添加状态
		let worksAddStatus = myresume.get('works').get('addStatus');

		// 代表作品数组
		let works = [];
		works = myresume.get('works').get('array');
		// console.log('works', works.toJS());

		// 获得教育经历添加状态
		let educationAddStatus = myresume.get('education').get('addStatus');
		// educationAddStatus = true;

		// 教育经历数组
		let educations = [];
		educations = myresume.get('education').get('array');
		// console.log('educations', educations.toJS());

		// 获得简历锚点
		let resumeAnchor = myresume.get('resumeAnchor');

		// 获得表单项错误
		const formItemError = myresume.get('formItemError');
		const formItemErrorId = formItemError.get('formId');	// 表单ID
		const formItemErrorTips = formItemError.get('errorTips');	// 错误提示

		// console.log('this.baseInfoForm.city', this.baseInfoForm.city);
		// console.log('this.baseInfoForm.freetime', this.baseInfoForm.freetime);

		return <section className={styles.container}>
			{/* 自定义加载中 */}
			{resumeDetailStatus === 0 || baseInfoEditSaveResult === 0 || uploadAvatarUploadResult === 'loading' || addWorkResult === 0 || editWorkByIdResult === 0 || deleteWorkByIdResult === 0 || addEducationResult === 0 || editEducationByIdResult === 0 || deleteEducationByIdResult === 0
				? <SpinCustom isModal={true}/>
				: null
			}
			{/* 导航栏 */}
			<section className={styles.nav}>
				<Nav path={path}/>
			</section>
			{/* 右侧正文 */}
			<section className={styles.contentContainer}>
				<section className={styles.resume}>
					{/* 中间正文 */}
					<section className={styles.main}>

						{/* 基本信息锚点 */}
						<a id="baseInfoAnchor"
						   className={styles.anchor}
						   style={{
							   top: '-120px',	// 顶部padding20px；又padding20px；又手动调整误差
						   }}/>

						{/* 基本信息（未编辑状态） */}
						{!baseInfoEditStatus &&
						<section className={styles.baseInfoNoEdit}
								 onMouseEnter={() => {
									 this.setState({
										 isBaseInfoHover: true
									 });
								 }}
								 onMouseLeave={() => {
									 this.setState({
										 isBaseInfoHover: false
									 });
								 }}>
							{/*<section className={styles.mask}*/}
							{/*style={{*/}
							{/*opacity: this.state.isBaseInfoHover ? '1' : '0',*/}
							{/*}}/>*/}
							{/* 头部 */}
							<section className={styles.header}>
								{/* 右上角编辑按钮 */}
								{this.state.isBaseInfoHover &&
								<span className={styles.edit}
									  onClick={this.handleBaseInfoEditClick.bind(this)}>
										<i className="iconfont icon-bianji1"
										   style={{marginRight: '5px', fontSize: '14px'}}/>编辑
									</span>
								}
								{/* 头像 */}
								<section className={styles.avatarWrapper2}
										 onMouseEnter={this.handleAvatarMaskMouseEnter.bind(this)}
										 onMouseLeave={this.handleAvatarMaskMouseLeave.bind(this)}>
									<div className={styles.avatarWrapper}
										 style={{
											 backgroundImage: `url(${avatar})`
										 }}/>
									{/* 头像蒙层 */}
									{(isAvatarHover || avatar === 'https://yunlaiwu0.cn-bj.ufileos.com/resume_default_avatar.svg') &&
									<div className={styles.avatarMask}
										 onClick={this.handleAvatarClick.bind(this)}>
										{avatar === 'https://yunlaiwu0.cn-bj.ufileos.com/resume_default_avatar.svg'
											? '上传头像'
											: '重新上传'
										}
									</div>
									}
								</section>
								{/* 姓名 */}
								<div
									className={styles.name}>{resumeDetail && resumeDetail.get('name') ? resumeDetail.get('name') : '姓名'}</div>
								{/* 第三行 */}
								<section className={styles.row3}>
									<div
										className={styles.item}>{resumeDetail && resumeDetail.get('sex') === 1 ? '男' : resumeDetail && resumeDetail.get('sex') === 2 ? '女' : '性别'}</div>
									<div
										className={styles.item}>{resumeDetail && age !== '' ? age + '岁' : '年龄'}</div>
									<div
										className={styles.item}>{resumeDetail && resumeDetail.get('city') ? resumeDetail.get('city') : '期望工作城市'}</div>
									{/* 暂不填写时什么都不展示 */}
									{freetime !== '暂不填写' &&
									<div className={styles.item}>
										{resumeDetail && freetime ? freetime : '档期'}
									</div>
									}

								</section>
							</section>
							{/* 个人介绍 */}
							<section className={styles.personalIntroduction}>
								{/* 标题 */}
								<div className={styles.title}>个人介绍</div>
								{/* 分隔线 */}
								<div className={styles.divider}/>
								{/* 内容 */}
								<div
									className={styles.content}>{resumeDetail && resumeDetail.get('intro') ? resumeDetail.get('intro') : ''}</div>
							</section>
							{/* 擅长类别 */}
							{resumeDetail instanceof Map && resumeDetail.get('class') &&
							<section className={styles.goodAtCategory}>
								{/* 标题 */}
								<div className={styles.title}>擅长类别</div>
								{/* 分隔线 */}
								<div className={styles.divider}/>
								{/* 内容 */}
								<div
									className={styles.content}>{resumeDetail && resumeDetail.get('class')}</div>
							</section>
							}
							{/* 擅长类型 */}
							{resumeDetail instanceof Map && resumeDetail.get('type') &&
							<section className={styles.goodAtType}>
								{/* 标题 */}
								<div className={styles.title}>擅长类型</div>
								{/* 分隔线 */}
								<div className={styles.divider}/>
								{/* 内容 */}
								<div className={styles.content}>{resumeDetail && resumeDetail.get('type')}</div>
							</section>
							}
						</section>
						}

						{/* 基本信息（编辑状态） */}
						{baseInfoEditStatus &&
						<section className={styles.baseInfoEdit}>
							<section className={styles.avatarWrapper3}>
								<section className={styles.avatarWrapper2}
										 onMouseEnter={this.handleAvatarMaskMouseEnter.bind(this)}
										 onMouseLeave={this.handleAvatarMaskMouseLeave.bind(this)}>
									{/* 头像 */}
									<div className={styles.avatarWrapper}
										 style={{
											 backgroundImage: `url(${avatar})`
										 }}/>
									{/* 头像蒙层 */}
									{isAvatarHover &&
									<div className={styles.avatarMask}
										 onClick={this.handleAvatarClick.bind(this)}>
										重新上传
									</div>
									}
								</section>
							</section>
							{/* 表单区域 */}
							<section className={styles.formSection}>
								<div className={styles.title}>基本信息
									{/*<span className={styles.tips}>（简历的基本信息填写后即会被推荐给影视方，简历完善度越高越易受到青睐）</span>*/}
								</div>
								<div className={styles.divider}/>
								{/* row1 */}
								<section className={styles.row1}>
									{/* 姓名 */}
									<section className={styles.label}>
										<div className={styles.text}><span className={styles.asterisk}>*</span>姓名
										</div>
										<Input id="formItem_name"
											   defaultValue={this.baseInfoForm.name}
											   className={styles.input}
											   placeholder="20字以内"
											   onChange={this.handleNameChange.bind(this)}
											   style={{
												   borderColor: formItemErrorId === 'formItem_name' && 'red'
											   }}/>
										{/* 错误提示 */}
										{formItemErrorId === 'formItem_name' &&
										<div className={styles.errorTips}>
											{formItemErrorTips}
										</div>
										}
									</section>
									{/* 期望工作城市 */}
									<section className={styles.label}>
										<div className={styles.text}><span className={styles.asterisk}>*</span>期望工作城市
										</div>
										<section className={styles.input}
												 style={{
													 boxShadow: formItemErrorId === 'formItem_city' && '0 0 0 1px red'
												 }}>
											<Cascader id="formItem_city"
													  defaultValue={this.baseInfoForm.city ? this.baseInfoForm.city.split('-') : ['工作地不限']}
													  placeholder="选择城市"
													  options={cascaderCityOptions}
													  changeOnSelect    // 选择即改变：这种交互允许只选中父级选项
													  className={styles.cascader}
													  onChange={this.handleCityChange.bind(this)}/>
										</section>
										{/* 错误提示 */}
										{formItemErrorId === 'formItem_city' &&
										<div className={styles.errorTips}>
											{formItemErrorTips}
										</div>
										}
									</section>
								</section>
								{/* row2 */}
								<section className={styles.row2}>
									{/* 性别 */}
									<section className={styles.label}>
										<div className={styles.text}><span className={styles.asterisk}>*</span>性别
										</div>
										<section className={styles.selectWrapper}
												 style={{
													 boxShadow: formItemErrorId === 'formItem_sex' && '0 0 0 1px red'
												 }}>
											<Select id="formItem_sex"
													defaultValue={this.baseInfoForm.sex === 1 ? '男' : this.baseInfoForm.sex === 2 ? '女' : undefined}
													className={styles.select}
													placeholder="选择性别"
													onChange={this.handleSexChange.bind(this)}>
												<Select.Option value="男">男</Select.Option>
												<Select.Option value="女">女</Select.Option>
											</Select>
										</section>
										{/* 错误提示 */}
										{formItemErrorId === 'formItem_sex' &&
										<div className={styles.errorTips}>
											{formItemErrorTips}
										</div>
										}
									</section>
									{/* 出生日期 */}
									<section className={styles.label}>
										<div className={styles.text}><span className={styles.asterisk}>&nbsp;</span>出生年月（选填）
										</div>
										<section className={styles.datePickerWrapper}
												 style={{
													 boxShadow: formItemErrorId === 'formItem_birth' && '0 0 0 1px red'
												 }}>
											<DatePicker.MonthPicker
												id="formItem_birth"
												defaultValue={this.baseInfoForm.birth ? moment(this.baseInfoForm.birth) : null}
												placeholder="选择日期"
												style={{
													width: '100%'
												}}
												disabledDate={(current) => {
													// 今天之后的日期不能选
													return current && current.valueOf() > Date.now();
												}}
												onChange={this.handleBirthdayChange.bind(this)}/>
										</section>
										{/* 错误提示 */}
										{formItemErrorId === 'formItem_birth' &&
										<div className={styles.errorTips}>
											{formItemErrorTips}
										</div>
										}
									</section>
								</section>
								{/* row3 */}
								<section className={styles.row3}>
									{/* 档期 */}
									<section className={styles.label}>
										<div className={styles.text}><span className={styles.asterisk}>*</span>档期
										</div>
										<section className={styles.selectWrapper}
												 style={{
													 boxShadow: formItemErrorId === 'formItem_freetime' && '0 0 0 1px red'
												 }}>
											<Select id="formItem_freetime"
													defaultValue={this.baseInfoForm.freetime === '随时有档期' ? '随时有档期' : this.baseInfoForm.freetime === '暂不填写' ? '暂不填写' : this.baseInfoForm.freetime ? '指定日期' : undefined}
													className={styles.select}
													placeholder="选择档期"
													onChange={this.handleFreetimeChange.bind(this)}>
												<Select.Option value="随时有档期">随时有档期</Select.Option>
												<Select.Option value="指定日期">指定日期</Select.Option>
												<Select.Option value="暂不填写">暂不填写</Select.Option>
											</Select>
										</section>
										{/* 错误提示 */}
										{formItemErrorId === 'formItem_freetime' &&
										<div className={styles.errorTips}>
											{formItemErrorTips}
										</div>
										}
									</section>
									{/* 档期日期 */}
									{(this.state.freetime === '指定日期' || (this.baseInfoForm.freetime && this.baseInfoForm.freetime !== '随时有档期' && this.baseInfoForm.freetime !== '暂不填写')) &&
									<section className={styles.label}>
										<div className={styles.text}><span
											className={styles.asterisk}>&nbsp;</span>
										</div>
										<section className={styles.datePickerWrapper}
												 style={{
													 boxShadow: formItemErrorId === 'formItem_freetime' && '0 0 0 1px red'
												 }}>
											<DatePicker.MonthPicker
												defaultValue={/^\d{4}-\d{2}/.test(this.baseInfoForm.freetime) ? moment(this.baseInfoForm.freetime) : undefined}
												placeholder="请选择指定日期"
												style={{
													width: '100%'
												}}
												onChange={this.handleFreetimePointTimeChange.bind(this)}/>
											<span className={styles.extraTips}>以后</span>
										</section>
										{/* 错误提示 */}
										{formItemErrorId === 'formItem_freetime' &&
										<div className={styles.errorTips}>
											{formItemErrorTips}
										</div>
										}
									</section>
									}
								</section>
								{/* row4 */}
								<section className={styles.row4}>
									{/* 擅长类别 */}
									<section className={styles.label}>
										<div className={styles.text}><span className={styles.asterisk}>*</span>擅长类别
										</div>
										<section className={styles.input}
												 style={{
													 boxShadow: formItemErrorId === 'formItem_class' && '0 0 0 1px red'
												 }}>
											{/* 多选框 */}
											<MultiSelect
												id="formItem_class"
												defaultValue={this.baseInfoForm.class ? this.baseInfoForm.class.split('、') : null}
												isHasMostGoodAt={true}
												tipsName="类别"
												placeholder="选择类别"
												items={['电影', '电视剧', '网剧', '网络大电影', '动画', '舞台剧', '栏目剧']}
												onChange={this.handleGoodAtCategoryChange.bind(this)}/>
										</section>
										{/* 错误提示 */}
										{formItemErrorId === 'formItem_class' &&
										<div className={styles.errorTips}>
											{formItemErrorTips}
										</div>
										}
									</section>
									{/* 擅长类型 */}
									<section className={styles.label}>
										<div className={styles.text}><span className={styles.asterisk}>*</span>擅长类型
										</div>
										<section className={styles.input}
												 style={{
													 boxShadow: formItemErrorId === 'formItem_type' && '0 0 0 1px red'
												 }}>
											{/* 多选框 */}
											<MultiSelect
												defaultValue={this.baseInfoForm.type ? this.baseInfoForm.type.split('、') : null}
												id="formItem_type"
												placeholder="选择类型"
												tipsName="类型"
												items={['爱情', '喜剧', '青春', '剧情', '悬疑', '惊悚', '古装', '奇幻', '科幻', '动作', '犯罪', '冒险', '家庭', '励志', '儿童', '武侠', '战争', '历史']}
												onChange={this.handleGoodAtTypeChange.bind(this)}/>
										</section>
										{/* 错误提示 */}
										{formItemErrorId === 'formItem_type' &&
										<div className={styles.errorTips}>
											{formItemErrorTips}
										</div>
										}
									</section>
								</section>
								{/* row5 */}
								<section className={styles.row5}>
									{/* 个人介绍 */}
									<section className={styles.labelFullWidth}>
										<div className={styles.text}><span className={styles.asterisk}>*</span>个人介绍
										</div>
										<Input id="formItem_intro"
											   defaultValue={this.baseInfoForm.intro}
											   className={styles.textarea}
											   placeholder="个人经历、特长等，更好的展示自己，100字以内"
											   type="textarea"
											   rows={4}
											   autosize={{
												   minRows: 6,
												   maxRows: 10
											   }}
											   onChange={this.handleIntroChange.bind(this)}
											   style={{
												   borderColor: formItemErrorId === 'formItem_intro' && 'red'
											   }}/>
										{/* 错误提示 */}
										{formItemErrorId === 'formItem_intro' &&
										<div className={styles.errorTipsTextArea}>
											{formItemErrorTips}
										</div>
										}
									</section>
								</section>
								{/* row6 按钮栏 */}
								<section className={styles.row6}>
									<div className={styles.btnSave}
										 onClick={this.handleBaseInfoSaveClick.bind(this)}>保存
									</div>
									<div className={styles.btnCancel}
										 onClick={this.handleBaseInfoCancelClick.bind(this)}>取消
									</div>
								</section>
							</section>
						</section>
						}

						{/* 代表作品锚点 */}
						<a id="representativeWorksAnchor" className={styles.anchor}/>

						{/* 代表作品 */}
						<section className={styles.representativeWorks}>

							{/* 标题 */}
							<div className={styles.title}>代表作品</div>
							{/* 分隔线 */}
							<div className={styles.divider}/>
							{/* 代表作品列表 */}
							<ul className={styles.worksList}>
								{works.map((item, index) => {
									// 代表作品项
									return <WorkItem data={item.toJS()}
													 key={item.get('id')}/>;
								})}
							</ul>
							{/* 添加按钮（未编辑状态） */}
							{!worksAddStatus &&
							<div className={styles.btnAddWrapper}>
								<div className={styles.btnAdd}
									 onClick={this.handleWorksAddBtnClick.bind(this)}>
									<i className="iconfont icon-jiaocutianjia"
									   style={{
										   marginRight: '5px',
										   fontSize: '18px'
									   }}/>添加
								</div>
							</div>
							}

							{/* 增加代表作品表单区域（编辑状态） */}
							{worksAddStatus &&
							<WorkForm mode='add'
									  data={
										  {
											  content: {}
										  }
									  }
									  onConfirm={this.handleAddWorkSaveClick.bind(this)}
									  onCancel={this.handleAddWorkCancelClick.bind(this)}/>
							}
						</section>

						{/* 教育经历锚点 */}
						<a id="educationAnchor" className={styles.anchor}/>

						{/* 教育经历 */}
						<section className={styles.education}>

							{/* 标题 */}
							<div className={styles.title}>教育经历</div>
							{/* 分隔线 */}
							<div className={styles.divider}/>
							{/* 教育经历列表 */}
							<ul className={styles.educationList}>
								{educations.map((item, index) => {
									// 教育经历项
									return <EducationItem data={item.toJS()}
														  key={item.get('id')}/>;
								})}
							</ul>
							{/* 添加按钮（未编辑状态） */}
							{!educationAddStatus &&
							<div className={styles.btnAddWrapper}>
								<div className={styles.btnAdd}
									 onClick={this.handleEducationAddBtnClick.bind(this)}>
									<i className="iconfont icon-jiaocutianjia"
									   style={{
										   marginRight: '5px',
										   fontSize: '18px'
									   }}/>添加
								</div>
							</div>
							}

							{/* 增加教育经历表单区域（编辑状态） */}
							{educationAddStatus &&
							<EducationForm mode="add"
										   onCancel={this.handleAddEducationCancel.bind(this)}/>
							}

						</section>
					</section>
					{/* 右侧侧边栏 */}
					<section className={styles.right}>
						{/* 上方栏 */}
						<section className={styles.top}>
							{/* 简历下载项 */}
							<div className={styles.item}
								 onClick={this.handleResumeDownloadClick.bind(this)}>
								<i className="iconfont icon-jianlixiazai"
								   style={{
									   fontSize: '28px'
								   }}/>
								<span className={styles.text}>简历下载</span>
							</div>
							{/* 简历预览项 */}
							<div className={styles.item}
								 onClick={this.handleResumePreviewClick.bind(this)}>
								<i className="iconfont icon-jianliguanli"
								   style={{
									   fontSize: '28px'
								   }}/>
								<span className={styles.text}>简历预览</span>
							</div>
						</section>
						{/* 下方栏 */}
						<section className={styles.bottom}>
							{/* 简历完成度 */}
							<section className={styles.completeness}>
								<span className={styles.resumeCompleteness}>简历完成度：</span><span
								className={styles.number}>{resumePercent}%</span>
							</section>
							{/* 分隔线 */}
							<div className={styles.divider}/>
							{/* 锚点区域 */}
							<section>
								{/* 基本信息 */}
								<section className={styles.baseInfo}
										 style={{
											 // background: resumeAnchor === 0 && '#f5f5f5'
										 }}
										 onClick={this.handleChangeRemuseAnchor.bind(this, 0)}>
									<i className="iconfont icon-jibenxinxi"
									   style={{
										   fontSize: '20px',
										   marginLeft: '25px',
										   marginRight: '30px'
									   }}/>
									<span className={styles.text}>基本信息</span>
									{resumeDetail && resumeDetail.get('name') &&
									<i className="iconfont icon-done"
									   style={{
										   fontSize: '18px',
										   position: 'absolute',
										   top: '17px',
										   right: '25px',
									   }}/>
									}
								</section>
								{/* 代表作品 */}
								<section className={styles.works}
										 style={{
											 // background: resumeAnchor === 1 && '#f5f5f5'
										 }}
										 onClick={this.handleChangeRemuseAnchor.bind(this, 1)}>
									<i className="iconfont icon-daibiaozuopin"
									   style={{
										   fontSize: '18px',
										   marginLeft: '26px',
										   marginRight: '31px'
									   }}/>
									<span className={styles.text}>代表作品</span>
									{works.size > 0 &&
									<i className="iconfont icon-done"
									   style={{
										   fontSize: '18px',
										   position: 'absolute',
										   top: '17px',
										   right: '25px',
									   }}/>
									}
								</section>
								{/* 教育经历 */}
								<section className={styles.education}
										 style={{
											 // background: resumeAnchor === 2 && '#f5f5f5'
										 }}
										 onClick={this.handleChangeRemuseAnchor.bind(this, 2)}>
									<i className="iconfont icon-jiaoyujingli"
									   style={{
										   fontSize: '20px',
										   marginLeft: '25px',
										   marginRight: '30px'
									   }}/>
									<span className={styles.text}>教育经历</span>
									{educations.size > 0 &&
									<i className="iconfont icon-done"
									   style={{
										   fontSize: '18px',
										   position: 'absolute',
										   top: '17px',
										   right: '25px',
									   }}/>
									}
								</section>
							</section>
						</section>
					</section>
				</section>
			</section>
			{/* 简历第一次填写基本信息完成后的模态框 */}
			{this.state.isShowBaseInfoTipsModal &&
			<Modal2 width="500px"
					height="271px"
					onCloseClick={this.handleCloseBaseInfoTipsModal.bind(this)}>
				<section className={styles.baseInfoompletemModal}>
					<i className="iconfont icon-tuisong"
					   style={{
						   fontSize: '50px',
					   }}/>
					<div className={styles.title}>基本信息完成后，我们即会将您的简历推荐给影视方</div>
					<div className={styles.title2}>出了基本信息外，完善度越高的简历，越易受到影视方的青睐</div>
					<div className={styles.btn}
						 onClick={this.handleBaseInfoTipsModalAlreadyKnownClick.bind(this)}>知道了
					</div>
				</section>
			</Modal2>
			}

			{/* 没有权限提示对话框 */}
			{this.state.isShowNoPermissionTipsModal && !isShowResume &&
			<Modal2 onCloseClick={this.handleCloseNoPermissionTipsModal.bind(this)}>
				<section className={styles.noPermissionTipsModal}>
					<i className="iconfont icon-baoqian"
					   style={{
						   fontSize: '60px',
						   color: '#596377'
					   }}/>
					<div className={styles.tips}>
						{resumeErrorTips}
						<br/>
						我们正在紧锣密鼓开发中，敬请期待...
					</div>
					<div className={styles.btn}
						 onClick={this.handleCloseNoPermissionTipsModal.bind(this)}>
						知道了
					</div>
				</section>
			</Modal2>
			}

			{/* 认证弹窗 */}
			{this.state.isShowAuthTipsModal &&
			<Modal2 width="400px"
					height="370px"
					onCloseClick={this.handleCloseAuthTipsModal.bind(this)}>
				<section className={styles.authTipsModal}>
					<div className={styles.title1}>请完成实名认证</div>
					<div className={styles.content}>为了保障您的权益和简历信息真实有效</div>
					<div className={styles.title2}>实名会员权益</div>
					<div className={styles.content}>填写简历，推荐给10000+影视人</div>
					<div className={styles.content}>上传作品，快速出售版权</div>
					<div className={styles.content}>投递征稿，直接触达影视方</div>
					<a className={styles.btn}
					   href="https://www.yunlaiwu.com/auth/index"
					   target="_blank"
					   onClick={() => {
						   this.setState({
							   isShowAuthTipsModal: false,
						   })
					   }}>立即认证</a>
					<div className={styles.content2}>
						<i className="iconfont icon-zhuyi"
						   style={{
							   color: '#434c5f',
							   fontSize: '13px',
							   marginRight: '8px',
						   }}/>
						简历功能暂不对版权代理人用户开放，敬请期待
					</div>
				</section>
			</Modal2>
			}

			{/* 简历下载模态框 */}
			<Modal title="简历下载"
				   visible={generateResumePdfResult === 'loading'}
				   footer={null}>
				<section className={styles.resumeDownloadModal}>
					<div className={styles.divider}/>
					<Spin size="large"/>
					<p className={styles.text}>正在努力生成PDF文件，请稍后...</p>
				</section>
			</Modal>
			{/* 上传头像模态框 */}
			<Modal title="上传头像"
				   visible={myresume instanceof Map && myresume.get('uploadAvatar').get('isShowModal')}
				   onOk={this.handleUploadAvatarModalOk.bind(this)}
				   onCancel={this.handleUploadAvatarModalCancel.bind(this)}>
				<section className={styles.uploadAvatarModal}>
					{/* 选择图片 */}
					<div className={styles.selectImg}>
						选择图片
						<input type="file"
							   onChange={this.handleSelectImgChange.bind(this)}
							   accept=".jpg,.png,.jpeg,.gif"/>
					</div>
					{/* 图片裁剪器 */}
					{myresume instanceof Map && myresume.get('uploadAvatar').get('isShowReactCrop') &&
					<ReactCrop src={myresume instanceof Map && myresume.get('uploadAvatar').get('imgData')}
							   crop={myresume instanceof Map && myresume.get('uploadAvatar').get('crop').toJS()}
							   onComplete={this.handleReactCropComplete.bind(this)}/>
					}
				</section>
			</Modal>
		</section>;
	}
}
