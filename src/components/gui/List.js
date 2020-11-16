import React from 'react';

const List = ({label, title, name, value, optionsArr, size, onChange}) => (
	<div title={title? title : label} style={{ margin: '1px', color: 'black', backgroundColor: '#ce9812', border: '1px solid #2b2b2b', borderRadius: '7px', fontWeight: 'bold'}}>
		<span>{label? label + ": " : null}</span>
		<select
			name={name? name : label}
			value={value}
			onChange={onChange}
			style={{fontFamily: 'Roboto, Rubik, sans-serif', fontSize: 16}}
			size={size? size :  0}
		>
			{optionsArr.length && optionsArr.map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
		</select>
	</div>
);

export default List;