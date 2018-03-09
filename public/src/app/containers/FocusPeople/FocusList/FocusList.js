/**
 * Created by waka on 2017/3/31.
 */

/********************************** React ****************************************/

import React, {
	Component,
} from 'react';

import PropTypes from 'prop-types';

// CSS modules
import styles from './FocusList.scss';

// 内部组件
import Person from './Person/Person';	// 人员项

/********************************** Immutable ****************************************/

import {
	fromJS,
	List
} from 'immutable';

import ImmutablePropTypes from 'react-immutable-proptypes';

/**
 * 关注列表
 */
export default class FocusList extends Component {

	// 定义属性类型
	static propTypes = {
		isShowFollowBtn: PropTypes.bool,	// 是否显示关注按钮
		dataArray: ImmutablePropTypes.listOf(PropTypes.object),	// 数据集
		onFollowClick: PropTypes.func,	// 关注按钮点击事件
	};

	// 设置默认属性
	static defaultProps = fromJS({
		isShowFollowBtn: false,
		dataArray: List(),
		onFollowClick: null,
	}).toObject();

	handleFocusButtonClick(index, uid, isFollow) {
		if (this.props.onFollowClick) {
			this.props.onFollowClick(index, uid, isFollow);
		}
	}

	render() {

		const {
			dataArray
		} = this.props;

		// console.log('dataArray', dataArray.toJS());

		return (
			<section className={styles.focusList}>
				<div className={styles.content}>
					{dataArray.size > 0 && dataArray.map((item, index) => {
						item = item.toJS();
						return <div className={styles.focusListItem} key={item.objectId}>
							<Person
								key={item.objectId}
								index={index}
								uid={item.objectId}
								ability={item.ability}
								type={item.type}
								name={item.username}
								desc={item.desc}
								// 是否已关注
								isAlreadyFocus={item.follow}
								// 当关注列表类型为关注我的人时显示关注按钮
								isShowFocusButton={this.props.isShowFollowBtn}
								// 关注按钮点击事件
								onFocusButtonClick={this.handleFocusButtonClick.bind(this)}
								// 头像url
								avatarImgUrl={item.smallAvatar}/>
						</div>
					})}
				</div>
			</section>
		);
	}
};
