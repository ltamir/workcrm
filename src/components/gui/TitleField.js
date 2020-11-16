import React from 'react';
import './TitleField.css';

//'#ce9812'
const TitleField = ({name, value, bg}) => (
	<div className="TitleField">
		<span>{name? name + ": " : null}</span>
		<span>{value? value : null}</span>
	</div>
);

export default TitleField;