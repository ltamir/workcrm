import React, {useEffect, useState} from 'react';
// import {getEntity} from '../server/firebase';
import * as operations from '../server/EntityOperations';
import Input from '../components/gui/Input';
import Select from '../components/gui/Select';
import './EditCustomer.css'
import Button from './gui/Button';

const EditCustomer = ({customer, customerPersons, navTo, setIsUpdated}) =>{
	const [title, setTitle] = useState('');
	const [chargeRate, setChargeRate] = useState(0.00);
	const [commission, setCommission] = useState(0.00);
	const [persons, setPersons] = useState([]);
	const [leadingPerson, setLeadingPerson] = useState(0);
	const [isActive, setIsActive] = useState(true);
	const [id, setId] = useState(-1);

	const setCustomer = customer => {
		setTitle(customer.title);
		setChargeRate(customer.chargeRate?customer.chargeRate : 0.00);
		setCommission(customer.commission?customer.commission: 0.00);
		setPersons(customer.persons);
		setLeadingPerson(customer.leadingPerson?customer.leadingPerson : customer.persons[0]);
		setIsActive(customer.isActive);
		setId(customer.id);
	}

	useEffect(() => {
		if(customer){
			setCustomer(customer);
		} 

	}, [customer])

	const saveCustomer = () => {
		operations.updateCustomer(
			{id, title, chargeRate, commission, isActive, persons, leadingPerson}, 
			() => {
				if(customer.isActive !== isActive){
					for(const [key, val] of Object.entries(customer.persons)){
						const updatedPerson = {id:val, isActive}
						operations.updatePerson(updatedPerson)
					};
				}
			}, 
			() => {
				setIsUpdated(new Date().getTime())
			}
		)
	}

	return(
		<div className="EditCustomer">
			<div className="EditCustomerRow">
				<Input value={title} onChange={e => setTitle(e.target.value)} label="Title"/>
				<Input value={chargeRate} onChange={e => setChargeRate(e.target.value)} label="Charge rate"/>
				<Input value={commission} onChange={e => setCommission(e.target.value)} label="Commission"/>
				<Select 
					label='Lead' 
					value={leadingPerson} 
					onChange={ e => setLeadingPerson(e.target.value)}
					optionsArr={customerPersons.map(p => {return {id:p.id, name: p.fullname}})}
					/>
				<Input 
					label="Active"
					title="Was lesson done"
					type="checkbox" 
					value={isActive} 
					onChange={e => setIsActive(e.target.checked === true)}/>
				<Button label="SAVE" onClick={saveCustomer}/>
			</div>
		</div>
	)

}

export default EditCustomer;