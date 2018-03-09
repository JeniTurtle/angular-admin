import React, {
	Component,
} from 'react';

import PropTypes from 'prop-types';

import styles from './Pagination.scss';

export default class Pagination extends Component {


	static get defaultProps() {
		return {
			curPage: 1
		};
	}

	static propTypes = {
		handleTurn: PropTypes.func.isRequired,
		total: PropTypes.number.isRequired,
		pageCount: PropTypes.number.isRequired,
		curPage: PropTypes.number
	}


	render() {

		const {
			handleTurn,
			total,
			pageCount,
			curPage,
			...attrs
		} = this.props;

		const pageLength = Math.ceil(total / pageCount);

		return (
			<div className={ styles.pagination } {...attrs}>
				<span className={ styles.pre + ( curPage > 1 ? ' ' + styles.enable : ''  ) } onClick={ curPage > 1 ? handleTurn.bind(this, curPage - 1) : () => {} }>上一页</span>
				<span className={ styles.counter }> { curPage } / { pageLength }</span>
				<span className={ styles.next + ( curPage < pageLength ? ' ' + styles.enable : ''  ) } onClick={ curPage < pageLength ? handleTurn.bind(this, curPage + 1) : () => {} }>下一页</span>
			</div>
		);
	}

}
