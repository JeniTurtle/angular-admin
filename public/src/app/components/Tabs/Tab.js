import React, {
	Component,
} from 'react';

import PropTypes from 'prop-types';

export default class Tab extends Component {

	static get defaultProps() {
		return {
			selected: false
		};
	}

	static propTypes = {
		selected: PropTypes.bool
	}

	render() {

		const {
			selected,
			children
		} = this.props;

		return (
			<div style={{ display: selected ? 'block' : 'none' }}>
				{ children }
			</div>
		);
	}

}
