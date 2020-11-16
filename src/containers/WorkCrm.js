import React, {useState, useEffect} from 'react';
import {NavLink, Route, useHistory} from 'react-router-dom';
import {getPersons, getEntities} from '../server/firebase'
import * as entityOperations from '../server/EntityOperations';
import * as utils from '../components/gui/utils'
import './WorkCrm.css'

import EntityView from '../components/EntityView';
import Persons from '../components/person/Persons';
import EditPerson from '../components/person/EditPerson';
import Input from '../components/gui/Input';
import Button from '../components/gui/Button';
import StateButton from '../components/gui/StateButton';
import Spinner from '../components/gui/Spinner';
import UpcomingLessons from '../components/lesson/UpcomingLessons';

const WorkCrm = ({isAuthed, logoutTime}) => {
	const [searchCustPerson, setSearchCustPerson] = useState('');
	const [searchResults, setSearchResults] = useState([]);
	const [activeState, setActiveState] = useState(1);
	const [isLoading, setIsLoading] = useState(true);
	
	const [reference, setReference] = useState(null);

	const history = useHistory();

	const clearSearch = () => {
		setSearchCustPerson('');
	}

	const allPersons = () => {
		const theToken = localStorage.getItem('idToken');
		setIsLoading(true);
		getPersons(theToken, setSearchResults, setIsLoading);
	}

	const searchInputHandler = event => {
		setSearchCustPerson(event.target.value)
	}

	const showCustomerHandler = person => {
		// console.log(person);
		if(person.customer && person.customer !== -1){
			history.push(`/workcrm/customers/${person.customer}`)
		} else {
			history.push(`/workcrm/persons/${person.id}`)
		}
	}

	const editPerson = (id) => {
		history.push(`/workcrm/persons/${id}`)
	}

	const navigateAfterSave = (entity, id) => {
		// console.log('pushing ', history.location.pathname);
		history.push(history.location.pathname)
	}

	const editLesson = (lesson) => {
		history.push({
			pathname: `/workcrm/customers/${lesson.customerId}/lessons/${lesson.id}`,
			state: {lesson: lesson}
		})
	}

	useEffect( () => {
		if(isAuthed){
			console.log('app authed');
			const theToken = localStorage.getItem('idToken');

			getEntities('reference', theToken)			
			.then( reference => {
				console.log(reference);
				setReference(reference)
				allPersons(theToken);
			})
		} else {
			console.log('app NOT authed');
		}
	}, [isAuthed])
	
	
	return(
		<div className="WorkCrm">
			<div className="WorkCrmMenu">
				<div title="logout time">
					<span style={{backgroundColor: '#cacaca', marginRight: '1px'}}>{utils.toIsrDate(new Date(logoutTime + (7200*1000)).toISOString())}</span>
					<span className="material-icons" style={{verticalAlign: 'super',paddingLeft: '1px', marginRight: '10px', fontSize: '12px', backgroundColor: '#fafafa'}}>{isAuthed? 'lock_open' : 'lock'}</span>
				</div>
				<span></span>
				<span className="WorkCrmMenu">
					<NavLink to="/workcrm/upcominglessons">UPCOMING LESSONS</NavLink>
					<NavLink to="/workcrm/persons">ADD PERSON</NavLink>
				</span>
				<span className="WorkCrmMenu">
				<Input 
					title="name or phone" 
					size="10"
					value={searchCustPerson} 
					onChange={searchInputHandler}/>
				<StateButton buttons={[
					{icon:'star', title:'Active Persons', value:1}, 
					{icon:'star_border', title:'Inactive Persons', value:0},
					{icon:'star_half', title:'All Persons', value:-1},
					]} setter={setActiveState}/>
					
					<Button icon="cached" title="Refresh" shadow="2px 4px 8px 0 #696969" onClick={allPersons}/>
					<Button icon="search_off" title="Clear search" shadow="2px 4px 8px 0 #696969" onClick={clearSearch}/>
				</span>
			</div>			
			<div style={{height: '40vh', overflowY: 'auto'}}>
				{isLoading && <Spinner />}
				{!isLoading && <Persons 
					persons={searchResults.filter(
						p => {
							switch(activeState){
								case 1:
									return p.isActive? p : null;
								case 0:
									return !p.isActive? p : null;
								case -1:
									return p;
								default:
									console.log(activeState, p);
									return p;
							}
						})
						.filter(p => {
							return p.fullname.toLowerCase().includes(searchCustPerson.toLowerCase()) || p.phone.includes(searchCustPerson)
						}).sort( (a, b) => a.fullname.localeCompare(b.fullname))
					}
					personTypes={reference.personType}
					editHandler={editPerson} 
					showCustomerHandler={showCustomerHandler}/>}
			</div>
			<hr/>
				{reference !== null &&<span><Route path="/workcrm/persons/:personId" render={
					props => <EditPerson 
						match={props.match}
						personTypes={reference.personType}
						onSavePerson={entityOperations.updatePerson}
						onCreateCustomer={entityOperations.insertCustomer}
						navTo={navigateAfterSave}
						/>} exact/>		
				<Route path="/workcrm/persons" render={
					props => <EditPerson 
					match={props.match}
					personTypes={reference.personType}
					navTo={navigateAfterSave}
					onSavePerson={entityOperations.insertPerson}
					/>}
				 exact/>	
				<Route path="/workcrm/upcominglessons" render={
					props => <UpcomingLessons 
					match={props.match}
					personTypes={reference.personType}
					editLesson={editLesson}
					changeStatus={entityOperations.updateLessonStatus}
					navTo={navigateAfterSave}
					onSavePerson={entityOperations.insertPerson}
					/>}
				 />
		 
				<Route path="/workcrm/customers/:customerId" render={
					props => <EntityView 
						match={props.match}
						personTypes={reference.personType}
						payChannels={reference.payChannel}
						onUpdateCustomer={entityOperations.updateCustomer}
						/>} 
				/>
				</span>}
		</div>
	)
};

export default WorkCrm;