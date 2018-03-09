export function getPathFromLocation(location) {
	const curPath = location.pathname.match(/^\/(\w*)/);
	return curPath && curPath.length ? curPath[1] : 'historylist'
}

export function getCookie(name) {
	let value = "; " + document.cookie;
	let parts = value.split("; " + name + "=");
	if (parts.length >= 2) return parts.pop().split(";").shift();
}