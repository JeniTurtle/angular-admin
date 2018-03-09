/**
 * Created by waka on 2017/4/6.
 */

// React
import React, {
	Component,
} from 'react';

import PropTypes from 'prop-types';

// CSS modules
import styles from './CheckBoxButton.scss';

// 导入图片
import checkedIcon from './checked.svg';

/**
 * 多选框，按钮样式
 */
export default class CheckBoxButton extends Component {

	// 定义属性类型
	static propTypes = {
		width: PropTypes.number,
		height: PropTypes.number,
		disabled: PropTypes.bool,	// 是否禁止点击事件
		isChecked: PropTypes.bool,	// 是否被选中
		text: PropTypes.string,	// 文本
		index: PropTypes.number,	// 下标
		onClick: PropTypes.func,	// 点击事件
	};

	// 设置默认属性
	static defaultProps = {
		width: 140,
		height: 30,
		disabled: false,
		isChecked: false,
		text: '',
		index: -1,
		onClick: null,
	};

	constructor(props) {
		super(props);
	}

	render() {

		const {
			width,
			height,
			isChecked,
			disabled
		} = this.props;

		let className = isChecked ? styles.checked : styles.unchecked;
		if (disabled) {
			className = styles.disabled;
		}

		return (
			<section
				// 鼠标悬浮显示文本
				title={this.props.text}
				className={className}
				style={{
					width: width + 'px',
					height: height + 'px'
				}}
				onClick={() => {
					if (this.props.onClick) {
						this.props.onClick(this.props.index);
					}
				}}>
				<span className={styles.text}>{this.props.text}</span>
				{this.props.isChecked
					? <img className={styles.checkedIcon} src={checkedIcon}/>
					: null
				}
			</section>
		);
	}
};
