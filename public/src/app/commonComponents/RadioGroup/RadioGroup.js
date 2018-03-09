/**
 * Created by waka on 2017/3/31.
 */
// React
import React, {
	Component,
} from 'react';

import PropTypes from 'prop-types';

// CSS modules
import styles from './RadioGroup.scss';

import Radio from '../Radio/Radio';

/**
 * 单选按钮组 组件
 */
export default class RadioGroup extends Component {

	// 定义属性类型
	static propTypes = {
		checkedIndex: PropTypes.number,	// 当前选中项
		texts: PropTypes.arrayOf(PropTypes.string),	// 文本们
		onChange: PropTypes.func,		// 选项变化时的回调函数
	};

	// 设置默认属性
	static defaultProps = {
		checkedIndex: 0,
		texts: [],
		onChange: null,
	};

	handleRadioClick(index) {
		if (index !== this.props.checkedIndex) {
			this.handleChange(index);
		}
	}

	handleChange(index) {
		if (this.props.onChange) {
			this.props.onChange(index);
		}
	}

	render() {
		return (
			<section className={styles.radioGroup}>
				{this.props.texts.map((text, index) => {
					return <div className={styles.radioItem} key={index}>
						<Radio isChecked={index === this.props.checkedIndex ? true : false}
							   text={text}
							   onRadioClick={this.handleRadioClick.bind(this)}
							   index={index}/>
					</div>;
				})}
			</section>
		);
	}
};
