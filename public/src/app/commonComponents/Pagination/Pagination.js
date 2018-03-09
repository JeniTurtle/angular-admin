/**
 * Created by waka on 2017/4/5.
 */

// React
import React, {
	Component,
} from 'react';

import PropTypes from 'prop-types';

// CSS modules
import styles from './Pagination.scss';

/**
 * 分页组件
 */
export default class Pagination extends Component {

	// 定义属性类型
	static propTypes = {
		current: PropTypes.number,	// 当前页数
		total: PropTypes.number,	// 数据总数
		pageSize: PropTypes.number,	// 每页条数
		onChange: PropTypes.func,	// 页数改变时调用
	};

	// 设置默认属性
	static defaultProps = {
		current: 1,
		total: 1,
		pageSize: 10,
		onChange: null,
	};

	render() {
		// 每次render 计算最大分页数
		const maxPageCount = Math.ceil(this.props.total / this.props.pageSize);
		return (
			<section className={styles.pagination}>
				<div className={styles.inner}>
					{/* 上一页按钮 */}
					<span
						className={styles.previous}
						onClick={() => {
							// 这里需要判断
							// 1. 是否监听改变事件
							// 2. 当前页数是否是第一页
							if (this.props.onChange && this.props.current !== 1) {
								this.props.onChange(this.props.current - 1);
							}
						}}
						// 设置禁用样式
						style={{
							color: this.props.current === 1 ? '#CCCDCF' : '#0037FF',
							cursor: this.props.current === 1 ? 'not-allowed' : 'pointer'
						}}>
						上一页
					</span>
					{/* 页数 */}
					<span className={styles.pageCount}>
						{this.props.current}/{maxPageCount}
					</span>
					{/* 下一页按钮 */}
					<span
						className={styles.next}
						onClick={() => {
							// 这里需要判断
							// 1. 是否监听改变事件
							// 2. 当前页数是否等于最大页数
							if (this.props.onChange && this.props.current !== maxPageCount) {
								this.props.onChange(this.props.current + 1);
							}
						}}
						// 设置禁用样式
						style={{
							color: this.props.current === maxPageCount ? '#CCCDCF' : '#0037FF',
							cursor: this.props.current === maxPageCount ? 'not-allowed' : 'pointer'
						}}>
						下一页
					</span>
				</div>
			</section>
		);
	}
};
