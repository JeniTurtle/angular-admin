
/**
 * 跳转至锚点
 * @param anchorDomId
 */
export const scrollToAnchor = (anchorDomId) => {
	if (!anchorDomId) {
		return;
	}
	const domAnchor = document.getElementById(anchorDomId);	// 获得 dom
	domAnchor.scrollIntoView();	// 调用 scrollIntoView() 方法
};
