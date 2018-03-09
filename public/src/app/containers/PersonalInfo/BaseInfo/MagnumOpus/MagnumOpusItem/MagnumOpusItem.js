/**
 * Created by waka on 2017/3/31.
 */

// React
import React, {
	Component,
} from 'react';

import PropTypes from 'prop-types';

// CSS modules
import styles from './MagnumOpusItem.scss';

/********************************** Immutable ****************************************/

import {
	fromJS,
	Map
} from 'immutable';

import ImmutablePropTypes from 'react-immutable-proptypes';

/**
 * 代表作品项
 */
export default class MagnumOpusItem extends Component {

	// 定义属性类型
	static propTypes = {
		magnumOpusItem: ImmutablePropTypes.map,	// 数据
		isShowBtns: PropTypes.bool,	// 是否显示按钮们?
		index: PropTypes.number,	// 下标
		onDelete: PropTypes.func,	// 删除
		onEdit: PropTypes.func,	// 编辑
	};

	// 设置默认属性
	static defaultProps = fromJS({
		magnumOpusItem: {},
		isShowBtns: true,
	}).toObject();

	constructor() {
		super();
		this.state = {
			isShowBtns: false,	// 是否显示按钮们
		};
	}

	render() {

		const {
			index,
			magnumOpusItem
		} = this.props;

		return (
			<section
				className={styles.magnumOpusItem}
				onMouseOver={() => {
					this.setState(() => {
						return {
							isShowBtns: true
						}
					});
				}}
				onMouseOut={() => {
					this.setState(() => {
						return {
							isShowBtns: false
						}
					});
				}}>
				<span className={styles.title}>代表作品{index + 1}：{magnumOpusItem.get('title')}</span>
				{this.props.isShowBtns
					? <div
						className={styles.right}
						style={{
							// 为什么不用visibility?因为实际测试会有延时
							// 但是display会导致回流，性能开销大
							// 目前的取舍是实现效果比较重要，性能开销可以接受
							// visibility: this.state.isShowBtns ? 'visible' : 'hidden',
							display: this.state.isShowBtns ? 'block' : 'none'
						}}>
					<span className={styles.delete}
						  onClick={() => {
							  if (this.props.onDelete) {
								  this.props.onDelete(this.props.index, this.props.magnumOpusItem.toJS());
							  }
						  }}>删除</span>
						<span className={styles.edit}
							  onClick={() => {
								  if (this.props.onEdit) {
									  this.props.onEdit(this.props.index, this.props.magnumOpusItem.toJS());
								  }
							  }}>编辑</span>
					</div>
					: null
				}
			</section>
		);
	}
};
