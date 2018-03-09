import {
	fromJS
} from 'immutable';

export default fromJS({
	//人物小传
	biographies: ['', ''],
	//大纲
	outline: ['', '', '', ''],
	//作品试读
	probation: '',
	//卡通试读
	cartoonProbation: [],
	//卡通人物小传
	cartoonBiography: [{
		lengendName: '',
		lengendPic: 'https://dn-2eyad9yt.qbox.me/e9efedb4c5af6b4dd93d.png',
		lengendDesc: ''
	}, {
		lengendName: '',
		lengendPic: 'https://dn-2eyad9yt.qbox.me/e9efedb4c5af6b4dd93d.png',
		lengendDesc: ''
	}]
}).toObject();