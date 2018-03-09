import React, {
	Component,
} from 'react';

import PropTypes from 'prop-types';

import {
	lengthRegex
}
	from '../../utils/validation';

import FormGroup from 'react-bootstrap/lib/FormGroup';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';

import Label from '../Label/Label';
import styles from './Textfield.scss';

export default class Textfield extends Component {

	static get defaultProps() {
		return {
			required: false,
			placeholder: '',
			label: '',
			maxLength: 0,
			disabled: false,
			isArea: false,
			value: '',
			tip: '',
			tipName: '',
			height: 0,
			autoExpand: false
		};
	}

	static propTypes = {
		label: PropTypes.string,
		required: PropTypes.bool,
		placeholder: PropTypes.string,
		maxLength: PropTypes.number,
		disabled: PropTypes.bool,
		isArea: PropTypes.bool,
		autoExpand: PropTypes.bool,
		value: PropTypes.string,
		onChange: PropTypes.func.isRequired,
		tip: PropTypes.string,
		tipName: PropTypes.string,
		height: PropTypes.number
	};

	constructor() {
		super();

		this.state = {
			tipShow: 0
		};
	}

	handleChange = (e) => {
		const {
			onChange
		} = this.props;

		onChange(e.target.value);
	};

	getLength(value) {

		return value.replace(lengthRegex, '').length;

	}

	handleFocus = () => {

		const {
			tipTrigger,
			autoExpand,
			height,
			onFocus
		} = this.props;

		onFocus && onFocus();

		if (tipTrigger) {

			this.setState({
				tipShow: 1
			});

		}

		this.setState({
			tmpHeight: height || 'auto'
		});

	};

	handleBlur = (e) => {

		const {
			tipTrigger,
			onBlur
		} = this.props;

		onBlur && onBlur(e.target.value);

		if (tipTrigger) {

			this.setState({
				tipShow: -1
			});

		}

		// console.log('value',this.props.value);
		if (!this.props.value) {
			this.setState({
				tmpHeight: 0
			});
		}

	};

	render() {

		let {
			required,
			label,
			maxLength,
			isArea,
			placeholder,
			autoExpand,
			value,
			tip,
			tipName,
			disabled,
			height
		} = this.props;

		const {
			tmpHeight
		} = this.state;

		const {
			tipShow
		} = this.state;

		let formControlAttributes = {
			placeholder,
			value,
			disabled,
			onChange: this.handleChange
		};

		const length = this.getLength(value);

		if (isArea) {
			Object.assign(formControlAttributes, {
				//当现实字符数计数的时候，设置右侧padding
				className: styles.textarea + (maxLength ? ' ' + styles.needPadding : ''),
				componentClass: 'textarea'
			});

			if (autoExpand) {
				if (!value) {
					height = tmpHeight || 43;
				}
			}

		} else {
			Object.assign(formControlAttributes, {
				className: styles.input + (maxLength ? ' ' + styles.needPadding : ''),
				type: 'text'
			});
		}

		// console.log('height', height);

		return (
			<FormGroup className={ styles.wrapper + ' clearfix' }>
				{ label &&
				<Label required={ required } tip={ tip } tipName={ tipName } tipShow={ tipShow }> { label } </Label> }
				<FormControl { ...formControlAttributes } onFocus={ this.handleFocus } onBlur={ this.handleBlur }
							 style={ {height: height ? height + 'px' : 'auto'} }/>
				{ maxLength > 0 &&
				<span className={ length > maxLength ? styles.warningCounter : styles.counter }>{ length }
					/ { maxLength }</span> }
			</FormGroup>
		);
	}

}
