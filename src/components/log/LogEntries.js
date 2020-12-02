import React, {useState, useEffect} from 'react';
import {getEntities} from '../../server/firebase';
import LogEntry from './LogEntry';

const LogEntries = ({personId, hasUpdated}) =>{
	const [entries, setEntries] = useState([])

	useEffect( () => {
		console.log('LogEntries CTOR', personId);
		const theToken = localStorage.getItem('idToken');
		getEntities(`persons/${personId}/log`, theToken)
		.then(response => {
			if(response){
				const arr = [];
				for(let k in response){
					const e = {...response[k], id: k}
					arr.push(e);
				}
				setEntries([...arr]);
			} else {
				setEntries([]);
			}
			// console.log(entries);
		})
	}, [personId, hasUpdated])


	const getStyle = (rows) => {
		const height = rows < 2 ? `${rows * 8}vh` : '12vh';
		return {width: '100%', height, overflowY:'auto'}
	}
	return(
		<div style={getStyle(entries.length)} >
			{entries.length > 0 && entries.map(e => <LogEntry logEntry={e} key={e.id} /> )}
			{entries.length === 0 && ' No log entries'}
		</div>
	)
}

export default LogEntries;