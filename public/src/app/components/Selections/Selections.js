/**
 * @Author: chenming
 * @Date:   2017-01-17T20:59:16+08:00
 * @Last modified by:   chenming
 * @Last modified time: 2017-02-13T15:11:02+08:00
 */

import React, {
	Component,
} from 'react';

import PropTypes from 'prop-types';

import styles from './Selections.scss';

import FormGroup from 'react-bootstrap/lib/FormGroup';
import Button from 'react-bootstrap/lib/Button';

import Label from '../Label/Label';
import CheckBoxButton from '../../commonComponents/CheckBoxButtons/CheckBoxButton/CheckBoxButton';

export default class Selections extends Component {

	static get defaultProps() {
		return {
			label: '',
			required: false,
			value: '',
			onChange: function () {
			},
			disabled: false
		};
	}

	static propTypes = {
		label: PropTypes.string,
		required: PropTypes.bool,
		selections: PropTypes.arrayOf(PropTypes.string),
		value: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.arrayOf(PropTypes.string)
		]),
		onChange: PropTypes.func,
		disabled: PropTypes.bool
	};

	constructor() {
		super();
		this.state = {};
	}

	render() {

		let {
			required,
			label,
			selections,
			value,
			onChange,
			disabled
		} = this.props;

		if (typeof value === 'string') value = [value];

		return (
			<FormGroup className={ styles.wrapper + ' clearfix' }>
				{ label && <Label required={ required }> { label } </Label> }
				{
					selections.map(function (item, index) {
						return <div key={index} className={ styles.buttonWrapper + ' col-sm-3'}>
							{/*<Button*/}
							{/*disabled={ disabled }*/}
							{/*onClick={ onChange.bind(this, item) }*/}
							{/*className={ styles.button + ( value.indexOf(item) > -1 ? ' btn-primary' : '') }>*/}
							{/*{ item }*/}
							{/*</Button>*/}
							<CheckBoxButton
								width={145}
								height={35}
								disabled={disabled}
								text={item}
								isChecked={value.indexOf(item) > -1}
								onClick={onChange.bind(this, item)}/>
						</div>;
					})
				}
			</FormGroup>
		);
	}

}
