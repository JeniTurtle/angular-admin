//tood: 在search情况下删除

import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	render,
	findDOMNode
} from 'react-dom';
import {
	bindActionCreators
} from 'redux';
import {
	Author,
	Pagination,
	Textfield,
	Label,
	ImageAvatarUploader,
	Confirm,
	Loading,
	Nav
} from '../../components';

import clone from '../../utils/clone';

import {
	connect
} from 'react-redux';

import {
	showToast,
	showWarning
} from '../../actions/Popups';


import FormControl from 'react-bootstrap/lib/FormControl';
import Modal from 'react-bootstrap/lib/Modal';
import Button from 'react-bootstrap/lib/Button';

import {
	fetchAuthors,
	deleteAuthor,
	addAuthor,
	updateAuthor,
	searchAuthor
} from '../../actions/HTTP';
import styles from './AuthorList.scss';

import validation from '../../utils/validation';

import Glyphicon from 'react-bootstrap/lib/Glyphicon';

import emptyHolder from './empty.png';

const pageCount = 20;

@connect(state => ({
	authors: state.get('authors')
}), dispatch => bindActionCreators({
	fetchAuthors: fetchAuthors.bind(this, dispatch),
	deleteAuthor: deleteAuthor.bind(this, dispatch),
	addAuthor: addAuthor.bind(this, dispatch),
	updateAuthor: updateAuthor.bind(this, dispatch),
	searchAuthor: searchAuthor.bind(this, dispatch),
	showToast,
	showWarning
}, dispatch))

export default class AuthorList extends Component {

	constructor(props) {

		super();
		this.state = {
			modalShow: false,
			modalAvatar: ImageAvatarUploader.defaultAvatar,
			modalName: '',
			modalDescript: '',
			modalId: '',
			modalTitle: '',
			modalWorks: [{
				title: '',
				type: '',
				publishTime: '',
				publisher: '',
				achievement: ''
			}],
			searchText: '',
			confirmShow: false,
			pn: 0
		};

	}

	componentWillMount() {

		const modalShow = this.props.params;
		if(modalShow && modalShow.auto){
			this.setState({
				modalShow: true
			});
		}

		const {
			fetchAuthors,
			showToast
		} = this.props;

		fetchAuthors(0, pageCount);
	}

	shouldComponentUpdate(nextProps, nextState) {

		const messageProps = {
			// loadingState: ['作者列表加载中', '作者列表加载成功', '作者列表加载失败'],
			proccessingAddAuthor: ['作者添加中', '作者添加成功', '作者添加失败'],
			proccessingUpdateAuthor: ['作者信息更新中', '作者信息更新成功', '作者信息更新失败'],
			processingDelAuthor: ['作者删除中', '作者删除成功', '作者删除失败'],
			processingSearchAuthor: ['正在搜索作者', '搜索作者成功', '搜索作者失败']
		};

		const messageKeys = Object.keys(messageProps);

		const {
			showToast,
			authors
		} = this.props;

		messageKeys.forEach(function(item) {

			if (nextProps.authors.get(item) != authors.get(item)) {

				switch (nextProps.authors.get(item)) {

					case 'start':
						showToast(messageProps[item][0], 'loading', -1);
						return;
					case 'success':
						showToast(messageProps[item][1], 'success');
						return;
					case 'fail':
						showToast(messageProps[item][2], 'fail');
						return;

				}

			}

		});

		return true;

	}

	handleEdit = index => {
		const {
			authors
		} = this.props;

		const author = authors.get('list').get(index);
		let newStates = {};

		author.map((item, index) => {
			newStates['modal' + index[0].toUpperCase() + index.substr(1)] = item.toJS ? item.toJS() : item;
		});

		//fuck
		if (typeof(newStates['modalWorks']) == 'string') {
			newStates['modalWorks'] = JSON.parse(newStates['modalWorks']);
		}

		this.setState(Object.assign(newStates, {
			modalShow: true,
			modalId: author.get('authorId'),
			modalTitle: '修改作者'
		}));
	}

	handleRemove = index => {
		const {
			authors
		} = this.props;

		this.setState({
			confirmShow: true,
			modalId: authors.get('list').get(index).get('authorId')
		});
	}

	update = (key, value, index, rvalue) => {

		if (key == 'work') {

			let {
				modalWorks
			} = this.state;

			modalWorks[index][value] = rvalue;

			this.setState({
				modalWorks
			});

			return;

		}

		this.setState({
			[key]: value
		});
	}

	addWork = () => {
		const {
			modalWorks
		} = this.state;

		this.setState({
			modalWorks: [
				...modalWorks, {
					title: '',
					type: '',
					publishTime: '',
					publisher: '',
					achievement: ''
				}
			]
		});
	}

	deleteWork = (index) => {

		const {
			modalWorks
		} = this.state;

		this.setState({
			modalWorks: [...modalWorks.slice(0, index), ...modalWorks.slice(index + 1)]
		});

	}

	close = () => {
		this.setState({
			modalShow: false
		});
	}

	save = () => {

		const {
			modalId,
			modalName,
			modalDescript,
			modalWorks,
			modalAvatar,

			pn
		} = this.state;

		const strategy = {

			modalAvatar: {
				required: true,
				name: '作者头像'
			},

			modalName: {
				required: true,
				name: '作者名称',
				maxLength: 15
			},

			modalDescript: {
				required: true,
				name: '作者简介',
				maxLength: 100
			}

		};

		const works = modalWorks.filter(work => !!work.title.trim());

		const {
			showToast,
			showWarning,
			updateAuthor,
			addAuthor
		} = this.props;

		const validationResult = validation(strategy, this.state);

		if (validationResult.length) {

			showWarning(validationResult[0].content, 'danger');

			return false;
		}

		this.close();


		this.setState({
			searchText: ''
		});

		if (modalId) {
			updateAuthor(modalId, {
				name: modalName,
				descript: modalDescript,
				avatar: modalAvatar,
				works
			}, pn, pageCount);
		} else {
			addAuthor({
				name: modalName,
				descript: modalDescript,
				avatar: modalAvatar,
				works
			}, pn, pageCount);
		}

	}

	handleAdd = () => {
		this.setState({
			modalShow: true,
			modalId: '',
			modalAvatar: ImageAvatarUploader.defaultAvatar,
			modalName: '',
			modalDescript: '',
			modalTitle: '新增作者',
			modalWorks: [{
				title: '',
				type: '',
				publishTime: '',
				publisher: '',
				achievement: ''
			}]
		});
	}

	handleSubmit = (e) => {

		const {
			searchAuthor
		} = this.props;

		e.preventDefault();

		const {
			searchText
		} = this.state;

		if (!searchText.trim()) {
			this.load();
			return;
		}

		searchAuthor(searchText.trim());
		return false;
	}

	removeSearch = () => {

		this.setState({
			searchText: ''
		});

		const {
			authors
		} = this.props;

		this.load();

	}

	load = p => {
		const {
			fetchAuthors
		} = this.props;

		const {
			pn
		} = this.state;

		fetchAuthors(p === undefined ? pn : p - 1, pageCount);
		this.setState({
			pn: p === undefined ? pn : p - 1
		});
	}

	closeConfirm = () => {
		this.setState({
			confirmShow: false
		});
	}

	okConfirm = () => {

		const {
			deleteAuthor
		} = this.props;

		const {
			modalId,
			pn
		} = this.state;

		this.setState({
			confirmShow: false,
			searchText: ''
		});
		deleteAuthor(modalId, pn, pageCount);
	}

	render() {

		const self = this;

		const {
			authors,
			path
		} = this.props;

		const {
			modalShow,
			modalAvatar,
			modalName,
			modalDescript,
			modalWorks,
			modalId,
			modalTitle,
			confirmShow,
			searchText,
			pn
		} = this.state;

		const whetherOK = authors && (authors.get('loadingState') == 'success' || authors.get('processingSearchAuthor') == 'success');
		const showSearchRemoveBtn = searchText.trim().length > 0;
		return (
			<div className={ styles.container }>
				<Nav path={ path }/>
				<div className={ styles.contentContainer + ' pull-right'}>
					<div className={ styles.searchAdd + ' clearfix' }>
						<form className={ styles.search } onSubmit={ this.handleSubmit }>
							<FormControl type="text" placeholder="作者名称" className={ styles.input } value={ searchText } onChange={ e => this.setState({searchText: e.target.value}) }/>
							<div className={ styles.searchicon } onClick={ this.handleSubmit }></div>
							{ showSearchRemoveBtn && <Glyphicon glyph="remove" className={ styles.removeicon } onClick={ this.removeSearch }/> }
						</form>
						<div className={ styles.newAuthor } onClick={ this.handleAdd }>新增作者</div>
					</div>
					<div className="clearfix">
					{whetherOK ?
					 	(authors.get('totalCount') > 0 ? authors.get('list').map((author, index) => {
							return <Author key={ index } handleEdit={ self.handleEdit.bind(self, index) } handleRemove={ self.handleRemove.bind(self, index) } { ...author.toJS() }/>
						}) : <div className={ styles.emptyHolder }>
							<img src={ emptyHolder } />
							<p style={{ color: '#707070', textAlign: 'center'}}>暂无签约作者</p>
						</div>)
					 	:
					 	<div style={{ marginTop: '200px' }}>
					 		<Loading />
					 	</div>
					}
					</div>
					{ authors.get('totalCount') > pageCount && <Pagination pageCount={ pageCount } handleTurn={ this.load } total={ authors.get('totalCount') } curPage={ pn + 1 }/> }
				</div>
				<Confirm show={ confirmShow } onClose={ this.closeConfirm } onOK={ this.okConfirm } content="是否确认删除该作者？" title="删除作者" />
				<Modal show={ modalShow } className={ styles.modal } onHide={ this.close }>
					<Modal.Header closeButton>
						<Modal.Title>{ modalTitle }</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<div className="fieldset clearfix">
							<Label className="col-sm-2">作者头像</Label>
							<div className="col-sm-10" style={ { position: 'relative' } }>
								<ImageAvatarUploader preview={ modalAvatar || '' } buttonName="上传头像" types={ ['jpg', 'png', 'gif', 'jpeg'] } tip="建议尺寸 800 * 800，仅支持 jpg、jpeg、png/gif格式，图片大小不超过1M" onChange={ file => this.update('modalAvatar', file) } />
							</div>
						</div>
						<div className="fieldset clearfix">
							<Label className="col-sm-2" required={ true }>作者姓名</Label>
							<div className="col-sm-10">
								<Textfield value={ modalName } maxLength={ 15 } onChange={ value => this.update('modalName', value) }/>
							</div>
						</div>
						<div className="fieldset clearfix">
							<Label className="col-sm-2" required={ true }>作者简介</Label>
							<div className="col-sm-10">
								<Textfield autoExpand={ true } height={ 100 } isArea={ true } value={ modalDescript } maxLength={ 100 } onChange={ value => this.update('modalDescript', value) }/>
							</div>
						</div>
						<div className="clearfix">
						{
							modalWorks.map((work, index) => {
								return <div key={ index } className="clearfix">
									<div className="fieldset clearfix">
										<Label className="col-sm-2">代表作品</Label>
										<div className="col-sm-10">
											代表作品{ ('一二三四五六七八九十').substr(index, 1) }
											{ index > 0 ? <span style={ { color: '#9B9B9B', paddingLeft: '10px', cursor: 'pointer'} } onClick={ self.deleteWork.bind(self, index) }>删除</span> : ''}
										</div>
									</div>
									<div className="fieldset clearfix">
										<Label className="col-sm-2">标题：</Label>
										<div className="col-sm-10">
											<Textfield value={ work.title } onChange={ value => self.update('work', 'title', index, value) }/>
										</div>
									</div>
									<div className="fieldset clearfix">
										<Label className="col-sm-2">类别：</Label>
										<div className="col-sm-10">
											<Textfield value={ work.type } onChange={ value => self.update('work', 'type', index, value) }/>
										</div>
									</div>
									<div className="fieldset clearfix">
										<Label className="col-sm-2">出版社/首发网站/发行方：</Label>
										<div className="col-sm-10">
											<Textfield value={ work.publisher } onChange={ value => self.update('work', 'publisher', index, value) }/>
										</div>
									</div>
									<div className="fieldset clearfix">
										<Label className="col-sm-2">出版/上映时间：</Label>
										<div className="col-sm-10">
											<Textfield value={ work.publishTime } onChange={ value => self.update('work', 'publishTime', index, value) }/>
										</div>
									</div>
									<div className="fieldset clearfix">
										<Label className="col-sm-2">获得成就：</Label>
										<div className="col-sm-10">
											<Textfield autoExpand={ true } height={ 100 } isArea={ true } value={ work.achievement } onChange={ value => self.update('work', 'achievement', index, value) }/>
										</div>
									</div>
								</div>;
							})
						}
						</div>
						{ modalWorks.length < 3 && <div onClick={ self.addWork } className={ styles.addWork }>添加代表作品</div> }
						{ modalWorks.length >= 3 && <div style={ { textAlign: 'right', fontSize: '16px', color: '#999' } }>最多三个代表作品</div> }
					</Modal.Body>
					<Modal.Footer>
						<Button className="ok" onClick={ this.save }>{ modalId ? '更新' : '保存' }</Button>
						<Button onClick={ this.close }>取消</Button>
					</Modal.Footer>
				</Modal>
			</div>
		);

	}

}
