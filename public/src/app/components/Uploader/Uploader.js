import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	connect
} from 'react-redux';
import dragula from 'react-dragula';

import Button from 'react-bootstrap/lib/Button';
import styles from './Uploader.scss';

import {
	showWarning,
	showToast
} from '../../actions/Popups';

import getExtImg from '../../utils/fileExtension';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';

const uploadUrl = 'http://www.yunlaiwu.com/api/operating/uploadImg';

//图片上传的阈值
const maxThreshold = 48;

@connect(() => ({}))
export default class Uploader extends Component {

	static propTypes = {
		buttonName: PropTypes.string,
		tips: PropTypes.string,
		types: PropTypes.arrayOf(PropTypes.string),
		displayName: PropTypes.string,
		maxSize: PropTypes.number
	}

	constructor() {
		super();
		this.state = {
			uploading: false,
			progress: 0
		};
	}

	handleChange = (e) => {

		const {
			uploading
		} = this.state;
		const fileList = e.currentTarget.files;
		if (uploading || !fileList.length) return;

		const {
			onChange,
			maxSize,
			dispatch,
			types
		} = this.props;

		const file = fileList[0];

		if (types.length) {

			let extension = file.name.match(/\.(\w*?)$/);
			extension = extension && extension[1];
			if (extension) {
				if (types.indexOf(extension.toLowerCase()) < 0) {
					dispatch(showToast('文件类型不对', 'fail'));
					return;
				}
			}

		}

		if (maxSize && maxSize < file.size) {
			dispatch(showToast('文件大小超过限制', 'fail'));
			return;
		}

		let fd = new FormData();
		fd.append('file', file);
		const self = this;

		this.setState({
			uploading: true
		});

		this.xhr = $.ajax({
			url: uploadUrl,
			type: 'POST',
			processData: false,
			contentType: false,
			data: fd,
			timeout: 40000,
			xhr: () => {
				let xhr = $.ajaxSettings.xhr();
				xhr.upload.addEventListener("progress", function(evt) {

					let done = evt.position || evt.loaded
					let total = evt.totalSize || evt.total;

					let percentComplete = done / total;
					self.setState({
						progress: Math.round(percentComplete * 90)
					});

				}, false);
				return xhr;
			},
			success: function(data) {
				onChange(data.link, file.name);
				self.setState({
					uploading: false
				});
				// dispatch(showToast('上传成功', 'success'));
			},
			error: function() {
				self.setState({
					uploading: false
				});
				dispatch(showToast('上传失败', 'fail'));
			}
		});
	}

	cancel = (sd) => {

		this.xhr.abort();
		this.setState({
			uploading: false
		});
	}

	render() {

		const {
			uploading,
			progress
		} = this.state;

		const {
			buttonName,
			tips,
			types,
			file,
			displayName,
			//div上也有onChange，要排除掉
			onChange,
			retryName,
			...attrs
		} = this.props;

		return (
			<div className="clearfix" {...attrs}>
				<div className={ styles.tips }><div dangerouslySetInnerHTML={ {__html: tips} }></div></div>
				{ uploading && <div className={ styles.progress }><div style={ { width: progress + '%'} }></div><Glyphicon style={ { position: 'absolute', left: '105px', color: '#707070', cursor: 'pointer' } } glyph="remove" onClick={ this.cancel } /></div> }
				{ !uploading && file && <div className={ styles.uploaded + ' col-sm-5'}><img src={ getExtImg(file) } /> { displayName ? displayName + '.' + file.split('.').pop() : file }</div>}
				{ !uploading && <label className={ styles.uploadBtn }>
				    { file ? (retryName || '重新上传') : buttonName } <input type="file" style={{display: 'none'}} onChange={ this.handleChange } accept={ types.map(function(item) { return '.' + item; }).join(',') }/>
				</label> }
			</div>
		);
	}

}

@connect(() => ({}))
export class ImageUploader extends Component {

	static get defaultProps() {
		return {
			previews: [],
			isMultiple: true
		};
	}

	static propTypes = {
		buttonName: PropTypes.string,
		tips: PropTypes.string,
		previews: PropTypes.arrayOf(PropTypes.string),
		types: PropTypes.arrayOf(PropTypes.string),
		isMultiple: PropTypes.bool
	}

	constructor() {
		super();
		this.state = {
			uploading: false
		};
		this.dragula = null;
	}

	handleChange = (e) => {

		const {
			uploading
		} = this.state;
		let fileList = e.currentTarget.files;
		if (uploading || !fileList.length) return;

		const {
			onChange,
			dispatch,
			previews,
			isMultiple,
			types
		} = this.props;

		if (previews.length + fileList.length > maxThreshold) {
			dispatch(showWarning('图片数目过多'));
			return;
		}

		if (types.length) {

			for (let i = 0; i < fileList.length; i++) {
				let file = fileList[i];
				let extension = file.name.match(/\.(\w*?)$/);
				extension = extension && extension[1];
				if (extension) {
					if (types.indexOf(extension.toLowerCase()) < 0) {
						dispatch(showToast('文件类型不对', 'fail'));
						return;
					}
				}
			}
		}

		this.setState({
			uploading: true
		});

		let uploadStack = [];
		let uploadFailStack = [];
		let promissArr = [];

		//es6的promise会因为一个子promise的reject而立即reject，因此需要在外面包一层
		for (let i = 0; i < fileList.length; i++) {
			let file = fileList[i];
			let fd = new FormData();
			fd.append('file', file);

			promissArr.push(new Promise(resolve => {
				$.ajax({
					url: uploadUrl,
					type: 'POST',
					processData: false,
					contentType: false,
					data: fd,
					timeout: 30000,
					success: function(data) {
						uploadStack.push(data.link);
						resolve(true);
					},
					error: function() {
						uploadFailStack.push(file);
						resolve(false);
					}
				})
			}));
		}

		Promise.all(promissArr).then(value => {

			onChange(isMultiple ? previews.concat(uploadStack) : uploadStack);

			this.setState({
				uploading: false
			});

			uploadFailStack.length && dispatch(showWarning('上传失败' + uploadFailStack.length + '张照片'));

		});
	}

	buildDragula = () => {
		let previews = this.refs.previews;
		const self = this;
		const {
			onChange
		} = this.props;

		if (this.dragula) {
			this.dragula.destroy();
		}

		this.dragula = dragula([previews], {
				direction: 'horizontal'
			})
			.on('drop', function() {

				let links = [];
				$('img', previews).each(function(index, el) {
					links.push(el.src)
				});
				onChange(links, true);

				self.dragula.cancel(true);

			});
	}

	componentDidMount = () => {
		this.buildDragula();
	}

	componentWillUnmount() {

		this.dragula.destroy();

	}

	handleDelete = index => {

		const {
			onChange,
			previews
		} = this.props;


		onChange([
			...previews.slice(0, index),
			...previews.slice(index + 1)
		]);

	}

	render() {

		const self = this;

		const {
			uploading
		} = this.state;

		const {
			buttonName,
			tips,
			previews,
			types,
			isMultiple
		} = this.props;

		return (
			<div>
				<div className="clearfix">
				{ uploading && <label className="btn btn-default btn-file col-sm-3">上传中...</label> }
				{ !uploading && <label className={ styles.uploadBtn + ' col-sm-3' }>
				    { buttonName } <input type="file" style={{display: 'none'}} onChange={ self.handleChange } multiple={ isMultiple ? 1 : 0 } accept={ types.map(function(item) { return '.' + item; }).join(',') }/>
				</label> }
				<div className={ styles.tips + ' col-sm-9' }><div>{ tips }</div></div>
				</div>
				{ previews.length > 0 && <div className={ styles.previews } ref="previews">
					{
						previews.map(function(preview, index) {
							return <div key={index} className={ styles.preview + ' col-sm-3'} >
									<div className={ styles.imageWrapper }>
										<img src={ preview }/>
									</div>
									{ isMultiple && <div className={ styles.remove } onClick={ self.handleDelete.bind(self, index) }>删除</div> }
								</div>
						})
					}
				</div> }
			</div>
		);
	}

}

const defaultAvatar = 'https://dn-2eyad9yt.qbox.me/e9efedb4c5af6b4dd93d.png';

@connect(() => ({}))
export class ImageAvatarUploader extends Component {

	static get defaultProps() {
		return {
			previews: defaultAvatar,
			types: ['jpg', 'jpeg', 'png', 'gif'],
			tip: ''
		};
	}

	static propTypes = {
		preview: PropTypes.string,
		types: PropTypes.arrayOf(PropTypes.string),
		tip: PropTypes.string
	}

	static defaultAvatar = defaultAvatar

	constructor() {
		super();
		this.state = {
			uploading: false
		};
	}

	handleChange = (e) => {

		const {
			uploading
		} = this.state;
		const {
			dispatch,
			onChange,
			types
		} = this.props;
		let fileList = e.currentTarget.files;
		if (uploading || !fileList.length) return;

		let file = fileList[0];

		if (types.length) {

			let extension = file.name.match(/\.(\w*?)$/);
			extension = extension && extension[1];
			if (extension) {
				if (types.indexOf(extension.toLowerCase()) < 0) {
					dispatch(showToast('文件类型不对', 'fail'));
					return;
				}
			}

		}



		let fd = new FormData();
		fd.append('file', file);

		$.ajax({
			url: uploadUrl,
			type: 'POST',
			processData: false,
			contentType: false,
			data: fd,
			timeout: 30000,
			success: function(data) {
				onChange(data.link);
				// dispatch(showToast('上传成功'), 'success');
			},
			error: function() {
				dispatch(showToast('上传失败'), 'fail');
			}
		});

	}

	render() {

		const {
			uploading
		} = this.state;

		const {
			tip,
			preview,
			types
		} = this.props;

		return (
			<div className={ styles.avatarImgWrapper + ' clearfix' }>
				<div className={ styles.avatarImg }>
					<img src={ preview }/>
					<label>
					    { preview == defaultAvatar ? '上传图片' : '重新上传' } <input type="file" style={{display: 'none'}} onChange={ this.handleChange } accept={ types.map(function(item) { return '.' + item; }).join(',') }/>
					</label>
				</div>
				<div className={ styles.tip }>
					<p>{ tip }</p>
				</div>
			</div>
		);
	}

}
