import './blobPolyfill';
import React, {
	Component,
	createElement
} from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/lib/Modal';
import Button from 'react-bootstrap/lib/Button';

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


import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import {
	Textfield
} from '../../components';

import {
	fetchUser
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

import styles from './Site.scss';

const uploadUrl = 'http://api.yunlaiwu.com/sns/user/upload/avatar';
@connect(state => state.get('user').toObject())

export default class Avatar extends Component {

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
	}

	constructor(props) {

		super(props);
		this.state = {
			editMode: false,
			editDesc: '',
			showCrop: false,
			crop: null,
			cropImage: '',
			showModal: true
		};

	}


	handleUploadAvatar = e => {
		const validEx = ['.jpg', '.png', '.jpeg', '.gif'];
		const extension = e.currentTarget.value.substr(e.currentTarget.value.lastIndexOf(".")).toLowerCase();
		if (validEx.indexOf(extension) == -1) return;
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
	}

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
						dispatch(fetchUser(dispatch));
						self.setState({
							showCrop: false
						});
						self.closedModal();
						dispatch(showWarning('上传头像成功'));
					},
					error: function () {
						dispatch(showWarning('上传头像失败'));
					}
				});
			}, 'image/jpeg');

		});
		image.src = cropImage;

	}

	handleCropReady = crop => {

		// todo，非要移动么。。。
		this.setState({
			crop
		});

	}

	handleCropCancel = () => {
		this.setState({
			showCrop: false
		});
	}

	closeModal = () => {
		this.setState({
			showModal: false
		});
	}
	closedModal = () => {
		this.setState({
			showModal: false
		});
		this.props.closed();
	}

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

		return (
			<Modal show={this.state.showModal} onHide={this.closedModal}>
				<Modal.Header closeButton>设置头像</Modal.Header>
				<Modal.Body>
					{ showCrop && <div className={ styles.cropContainer }>
						<div className={ styles.crop } ref="crop"></div>
					</div> }
					<div className={styles.selectPic}>
						选择图片
						<input type="file" onChange={ this.handleUploadAvatar } accept=".jpg,.png,.jpeg,.gif"/>
					</div>
					<div className={styles.tips}>仅支持 jpg、jpeg、png格式，图片大小不超过1M</div>
					<div className={ styles.btnCont }>
						<button onClick={this.handleCropOK} className={ styles.confirm }>确定</button>
						<button onClick={this.closedModal} className={ styles.cancel }>取消</button>
					</div>
				</Modal.Body>
			</Modal>
		);
	}

}
