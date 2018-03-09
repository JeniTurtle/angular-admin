import React, {
	Component,
} from 'react';

import PropTypes from 'prop-types';

import loadingImg from './loading.png';
import styles from './Loading.scss';

export default class Loading extends Component {

	render() {

		const {
			content
		} = this.props;

		return (
			<div className={ styles.wrapper }>
				<img src={ loadingImg } className={ styles.icon } />
				{/*
				<p style={ { width: '200px', height: '32px', position: 'absolute', textAlign: 'left', lineHeight: '32px', left: '50%', top: '40%', margin: '-16px 20px', color: '#000', fontSize: '20px' } }>{ content || '加载中...' }</p>
				*/}
			</div>
		);
	}

}
