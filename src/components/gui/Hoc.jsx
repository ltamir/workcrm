import React from 'react';

const Hoc = props => {
	const {height, overflowY, children} = props;
	return(
		<div style={{height: height?height:'20vh', overflowY: overflowY? overflowY :'auto'}}>
			{children}
		</div>
	)
};

export default Hoc;