import React from 'react';
import * as gui from './utils'
import './Field.css'

const getDirectionStyle = d => {
	const charCode = d.charCodeAt(0);
	if(charCode >= 1488 && charCode <= 1514){
		return {direction: 'rtl', fontWeight: 'normal', fontSize: '14px', whiteSpace: 'pre-line'};
	}
	return {direction: 'ltr', fontWeight: 'normal', fontSize: '14px', whiteSpace: 'pre-line'};
}

const NotesField = ({name, value, icon}) => (
	<div className="Field">
		<span style={name? gui.getDirectionStyle(name) : null} className="FieldLabel">{name? name : null}</span>
		<div className="FieldData" style={getDirectionStyle(value)}>{icon && <span className="material-icons">{icon}</span>}{value? value : null}</div>
	</div>
);

export default NotesField;