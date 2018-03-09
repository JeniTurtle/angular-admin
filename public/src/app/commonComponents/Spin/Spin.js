/**
 * 加载中
 * Created by BadWaka on 2017/4/18.
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styles from './Spin.scss';
import spinPng from './spin.png';

export default class Spin extends Component {

	static propTypes = {
		type: PropTypes.string,	// 类型: mask / modal / nomal
		isModal: PropTypes.bool,	// 是否是模态框
		size: PropTypes.number,	// 大小
	};

	static defaultProps = {
		type: 'mask',
		isModal: false,
		size: 32,
	};

	render() {
		return <div>
			{this.props.isModal
				// 模态框加载中...
				? <div className={styles.maskSpin}>
					<img
						className={styles.spin}
						src={spinPng}
						alt="加载中..."
						style={{
							width: this.props.size + 'px',
							height: this.props.size + 'px',
						}}/>
				</div>
				// 普通加载中...
				: <img
					className={styles.spin}
					src={spinPng}
					alt="加载中..."
					style={{
						width: this.props.size + 'px',
						height: this.props.size + 'px',
					}}/>
			}
		</div>;
	}

};
