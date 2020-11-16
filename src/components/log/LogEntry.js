import React from 'react';
import NotesField from '../gui/NotesField';
import * as utils from '../gui/utils'
import './LogEntry.css'


const LogEntry = ({logEntry}) =>(
	<div 
		className="LogEntry"
		style={logEntry.loggingSide === 1 ? {marginRight: '2px', marginLeft: 'auto', width:'30em'} :  {marginLeft: '2px', width:'30em'}} >
		<NotesField name={utils.toIsrDate(logEntry.date)} value={logEntry.entry} />
	</div>
)

export default LogEntry;