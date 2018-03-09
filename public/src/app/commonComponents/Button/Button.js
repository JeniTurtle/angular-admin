/**
 * Created by waka on 2017/4/5.
 */
// React
import React, {
	Component,
} from 'react';

import PropTypes from 'prop-types';

// CSS modules
import styles from './Button.scss';

/**
 * 按钮组件
 */
export default class Button extends Component {

	// 定义属性类型
	static propTypes = {
		type: PropTypes.string,	// 设置按钮类型：primary,default,danger
		onClick: PropTypes.func,	// 点击事件
	};

	// 设置默认属性
	static defaultProps = {
		type: 'default',
		onClick: null,
	};

	/**
	 * 根据类型输出Button
	 * @returns {XML}
	 */
	switchType() {
		let className = 'default';
		switch (this.props.type) {
			case 'primary':
				className = 'primary';
				break;
			case 'danger':
				className = 'danger';
				break;
			case 'default':
			default:
				className = 'default';
				break;
		}
		return <section
			className={styles[className]}
			style={{
				borderRadius: this.props.borderRadius + 'px'
			}}
			onClick={() => {
				if (this.props.onClick) {
					this.props.onClick();
				}
			}}>
			{this.props.children}
		</section>;
	}

	render() {
		return (
			this.switchType()
		);
	}
};
