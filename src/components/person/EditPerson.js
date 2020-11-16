import React, {useEffect, useState} from 'react';
import {getEntity} from '../../server/firebase'
import Input from '../gui/Input';
import Select from '../gui/Select';
import Button from '../gui/Button';
import TextArea from '../gui/TextArea';
import TitleField from '../gui/TitleField';
import EditlogEntry from '../log/EditlogEntry';
import LogEntries from '../log/LogEntries';
import './EditPerson.css'

// const personTypes = [{id:0, name:'Student'}, {id:1, name:'Sybling'}];

const EditPerson = ({match, onSavePerson, personTypes, onCreateCustomer, navTo}) =>{
	const [fullname, setFullname] = useState('');
	const [email, setEmail] = useState('');
	const [phone, setPhone] = useState('');
	const [type, setType] = useState(0);
	const [notes, setNotes] = useState('');
	const [isActive, setIsActive] = useState(true);
	const [id, setId] = useState(-1);
	const [customer, setCustomer] = useState(-1);

	const [hasUpdated, setHasUpdated] = useState(false);

	const setPerson = person => {
		// console.log(person);
		setFullname(person.fullname);
		setEmail(person.email);
		setPhone(person.phone);
		setType(person.personType);
		setIsActive(person.isActive);
		setNotes(person.notes);
		setId(person.id);
		setCustomer(person.customer? person.customer : -1);
	}

	useEffect(() => {
		console.log("EditPerson CTOR", match.params);
		if(match && match.params.personId){
			const theToken = localStorage.getItem('idToken');
			getEntity('persons', theToken, match.params.personId)
			.then(person => {
				person.id = match.params.personId;
				setPerson(person);
			})
		} else {
			let customerId;
			if(match.params && match.params.customerId)
				customerId = match.params.customerId;
			setPerson({id: -1, fullname: '', email:'', phone:'', isActive: true, notes:'',personType:0, customer:customerId});
		}
		
	}, [match])

	const savePerson = () => {
		onSavePerson({id, fullname, email, phone, isActive, personType: +type, notes, customer}, navTo);
	}

	const createCustomer = () => {
		onCreateCustomer({title: fullname, profit: 0.0, balance: 0.0, isActive: true, persons:[id], leadingPerson:id}, navTo)
	}

	return(
			<div className="EditPerson">
				{fullname && <TitleField value={fullname} />}
				<div className="EditPersonRow">
					
				<Input 
					label="Name"
					value={fullname} 
					onChange={e => setFullname(e.target.value)} 
					title="name"/>
				<Input
					label="Phone"
					value={phone} 
					onChange={e => setPhone(e.target.value)} 
					title="Phone number"/>
				<Input
					label="Email"
					value={email} 
					size="15"
					onChange={e => setEmail(e.target.value)} 
					title="Email"/>					
				<Input 
					label="Active"
					title="Was lesson done"
					type="checkbox" 
					checked={isActive} 
					value={isActive} 
					onChange={e => setIsActive(e.target.checked)}/>						
				<Select 
					label="Type"
					optionsArr={personTypes.map(pt => {return{id: pt.id, name: pt.name}}) }
					value={type} 
					onChange={e => setType(e.target.value)} />
					<Button label="SAVE" onClick={savePerson}/>
				</div>Manager
				<div className="EditPersonRow">
					<TextArea 
						label="Notes"
						cols="80"
						value={notes}
						onChange={e => setNotes(e.target.value)}
						title="Notes"
						 />
				</div>
				<div className="EditPersonRow" style={{justifyContent:'flex-end'}}>
					{id !== -1 && customer === -1 && <Button label={'ACTIVATE'} onClick={createCustomer} style={{float: 'right'}}/>}
				</div>

				{id !== -1 && <div style={{boxShadow: '0 2px 4px 2px #2b2b2b'}}><div className="EditPersonRow" >
					<LogEntries personId={id} hasUpdated={hasUpdated} />
				</div>				
				<hr/>
				<div className="EditPersonRow">
					<EditlogEntry personId={id} navTo={navTo} setHasUpdated={setHasUpdated}/>
				</div></div>}
		</div>
	)

}

export default EditPerson;