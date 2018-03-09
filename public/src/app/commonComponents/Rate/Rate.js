/**
 * Created by waka on 2017/3/30.
 */

// React
import React, {
	Component,
} from 'react';

import PropTypes from 'prop-types';

// CSS modules
import styles from './Rate.scss';

/**
 * 评分组件
 *
 * 思路：先一排空的五角星作为背景层，之后根据传入的值计算实心五角星和半实心五角星的个数，覆盖上去
 */
export default class Rate extends Component {

	// 定义属性类型
	static propTypes = {
		fontSize: PropTypes.number,	// 字体大小，单位px
		curRate: PropTypes.number,	// 当前评分
		maxRate: PropTypes.number 	// 最大评分，目前只能为10
	};

	// 设置默认属性
	static defaultProps = {
		fontSize: 16,
		curRate: 0,
		maxRate: 10
	};

	/**
	 * 渲染字体图标
	 *
	 * @param iconFontName 字体图标名称
	 * @param key 列表渲染时需要传入的key
	 */
	renderIconFont(iconFontName, key) {
		return <i className="material-icons" style={{fontSize: this.props.fontSize + 'px'}}
				  key={key}>{iconFontName}</i>;
	}

	render() {
		// 背景层
		let rateListBackground = [];
		for (let i = 0; i < 5; i++) {
			rateListBackground.push(this.renderIconFont('star_border', i));	// 渲染空心五角星
		}

		// 计算实心和半实心个数
		let stars = this.props.curRate / 2;	// 当前评分除以二，得到商
		const isDecimal = stars.toString().search(/\./);	// 判断是否是小数
		stars = Math.floor(stars);	// 取整数部分

		// 覆盖层
		let rateList = [];
		for (let i = 0; i < stars; i++) {
			rateList.push(this.renderIconFont('star', i));	// 渲染实心五角星
		}
		if (isDecimal !== -1) {
			// 如果是小数，则加一个半实心
			rateList.push(this.renderIconFont('star_half', stars + 1));	// 渲染半实心五角星
		}
		return (
			<section className={styles.rate}>
				{/* 背景层 */}
				<div className={styles.rateListBackground}>
					{rateListBackground}
				</div>
				{/* 覆盖层 */}
				<div className={styles.rateList}>
					{rateList}
				</div>
			</section>
		);
	}
};
