// 简历功能的白名单（userId array）

const resumeWhiteListArray = [

	// 测试环境

	// 测试账号
	{
		userId: '590155430ce46300614f765f',
		name: '',
		mobile: '13221703814',
	}, {
		userId: '56fe3e432e958a0059f30ac6',
		name: '花姐',
		mobile: '18910428317',
	}, {
		userId: '56f39d59efa6310055a9ac62',
		name: '',
		mobile: '15810531554',
	}, {
		userId: '5751673f816dfa005f623ef1',
		name: '伟达',
		mobile: '18311398852',
	}, {
		userId: '57512c74207703006ce2fedc',
		name: '朗',
		mobile: '18238805152',
	}, {
		userId: '58f8821aac502e00638effa9',
		name: '影视机构',
		mobile: '15578146505',
	}, {
		userId: '58b686358fd9c5006123cd4b',
		name: '',
		mobile: '18401698320',
	}, {
		userId: '58edfd2961ff4b00581cb504',
		name: '',
		mobile: '15676626634',
	}, {
		userId: '58edff728d6d8100580ff182',
		name: '',
		mobile: '13152696004',
	}, {
		userId: '58edfff144d9040057767ddf',
		name: '',
		mobile: '13175246004',
	},

	// 正式环境

	{
		userId: '594dfb470ce46300575ce2f8',
		name: '支雅卿',
		mobile: '18401448510',
	},
	{
		userId: '58bbc4888d6d81006541515c',
		name: '史迈',
		mobile: '15711372579',
	},
	{
		userId: '59102d9f44d904007bf03c70',
		name: '十七',
		mobile: '18610470708',
	},
	{
		userId: '575264b479bc440063a481c1',
		name: '白雾',
		mobile: '13901175575',
	},
	{
		userId: '58510a5761ff4b006c7fe3b4',
		name: '马硕苑',
		mobile: '18681672214',
	},
	{
		userId: '5844eb24ac502e006cd6e243',
		name: '赵毓丞',
		mobile: '13816743849',
	},
	{
		userId: '58a2c62461ff4b006b594359',
		name: '阿亮',
		mobile: '13739718089',
	},
	{
		userId: '587cfb165c497d0058af6c78',
		name: '青来',
		mobile: '18805927857',
	},
	{
		userId: '57ff97990bd1d00058e826bb',
		name: '朱其莠',
		mobile: '18358580173',
	},
	{
		userId: '5821d07eda2f60005d14da33',
		name: 'zooone',
		mobile: '15868649834',
	},
	{
		userId: '574bf02e71cfe4006beeb1d8',
		name: '李戈多',
		mobile: '15668405662',
	},
	{
		userId: '569f96f4128fe100594dc848',
		name: '贰狗狗',
		mobile: '15922742516',
	},
	{
		userId: '58244b122f301e005c427782',
		name: '宁静致远',
		mobile: '13775812389',
	},
	{
		userId: '58294e2467f35600588553e3',
		name: '北秋',
		mobile: '15208498688',
	},
	{
		userId: '5753f7af6be3ff006beef565',
		name: '萧韩',
		mobile: '13583505213',
	},
	{
		userId: '567ce75560b2c0befd5fb4e1',
		name: '苏予枫',
		mobile: '18561372021',
	},
	{
		userId: '5940a231fe88c2006a44b91e',
		name: '冰河',
		mobile: '18301485967',
	},
	{
		userId: '580c1e77128fe1005fd3024a',
		name: '暗沙',
		mobile: '13507074706',
	},
	{
		userId: '569111a600b009a31aa4fd47',
		name: '田雪峰',
		mobile: '18609401877',
	},
	{
		userId: '581762892e958a0054a86368',
		name: '醒木',
		mobile: '13055912257',
	},
	{
		userId: '567a6d7700b0cff56c0bcf13',
		name: '周海亮',
		mobile: '13563106381',
	},
	{
		userId: '5691174300b009a31aa53b3f',
		name: '白云漫',
		mobile: '15652685186',
	},
	{
		userId: '57ff45be0e3dd90057e65d07',
		name: '汪伟',
		mobile: '17721177436',
	},
	{
		userId: '569f8e8f1532bc0054165692',
		name: '胡不归',
		mobile: '13552626182',
	},
	{
		userId: '57fc6946da2f60004fa71212',
		name: '郭凌翔',
		mobile: '',
	},
	{
		userId: '573d418849830c0061230915',
		name: '九一',
		mobile: '13811445491',
	},
	{
		userId: '56ea75d5b014600029372744',
		name: '冯志刚',
		mobile: '13920434021',
	},
	{
		userId: '579b18915bbb500064cb3865',
		name: '何淼',
		mobile: '15330227901',
	},
	{
		userId: '5763d8447f578500546d0a7d',
		name: '岁正正',
		mobile: '18801130922',
	},
	{
		userId: '575168d9530fd30068f11653',
		name: '赖明东',
		mobile: '13381230907',
	},
	{
		userId: '5696224060b2d6907c93827a',
		name: '王晴川',
		mobile: '18622396916',
	},
	{
		userId: '569276cb60b26bd85da2a89a',
		name: '墅子',
		mobile: '15311185721',
	},
	{
		userId: '568b364700b009a31b1f0315',
		name: '谷老师',
		mobile: '13501035125',
	},
	{
		userId: '5853a03661ff4b006c8dbac7',
		name: '李正虎',
		mobile: '18511251013',
	},
	{
		userId: '5874e4bb2f301e005756907c',
		name: '张亚',
		mobile: '13522328154',
	},
	{
		userId: '5693245600b0bca077f2808c',
		name: '浪泉',
		mobile: '17744545114',
	},
	{
		userId: '5955ec5b0ce4630058875f65',
		name: '李红',
		mobile: '18410727556',
	},
	{
		userId: '596da49fa22b9d006a3b2ece',
		name: '韩博宇',
		mobile: '18647695493',
	},
	{
		userId: '59684191ac502e006c90e6b7',
		name: '都雪萍',
		mobile: '13009805605',
	},
	{
		userId: '567a9ee800b08d6c01ed0613',
		name: '吴又',
		mobile: '18610099548',
	},
	{
		userId: '567f6cfd60b2c0befd6e6fc4',
		name: '恺神',
		mobile: '',
	},
	{
		userId: '57a6c78f2e958a0066a0a0ac',
		name: '崔洪鹏',
		mobile: '',
	},
	{
		userId: '577b2cf40a2b580057291de3',
		name: '杨博文',
		mobile: '',
	},
	{
		userId: '59113fe0ac502e4502813f1f',
		name: '未认证的账号',
		mobile: '13252031714',
	},
	{
		userId: '568f89e360b25396c518415f',
		name: '大明',
		mobile: '18500188370',
	},
	{
		userId: '57989401a34131005aabb1f8',
		name: '赵旋',
		mobile: '17010283404',
	}, {
		userId: '56fc9f45128fe1005943310d',
		name: '花姐',
		mobile: '18910428317',
	}, {
		userId: '5911724e61ff4b00625fe92a',
		name: '影视机构',
		mobile: '13221703814',
	}, {
		userId: '56934b0a00b009a31ab2b12c',
		name: '伟达',
		mobile: '18311398852',
	}, {
		userId: '567b6f3600b0adf744dcbf1f',
		name: '一哥',
		mobile: '18238805152',
	}, {
		userId: '58ede83c0ce463006bb80fab',
		name: '无力',
		mobile: '15676626634',
	},
	{
		userId: '58175f52128fe10055975f38',
		name: '潘鑫宇',
	}, {
		userId: '56ac34b06240b8005a3df20a',
		name: '乌日娜',
	}, {
		userId: '570e4e788ac247006433e629',
		name: '彭杉',
	}, {
		userId: '567b819f00b0cff56c122f0e',
		name: '吴晨啸',
	},
	// 正常用户
	{
		userId: '57c705d4c4c9710061ab100b',
		name: '简白',
	}, {
		userId: '5844d47179bc440065bebbcf',
		name: '邓子诺',
	}, {
		userId: '56912af160b2c2974ccd6883',
		name: '徐小怪',
	}, {
		userId: '56e7d879a3413100546e5b36',
		name: '章磊',
	}, {
		userId: '5688c59f60b2fa064c3da72a',
		name: '纪然',
	}, {
		userId: '5684971160b2b60f65d6b693',
		name: '黄颖玥',
	}, {
		userId: '580e6222128fe1005fe1470c',
		name: '徐翔宇',
	}, {
		userId: '574d447d75c4cd562a13c508',
		name: '奚龙飞',
	}, {
		userId: '567f8ef760b25aa3dcd1d559',
		name: '庄秦',
	}, {
		userId: '58e3f333a22b9d00587f1bb2',
		name: '吕萍娟',
	},
	{
		userId: '5685ea9600b0bca0763e1b84',
		name: '符祎明',
	}, {
		userId: '58171c222e958a0054a486dd',
		name: '李海超',
	}, {
		userId: '576b85cf5bbb50005942f231',
		name: '吴蓉',
	}, {
		userId: '5868dee861ff4b006d6dc3c5',
		name: '徐闰',
	}, {
		userId: '567f7e7c00b0adf744f527f9',
		name: '杨啸',
	}, {
		userId: '57ad6d206be3ff006b9390ef',
		name: '胡阳',
	}, {
		userId: '56e68d42a3413100544fd7f1',
		name: '邢远',
	}, {
		userId: '58bd0a702f301e006c714daf',
		name: '石鼎',
	}, {
		userId: '58cf67d65c497d0057cbae3e',
		name: '朱心怡',
	}, {
		userId: '56af410c816dfa005981616b',
		name: '缪轶',
	},
	{
		userId: '5680091d00b0e902c0969fe1',
		name: '周子逾',
	}, {
		userId: '569187b460b2ad083a8d4de0',
		name: '苏欣',
	}, {
		userId: '579270791532bc0060c38e4d',
		name: '青柏',
	}, {
		userId: '5800e822bf22ec0064ca8f5a',
		name: '陈爽',
	}, {
		userId: '56f3aca8731956005d5a7512',
		name: '郭文文',
	}, {
		userId: '5691a3b900b0bca077e8aeb5',
		name: '冯云',
	}, {
		userId: '57da75098ac24700614df747',
		name: '蔡慧慧',
	}, {
		userId: '56ea18dc731956005c17ebad',
		name: '王智',
	}, {
		userId: '568cc7c160b20f9ad673ed21',
		name: '常馨月',
	}, {
		userId: '568dfb7660b26bd85d83cc33',
		name: '李戎',
	},
	{
		userId: '5691dd6c60b25396c5276360',
		name: '殷艺慈',
	}, {
		userId: '57f788cf67f356005861ec73',
		name: '罗国良',
	}, {
		userId: '568b85f860b21c09c03099b4',
		name: '刘康',
	}, {
		userId: '57ca57582e958a0068d57903',
		name: '胡雅娟',
	}, {
		userId: '56914c0900b009a33493cb5a',
		name: '叶俊彦',
	}, {
		userId: '57207b57f38c840059827b4c',
		name: '金靳',
	}, {
		userId: '5777de37165abd0054ab1610',
		name: '刘伊影',
	}, {
		userId: '581afda70ce463005870d639',
		name: '李孟珊',
	}, {
		userId: '56910fbbcbc2e8a30c5a33ee',
		name: '朱古力',
	}, {
		userId: '5847fbd361ff4b006c465512',
		name: '段子期',
	},
	{
		userId: '57be964e8ac247006322fd83',
		name: '徐涛',
	}, {
		userId: '58bfed6ca22b9d00588ce089',
		name: '刘咏涵',
	}, {
		userId: '59574c991b69e6005b4edc65',
		name: '徐程博',
	}, {
		userId: '595242f8b123db005df5076a',
		name: '杜金凤',
	}, {
		userId: '57df5e5f7db2a24eb1bee3e6',
		name: '皮振飞',
	}, {
		userId: '586515fc8d6d8100650a6f9a',
		name: '刘宇',
	}, {
		userId: '574b8946c4c97100548f5c3b',
		name: '李宏斌',
	}, {
		userId: '568cd98300b0bca045adff35',
		name: '马应寿',
	}, {
		userId: '569f9da59123b800556e15be',
		name: '郭帅',
	}, {
		userId: '5682329560b2b60f65c9e70e',
		name: '张靓',
	},
	{
		userId: '56925cfd00b09aa2e8da70a5',
		name: '满城烟火',
	}, {
		userId: '5680d8c234f81a1d87adee38',
		name: '李名',
	}, {
		userId: '5695edd560b2608e5927b93f',
		name: '焦阳',
	}, {
		userId: '56c9568e128fe10058eca429',
		name: '陈清照',
	}, {
		userId: '5844d20461ff4b006b9e6695',
		name: '修潇楠',
	}, {
		userId: '56dbcc92731956005d90d632',
		name: '九山萧',
	}, {
		userId: '5704fa7c128fe100525667f9',
		name: '阳光慧',
	}, {
		userId: '574b8946c4c97100548f5c3b',
		name: '李写乐',
	}, {
		userId: '5691a917cbc2e8a30c5d0cdf',
		name: '老喵咪',
	}, {
		userId: '56e7b67e816dfa00512ef5bf',
		name: '周炎青',
	},
	{
		userId: '56bf3b07a633bd005865ae50',
		name: '范岱锋',
	}, {
		userId: '56e62becdf0eea0054e18c04',
		name: '王亦达',
	}, {
		userId: '569ee2099123b80055663f04',
		name: '王梦灵',
	}, {
		userId: '57ebb2148ac247005bed9af2',
		name: '墨微刘铮',
	}, {
		userId: '580dd1ecc4c971005898ff03',
		name: '波波鱼',
	}, {
		userId: '568df70000b0bca0ca17dd17',
		name: '姽婳',
	}, {
		userId: '569a54ae00b00ef3850966b0',
		name: '浩瀚传媒',
	}, {
		userId: '568b9a0f00b01b9f2c11f3a1',
		name: '编剧阿杜',
	}, {
		userId: '569aff6e60b2a421c9405d58',
		name: '贾一潇',
	}, {
		userId: '56919e8560b27e9ba8d3a800',
		name: '彭中智',
	},
	{
		userId: '576349086be3ff006a14d245',
		name: '潭中潭',
	}, {
		userId: '569f9da59123b800556e15be',
		name: '诺帅',
	}, {
		userId: '5684af4160b24d71fea2d51a',
		name: '元初工作室',
	}, {
		userId: '56e8d77cc4c9710051548425',
		name: '编剧韩秀成',
	}, {
		userId: '56ac3664d342d300543bfab3',
		name: '赵颢喆',
	}, {
		userId: '57d77ef9d20309006a0cef45',
		name: '陶明国',
	}, {
		userId: '568bdc9060b21c09c033c42c',
		name: '黎波',
	}, {
		userId: '57be476b7db2a20068df1794',
		name: '铮音',
	}, {
		userId: '574be7f5c26a380058ee036a',
		name: '发威',
	}, {
		userId: '576304d87f5785005466ca5a',
		name: '钟荻',
	},
	{
		userId: '56f0dc9c1ea49300556e61cb',
		name: '陈醋',
	}, {
		userId: '567d78b360b2a03133687ca3',
		name: '蒋涛',
	}, {
		userId: '5693d73860b25396c5361646',
		name: '郭郭',
	}, {
		userId: '593ba3fcfe88c2006a111889',
		name: '千度',
	}, {
		userId: '56924cd560b25396c52b3b18',
		name: '叶宏涛',
	}, {
		userId: '58101850bf22ec00583f69e7',
		name: '编剧胡天华',
	}, {
		userId: '567e11ab60b204baff4e618b',
		name: 'LT',
	}, {
		userId: '57e9f6a2bf22ec00588189e0',
		name: '卢昶龙',
	}, {
		userId: '578dda902e958a005444246a',
		name: '玉舟',
	}, {
		userId: '5762cebd1532bc00600deb06',
		name: '冯珺',
	},
	{
		userId: '56b22466c4c9710052d678b5',
		name: '韩兮',
	}, {
		userId: '574e2d54d342d3004347dbbb',
		name: '夜半私语',
	}, {
		userId: '57d2f3575bbb50005bb24337',
		name: '江海',
	}, {
		userId: '5684e5c660b2e57b8d69deb0',
		name: '刘劲飞',
	}, {
		userId: '569cf8fc60b2715708e17bae',
		name: '饶灵犀',
	}, {
		userId: '56eb8bcf1ea493005538e516',
		name: '西门',
	}, {
		userId: '57b83a807db2a20054225fcd',
		name: '灰面人',
	}, {
		userId: '5753db62207703006cf6d690',
		name: '郭曦',
	}, {
		userId: '56f5550f1ea493005d0ed62f',
		name: '米筝',
	}, {
		userId: '567a6cfd60b2c0befd50d487',
		name: '唐小蓝',
	},
	{
		userId: '586501c31b69e675fce51144',
		name: '阿怪',
	}, {
		userId: '5798205c5bbb500063facd15',
		name: '雪涛',
	}, {
		userId: '57121b5a2e958a00690227b3',
		name: '凯远欧',
	}, {
		userId: '57635f717f57850054685cb9',
		name: '富贵',
	}, {
		userId: '572fe2e4df0eea00632100f0',
		name: '巴璐',
	}, {
		userId: '5684b00360b2c297d01ad751',
		name: '黄开建',
	}, {
		userId: '57174a6a71cfe400573f33f2',
		name: '何许人',
	}, {
		userId: '5705fb522e958a0057a917f5',
		name: '李春',
	}, {
		userId: '5784abe0165abd0062b16223',
		name: '北极光',
	}, {
		userId: '57a2e0d9a633bd00602f0e75',
		name: '潘俠非',
	},
	{
		userId: '56d7ffc7816dfa005a406975',
		name: '文龙',
	}, {
		userId: '571078cbc4c9710054a7c96e',
		name: '郭宇阳',
	}, {
		userId: '570349952e958a005956f334',
		name: '顺流逆流',
	}, {
		userId: '5762dc0e1532bc00600e47d2',
		name: '阿丹',
	}, {
		userId: '57d4e76bda2f600059f49584',
		name: '方寸心',
	}, {
		userId: '576793c3df0eea0062ff0d9e',
		name: '高翔宇',
	}, {
		userId: '5888a1ef1b69e60058f802e8',
		name: '陈峻菁',
	}, {
		userId: '57d172ea2e958a00544ed429',
		name: '罗朋飞',
	}, {
		userId: '58d66d0944d90400686ede59',
		name: '喻敏',
	}, {
		userId: '574be74c79bc440062590de8',
		name: '邵占凯',
	},
	{
		userId: '56e789c61ea4930055195fd8',
		name: '朱七七',
	}, {
		userId: '57df91907db2a24eb1c06523',
		name: '孔立文',
	}, {
		userId: '5721769dff64d80056a6dc60',
		name: '晓松溪月',
	}, {
		userId: '57ccbe4167f3560057c6febf',
		name: '陈澄',
	}, {
		userId: '56d77fb11532bc0050735ddb',
		name: '扬州编剧吴爱民',
	}, {
		userId: '57d178dc816dfa00542f1fed',
		name: '柳清水',
	}, {
		userId: '568f65bd00b0bca0ca20ebde',
		name: '乔大旺',
	}, {
		userId: '57dfc1e80e3dd900697809c9',
		name: '黃湘玟',
	}, {
		userId: '57104bea1ea4930068ffc298',
		name: '三味',
	}, {
		userId: '56dbcb7f7db2a20051447f2b',
		name: '郑来志',
	},
	{
		userId: '56a070941532bc0053bc1e5c',
		name: '汪绘雨',
	}, {
		userId: '576cb8ea2e958a00571da400',
		name: '海涛',
	}, {
		userId: '56e784c5731956005c01c2ff',
		name: '康与江',
	}, {
		userId: '56adca0cc4c971005322f8ec',
		name: '编剧才东亮',
	}, {
		userId: '568f51bc00b0bca077d94a4e',
		name: '魏霄飞',
	}, {
		userId: '57725b71a633bd00643f4b0b',
		name: '于英楠',
	}, {
		userId: '5685505460b2c297d0209a74',
		name: '张璟',
	}, {
		userId: '5689edb960b2e57ba2c15d3d',
		name: '张涛',
	}, {
		userId: '568cc0d400b009a3c030842c',
		name: '王晗羽',
	}, {
		userId: '569a5dc460b2b80a9eabe0cd',
		name: '王强',
	},
	{
		userId: '567a6d4800b06f9f61717a85',
		name: '杨紫陌',
	}, {
		userId: '581c1c578ac247004fe27391',
		name: '庞清新',
	}, {
		userId: '57974c85c4c97100542e261a',
		name: '大壮在飘荡',
	}, {
		userId: '5691461460b2c2974cce152b',
		name: '韦星星',
	}, {
		userId: '5795ff7179bc44006641baab',
		name: '东方荔枝',
	}, {
		userId: '5687ac8560b21c09c017c483',
		name: '领头羊影视付强',
	}, {
		userId: '57805152165abd00555ab62a',
		name: '张冬',
	}, {
		userId: '58cf768944d90400690cc3fa',
		name: '韦剑',
	}, {
		userId: '58591d9e8e450a006cbc105f',
		name: '于洁',
	}, {
		userId: '57b2621f7db2a20054337b72',
		name: '李晓平',
	},
	{
		userId: '594261f25c497d006bc45911',
		name: '闫金城',
	}, {
		userId: '575b87726be3ff00694ec778',
		name: '张勇',
	}, {
		userId: '56ce9e7dd342d30054d0c101',
		name: '回子捷',
	}, {
		userId: '5933f49cb123db00641ca51e',
		name: '铅小刀',
	}, {
		userId: '57e5d97ada2f600060c557f7',
		name: '李涛',
	}, {
		userId: '56e78c26731956005deac051',
		name: '一丁',
	}, {
		userId: '5765fbdf6be3ff006a2a1e89',
		name: '禅师',
	}, {
		userId: '5765fbdf6be3ff006a2a1e89',
		name: '初七',
	}, {
		userId: '57eb4fbcda2f600060ecbd1a',
		name: '郭丽丽',
	}, {
		userId: '5831bf2f8ac2470061bf2b8f',
		name: '刘国超',
	},
	{
		userId: '5695036d00b0d8c9a75c9eb8',
		name: '谢峰',
	}, {
		userId: '5932c7b21b69e60065ee5e47',
		name: '张晶',
	}, {
		userId: '56f0eab6da2f60004cb4f71f',
		name: '天涯红尘客',
	}, {
		userId: '58d3ddc9ac502e0058bd605e',
		name: '郭东旭',
	}, {
		userId: '5853a03661ff4b006c8dbac7',
		name: '李正虎',
	}, {
		userId: '5874e4bb2f301e005756907c',
		name: '张亚',
	}, {
		userId: '56adca0cc4c971005322f8ec',
		name: '才东亮',
	}, {
		userId: '5888a1ef1b69e60058f802e8',
		name: '陈峻菁',
	}, {
		userId: '567a6cfd60b2c0befd50d487',
		name: '蓝霆影视',
	}, {
		userId: '567abd9300b08d6c01ee3df8',
		name: '杨宇航',
	},
];

const resumeWhiteList = resumeWhiteListArray.map((item) => {
	return item.userId;
});

/**
 * 判断当前用户是否在简历白名单
 * @param userId
 * @return {number}
 */
const isCurrentUserInResumeWhiteList = (userId) => {
	return resumeWhiteList.indexOf(userId);
};

/**
 * 判断当前用户是否有简历权限
 * @param user
 * @return {boolean}
 */
const isCurrentUserHasResumePermission = (user) => {
	const type = user.type;
	const userId = user.objectId;
	// console.log('type', type, 'userId', userId);
	return type === 1 && isCurrentUserInResumeWhiteList(userId) !== -1;
};

export {
	resumeWhiteList,
	isCurrentUserInResumeWhiteList,
	isCurrentUserHasResumePermission,
};
