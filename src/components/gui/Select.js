import React from 'react';
import './Select.css'

//style={{ margin: '1px', color: 'black', backgroundColor: '#ce9812', border: '1px solid #2b2b2b', borderRadius: '7px', fontWeight: 'bold'}}
const Select = ({label, title, name, value, optionsArr, size, onChange, onClick}) => (
	<div title={title? title : label} className="Select">
		<span className="SelectLabel">{label? label + ": " : null}</span>
		<br/>
		<select
			className="SelectData"
			name={name? name : label}
			value={value}
			onFocus={onClick}
			onChange={onChange}
			style={{fontFamily: 'Roboto, Rubik, sans-serif', fontSize: 16}}
			size={size? size :  0}
		>
			{optionsArr.length && optionsArr.map(opt => <option key={opt.id} value={opt.id} title={opt.title}>{opt.name}</option>)}
		</select>
	</div>
);

export default Select;