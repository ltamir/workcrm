import React from 'react';
import './Toggle.css'

//'#ce9812'
const Toggle = ({name, icon, value, sup, title, clickHandler}) => {
	return(
		<div 
			className={"Toggle " + (value? "ToggleOff" :  "ToggleOn")} 
			style={sup? {backgroundColor: 'inherit'} : null} 
			title={title} 
			onClick={clickHandler?clickHandler:null}>

			{icon && <span className="material-icons">{icon}</span>}
			<span 
				className="FieldData" 
				style={sup?{verticalAlign: 'super', fontSize: '0.8em', backgroundColor: 'inherit'} : null} >
					{value? name[0] : name[1]}
				</span>
		</div>
	)

};

export default Toggle;