/**
 * Created by waka on 2017/4/6.
 */

// React
import React, {
	Component,
} from 'react';

import PropTypes from 'prop-types';

// CSS modules
import styles from './CheckBoxButtons.scss';

// 多选框按钮样式
import CheckBoxButton from './CheckBoxButton/CheckBoxButton';

/**
 * 多选框
 */
export default class CheckBoxButtons extends Component {

	// 定义属性类型
	static propTypes = {
		dataArray: PropTypes.array,	// 数据集
		isSingle: PropTypes.bool,	// 是否单选
		value: PropTypes.string,	// 值
		onChange: PropTypes.func,	// 当改变发生
	};

	// 设置默认属性
	static defaultProps = {
		dataArray: [],
		isSingle: false,
		value: '',
		onChange: null,
	};

	constructor(props) {
		super(props);
		// 用传进来的data初始化state中的data
		// Q：为什么不直接用props?而用到state?
		// A：因为外层并不关心使用的是哪一个，外层只关心最终选中的文本是什么，所以内部自己维护状态即可
		this.state = {
			dataArray: this.props.dataArray
		};
	}

	onItemClick(index) {
		// console.log(index);
		// 设置state
		this.setState((prevState) => {
			// 如果是单选
			if (this.props.isSingle) {
				// 记录当前点击项原始状态
				let originIndexState = prevState.dataArray[index].isChecked;
				// 重置所有状态为false
				prevState.dataArray.forEach((item, index) => {
					item.isChecked = false;
				});
				// 增加该判断是为了用户点击一个已选中的项，取消该项的选中状态
				if (originIndexState === false) {
					prevState.dataArray[index].isChecked = !prevState.dataArray[index].isChecked;
				}
			}
			// 多选
			else {
				prevState.dataArray[index].isChecked = !prevState.dataArray[index].isChecked;
			}
			return {dataArray: prevState.dataArray}
		});
		// 如果外部监听了onChange事件
		if (this.props.onChange) {
			// 如果是单选
			// 这里的第二句判断主要是为了解决取消选中后onChange事件还输出该项的问题
			if (this.props.isSingle && this.state.dataArray[index].isChecked === false) {
				this.props.onChange(this.state.dataArray[index].text);
			}
			// 如果是多选
			else {
				let strings = [];
				this.state.dataArray.forEach((item, i) => {
					if (item.isChecked === true && i !== index) {
						strings.push(item.text);
					}
				});
				// 加这一段代码是为了解决setState在render之后才生效，导致还使用之前的数据的问题
				if (this.state.dataArray[index].isChecked === false) {
					strings.push(this.state.dataArray[index].text);
				}
				this.props.onChange(strings.join(','));
			}
		}
	}

	render() {
		return (
			<section className={styles.wrapper}>
				{/* 遍历传入的数据 */}
				{this.state.dataArray.map((item, index) => {
					return <div className={styles.checkBoxButtonItem} key={index}>
						<CheckBoxButton
							isChecked={this.state.dataArray[index].isChecked}
							text={this.state.dataArray[index].text}
							index={index}
							onClick={this.onItemClick.bind(this)}/>
					</div>;
				})}
			</section>
		);
	}
};
