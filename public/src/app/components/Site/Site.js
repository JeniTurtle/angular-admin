import './blobPolyfill';
import React, {
	Component,
	createElement
} from 'react';
import PropTypes from 'prop-types';
import {
	render,
	findDOMNode
} from 'react-dom';
import ReactCrop from 'react-image-crop';

import {
	showWarning
} from '../../actions/Popups';

import {
	connect
} from 'react-redux';

import styles from './Site.scss';
import QRious from 'qrious';

import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import {
	Textfield
} from '../../components';

import {
	updateUserDesc,
	updateUserAvatar
} from '../../actions/HTTP';

import {
	Link
} from 'react-router';

import {
	checkVerified
} from '../../utils/auth';

import {
	getCookie
} from '../../utils/funcs';

import defaultAvatar from './defaultAvatar.png';

import {
	fromJS
} from 'immutable';

const uploadUrl = 'http://api.yunlaiwu.com/sns/user/upload/avatar';

@connect(state => state.get('user').toObject())

export default class Site extends Component {

	static get defaultProps() {

		return {
			smallAvatar: '',
			username: '',
			objectId: '',
			desc: ''
		}

	}

	static propTypes = {
		smallAvatar: PropTypes.string.isRequired,
		username: PropTypes.string.isRequired,
		objectId: PropTypes.string.isRequired,
		desc: PropTypes.string.isRequired
	};

	constructor() {

		super();
		this.state = {
			editMode: false,
			editDesc: '',
			showCrop: false,
			crop: null,
			cropImage: ''
		};

	}

	handleEdit = () => {

		this.setState({
			editMode: true,
			editDesc: ''
		});

	};

	updateDesc = val => {
		this.setState({
			editDesc: val
		});
	};

	handleSubmit = e => {

		const {
			editDesc
		} = this.state;

		const {
			dispatch
		} = this.props;

		e.preventDefault();

		if (!editDesc.trim()) return true;

		this.setState({
			editMode: false
		});

		dispatch(updateUserDesc(dispatch, editDesc.trim()));

		return true;

	};

	handleUploadAvatar = e => {

		let fileList = e.currentTarget.files;
		let reader = new FileReader();
		if (!fileList || !fileList[0]) return;

		const self = this;
		this.setState({
			showCrop: true
		});

		reader.addEventListener("load", function () {
			const cropConfig = {
				width: 90,
				aspect: 1
			};
			const CropComponent = () => <ReactCrop src={ reader.result } onComplete={ self.handleCropReady }
												   crop={ cropConfig } style={{
				position: 'relative',
				width: '800px',
				height: 'auto',
				margin: '100px auto'
			}}/>;
			render(createElement(CropComponent), findDOMNode(self.refs.crop));
			self.setState({
				cropImage: reader.result
			});
		}, false);
		reader.readAsDataURL(fileList[0]);

		//需要清空，防止重复提交同一个照片时不触发change事件
		e.currentTarget.value = '';
	};

	handleCropOK = () => {
		let {
			crop,
			cropImage
		} = this.state;
		const {
			dispatch
		} = this.props;
		let image = new Image();
		const self = this;
		image.addEventListener('load', function () {

			//没有移动时，设置默认值
			if (!crop) {

				crop = {
					x: 0,
					y: 0,
					width: image.height >= image.width ? 90 : image.height * 100 / image.width
				};

			}

			let canvas = document.createElement('canvas');
			var cropWidth = (crop.width / 100) * image.width;
			var cropHeight = cropWidth;
			var cropX = (crop.x / 100) * image.width;
			var cropY = (crop.y / 100) * image.height;
			canvas.width = cropWidth;
			canvas.height = cropHeight;
			let ctx = canvas.getContext('2d');
			ctx.drawImage(image, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);

			canvas.toBlob(b => {
				let fd = new FormData();
				fd.append('picture', b);
				fd.append('token', getCookie('X-AVOSCloud-Session-Token'));
				$.ajax({
					url: uploadUrl,
					type: 'POST',
					processData: false,
					contentType: false,
					data: fd,
					timeout: 30000,
					success: function (data) {
						dispatch(updateUserAvatar(dispatch, canvas.toDataURL()));
						dispatch(showWarning('上传头像成功'));
						self.setState({
							showCrop: false
						});
					},
					error: function () {
						dispatch(showWarning('上传头像失败'));
					}
				});
			}, 'image/jpeg');

		});
		image.src = cropImage;

	};

	handleCropReady = crop => {

		// todo，非要移动么。。。
		this.setState({
			crop
		});

	};

	handleCropCancel = () => {
		this.setState({
			showCrop: false
		});
	};

	render() {

		const {
			smallAvatar,
			username,
			objectId,
			desc
		} = this.props;

		const {
			editMode,
			editDesc,
			showCrop
		} = this.state;

		const qr = new QRious({
			size: 400,
			value: 'http://www.yunlaiwu.com/author?uid=' + objectId
		}).toDataURL('image/jpeg');

		const isVerified = checkVerified(fromJS(this.props));

		return (
			<div className={ styles.site }>
				<div className={ styles.avatar }>
					<img src={ smallAvatar || defaultAvatar }/>
					<div className={ styles.edit }>
						<Glyphicon glyph="edit"
								   style={ {cursor: 'pointer', color: '#fff', fontSize: '40px', lineHeight: '100px'} }/>
						<input type="file" onChange={ this.handleUploadAvatar } accept=".jpg,.png,.jpeg,.gif"/>
					</div>
				</div>
				<div className={ styles.info }>
					<h1>{ username + ' · 版权小站' }</h1>
					{ !editMode && <p>{ desc || '这个人很懒，什么都没有留下' } <Glyphicon glyph="edit" style={ {
						cursor: 'pointer',
						color: '#0037ff'
					} } onClick={ this.handleEdit }/></p> }
					{ editMode &&
					<form onSubmit={ this.handleSubmit }><Textfield onChange={ this.updateDesc } value={ editDesc }
																	placeholder={ desc }/></form> }
				</div>
				{ isVerified && <img className={ styles.code } src={ qr }/> }
				<p style={ {textAlign: 'right', marginRight: '-4px', color: '#999', marginTop: '5px'} }>您的版权小站专属二维码</p>
				<p style={ {textAlign: 'right', marginRight: '-4px', color: '#999', marginTop: '-12px'} }>
					扫描后分享给他人，让更多人关注您的版权小站</p>
				{ showCrop && <div className={ styles.cropContainer }>
					<div className={ styles.okBtn } onClick={ this.handleCropOK }>确认</div>
					<div className={ styles.cancelBtn } onClick={ this.handleCropCancel }>取消</div>
					<div className={ styles.crop } ref="crop"></div>
				</div> }
			</div>
		);
	}

}
