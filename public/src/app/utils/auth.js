export function checkVerified(user) {

	return user.get('authData') && (user.get('type') == 1 && user.get('authData').get('personState') == 3 || user.get('type') == 2 && user.get('authData').get('businessState') == 3) && user.get('ability') > 0;

}