import React from 'react';
import './Input.css'

const getDirectionStyle = (value) => {
	if(!value) return;

	const charCode = value.trim().charCodeAt(0);
	if(charCode >= 1488 && charCode <= 1514){
		return {direction: 'rtl'};
	}
	return {direction: 'ltr' };
}

const getStyle = (value, type, size) => {
	const dir = type === 'text' ? getDirectionStyle(value) : null;
	const width = size? {width: `${size}em`} : null;
	return {...dir, ...width}
}

const Input = ({label, title, name, value, type, size, onChange}) => (
	<div title={title? title : label} className="Input" style={size? {width: `${size}em`} : null}>
		{label && <span className="InputTitle">{label? label + ": " : null}</span>}
		{label && <br/>}
		<input 
			className="InputData"
			type={type? type : "text"} 
			step={type === 'time'? 1800: null}
			value={value}
			name={name? name : label}
			onChange={onChange}
			size={size? size :  12}
			checked={value}
			placeholder={title}
			style={getStyle(value, type? type : "text", size)}
		/>
	</div>
);

export default Input;