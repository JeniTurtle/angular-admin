import React, {
	Component
} from 'react';
import {
	connect
} from 'react-redux';
import Glyphicon from 'react-bootstrap/lib/Glyphicon'
import {
	Link
} from 'react-router';
import styles from './Progress.scss';

@connect(state => ({
	user: state.get('user')
}))
export default class WorkSpace extends Component {

	render() {

		const {
			step,
			GG,
			user
		} = this.props;

		return (
			<div className={ styles.container }>
				<div style={{ color: '#0037ff' }}>{ step > 0 ? <Glyphicon glyph="ok-sign" className={ styles.icon }/> : <span className={ styles.icon }>①</span> }<span>基本信息</span></div>
				<span style={{ color: '#0037ff' }}><Glyphicon glyph="menu-right" /></span>
				{ !GG && <div style={{ color: step > 0 ? '#0037ff' : '#707070' }}>{ step > 1 ? <Glyphicon className={ styles.icon } glyph="ok-sign" /> : <span className={ styles.icon }>②</span> }<span>故事梗概</span></div> }
				{ !!GG && typeof(GG) == 'string' && <Link style={{ color: '#707070', textDecoration: 'none' }} to={ GG }><span className={ styles.icon }>②</span><span>故事梗概</span></Link> }
				{ !!GG && typeof(GG) == 'boolean' && <div style={{ color: '#707070', textDecoration: 'none' }}><span className={ styles.icon }>②</span><span>故事梗概</span></div> }
				{ !!GG && <p style={{ width: '120px', marginLeft: '-40px' }}>无梗概作品不会被推荐</p> }
				<span style={{ color: step > 0 ? '#0037ff' : '#707070' }}><Glyphicon glyph="menu-right" /></span>
				<div style={{ color: step > 1 ? '#0037ff' : '#707070' }}>{ step > 2 ? <Glyphicon className={ styles.icon } glyph="ok-sign" /> : <span className={ styles.icon }>③</span> }<span>上传原文</span></div>
				<span style={{ color: step > 1 ? '#0037ff' : '#707070' }}><Glyphicon glyph="menu-right" /></span>
				<div style={{ color: step > 2 ? '#0037ff' : '#707070' }}>{ step >= 3 ? <Glyphicon className={ styles.icon } glyph="ok-sign" /> : <span className={ styles.icon }>④</span> }<span>提交审核(48小时)</span></div>
				{ user.get('authState') != 'authed' && <p style={{ width: '100px', color: '#ff3b30' }}>需先完成认证</p> }
			</div>
		);
	}
}