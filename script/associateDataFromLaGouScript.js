/**
 * 联想数据 from 拉勾
 */
'use strict';

const request = require('request');
const fs = require('fs');
const path = require('path');
const console = require('tracer').colorConsole(); // 增强console

/**
 * 拉取联想数据 from 拉勾
 * @param input 输入的文本
 * @param type 类型 1:职位[POSITION]; 2:公司[COMPANY]; 3:学校[COLLEGE]; 4:专业[MAJOR]; 5:期望工作[EXPECT_JOB];
 * @param num    每次返回的数量
 */
function fetchAssociateDataFromLaGou(input, type, num) {
	request({
		method: 'GET',
		url: 'https://suggest.lagou.com/suggestion?input=' + input + '&type=' + type + '&num=' + num,
	}, function (err, res, body) {
		if (err) {
			console.error(err);
			return;
		}
		// 保存数据
		saveDataAsFile(body, path.resolve(__dirname, './data/lagou.json'));
	});
}

/**
 * 保存数据
 * @param data
 * @param fileName
 */
function saveDataAsFile(data, fileName) {
	// 拿到数据
	const newData = JSON.parse(data);
	// 筛选无用数据
	for (let key in newData) {
		if (newData.hasOwnProperty(key)) {
			let array = newData[key];
			array = array.map(function (item, index) {
				return item.cont;
			});
			newData[key] = array;
		}
	}
	// 读文件
	fs.readFile(fileName, 'utf8', function (err, data) {
		if (err) {
			console.error('err', err);
			// 文件不存在
			if (err.errno === -2) {
				// 写入文件
				fs.writeFile(fileName, JSON.stringify(newData), function (err) {
					if (err) {
						console.error(err);
						throw err;
					}
					console.debug('文件写入完成（新写）');
				});
				return;
			} else {
				throw err;
			}
		}
		console.debug('读文件' + fileName + '读到的 data', data);
		let originData = JSON.parse(data);	// 原始数据
		// 遍历新数据的 key，每个 key 都是一个数组
		for (let key in newData) {
			if (newData.hasOwnProperty(key)) {
				// 如果原始数据中也有该 key
				if (originData[key]) {
					// 链接两个数组
					originData[key] = originData[key].concat(newData[key]);
					// 数组去重
					originData[key] = Array.from(new Set(originData[key]));
				}
				// 如果原始数据中没有该 key
				else {
					// 直接赋值
					originData[key] = newData[key];
				}
			}
		}
		// 写入文件
		fs.writeFile(fileName, JSON.stringify(originData), function (err) {
			if (err) {
				console.error(err);
				throw err;
			}
			console.debug('文件写入完成（重写）');
		});
	});
}

fetchAssociateDataFromLaGou('a', 4, 20);


