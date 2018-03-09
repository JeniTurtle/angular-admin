/**
 * Created by waka on 2017/3/31.
 */

// React
import React, {
	Component,
} from 'react';

import PropTypes from 'prop-types';

// CSS modules
import styles from './MagnumOpus.scss';

// 代表作品项
import MagnumOpusItem from './MagnumOpusItem/MagnumOpusItem';

/********************************** Immutable ****************************************/

import {
	fromJS
} from 'immutable';

import ImmutablePropTypes from 'react-immutable-proptypes';

/**
 * 代表作品
 */
export default class MagnumOpus extends Component {

	// 定义属性类型
	static propTypes = {
		magnumOpus: ImmutablePropTypes.listOf(PropTypes.object),	// 代表作品
		onDelete: PropTypes.func,	// 删除
		onEdit: PropTypes.func,	// 编辑
		isShowAddBtn: PropTypes.bool,	// 是否显示添加按钮
		isShowRightBtns: PropTypes.bool,	// 是否显示右侧按钮
		onAddMagnumOpusItem: PropTypes.func,	// 添加代表作
	};

	// 设置默认属性
	static defaultProps = fromJS({
		magnumOpus: [],
		isShowAddBtn: true,
		isShowRightBtns: true,
	}).toObject();

	componentWillMount() {
		// console.log('componentWillMount');
	}

	componentDidMount() {
		// console.log('componentDidMount');
	}

	componentWillUpdate() {
		// console.log('componentWillUpdate');
	}

	componentDidUpdate() {
		// console.log('componentDidUpdate',this.props.magnumOpus.toJS());
	}

	handleDelete(index, magnumOpusItem) {
		// console.log('handleDelete index' + index);
		if (this.props.onDelete) {
			this.props.onDelete(index, magnumOpusItem);
		}
	}

	handleEdit(index, magnumOpusItem) {
		// console.log('handleEdit index' + index);
		if (this.props.onEdit) {
			this.props.onEdit(index, magnumOpusItem);
		}
	}

	handleAddMagnumOpusItem() {
		if (this.props.onAddMagnumOpusItem) {
			this.props.onAddMagnumOpusItem();
		}
	}

	render() {
		let magnumOpusList = [];
		this.props.magnumOpus.forEach((magnumOpusItem, index) => {
			magnumOpusList.push(
				<div className={styles.magnumOpusItem} key={index}>
					<MagnumOpusItem
						magnumOpusItem={magnumOpusItem}
						isShowBtns={this.props.isShowRightBtns}
						index={index}
						onDelete={this.handleDelete.bind(this)}
						onEdit={this.handleEdit.bind(this)}/>
				</div>
			)
		});
		return (
			<section className={styles.magnumOpus}>
				<span className={styles.magnumOpusLabel}>代表作品：</span>
				<div className={styles.magnumOpusList}>
					{/* 作品项 */}
					{magnumOpusList}
					{this.props.isShowAddBtn
						? <div className={styles.addMagnumOpusItem}
							   onClick={this.handleAddMagnumOpusItem.bind(this)}>＋增加代表作品
						</div>
						: null
					}
				</div>
			</section>
		);
	}
};
