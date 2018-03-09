import React, {
	Component,
} from 'react';

import PropTypes from 'prop-types';

import {
	connect
} from 'react-redux';
import {
	bindActionCreators
} from 'redux';
import {
	getAuthorIPs
} from '../../actions/HTTP';
import styles from './Author.scss';
import {
	Uploader
} from '../../components';
import copyrightMap from '../../utils/copyrightMap';

export default class Author extends Component {

	constructor() {

		super();

		this.state = {
			count: -1
		};

	}

	componentWillMount() {

		const {
			authorId
		} = this.props;

		getAuthorIPs(authorId).then(dat => {
			this.setState({
				count: dat.data
			});
		});

	}

	render() {
		const {
			avatar,
			name,
			descript,
			handleEdit,
			handleRemove
		} = this.props;

		const {
			count
		} = this.state;

		return (
			<div className={ styles.author }>
				<img className={ styles.avatar} src={ avatar }/>
				<h2 className={ styles.name }>{ name }</h2>
				<div className={ styles.info }>
					<p>{ count > -1 ? count : '-'} </p>
					<p>作品</p>
				</div>
				<p className={ styles.desc }>{ descript }</p>
				<div className={ styles.bar }>
					{ handleEdit && <div className={ styles.edit } onClick={ handleEdit }>编辑</div> }
					{ handleRemove && <div className={ styles.remove } onClick={ handleRemove }>删除</div> }
				</div>
			</div>
		);
	}
}
