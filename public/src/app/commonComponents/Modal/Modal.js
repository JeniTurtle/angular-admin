/**
 * Created by waka on 2017/4/5.
 */

// React
import React, {
	Component,
} from 'react';

import PropTypes from 'prop-types';

// CSS modules
import styles from './Modal.scss';

// 引入图标
import closeIcon from './close.svg';	// 关闭

import {
	Button,	// 按钮
} from '../../commonComponents';

/**
 * 绑定手机号对话框
 */
export default class Modal extends Component {

	// 定义属性类型
	static propTypes = {
		zIndex: PropTypes.number,	// z-index的值
		isPure: PropTypes.bool,	// 是否纯净
		isShow: PropTypes.bool,	// 是否显示
		title: PropTypes.string,	// 对话框标题
		content: PropTypes.string,	// 内容
		errorTips: PropTypes.string,	// 错误提示
		onOK: PropTypes.func,		// 点击确定回调
		onCancel: PropTypes.func,	// 点击遮罩层或右上角叉或取消按钮的回调
		width: PropTypes.number,	// 宽度
		okText: PropTypes.string,// 确定按钮文字
		cancelText: PropTypes.string,	// 取消按钮文字
		okType: PropTypes.string,	// 确定按钮的类型
		isShowButtons: PropTypes.bool,	// 是否显示按钮栏
	};

	// 设置默认属性
	static defaultProps = {
		zIndex: 999,
		isPure: false,
		isShow: true,
		title: '',
		content: '',
		errorTips: '',
		onOk: null,
		onCancel: null,
		width: 460,
		okText: '确定',
		cancelText: '取消',
		okType: 'primary',
		isShowButtons: true,
	};

	render() {
		return (
			<div>
				{this.props.isShow
					? <section
						className={styles.modalWrapper}
						style={{
							zIndex: this.props.zIndex
						}}>

						{/* 对话框 */}
						<div className={styles.modal}
							 style={{
								 width: this.props.width
							 }}>

							{/* 判断是否纯净 */}
							{this.props.isPure
								// 纯净
								? <div>{this.props.children}</div>
								// 带标题栏和确定取消按钮
								: <section>
									{/* 标题栏 */}
									<div className={styles.title}>
										{/* 标题 */}
										<span className={styles.titleText}>{this.props.title}</span>
										{/* 关闭按钮 */}
										<img className={styles.closeIcon} src={closeIcon}
											 onClick={() => {
												 if (this.props.onCancel) {
													 this.props.onCancel();
												 }
											 }}/>
									</div>

									{/* 内容 */}
									{this.props.content
										? <div className={styles.content}>
											{this.props.content}
										</div>
										: null
									}

									{/* 放置子元素 */}
									{this.props.children}

									{this.props.isShowButtons
										// 按钮栏
										? <div className={styles.buttons}>

											{
												// 错误提示
												this.props.errorTips &&
												<div className={styles.errorTips}>
													{this.props.errorTips}
												</div>
											}

											{/* 确定 */}
											<div className={styles.confirm}>
												<Button type={this.props.okType}
														onClick={() => {
															if (this.props.onOK) {
																this.props.onOK();
															}
														}}>{this.props.okText}</Button>
											</div>
											{/* 取消 */}
											<div className={styles.cancel}>
												<Button onClick={() => {
													if (this.props.onCancel) {
														this.props.onCancel();
													}
												}}>{this.props.cancelText}</Button>
											</div>
										</div>
										: null
									}

								</section>
							}
						</div>
					</section>
					: null
				}
			</div>
		);
	}
};
