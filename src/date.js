
const formatDate = (date) =>{

	function appendSuffix(day){
		switch(day % 10){
			case 1: return 'st';
			case 2: return 'nd';
			case 3: return 'rd';
			default: return 'th';		
		}
	}
	const d = new Date(date)
	const monthDay = d.toLocaleDateString('en-US', {month: 'short', day: '2-digit'});
	const daySuff = appendSuffix(d.getDate());
	const time = d.toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit', hour12: true});
	const formattedDate = `${monthDay}${daySuff} ${time}`

	return formattedDate;
}

const d = new Date().toISOString();
console.log(formatDate(d));