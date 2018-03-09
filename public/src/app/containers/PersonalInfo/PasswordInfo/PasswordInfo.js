/**
 * Created by waka on 2017/3/31.
 */

// React
import React, {
	Component,
} from 'react';

import PropTypes from 'prop-types';

// CSS modules
import styles from './PasswordInfo.scss';

import InfoTitle from '../common/InfoTitle/InfoTitle';	// 信息标题
import InfoItem from '../common/InfoItem/InfoItem';	// 信息项

/**
 * 密码信息
 */
export default class PasswordInfo extends Component {

	// 定义属性类型
	static propTypes = {
		onRightClick: PropTypes.func,	// 密码设置点击事件
		middleText: PropTypes.string,	// 中间文本
		rightText: PropTypes.string,	// 右侧文本
	};

	// 设置默认属性
	static defaultProps = {
		onRightClick: null,
		middleText: '',
		rightText: '',
	};

	render() {

		return (
			<section className={styles.passwordInfo}>

				{/* 密码信息 */}
				<InfoTitle title="密码信息"/>
				<InfoItem title="密码设置："
						  content={this.props.middleText}
						  btnText={this.props.rightText}
						  onRightClick={() => {
							  if (this.props.onRightClick) {
								  this.props.onRightClick();
							  }
						  }}/>

			</section>
		);
	}
};
