/**
 * 在数组中根据 id 找到对应的 index
 * @param array 格式应该是固定的 [{id:''}] 这种类型
 * @param id
 */
export const getIndexByIdFromArray = (array, id) => {
	let itemIndex = -1;
	array.forEach((item, index) => {
		if (item.id === id) {
			itemIndex = index;
			return itemIndex;
		}
	});
	return itemIndex;
};
