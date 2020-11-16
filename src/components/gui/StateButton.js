import React, {useState} from 'react';
import './StateButton.css'

// array of {label, value, setter}
const StateButton = ({buttons, setter}) =>{

	const [btnStates, setBtnStates] = useState([...buttons.map((b, index) => {return {is: false}})]);
	const selected = {border: '2px inset #f9fefa', backgroundColor: 'gray'};
	const unSelected = {border: '2px outset #f9fefa'};

	const setState = (index, value) => {
		const arr = btnStates.map( (b, idx) => {
			if(idx === index){
				return {is: true};
			} else {
				return {is: false};
			}
		});
		
		// console.log(arr);
		setBtnStates([...arr]);
		setter(value);
	}

	return(
	<div className="StateButton">
		{buttons.map((b, index) => <div 
			key={index} 
			className="btnDefault" 
			title={b.title} 
			style={btnStates[index].is?selected : unSelected} 
			onClick={() => setState(index, b.value)}>
				{b.label}
				{b.icon && <span className="material-icons">{b.icon}</span>}
				</div>
		)}
	</div>
	)
}

export default StateButton;