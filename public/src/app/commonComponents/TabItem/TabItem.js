/**
 * Created by waka on 2017/3/31.
 */

// React
import React, {
	Component,
} from 'react';

import PropTypes from 'prop-types';

// CSS modules
import styles from './TabItem.scss';

/**
 * Tab项
 */
export default class TabItem extends Component {

	// 定义属性类型
	static propTypes = {
		index: PropTypes.number,	// 在数组中的下标，用来在点击时给TabGroup区分当前点击的是哪个TabItem
		text: PropTypes.string,	// tab的文字，必须
		isSelected: PropTypes.bool,	// 是否被选中
		onTabItemClick: PropTypes.func,	// tab点击事件监听
	};

	// 设置默认属性
	static defaultProps = {
		index: null,
		text: '',
		isSelected: false,
		onTabItemClick: null
	};

	onTabItemClick() {
		// console.log('onTabItemClick');
		// 如果外部传入点击事件监听方法
		if (this.props.onTabItemClick) {
			// 调用它，并传入当前index，以区分调用的是哪个Tab
			this.props.onTabItemClick(this.props.index);
		}
	}

	render() {
		return (
			<section className={styles.tabItem}
					 onClick={this.onTabItemClick.bind(this)}>
				{/* tab的文字 */}
				<div className={styles.text}
					 style={{
						 color: this.props.isSelected ? '#434C5F' : '#8C96A9',
						 fontWeight: this.props.isSelected ? 'bold' : 'normal',
					 }}>{this.props.text}</div>
				{/* 下方下划线 */}
				<div className={styles.underline}
					 style={{
						 display: this.props.isSelected ? 'block' : 'none'
					 }}/>
			</section>
		);
	}
};
