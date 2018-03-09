/**
 * 下载工具
 */

/**
 * 下载文件
 * @param fileUrl
 * @param fileName
 */
export function downloadFile(fileUrl, fileName) {
	const aTag = document.createElement('a');	// 创建一个 <a> 标签
	aTag.href = fileUrl;
	aTag.download = fileName || '';
	aTag.click();	// 模拟 <a> 标签点击
}
