/**
 * Created by waka on 2017/3/30.
 */

// React
import React, {
	Component,
} from 'react';

import PropTypes from 'prop-types';

// 引入样式
import styles from './LiteratureItem.scss';

// 引入图片
import dciIcon from './dci-icon.svg';
import likeIcon from './like.svg';

/**
 * 作品项
 */
export default class LiteratureItem extends Component {

	// 定义属性类型
	static propTypes = {
		id: PropTypes.string,	// 作品id
		title: PropTypes.string,	// 标题
		dciCode: PropTypes.string,	// 版权代码
		dciUrl: PropTypes.string,	// 版权url
		vip: PropTypes.number,	// vip状态，vip===2为黑名单
		coreSellingPoint: PropTypes.string,	// 核心卖点
		desc: PropTypes.string,	// 描述
		author: PropTypes.string,	// 作者
		category: PropTypes.string,	// 种类
		workType: PropTypes.string,	// 工作种类
		subscribed: PropTypes.bool,	// 是否关注
	};

	// 设置默认属性
	static defaultProps = {
		id: '',	// 作品id
		title: '',	// 标题
		dciCode: '',	// 版权代码
		dciUrl: '',	// 版权url
		vip: -1,	// vip状态，vip===2为黑名单
		coreSellingPoint: '',	// 核心卖点
		desc: '',	// 描述
		author: '',	// 作者
		category: '',	// 种类
		workType: '',	// 工作种类
		subscribed: false,	// 是否关注
	};

	render() {

		return (
			<section
				className={styles.literatureItem}
				onClick={() => {
					// console.log('作品项点击事件', this.props.id);
					window.open('http://www.yunlaiwu.com/detail?id=' + this.props.id);
				}}>
				<div className={styles.row1}>
					<span className={styles.title}>{this.props.title}</span>
					{/* 是否通过dci认证 */}
					{this.props.dciCode
						? <a href={this.props.dciUrl} target="_blank">
							<img className={styles.dciIcon} src={dciIcon}/>
						</a>
						: null
					}
					{/* 是否是黑名单 */}
					{this.props.vip === 2
						? <span className={styles.blacklist}>黑名单</span>
						: null
					}
				</div>
				{/* 核心卖点 */}
				{this.props.coreSellingPoint
					? <div className={styles.row2}>“{this.props.coreSellingPoint}”</div>
					: null
				}
				{/* 描述 */}
				<div className={styles.row3}>
					{this.props.desc}
				</div>
				<div className={styles.row4}>
					{/* 作者 */}
					<span className={styles.left}>作者：{this.props.author}</span>
					{/* 类型 */}
					<span className={styles.right}>{this.props.category}·{this.props.workType}</span>
				</div>
				{/* 分割线 */}
				<div className={styles.hr}/>
				<div className={styles.row5}>
					{this.props.subscribed
						? <div className={styles.right}>
							<img src={likeIcon}/>
							<span className={styles.text}>已关注</span>
						</div>
						: <div className={styles.right}>
							<img src={likeIcon}/>
							<span className={styles.text}>未关注</span>
						</div>
					}
				</div>
			</section>
		);
	}
}
