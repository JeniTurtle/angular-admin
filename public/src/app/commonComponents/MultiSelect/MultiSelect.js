import React, {
	Component,
} from 'react';

import PropTypes from 'prop-types';

import styles from './MultiSelect.scss';

export default class MultiSelect extends Component {

	// 定义属性类型
	static propTypes = {
		defaultValue: PropTypes.arrayOf(PropTypes.string),	// 默认值
		placeholder: PropTypes.string,	// placeholder 提示语
		tipsName: PropTypes.string,	// 提示名
		isHasMostGoodAt: PropTypes.bool,	// 是否有最擅长的
		items: PropTypes.arrayOf(PropTypes.string),	// 多选项数组
		onChange: PropTypes.func,	// value 改变事件
	};

	// 设置默认属性
	static defaultProps = {
		defaultValue: null,
		placeholder: '',
		tipsName: '',
		isHasMostGoodAt: false,
		items: null,
		onChange: null,
	};

	constructor(props) {
		super(props);

		this.state = {
			isFocused: false,	// 是否聚焦
			selectedItemArray: [],	// 被选中的项数组
			mostGoodAt: '',	// 最擅长的类别
			errorTips: '',	// 错误提示
		};

		this.lastSelectedItemArray = [];	// 上一次被选中的项数组，用来实现取消功能
	}

	componentWillMount() {
		const {
			defaultValue,
			isHasMostGoodAt,
		} = this.props;

		const {
			selectedItemArray,
			mostGoodAt,
		} = this.state;

		if (!defaultValue || defaultValue.length === 0) {
			return;
		}

		defaultValue.forEach((item) => {
			// 如果数组中没有该项，添加进数组
			const position = selectedItemArray.indexOf(item);
			if (position === -1) {
				selectedItemArray.push(item);
			}
		});

		if (isHasMostGoodAt) {
			this.setState(() => {
				return {
					mostGoodAt: defaultValue[0]
				}
			});
		}
	}

	// 显示层点击事件
	handleShowLayerClick() {

		const {
			selectedItemArray,
		} = this.state;
		this.lastSelectedItemArray = selectedItemArray.slice();	// 记录上一次的选中项数组，注意这里不能直接赋值，需要复制一个数组后再进行赋值
		// console.log('记录上一次的选中项数组', this.lastSelectedItemArray);

		this.setState({
			isFocused: true,
		});
	}

	// 多选项点击事件
	handleItemClick(item, index, e) {
		// console.log('item', item, 'index', index);
		e.stopPropagation();	// 阻止冒泡

		const {
			selectedItemArray,
		} = this.state;

		// console.log('selectedItemArray【before】', selectedItemArray);

		// 如果数组中没有该项，添加进数组
		const position = selectedItemArray.indexOf(item);
		// console.log('position', position);
		if (position === -1) {
			selectedItemArray.push(item);

			// 如果 mostGoodAt 还没有值，即如果最擅长的类型还没有被选中
			if (!this.state.mostGoodAt) {
				// 将该项设置为最擅长的一项
				this.setState(() => {
					return {
						mostGoodAt: item,
					}
				});
			}
		}
		// 如果有，从数组中移除该项
		else {
			selectedItemArray.splice(position, 1);

			// 如果最擅长的类型(mostGoodAt)等于该项
			if (this.state.mostGoodAt === item) {
				// 将最擅长的一项置为空
				this.setState(() => {
					return {
						mostGoodAt: '',
					}
				});
			}
		}

		this.setState(() => {
			return {
				selectedItemArray,
				errorTips: '',
			}
		});

		this._moveMostGoodAtToFirst();
	}

	// 提示项关闭按钮点击事件
	handleTipsItemCloseClick(item, e) {
		e.stopPropagation();	// 阻止冒泡

		const {
			onChange,
		} = this.props;

		const {
			selectedItemArray,
		} = this.state;

		// 如果数组中有该项，从数组中移除该项
		const position = selectedItemArray.indexOf(item);
		if (position !== -1) {
			selectedItemArray.splice(position, 1);

			// 如果最擅长的类型(mostGoodAt)等于该项
			if (this.state.mostGoodAt === item) {
				// 将最擅长的一项置为空
				this.setState(() => {
					return {
						mostGoodAt: '',
					}
				});
			}
		}
		this.setState(() => {
			return {
				selectedItemArray,
				errorTips: '',
			}
		});

		if (onChange) {
			onChange(selectedItemArray);
		}
	}

	// 上方项关闭按钮点击事件
	handleTopItemCloseClick(item, e) {
		e.stopPropagation();	// 阻止冒泡

		const {
			onChange,
		} = this.props;

		const {
			selectedItemArray,
		} = this.state;

		// 如果数组中有该项，从数组中移除该项
		const position = selectedItemArray.indexOf(item);
		if (position !== -1) {
			selectedItemArray.splice(position, 1);

			// 如果最擅长的类型(mostGoodAt)等于该项
			if (this.state.mostGoodAt === item) {
				// 将最擅长的一项置为空
				this.setState(() => {
					return {
						mostGoodAt: '',
					}
				});
			}
		}
		this.setState(() => {
			return {
				selectedItemArray,
				errorTips: '',
			}
		});

		if (onChange) {
			onChange(selectedItemArray);
		}
	}

	// 背景层点击事件
	handleBackgroundClick() {
		// console.log('handleBackgroundClick');
		const {
			onChange,
			tipsName,
			isHasMostGoodAt,
		} = this.props;

		const {
			selectedItemArray,
			mostGoodAt,
		} = this.state;

		if (!mostGoodAt && isHasMostGoodAt && selectedItemArray.length > 0) {
			this.setState({
				errorTips: `请填写最擅长的${tipsName}`,
			});
			return;
		}

		this.setState({
			isFocused: false,	// 是否聚焦
		});

		if (onChange) {
			onChange(selectedItemArray);
		}
	}

	// 确定按钮点击事件
	handleConfirmClick() {
		const {
			onChange,
			tipsName,
			isHasMostGoodAt
		} = this.props;

		const {
			selectedItemArray,
			mostGoodAt
		} = this.state;

		if (!mostGoodAt && isHasMostGoodAt) {
			this.setState({
				errorTips: `请填写最擅长的${tipsName}`,
			});
			return;
		}

		this.setState({
			isFocused: false,
		});

		if (onChange) {
			onChange(selectedItemArray);
		}
	}

	// 取消按钮点击事件
	handleCancelClick() {
		// console.log('上一次保存的项数组 this.lastSelectedItemArray', this.lastSelectedItemArray);

		this.setState({
			isFocused: false,
			selectedItemArray: this.lastSelectedItemArray,	// 回到上一次保存的数组
		});
	}

	// 将最擅长项移至 selectedItemArray 的第一位
	_moveMostGoodAtToFirst() {
		// 设置 state
		this.setState((prevState, props) => {

			const {
				mostGoodAt,
				selectedItemArray,
			} = prevState;

			const {
				isHasMostGoodAt,
			} = props;

			// 如果最擅长存在 && 选中的数组长度大于0 && 有最擅长项
			if (mostGoodAt && selectedItemArray.length > 0 && isHasMostGoodAt) {
				// 找到最擅长的在数组中的位置
				const index = selectedItemArray.indexOf(mostGoodAt);
				// 如果在
				if (index !== -1) {
					// 删除原来的元素
					selectedItemArray.splice(index, 1);
					// 把该元素插到第一位
					selectedItemArray.unshift(mostGoodAt);
					return {
						selectedItemArray
					}
				}
			}
		});
	}

	render() {

		const {
			items,
			placeholder,
			tipsName,
			isHasMostGoodAt,
		} = this.props;

		const {
			isFocused,
			selectedItemArray,
			mostGoodAt,
			errorTips,
		} = this.state;

		// console.log('mostGoodAt', mostGoodAt);
		// console.log('selectedItemArray【render】', selectedItemArray);

		// 擅长的类型，去除最擅长的类型
		let goodAtArray = selectedItemArray.slice();	// 复制数组
		const mostGoodAtIndex = goodAtArray.indexOf(mostGoodAt);	// 找到最擅长的类型在数组中的位置
		if (mostGoodAtIndex !== -1) {
			goodAtArray.splice(mostGoodAtIndex, 1);	// 去掉这个数
		}

		return <section className={styles.multiSelect}>
			{/* 显示层 */}
			<section className={styles.showLayer}
					 style={{
						 borderColor: isFocused && '#596377',
						 boxShadow: isFocused && '0 0 0 2px #d4d9e2'
					 }}
					 onClick={this.handleShowLayerClick.bind(this)}>
				{/* 没有选中项时 或者 聚焦状态时 显示 placeholder */}
				{(selectedItemArray.length === 0 ) &&
				<span>{placeholder}</span>
				}
				{/* 在未聚焦状态下，有选中项时显示提示选中项 */}
				{selectedItemArray.length > 0 &&
				selectedItemArray.map((item, index) => {
					let className = 'tipsItem';
					if (this.state.mostGoodAt === item && isHasMostGoodAt) {
						className = 'tipsItemMostGoodAt';
					}
					return <div className={styles[className]}
								key={index}>
						{item}
						{/*<i className="iconfont icon-guanbi"*/}
						{/*style={{*/}
						{/*fontSize: '16px',*/}
						{/*cursor: 'pointer'*/}
						{/*}}*/}
						{/*onClick={this.handleTipsItemCloseClick.bind(this, item)}/>*/}
					</div>;
				})
				}
			</section>
			{isFocused &&
			// 选中状态才显示
			<section>
				{/* 背景层，这个背景层是为了取消多选框弹出层而存在的 */}
				<section className={styles.backgroundLayer}
						 onClick={this.handleBackgroundClick.bind(this)}/>
				{/* 悬浮层 */}
				<section className={styles.hoverLayer}>
					{/* 上部分 */}
					{isHasMostGoodAt &&
					<div className={styles.top}>
						<div className={styles.row1}>
							<span className={styles.tip}>最擅长的{tipsName}（必选，仅限一个）：</span>
							{this.state.mostGoodAt &&
							<div className={styles.item}>
								{this.state.mostGoodAt}
								<i className="iconfont icon-guanbi"
								   style={{
									   fontSize: '16px',
									   cursor: 'pointer'
								   }}
								   onClick={this.handleTopItemCloseClick.bind(this, this.state.mostGoodAt)}/>
							</div>
							}
						</div>
						<div className={styles.row2}>
							<span className={styles.tip}>擅长的{tipsName}（可选，不限）：</span>
							{goodAtArray && goodAtArray.map((item, index) => {
								return <div className={styles.item}
											key={index}>
									{item}
									<i className="iconfont icon-guanbi"
									   style={{
										   fontSize: '16px',
										   cursor: 'pointer'
									   }}
									   onClick={this.handleTopItemCloseClick.bind(this, item)}/>
								</div>
							})
							}
						</div>
						<div className={styles.divider}/>
					</div>
					}
					{/* 中部分 */}
					<div className={styles.middle}>
						{items.map((item, index) => {
							if (selectedItemArray.indexOf(item) !== -1) {
								return <div className={styles.itemSelected}
											key={index}
											onClick={this.handleItemClick.bind(this, item, index)}>
									{item}
								</div>;
							} else {
								return <div className={styles.item}
											key={index}
											onClick={this.handleItemClick.bind(this, item, index)}>
									{item}
								</div>;
							}
						})}
					</div>
					{/* 下部分 */}
					<div className={styles.bottom}>
						{/* 分割线 */}
						<div className={styles.divider}/>
						<div className={styles.row}>
							<div className={styles.errorTips}>
								{errorTips}
							</div>
							<div className={styles.btnConfrim}
								 onClick={this.handleConfirmClick.bind(this)}>确定
							</div>
							{/*<div className={styles.btnCancel}*/}
							{/*onClick={this.handleCancelClick.bind(this)}>取消*/}
							{/*</div>*/}
						</div>
					</div>
				</section>
			</section>
			}
		</section>;
	}
}
