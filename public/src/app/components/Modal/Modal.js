import React, {
	Component,
} from 'react';

import PropTypes from 'prop-types';

import styles from './Modal.scss';

export default class Modal extends Component {

	// 定义属性类型
	static propTypes = {
		onCloseClick: PropTypes.func,
		width: PropTypes.string,
		height: PropTypes.string,
		isShowClose: PropTypes.bool,
	};

	// 设置默认属性
	static defaultProps = {
		onCloseClick: null,
		width: '',
		height: '',
		isShowClose: true,
	};

	handleCloseClick() {
		const {
			onCloseClick
		} = this.props;

		if (onCloseClick) {
			onCloseClick();
		}
	}

	render() {

		const {
			width,
			height,
			isShowClose,
		} = this.props;

		// console.log('isShowClose', isShowClose);

		const modalWrapperStyle = {
			width,
			height,
		};

		return (
			<section className={styles.wrapper}>
				<section className={styles.modalWrapper}
						 style={modalWrapperStyle}>
					<section className={styles.modal}>
						{isShowClose &&
						<i className="iconfont icon-close"
						   style={{
							   position: 'absolute',
							   top: '20px',
							   right: '20px',
							   fontSize: '16px',
							   cursor: 'pointer',
							   color: '#d4d9e2',
						   }}
						   onClick={this.handleCloseClick.bind(this)}/>
						}
						{this.props.children}
					</section>
				</section>
			</section>
		);
	}

}
