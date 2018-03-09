/**
 * Created by waka on 2017/3/31.
 */

// React
import React, {
	Component,
} from 'react';

import PropTypes from 'prop-types';

// CSS modules
import styles from './AuthorAuthedRights.scss';

// 导入图片
import literatureImg from './literature.svg';	// 作品图标
import contributeImg from './contribute.svg';	// 投稿图标
import communicationImg from './communication.svg';	// 对话图标

/**
 * 写作者认证后权益组件
 */
export default class AuthorAuthedRights extends Component {

	// 定义属性类型
	static propTypes = {};

	// 设置默认属性
	static defaultProps = {};

	render() {
		return (
			<section className={styles.authorAuthedRights}>
				<div className={styles.row1}>如果您是写作者，认证后可获得一下权益</div>
				<ul className={styles.row2}>
					<li><img src={literatureImg}/>免费出售作品</li>
					<li><img src={contributeImg}/>免费投递征稿</li>
					<li><img src={communicationImg}/>与版权方对话</li>
				</ul>
			</section>
		);
	}
};
