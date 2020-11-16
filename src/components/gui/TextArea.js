import React from 'react';
import * as gui from './utils'
import './TextArea.css'


const TextArea = ({label, title, name, value, rows, cols, onChange}) => (
	<div className="TextArea">
		<span className="TextAreaLabel">{label? label + ": " : null}</span>
		<textarea 
			className="TextAreaData"
			rows={rows? rows : 2} 
			cols={cols? cols : 2}
			name={name? name : label}
			value={value}
			onChange={onChange}
			title={title? title : label}
			style={gui.getDirectionStyle(value)}>
		</textarea>
	</div>
);

export default TextArea;