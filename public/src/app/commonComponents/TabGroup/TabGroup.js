/**
 * Created by waka on 2017/3/31.
 */

// React
import React, {
	Component,
} from 'react';

import PropTypes from 'prop-types';

// CSS modules
import styles from './TabGroup.scss';

import TabItem from '../TabItem/TabItem';	// Tab项

/**
 * Tab组
 */
export default class TabGroup extends Component {

	// 定义属性类型
	static propTypes = {
		tabs: PropTypes.arrayOf(	// tab数组，它的每一个值是一个对象
			PropTypes.shape({
				text: PropTypes.string	// tab文本
			})
		),
		onTabChanged: PropTypes.func 	// Tab切换触发的回调方法
	};

	// 设置默认属性
	static defaultProps = {
		tabCount: 0,
		tabs: []
	};

	constructor(props) {
		super(props);
		// 初始化state
		// 虽然是展示组件，但是如果该组件能自身变化的话，就必须使用state
		this.state = {
			currentSelectedIndex: 0	// 当前选中项的下标
		};
	}

	/**
	 * TabItem点击事件，在TabGroup中监听
	 * @param index 点击的Tab项下标
	 */
	onTabItemClickTabGroup(index) {
		// console.log('onTabItemClickTabGroup index = ', index);
		// 使用函数式 setState
		this.setState((prevState) => {
			return {
				currentSelectedIndex: index
			}
		});

		// 如果外界监听了Tab变化方法
		if (this.props.onTabChanged) {
			// 传入index调用
			this.props.onTabChanged(index);
		}
	}

	render() {
		let tabs = [];
		for (let i = 0; i < this.props.tabs.length; i++) {
			tabs.push(
				<div className={styles.tabItem} key={i}>
					<TabItem text={this.props.tabs[i].text} onTabItemClick={this.onTabItemClickTabGroup.bind(this)}
							 index={i}
							 isSelected={this.state.currentSelectedIndex === i}/>
				</div>
			);
		}
		return (
			<section className={styles.tabGroup}>
				{tabs}
			</section>
		);
	}
};
