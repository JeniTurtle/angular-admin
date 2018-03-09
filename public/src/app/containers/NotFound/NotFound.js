import React from 'react';
import {
	render
} from 'react-dom';

import p404 from './404.png';
import styles from './NotFount.scss';

class NotFound extends React.Component {
	render() {
		return (
			<div className={ styles.container }>
				<img src={ p404 } />
				<a href="http://www.yunlaiwu.com" className={ styles.goHome }>去云莱坞首页~</a>
			</div>
		);
	}
}


export default NotFound;
