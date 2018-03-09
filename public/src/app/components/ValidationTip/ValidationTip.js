import React, {
	Component
} from 'react';

import Glyphicon from 'react-bootstrap/lib/Glyphicon';

export default class ValidationTip extends Component {


	render() {
		const {
			type,
			content
		} = this.props;

		return <div>{ type == 'fail' ? <Glyphicon glyph="remove-sign" style={ { fontSize: '16px', color: '#ff3b30' } } /> : <Glyphicon glyph="ok-sign" style={ { fontSize: '16px', color: '#44DB5E' } } /> }{ content }</div>;
	}

}