import React, {
	Component,
} from 'react';

import PropTypes from 'prop-types';

import Modal from '../Modal/Modal';

import styles from './ConfirmModal.scss';

/**
 * 确认对话框
 */
export default class ConfirmModal extends Component {

	// 定义属性类型
	static propTypes = {
		tips: PropTypes.string,
		onConfirm: PropTypes.func,
		onCancel: PropTypes.func,
	};

	// 设置默认属性
	static defaultProps = {
		tips: '',
		onConfirm: null,
		onCancel: null,
	};

	handleConfirmClick() {
		const {
			onConfirm
		} = this.props;

		if (onConfirm) {
			onConfirm();
		}
	}

	handleCancelClick() {
		const {
			onCancel
		} = this.props;

		if (onCancel) {
			onCancel();
		}
	}

	render() {

		const {
			tips,
		} = this.props;

		return (
			<Modal isShowClose={false}>
				<section className={styles.confirmModal}>
					<div className={styles.tips}>{tips}</div>
					<div className={styles.bottomBtnRow}>
						<div className={styles.confirm}
							 onClick={this.handleConfirmClick.bind(this)}>确定
						</div>
						<div className={styles.cancel}
							 onClick={this.handleCancelClick.bind(this)}>取消
						</div>
					</div>
				</section>
			</Modal>
		);
	}

}
