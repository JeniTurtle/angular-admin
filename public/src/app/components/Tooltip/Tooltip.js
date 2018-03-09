import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import styles from './Tooltip.scss';

export default class Tooltip extends Component {

	static get defaultProps() {

		return {
			tipName: ''
		};

	}

	static propTypes = {
		left: PropTypes.number,
		right: PropTypes.number,
		top: PropTypes.number,
		bottom: PropTypes.number,
		tipName: PropTypes.string
	}

	render() {

		const {
			left,
			top,
			right,
			bottom,
			tipName,
			children,
			width,
			height,
			tipShow,
			onToggle,
			onHide
		} = this.props;

		let s = {};
		if (left !== undefined) s.left = left + 'px';
		if (right !== undefined) s.right = right + 'px';
		if (top !== undefined) s.top = top + 'px';
		if (bottom !== undefined) s.bottom = bottom + 'px';
		if (width) s.width = width + 40 + 'px';
		if (height) s.height = height + 70 + 'px';
		if (width) {
			s.transform = 'translate(' + (width + 40) + 'px, -46px)';
		}


		return (
			<div className={ styles.wrapper } style={ s }>
				{ tipName && <div className={ styles.anchor } onClick={ onToggle }>{ tipName }</div> }
				{ (tipShow == 1) && <div className={ styles.container }>
					<div className={ styles.close } onClick={ onHide }></div>
					{ children }
				</div> }
			</div>
		);
	}

}
