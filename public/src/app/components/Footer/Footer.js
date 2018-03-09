import React, {
	Component
} from 'react';

import styles from './Footer.scss';

export default class Footer extends Component {

	render() {

		return (
			<footer>
				<div>
					<div>
						<div>
							<a target="_blank" href="http://www.yunlaiwu.com/protocol#kefu">联系我们</a>
								<a target="_blank" href="http://www.yunlaiwu.com/usehelp">使用教程</a>
								<a target="_blank" href="http://www.yunlaiwu.com/protocol#rule">帮助中心</a>
							<a target="_blank" href="http://www.yunlaiwu.com/protocol#protocol">服务协议</a>
							<a target="_blank" href="http://www.yunlaiwu.com/protocol#secret">隐私政策</a>
							<a target="_blank" href="http://y.yunlaiwu.com/static/tortguide">侵权投诉</a>
						</div>
						<p>© 2015-2017 Yunlaiwu 京ICP备案15050505</p>
					</div>
					<div>
						<img src="https://dn-2eyad9yt.qbox.me/0877a584b6f1d9cef3ce.jpeg" />
						<p>云莱坞微信公众号</p>
					</div>
				</div>
			</footer>
		);

	}

}
