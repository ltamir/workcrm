import React from 'react';
import * as utils from './utils'
import './Field.css'

//'#ce9812'
const Field = ({name, icon, value, setDir, sup, title, clickHandler}) => {
	const dir = setDir? utils.getDirectionStyle(value)  : null
	const supStyle = sup?{verticalAlign: 'super', fontSize: '0.8em', backgroundColor: 'inherit'} : null
	const dataFieldStyle = {...dir, ...supStyle}

	return(
		<div className="Field" style={sup? {backgroundColor: 'inherit'} : null} title={title} onClick={clickHandler?clickHandler:null}>
			<span className="FieldLabel">{name? name + ": " : null}</span>
			{icon && <span className="material-icons">{icon}</span>}
			<span className="FieldData" style={dataFieldStyle} >{value? value : null}</span>
		</div>
	)

};

export default Field;