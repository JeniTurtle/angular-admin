/**
 * Created by BadWaka on 2017/4/21.
 */

/******************************* React **********************************/

import React, {
	Component,
} from 'react';

import PropTypes from 'prop-types';

// 引入样式
import styles from './NoData.scss';

import noPersonImg from './noPerson.svg';
import noWorkImg from './noWork.svg';

/**
 * 没有数据界面
 */
export default class NoData extends Component {

	// 定义属性类型
	static propTypes = {
		type: PropTypes.string,	// 类型
		text: PropTypes.string,	// 文字
	};

	// 设置默认属性
	static defaultProps = {
		type: 'person',
		text: ''
	};

	/**
	 * 根据type渲染图片
	 */
	renderImgByType() {
		switch (this.props.type) {
			case 'person':
				return <img className={styles.img} src={noPersonImg} alt={this.props.text}/>;
			case 'work':
				return <img className={styles.img} src={noWorkImg} alt={this.props.text}/>;
			default:
				return null;
		}
	}

	render() {
		return (
			<section className={styles.noData}>
				{this.renderImgByType()}
				<div className={styles.text}>{this.props.text}</div>
			</section>
		);
	}
}
