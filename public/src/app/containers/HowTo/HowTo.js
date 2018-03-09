import React, {
	Component
} from 'react';
import background from './background.png';
import styles from './HowTo.scss';

export default class HowTo extends Component {

	render() {

		return (
			<div className={ styles.wrapper }>
				<img src={ background } />
				<p>除了故事本身的价值，另一个<b>至关重要</b>的因素就只有<b>做好自己的故事卡</b>。</p>
				<p>您上传的故事卡<b>内容越完整</b>，就越容易被制片人青睐并<b>成交</b>；</p>
				<p>制片人太忙了，当他们扫过【一句话故事】没有发现有用的信息，您的整部作品就直接被忽视掉；</p>
				<p>毫不夸张地说，<b>【一句话故事】和简短的【核心卖点】</b>，是制片人要不要继续了解您作品的<b>基础</b>；</p>
				<p>接下来，他们才会更耐心地观察您作品中<b>【人物小传】和【故事梗概】</b>中的信息，<b>发现改编可行性，决定是否购买版权</b>。</p>
				<p>因此，写好故事卡至关重要。</p>
			</div>
		);
	}

}