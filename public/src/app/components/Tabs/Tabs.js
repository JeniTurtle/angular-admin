import React, {
	Component,
	Children,
	cloneElement
} from 'react';

import PropTypes from 'prop-types';

import Radio from 'react-bootstrap/lib/Radio';
import styles from './Tabs.scss';

export default class Tabs extends Component {

	static get defaultProps() {
		return {
			required: false,
			selected: 0
		};
	}

	static propTypes = {
		required: PropTypes.bool,
		tabs: PropTypes.arrayOf(PropTypes.string),
		selected: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.number
		]),
		values: PropTypes.array.isRequired
	}

	constructor(props) {

		super();
		const {
			selected
		} = props;

		this.state = {
			selected: selected
		};

	}

	renderChildren(children, index) {

		const {
			selected
		} = this.state;

		return cloneElement(children[index], {
			selected: selected == index
		});
	}

	render() {
		const self = this;
		const {
			required,
			tabs,
			children,
			name,
			values
		} = this.props;
		const {
			selected
		} = this.state;

		return (
			<div className={ styles.wrapper }>
				<div className={ styles.radios + ' row' }>
					{ tabs.map(function (item, index) {
						return <Radio key={index} value={ values[index] } checked={ selected === index ? 1 : 0 }
									  className={ styles.radio + ' col-sm-2 '} onChange={ e => {
							self.setState({selected: +e.currentTarget.value});
						} }>{ item }</Radio>
					}) }
				</div>
				<div className={ styles.tabs + ' row' }>
					{ tabs.map(function (item, index) {
						return <div key={index}
									className={ styles.tab + ' col-sm-2 ' + ( selected === index ? styles.selected : '' ) }></div>
					}) }
				</div>
				{ tabs.map(function (item, index) {
					return <div key={index} className={ styles.tabPanel }>
						{ self.renderChildren(children, index) }
					</div>
				}) }
			</div>
		);
	}

}
