export function checkIfToday(date: Date | null | undefined) {
	if (!date) return false;
	const today = new Date();
	return (
		date.getDate() === today.getDate() &&
		date.getMonth() === today.getMonth() &&
		date.getFullYear() === today.getFullYear()
	);
}

export function checkIfOlderThanToday(date: Date | null | undefined) {
	if (!date) return false;
	const today = new Date();
	return (
		date.getDate() < today.getDate() &&
		date.getMonth() <= today.getMonth() &&
		date.getFullYear() <= today.getFullYear()
	);
}

export function checkIfYesterday(date: Date | null | undefined) {
	if (!date) return false;
	const today = new Date();
	return (
		date.getDate() === today.getDate() - 1 &&
		date.getMonth() === today.getMonth() &&
		date.getFullYear() === today.getFullYear()
	);
}
