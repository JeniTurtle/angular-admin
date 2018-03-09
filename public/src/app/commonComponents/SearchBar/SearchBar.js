/**
 * 搜索框
 * Created by waka on 2017/3/31.
 */

// React
import React, {
	Component,
} from 'react';

import PropTypes from 'prop-types';

// CSS modules
import styles from './SearchBar.scss';

import searchImg from './search.svg';	// 搜索图标

/**
 * 搜索框
 */
export default class SearchBar extends Component {

	render() {
		return (
			<section className={styles.searchBar}>
				<input className={styles.input} placeholder="姓名/公司"/>
				<span className={styles.icon}>
					<img src={searchImg}/>
				</span>
			</section>
		);
	}
}
