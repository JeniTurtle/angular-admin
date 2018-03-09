export const SAVE = 'IPINFO/SAVE';
export const UPDATE = 'IPINFO/UPDATE';

export function save() {
	return {
		type: SAVE
	}
}

export function update(key, value) {
	return {
		type: UPDATE,
		key,
		value
	}
}