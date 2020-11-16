import React from 'react';
import Person from './Person';

const Persons = ({persons, personTypes, editHandler, showCustomerHandler}) =>{
	
	return(
		<div>
			{persons.map(p =>
				 <Person 
					key={p.id} 
					onClick={showCustomerHandler} 
					onDblCLick={editHandler}
					person={p} 
					personType={personTypes[p.personType]}/>
			 )}
		</div>
	)
}

export default Persons;