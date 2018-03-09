/**
 * @Author: chenming
 * @Date:   2017-01-17T20:59:16+08:00
 * @Last modified by:   chenming
 * @Last modified time: 2017-02-14T11:58:25+08:00
 */


import React, {
	Component
} from 'react';
import {
	connect
} from 'react-redux';
import styles from './Preview.scss';
import iphoneImg from '../../components/Phone/iphone.png';
import {
	fetchIP
} from '../../actions/HTTP';
import {
	bindActionCreators
} from 'redux';
import pcImg from './pc.png';
import pcActiveImg from './pcactive.png';
import mobileImg from './mobile.png';
import mobileActiveImg from './mobileActive.png';

const previews = [

	{
		title: '盗墓笔记：七星鲁王宫',
		realAuthor: '南派三叔',
		cat: ['冒险'],
		desc: '古董店小老板吴邪，因受祖传盗墓笔记影响，在生活窘迫之际，与几位“杂牌队友”开始了惊险刺激的盗墓生涯。',
		biographies: ['吴邪：男，30岁，古董店老板，为生活所迫，“继承祖业”踏上盗墓的不归路。', '闷油瓶：男，真实年龄未知，沉默寡言，血液具有驱邪的神奇功效。', '胖子：男，背景神秘的北派盗墓贼，行为滑稽，真实动机不明。'],
		outline: [
			'吴邪，江南某个古董小店的老板，因生意冷清，只能终日看着祖父生前留下的一本“盗墓笔记”打发时间。\
			其中，一篇残缺的手记，记载着有关“战国古墓宝藏的帛书”，引起了他浓厚的兴趣。然而，他怎么也想不到，命运却将“另一部分战国帛书”，经由一个奇怪的老头，带到他的店里。\
			尽管吴邪没有得到这份帛书，他还是机灵的偷拍了一张照片，并将照片交给了他那对盗墓兴趣使然的三叔。三叔却意外的从帛书上的文字看出了一张地图。\
			吴邪迫于经济危机，又为满足强烈的好奇心，要求跟三叔一同踏上盗墓寻宝的冒险。',
			'起初，三叔并不同意带上吴邪。但在威逼利诱之下，三叔也只好答应。\
			于是，吴邪、三叔、退伍的潘子和壮硕的大奎以及沉默寡言的“闷油瓶”，临时组成了一个盗墓贼团队，开始向宝藏进发。\
			他们在当地，找了一个老汉当导游，熟料，老汉却把他们引到了满是巨型食人尸蟞的河洞里，企图谋财害命。\
			祸不单行，他们前方又出现了一个“千年女鬼”。危难关头，“闷油瓶”竟然用他具有特殊能力的血，驱散了“它们”，使大家幸免于难。\
			逃过一劫的吴邪等人，来到小山村的招待所，通过女服务员的口述，得知这里几年前曾发生山体塌方，不仅塌出一个大坑，还暴露了一大批文物和头骨。\
			由此，他们推断那里就是此行的目的地了。',
			'上山的路上，吴邪等人又遇到了导游老汉，老汉因亲眼目睹过几周前另一伙盗墓贼惨死的景象，执意不肯带路。无奈之下，他们只好用武力威胁老汉，才找出了墓穴的具体位置。\
			但是情况并不乐观，他们好不容易挖出了墓墙，却险些命丧于墓墙后面的强酸。进入墓穴后，又差点触动一口棺材里面的杀人血尸。虽然一连串的危险接踵而至，但他们仍然顺利的找到了鲁殇王的主墓。\
			面对着七口真假难辨的棺材，前一波盗墓贼留下的痕迹，一具外国人的尸体，本已十分头疼的吴邪等人，又忽然遭遇一个脑袋套着缸的“怪物”,惊慌之下，吴邪与三叔等人走失于黑暗之中。\
			原来，这个套着缸的怪物，是北派的摸金贼“胖子”，他的目的与吴邪等人似乎相同，却似乎有着不可告人的秘密。但他的出现，导致了在诡谲莫测的古墓中，手无缚鸡之力的吴邪，只能独自面对未知的危险。\
			没想到，通过祖父笔记上留下的经验，吴邪竟意外的打开了一处密道。\
			吴邪本以为可以逃出生天，不料只是进入了更深的迷宫。直到气急败坏的他遇到了同样掉入密道的潘子。\
			可是还没等松口气，他们很快又陷入了尸蟞的致命包围圈，而随后“胖子”又引来了“杀人血尸”的追击，眼看潘子命悬一线，闷油瓶神奇的再次出现，及时救了他们。\
			吴邪与胖子给性命垂危的潘子包扎了伤口，休息一会后，他们又被会攻击人的藤蔓袭击，意外的被抓入了藏有“巨型食人树”的西周墓室之中。\
			吴邪此时才发现，这里，其实是一座墓中墓！',
			'经过一番危机生命的波折，吴邪在法力高强的“青眼狐尸”手中得到了一个紫金盒，并与三叔等人汇合。\
			通过一连串复杂的机关和吴邪对古代文字丰富的了解，他们最终找到了穿着长生不老铠甲，拥有不死之身的“鲁殇王”。\
			正当他们欣喜若狂的要夺取宝藏之际，闷油瓶突然挥刀斩杀了鲁殇王。\
			原来，这个生性残暴的鲁殇王也是个盗墓贼。为了找到能使人长生不老的铠甲，他听信军师的话，盗取了这座西周墓，企图把自己安葬在里面。\
			岂料，就在要下葬的时候，被自己的军师取而代之。\
			看来这个闷油瓶早就知道棺材里下葬的是鲁殇王的军师。\
			闷油瓶不为人知的来历，不禁引起了吴邪的好奇。但是他没来得及深究，就因为胖子的疏忽导致他们再一次的受到了成千上万尸蟞的围困。多亏经验老道的三叔以火药解围，才让他们脱离了化作白骨的危险。\
			经历了这一遭，没有得到任何宝贝的三叔感到很失落。但吴邪却带出的了一个神秘的紫金盒让他们找到了新的谜题，很快，他们将再次踏上寻宝的旅程了。'
		],
		coreSellingPoint: '南派三叔代表作'
	},

	{
		title: '半泽直树 第一季',
		realAuthor: '八津弘幸、池井户润',
		cat: ['剧情'],
		desc: '一个大学毕业生为了复仇来到中央银行工作，在泡沫经济时代摸爬滚打，立志要改变整个金融业腐败现状。',
		biographies: ['半泽直树：男，24岁，大学毕业生，为了向逼死他父亲的人复仇来到中央银行工作，激进、热血', '近藤：男，30岁，半泽直树的伙伴，患有精神分裂症', '大和田：男，50岁，中央银行常务，不择手段的野心家，在银行只手遮天'],
		outline: [
			'90年代初，曾亲眼目睹了父亲自杀的大学毕业生，半泽直树如愿来到了产业中央银行工作。为了找到逼死自己父亲的凶手，半泽直树艰难的从底层摸爬滚打，立志要改变整个银行业腐败的现状。\
			几年后，日本进入泡沫经济时代，半泽直树在这样一个银行家身心饱受摧残的时代，与同期的好友近藤和度利，朝着各自的人生方向奋斗。',
			'21世纪，产业中央银行与东京第一银行合并为东京中央银行。同年，半泽直树意外的顺利荣升为了大阪西支行的一名融资课长。终于离仇人又近了一步。\
			情况并没有因此而乐观，才升职不久的半泽遭到了支行行长的陷害，必须向做假账的大阪西钢铁厂追讨五亿欠款。与此同时，他的好友近藤因为工作压力大患上了精神分裂症，接踵而来的是比降职还惨的待遇，家庭也濒临毁灭。这也使得半泽意识到追讨失败的严重后果。为了他美满的家庭，半泽直树在生与死的夹缝中扛起这个重担。\
			在大阪西钢铁厂老板与半泽上司的串通下，半泽几次追讨都以失败告终，近乎绝望的他终于明白不能再忍受下去，燃起了斗志，要那些陷害他的人十倍奉还。\
			在一系列的挫折之后，半泽找到了被大阪西钢铁厂害得倾家荡产的一名工人以及钢铁厂厂长的情妇，以真诚打动了他们，并且在好友度利和他忠心部下的帮助下巧施连环计，揭发了大阪西支行行长与钢铁厂老板串通诈骗银行贷款的罪行。讨回了五亿的债务。',
			'罪人得到了应有的惩罚，半泽直树也顺利升迁，成为了中央银行总行的融资课长。此时，他将要面对生平最大敌人，当年利用银行贷款逼死了他父亲的总行高管，几乎掌握了金融业腐败体系的大和田常务。\
			在总行任职的半泽直树得到了总行行长的器重，事业蒸蒸日上，一向重情重义的他决定帮助已经被“放逐”的好友近藤重回银行，意外的发现了近藤工作的公司亏空了一大笔公款。然而，此时的半泽并没有发现自己已经掉入了一个更大的圈套当中。\
			大和田常务企图利用东京一家酒店的十二亿欠款迫使总行行长下台，取而代之。迫于国税局的介入以及总行行长的委托，半泽直树临危受命，肩负起了追查十二亿贷款的使命，开始了与大和田常务的巅峰较量。\
			通过调查，半泽接触到了酒店老板的儿子，掌握了大和田常务串通了酒店的一个股东，将这十二亿的贷款挪用一空的证据。\
			但是好友近藤的出卖，不仅让他的计划彻底泡汤，还让他的心灵受到了巨大创伤，他被迫在自己仇人的面前磕头谢罪。',
			'虽然遭受了打击，半泽直树并没有就此消沉下去，他决定直面腐败的银行家体制，孤注一掷与大和田背水一战。\
			正直的他原谅了近藤，并且与度利三人联手查出了近藤所在公司亏空的公款与酒店十二亿欠款有着密不可分的联系。原来，大和田一直在利用酒店的十二亿贷款和亏空的公款为他的妻子偿还巨额的赌债，并将计就计意图在中央银行一手遮天。\
			揭发了大和田常务罪行的半泽如愿让仇人百倍偿还了他的痛苦，十二亿的贷款也被找了回来。然而迎接半泽的并不是升职，反之，因为他采取的手段过于激进，而被老谋深算的总行行长处以降职“左迁”。\
			面对这样的境遇，半泽直树知道，对抗腐败的金融业，还需要继续战斗。'
		],
		coreSellingPoint: '让堺雅人身价飙升的收视利器'
	},

	{
		title: '那些年，我们一起追的女孩',
		realAuthor: '九把刀',
		cat: ['青春'],
		desc: '每个男孩心中都有一个沈佳仪，像烛火一样为他们照亮一条从男孩逐渐变成男人的路。',
		biographies: ['柯景腾：男，13岁，中学生，调皮捣蛋的他常常蝉联扰乱班级风纪的黑名单。', '阿和：柯景腾从小到大的宿敌，有着同龄男孩没有的成熟。', '沈佳宜：女，13岁，班中的好学生班花，唯一的兴趣就是读书，内心自卑。'],
		outline: [
			'初中时代，美术甲班的柯景腾蝉联班级扰乱课堂纪律黑名单榜首，顽皮的他甚至还想出跟墙壁聊天的招数让班主任崩溃。无奈之下，班主任只得把他调到学习成绩优异的班花，沈佳仪前面的座位。\
			在柯景腾眼里，清丽脱俗的沈佳仪最大的兴趣就是读书，课余爱好是用圆珠笔戳他的后背，这令顽皮的柯景腾感到十分无奈。\
			一次学校组织的课外郊游，两个人因为一盘输赢难分的军棋将矛盾上升到了白热化的阶段。直到学校通知再次分班的消息，以及柯景腾从小到大的劲敌，阿和对沈佳仪展开的疯狂追求，让柯景腾渐渐发现自己对沈佳宜的好感。',
			'在沈佳仪的督促下，顽劣的柯景腾不得不开始发奋学习。经过一番努力逃过了分到差班的危险。然而，开朗活泼的李小华进入了柯景腾的世界，让这段感情有了戏剧化的转变。\
			柯景腾渐渐的被李小华打动，两个人开始正式恋爱，阿和也在这段时间增进了跟沈佳仪的友情。致使柯景腾始终无法理清心中对沈佳仪的感觉。\
			初三那一年，柯景腾与李小华面对联考做出了不同的人生选择，导致两人之间的感情无疾而终。\
			失恋给柯景腾带来了巨大的打击，沈佳仪的陪伴让他从阴霾中走了出来，带着一点点遗憾，他们毕业了。\
			高中时代，柯景腾跟情敌阿和分到了同一班级。虽然他们与沈佳仪不同班，柯景腾还是通过一次偶然的机会，发现了沈佳仪有放学之后自己在教室补习的习惯。从此，他们成为了无话不谈的朋友。不仅如此，他还从沈佳仪口中得知，廖英宏、陈明章等人也在用各自的方式追求沈佳仪，让只想用功读书的她十分苦恼。\
			聪明的柯景腾明白谁先追谁就输了，他一方面通过跟沈佳仪比试学习成绩来增进两人的关系，另一方面决定等到大学以后再一鼓作气的表白。\
			但是，劲敌阿和为了接近沈佳仪而转班的卑劣手段让柯景腾乱了阵脚。',
			'为了在这场恋爱大作战中扳回一筹，柯景腾决定把表白的时间提前，另一方面，他一直默默的给沈佳仪写歌。岁月匆匆，高三悄然来袭了。\
			学校组织柯景腾、沈佳仪、阿和等一行人去佛学院夏令营照顾小孩子。柯景腾和他的一干情敌们在这一行中与沈佳仪成为了扣在一起的小伙伴。与沈佳仪近在咫尺的时候，柯景腾却仍然不敢表白。\
			再次鼓起勇气的柯景腾决定在学校礼堂当着所有同学的面，唱出他给沈佳仪写的歌。但是沈佳仪的中途离席让他颇受打击。\
			不过柯景腾并没有气馁，为了进一步接近沈佳仪，他跟沈佳仪一起报考了提前批大学录取的甄试，让他意料不到的是，沈佳仪为了帮助一个女孩而放弃了名额。庆幸的是，虽然错过了跟沈佳仪考取同一所大学的机会，他还是被理工科大学提前录取了。',
			'高考失利的沈佳仪痛哭了一整晚，原本前来安慰她的柯景腾压抑不住心中的激动对她表白。沈佳仪本打算给他个答复，但是柯景腾却在这个答案面前怯懦了。他怎么也想不到，这个答案成为了他一生的遗憾。\
			双双升入大学以后，柯景腾跟沈佳仪的感情接近恋人，但是谁也没有捅破那层窗户纸。大一的年华依旧在“好朋友”的关系上维持着。直到依旧顽皮的柯景腾在大学里创办了“地下格斗大赛”被人打伤，导致他与沈佳仪发生了激烈的争吵，终于关系破裂。\
			此后，两人久久没有联系，阿和在这段时间趁虚而入成功与沈佳仪恋爱了。\
			虽然在爱情上，柯景腾经历了失败，但是他追求沈佳仪不灭的热情陪伴他成为了一个顶天立地的男人，立志要为了人生奋斗的他在大学毕业后成为了一名网络作家。\
			几年后，沈佳仪通知柯景腾等人参加她的婚礼，令柯景腾欣慰的是，她的老公并不是阿和。\
			婚礼宴席上，老友重聚，他们再次回首这段青春岁月，留下了他们不灭的爱情和燃烧的激情。'
		],
		coreSellingPoint: '让台湾人集体感动的青春喜剧作品'
	}

];


@connect(state => ({
	ip: state.get('ipInfo'),
	cats: state.get('cats')
}), dispatch => bindActionCreators({
	fetchIP: fetchIP.bind(this, dispatch)
}, dispatch))
export default class Preveiw extends Component {

	constructor() {
		super();
		this.state = {
			mode: 'pc'
		};
	}

	componentDidMount() {

		const {
			params,
			fetchIP
		} = this.props;

		let preview = '';

		if (params.index.length > 1) {
			fetchIP(params.index).then(() => {

				const {
					ip,
					cats
				} = this.props;

				let ipObj = ip.toJS();
				// console.log(ipObj.cat);
				// ipObj.cat = cats.filter(cat => cat.get('id') == ipObj.cat[0]).get(0).get('name');
				let cat = ipObj.cat, selCatArr = [], selCat = '';
				for (let c of cat) {
					const filterCat = cats.filter(item => item.get('id') == c);
					selCat = filterCat.count() ? filterCat.get(0).get('name') : '';
					selCatArr.push(selCat);
				}
				ipObj.cat = selCatArr;
				this.loadPreview(ipObj);
			});
		} else {
			this.loadPreview(Object.assign(previews[params.index], {
				cartoonBiography: [],
				workType: '长篇小说',
				selfPrice: '保密'
			}));
		}
	}

	loadPreview = preview => {

		document.title = preview.title + ' 预览';

		preview.author = [{
			objectId: 0
		}];

		preview.selling = [];
		preview.frozenChs = [];
		preview.finishedChs = [];
		preview.biography = preview.biographies.join('\n');

		this.refs.hiddenTransfer.value = JSON.stringify(preview);
		this.refs.hiddenForm.submit();

		this.refs.hiddenPCTransfer.value = JSON.stringify(preview);
		this.refs.hiddenPCForm.submit();
	};

	switchMode = mode => {
		this.setState({
			mode
		});
	};

	iframeLoaded = prefix => {

		const frame = this.refs[prefix + 'frame'];

		frame.height = "";
		frame.height = frame.contentWindow.document.body.scrollHeight + "px";
		$(frame).height(frame.contentWindow.document.body.scrollHeight);
	};

	render() {

		const {
			mode
		} = this.state;

		let pcAction = 'http://www.yunlaiwu.com/detail';
		if (NODE_SERVER_ENV === 'development') {
			// pcAction = 'http://waka.yunlaiwu.com:3000/detail';
		}
		console.log('pcAction', pcAction);

		return (
			<div className={styles.wrapper + ' clearfix'}>
				<div className={styles.mode}>
					<div>
						<img onClick={this.switchMode.bind(this, 'pc')}
							 src={mode === 'pc' ? pcActiveImg : pcImg}/>
						<p className={styles.txt + ( mode === 'pc' ? ' ' + styles.active : '')}>电脑预览</p>
					</div>
					<div>
						<img className={styles.mobile}
							 onClick={this.switchMode.bind(this, 'mobile')}
							 src={mode === 'mobile' ? mobileActiveImg : mobileImg}/>
						<p className={styles.txt + ( mode === 'mobile' ? ' ' + styles.active : '')}>手机预览</p>
					</div>
				</div>
				<div className={styles.phone + ' clearfix'}
					 style={{
						 display: mode === 'mobile' ? 'block' : 'none'
					 }}>
					<img src={iphoneImg}
						 className={styles.iphoneImg}/>
					<iframe ref="mobileframe"
							name="phoneFrame"
							className={styles.frame}
							frameBorder="no"
							src="about:blank"/>
				</div>
				<div className={styles.pc + ' clearfix'}
					 style={{
						 display: mode === 'pc' ? 'block' : 'none'
					 }}>
					<iframe onLoad={this.iframeLoaded.bind(this, 'pc')}
							ref="pcframe"
							name="pcFrame"
							className={styles.pcFrame}
							frameBorder="no"
							src="about:blank"/>
				</div>
				<form method="POST"
					  style={{
						  display: 'none'
					  }}
					  ref="hiddenForm"
					  target="phoneFrame"
					  action="http://www.yunlaiwu.com/mobile/detail">
					<input ref="hiddenTransfer"
						   type="text"
						   name="data"/>
				</form>
				<form method="POST"
					  style={{
						  display: 'none'
					  }}
					  ref="hiddenPCForm"
					  target="pcFrame"
					  action={pcAction}>
					<input ref="hiddenPCTransfer"
						   type="text"
						   name="data"/>
				</form>
			</div>
		);
	}

}
