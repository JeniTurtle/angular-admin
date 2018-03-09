import React, {
	Component
} from 'react';

import PropTypes from 'prop-types';

// 样式
import styles from './CopyrightProtectionCertificateModal.scss';

// antd
import {
	Input,
	Spin,	// 加载中
} from 'antd';

// redux
import {
	bindActionCreators
} from 'redux';
import {
	connect
} from 'react-redux';

import {
	initCopyrightProtection,
	copyrightProtectionAssociationByCopyId,
	changeCurrentCopyrightProtectionErrorTips,
	getWorkDetailByCopyId,
	setWorkDetailByCopyId,
} from '../../actions/CopyrightProtectionAssociationModal';

@connect(state => ({
	user: state.get('user'),
	copyrightProtectionAssociationModal: state.get('copyrightProtectionAssociationModal'),
}), dispatch => bindActionCreators({
	copyrightProtectionAssociationByCopyId: copyrightProtectionAssociationByCopyId.bind(this, dispatch),
	getWorkDetailByCopyId: getWorkDetailByCopyId.bind(this, dispatch),
	setWorkDetailByCopyId: setWorkDetailByCopyId,
	changeCurrentCopyrightProtectionErrorTips: changeCurrentCopyrightProtectionErrorTips,
	initCopyrightProtection: initCopyrightProtection,
}, dispatch))

/**
 * 版保关联证书弹窗
 */
export default class CopyrightProtectionCertificateModal extends Component {

	// 定义属性类型
	static propTypes = {
		dciUrl: PropTypes.string,	// dci 证书图片路径
		leanId: PropTypes.string,	// leancloud ippre表objectId
		workTitle: PropTypes.string,	// 作品名
		onClose: PropTypes.func,	// 关闭事件
	};

	// 设置默认属性
	static defaultProps = {
		dciUrl: '',
		leanId: '',
		workTitle: '',
		onClose: null,
	};

	constructor(props) {
		super(props);

		this.state = {
			isShowChangeModal: false,	// 是否显示更换关联的证书
		};

		this.currentHandCopyId = '';	// 当前手动输入的版保号
	}

	componentWillMount() {
	}

	componentWillUnmount() {
		const {
			initCopyrightProtection,
		} = this.props;

		// 初始化版保数据
		initCopyrightProtection();
	}

	// 关闭按钮点击
	handleCloseClick() {
		// console.log('关闭按钮');
		if (this.props.onClose) {
			this.props.onClose();
		}
	}

	// 切换至关联的证书
	handleChangeAssociatedCertificateClick() {
		this.setState({
			isShowChangeModal: true,
		});
	}

	// 手动输入版保号 change
	handleHandInputCopyIdChange(e) {
		// console.log(e.target.value);
		const {
			getWorkDetailByCopyId,
			setWorkDetailByCopyId,
		} = this.props;

		this.currentHandCopyId = e.target.value;

		// 清空错误提示
		this.props.changeCurrentCopyrightProtectionErrorTips({
			errorTips: '',
			color: ''
		});

		if (e.target.value.length === 32) {
			getWorkDetailByCopyId(e.target.value);
		} else {
			setWorkDetailByCopyId({
				data: {},
				isLoading: false,
			})
		}
	}

	// 确定按钮点击
	handleConfirmClick() {
		const {
			leanId,
			copyrightProtectionAssociationByCopyId,
			changeCurrentCopyrightProtectionErrorTips,
		} = this.props;

		if (!this.currentHandCopyId) {
			changeCurrentCopyrightProtectionErrorTips({
				errorTips: '版保关联号不能为空',
				color: 'red'
			});
			return;
		}
		const data = {
			copyId: this.currentHandCopyId,
			leanId: leanId,
		};
		// console.log('版保关联数据（手动输入版保号做关联） data', data);
		copyrightProtectionAssociationByCopyId(data);
	}

	render() {

		const {
			dciUrl,
			copyrightProtectionAssociationModal,
		} = this.props;

		// 错误提示
		const currentCopyrightProtectionErrorTips = copyrightProtectionAssociationModal.get('currentCopyrightProtectionErrorTips').toJS();
		// console.log('currentCopyrightProtectionErrorTips', currentCopyrightProtectionErrorTips);

		// 版保关联相关
		const copyrightProtectionAssociationByCopyid = copyrightProtectionAssociationModal.get('copyrightProtectionAssociationByCopyid').toJS();
		// 版保关联加载状态
		const copyrightProtectionAssociationByCopyidIsLoading = copyrightProtectionAssociationByCopyid.isLoading;
		// 版保关联是否成功标识
		const copyrightProtectionAssociationByCopyidIsSuccess = copyrightProtectionAssociationByCopyid.isSuccess;
		// 如果关联成功，关闭对话框
		if (copyrightProtectionAssociationByCopyidIsSuccess) {
			this.handleCloseClick();
		}

		// 根据 copyId 获得的作品标题
		const workTitleByCopyId = copyrightProtectionAssociationModal.get('workDetailByCopyId').toJS().data.title;
		// console.log('workDetailByCopyId', copyrightProtectionAssociationModal.get('workDetailByCopyId').toJS());

		return <section className={styles.wrapper}>
			<section className={styles.main}>

				{/* 关闭按钮 */}
				<i className="iconfont icon-close"
				   style={{
					   color: '#d4d9e2',
					   position: 'absolute',
					   top: '17px',
					   right: '17px',
					   cursor: 'pointer',
				   }}
				   onClick={this.handleCloseClick.bind(this)}/>

				{/* 版权保护证书 */}
				{!this.state.isShowChangeModal &&
				<section className={styles.copyrightProtectionCertificate}>
					<div className={styles.title}>版权保护证书</div>
					<img className={styles.img}
						 src={dciUrl}
						 alt="版保证书"
						 width={420}
						 height={300}/>
					<div className={styles.bottom}
						 onClick={this.handleChangeAssociatedCertificateClick.bind(this)}>更换关联的证书
					</div>
				</section>
				}

				{/* 更换关联证书 */}
				{this.state.isShowChangeModal &&
				<Spin size="large"
					  spinning={copyrightProtectionAssociationByCopyidIsLoading}>
					<section className={styles.changeAssociatedCertificate}>
						<div className={styles.title}>更换关联证书</div>
						<div className={styles.row1}>如果此作品和证书的关联不匹配，请通过版保关联号更新</div>
						<div className={styles.row2}>
							<Input className={styles.input}
								   placeholder="版保关联号"
								   onChange={this.handleHandInputCopyIdChange.bind(this)}
								   defaultValue={this.currentHandCopyId}
								   style={{
									   borderColor: currentCopyrightProtectionErrorTips.color === 'red' && currentCopyrightProtectionErrorTips.color
								   }}/>
							<section className={styles.tips}>
								{!currentCopyrightProtectionErrorTips.errorTips && workTitleByCopyId &&
								<div className={styles.workTitleTips}
									 title={`《${workTitleByCopyId}》`}>
									作品《{workTitleByCopyId}》
								</div>
								}
								{currentCopyrightProtectionErrorTips.errorTips &&
								<div className={styles.errorTips}
									 style={{
										 color: currentCopyrightProtectionErrorTips.color && currentCopyrightProtectionErrorTips.color
									 }}>
									{currentCopyrightProtectionErrorTips.errorTips}
								</div>
								}
							</section>
						</div>
						<div className={styles.btn}
							 onClick={this.handleConfirmClick.bind(this)}>确定
						</div>
						<div className={styles.tips3}>什么是版保关联号？</div>
						<div className={styles.tips4}>
							版保关联号用于将作品与作品的版保证书进行关联。<br/>
							当您在云莱坞交易平台上传作品时，如果此作品已在云莱坞版保中心进行了版保，就可以通过版保关联号为此作品打上版保的标志C。
						</div>
						<div className={styles.tips3}>如何获取版保关联号？</div>
						<img className={styles.img2}
							 width={400}
							 height={130}
							 src="//yunlaiwu0.cn-bj.ufileos.com/copyrightProtectionAssociation.png"
							 alt=""/>
					</section>
				</Spin>
				}
			</section>
		</section>
	}
}
