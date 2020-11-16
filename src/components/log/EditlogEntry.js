import React, {useState} from 'react';
import * as operations from '../../server/EntityOperations';
import TextArea from '../gui/TextArea';
import Button from '../gui/Button';
import StateButton from '../gui/StateButton';

const EditlogEntry = ({personId, navTo, setHasUpdated}) =>{
	const [entry, setEntry] = useState('');
	const [loggingSide, setLoggingSide] = useState('');

	const updateSignal = () => {
		setHasUpdated(new Date().toISOString());
		setEntry('');
	}
	
	const saveEntry = event => {
		event.preventDefault();
		operations.insertPersonLog({loggingSide, entry: entry, date: new Date().toISOString()}, personId, navTo, updateSignal)
		
	}

	return(
		<form onSubmit={event => saveEntry(event)}>
			<div style={{display: 'flex',  justifyContent: 'flex-end'}}>
			<TextArea 
				label="Entry" 
				cols="80" 
				value={entry} 
				onChange={event => setEntry(event.target.value)} />
			
			<StateButton buttons={[
				{icon:'navigate_before', title:'Me', value:0},
				{icon:'navigate_next', title:'Client', value:1}, 
					]} setter={setLoggingSide}/>		
			<Button label='LOG' type="submit"/>
			</div>
		</form>
	)
}

export default EditlogEntry;