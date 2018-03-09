/**
 * Created by waka on 2017/4/5.
 */

// React
import React, {
	Component,
} from 'react';

import PropTypes from 'prop-types';

// CSS modules
import styles from './ModalDeleteMagnumOpusItem.scss';

import {
	Modal,	// 基础对话框
} from '../../../commonComponents';

/**
 * 添加代表作品对话框
 */
export default class ModalDeleteMagnumOpusItem extends Component {

	// 定义属性类型
	static propTypes = {
		text: PropTypes.string,	// 文本
		isShow: PropTypes.bool,	// 是否显示
		onOK: PropTypes.func,	// 确定
		onCancel: PropTypes.func,	// 取消
	};

	// 设置默认属性
	static defaultProps = {
		text: '您确定要删除该代表作品吗？',
		isShow: false,
		onOK: null,
		onCancel: null,
	};

	render() {
		return (
			<Modal
				isShow={this.props.isShow}
				title="温馨提示"
				okType="danger"
				okText="删除"
				onOK={() => {
					if (this.props.onOK) {
						this.props.onOK();
					}
				}}
				onCancel={() => {
					if (this.props.onCancel) {
						this.props.onCancel();
					}
				}}>
				<div className={styles.content}>
					{this.props.text}
				</div>
			</Modal>
		);
	}
};
