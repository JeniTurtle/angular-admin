/**
 * @Author: chenming
 * @Date:   2017-01-17T20:59:16+08:00
 * @Last modified by:   chenming
 * @Last modified time: 2017-02-13T19:19:43+08:00
 */



export const lengthRegex = /[\s,.:\'\"\!\?\-;/\[\]\【\】，。：“”’‘！？；……]/g;

//哈哈，fuck me！！！！！
Number.prototype.replace = (...args) => {

	return String.prototype.replace.apply(this + '', args);
};

function getPath(parent, current) {
	return [parent, current].filter(item => item.length).join('.');
}

export default function validataion(strategies, data, path = '') {

	let result = [];

	for (let s in strategies) {

		const strategy = strategies[s];
		const d = data[s];

		if (s == 'notLeaf' || !strategy || d === undefined) continue;

		const anchor = getPath(path, s);
		let content = '';

		if (strategy.notLeaf) {
			result = result.concat(validataion(strategy, d.toJS ? d.toJS() : d, anchor));
		}

		if (strategy.isArray) {
			if (strategy.required) {
				// console.log('d', d.toJS());
				if (d.reduce((pre, cur) => {
						if (cur === null) {
							return pre;
						}
						return pre + cur.replace(lengthRegex, '').length
					}, 0) <= 0) {
					content = strategy.name + '不能为空';
				}
			}

			if (strategy.firstRequired) {
				if (!d.get(0)) {
					content = strategy.name + '不能为空';
				}
			}

			if (strategy.allRequired) {
				if (d.filter(item => item.replace(lengthRegex, '').length <= 0).length) {
					content = strategy.name + '不能有项目为空';
				}
			}

			if (strategy.maxLength) {
				if (d.reduce((pre, cur) => {
						if (cur === null) {
							return pre;
						}
						return pre + cur.replace(lengthRegex, '').length
					}, 0) > strategy.maxLength) {
					content = strategy.name + '总字数不能超过' + strategy.maxLength + '字';
				}
			}

			if (strategy.minLength) {
				if (d.size > 0 && d.reduce((pre, cur) => {
						if (cur === null) {
							return pre;
						}
						return pre + cur.replace(lengthRegex, '').length
					}, 0) < strategy.minLength) {
					content = strategy.name + '总字数不能少于' + strategy.minLength + '字';
				}
			}

			if (strategy.singleMaxLength) {
				if (d.filter(item => item.replace(lengthRegex, '').length > strategy.singleMaxLength).length) {
					content = strategy.name + '不能有项目超过' + strategy.singleMaxLength + '字';
				}
			}

			if (strategy.singleMinLength) {
				if (d.filter(item => item.replace(lengthRegex, '').length < strategy.singleMinLength).length) {
					content = strategy.name + '不能有项目少于' + strategy.singleMinLength + '字';
				}
			}

		} else {
			if (strategy.required) {
				if (d.replace(lengthRegex, '').length <= 0) {
					content = strategy.name + '不能为空';
				}
			}

			if (strategy.maxLength) {
				if (d.replace(lengthRegex, '').length > strategy.maxLength) {
					content = strategy.name + '的字数不能超过' + strategy.maxLength + '字';
				}
			}

			if (strategy.minLength) {
				if (d.replace(lengthRegex, '').length < strategy.minLength) {
					content = strategy.name + '的字数不能少于' + strategy.minLength + '字';
				}
			}
		}

		content && result.push({
			content,
			anchor
		});


	}

	return result;

}
