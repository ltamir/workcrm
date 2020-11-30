import React from 'react';
import './Spinner.css'

const spinner = props =>(
	<div className={props.sm ? 'LoaderSm' : "Loader"} style={props.margin? {maring: props.margin} : null}>Loading...</div>
);

export default spinner;