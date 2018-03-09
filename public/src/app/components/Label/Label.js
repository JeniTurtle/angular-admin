import React, {
	Component,
	createElement
} from 'react';

import PropTypes from 'prop-types';

import {
	render
} from 'react-dom';

import ControlLabel from 'react-bootstrap/lib/ControlLabel';

import {
	Tooltip
} from '../../components';

import styles from './Label.scss';

export default class Label extends Component {

	static get defaultProps() {
		return {
			required: false,
			tip: '',
			tipName: '',
			withColon: false
		};
	}

	static propTypes = {
		required: PropTypes.bool,
		tip: PropTypes.string,
		tipName: PropTypes.string,
		withColon: PropTypes.bool
	}

	constructor() {
		super();
		this.state = {
			width: 0,
			height: 0
		};
	}

	onloadImage = () => {
		this.setState({
			width: this.image.width,
			height: this.image.height
		});
	}

	checkIfImage = () => {

		const {
			tip
		} = this.props;
		return /^http\:\/\//.test(tip);

	}

	getTipComponent = () => {

		const {
			tip
		} = this.props;

		const ifImage = this.checkIfImage();

		return ifImage ?
			() => <img src={ tip }/> :
			() => <div>{ tip.split('\\n').map((item, key) => <p key={ key }>{ item }</p>) }</div>;
	}

	componentDidMount() {

		const {
			width
		} = this.state;

		const ifImage = this.checkIfImage();
		const TipComponent = this.getTipComponent();

		if (ifImage && !this.image) {
			this.image = new Image;
			this.image.onload = this.onloadImage;
			this.image.src = tip;
		}

		//从无限远端的一个div获取真正高度
		if (!ifImage && !width) {
			const fullfilWidth = 250;
			let $mockEl = $('<div style="width: ' + fullfilWidth + 'px; position: absolute; left: 100000px; top: 0;"></div>').appendTo(document.body);
			render(createElement(TipComponent), $mockEl[0]);
			this.setState({
				width: fullfilWidth,
				height: $mockEl.height() + 60
			});

			$mockEl.remove();
		}

	}

	render() {

		const {
			required,
			tip,
			tipName,
			children,
			tipShow,
			withColon,
			className,
			tipRight,
			onTipToggle,
			onTipHide,
			...attrs
		} = this.props;

		const TipComponent = this.getTipComponent();

		let {
			width,
			height
		} = this.state;

		return (
			<ControlLabel
				className={ styles.label + ( required ? ' ' + styles.required : '' ) + ( className ? ' ' + className : '') + ( withColon ? ' withColon' : '') } {...attrs}>
				{ children }
				{ tip && <Tooltip tipShow={ tipShow } right={ tipRight ? tipRight : -25 } top={ 0 } width={ width || 0}
								  height={ height || 0 } tipName={ tipName } onToggle={ onTipToggle }
								  onHide={ onTipHide }>
					<TipComponent />
				</Tooltip> }
			</ControlLabel>
		);
	}

}
