export const getDirectionStyle = d => {
	if(!d || d.length === 0) return;
	const charCode = d.trim().charCodeAt(0);
	if(charCode >= 1488 && charCode <= 1514){
		return {direction: 'rtl'};
	}
	return {direction: 'ltr'};
}

export const formatDate = date => {
	const arr = date.split('T');
	const time = arr[1].split('.')[0];
	return arr[0] + ' ' + time;
}

export const toIsrDate = date => {
	let datePart = date;
	let timePart = '';
	let dateArr;

	if(date.includes('T')){
		dateArr = date.split('T');
	} else if(date.includes(' ')){
		dateArr = date.split(' ');
	}
	datePart = dateArr[0];
	timePart = dateArr[1];
	const timeParts = timePart.split(':')
	const dateParts = datePart.split('-');

	return `${dateParts[2]}/${dateParts[1]}/${dateParts[0]} ${timeParts[0]}:${timeParts[1]}`;
}

export const calculateHeight = (items) => {
	const height = items < 3? items * 7 : 20;
	return {height: height + 'vh', overflowY:'auto'}
}