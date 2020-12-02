import React from 'react';
import './Toggle.css'

//'#ce9812'
const Toggle = ({name, icon, value, sup, title, clickHandler}) => {

	const calcMaxWidth = names => {
		return name[0].length > name[1].length ? name[0].length : name[1].length;
	}

	return(
		<div 
			className={"Toggle " + (value? "ToggleOff" :  "ToggleOn")} 
			style={sup? {backgroundColor: 'inherit'} : null, {width: calcMaxWidth(name)/1.6 + 'em'}} 
			title={title} 
			onClick={clickHandler?clickHandler:null}>

			{icon && <span className="material-icons">{icon}</span>}
			<div 
				className="ToggleData" 
				style={sup?{verticalAlign: 'super', fontSize: '0.8em', backgroundColor: 'inherit'} : null} >
					{value? name[0] : name[1]}
				</div>
		</div>
	)

};

export default Toggle;