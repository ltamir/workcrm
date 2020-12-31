import React, {useState, useEffect, useReducer} from 'react';
import { Route, useHistory} from 'react-router-dom';
import {getEntities} from '../server/firebase'
import * as entityOperations from '../server/EntityOperations';
import * as utils from '../components/gui/utils'
import './WorkCrm.css'

import {rootReducer} from '../store/reducers';
import {initialState} from '../store/initialState';
import * as actionTypes from '../store/actionTypes';

import EntityView from '../components/EntityView';
import Persons from '../components/person/Persons';
import EditPerson from '../components/person/EditPerson';
import Spinner from '../components/gui/Spinner';
import UpcomingLessons from '../components/lesson/UpcomingLessons';
import UpcomingWorks from '../components/work/UpcomingWorks';
import Navbar from '../components/Navbar';

const WorkCrm = ({isAuthed, logoutTime}) => {
	const [filterText, setFilterText] = useState('');
	const [searchResults, setSearchResults] = useState([]);
	// const [persons, setPersons] = useState([]);
	// const [customers, setCustomers] = useState([]);
	const [activeState, setActiveState] = useState(1);
	const [isLoading, setIsLoading] = useState(true);

	const [data, dispatch] = useReducer(rootReducer, initialState)
	
	const [reference, setReference] = useState(null);

	const history = useHistory();


	const allPersons = () => {
		const theToken = localStorage.getItem('idToken');
		setIsLoading(true);
		// dispatch({type: actionTypes.LOAD_PERSONS})
		const filter = `orderBy="isActive"&startAfter=true`
		getEntities('persons', theToken)			
		.then( persons => {
			const personArr = [];
			for (let k in persons){
				if(persons[k]){
					personArr.push({...persons[k], id: k});
				}
			}

			setSearchResults([...personArr])
			setIsLoading(false);
		})
	}

	const clearSearch = () => {
		setFilterText('');
	}

	const searchInputHandler = event => {
		setFilterText(event.target.value)
	}

	const showCustomerHandler = person => {
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
				<div>
					<span 
						className="material-icons" 
						style={{verticalAlign: 'super',paddingLeft: '1px', fontSize: '12px', backgroundColor: '#fafafa'}}
						title={"logout time " + utils.toIsrDate(new Date(logoutTime + (7200*1000)).toISOString())}>
							{isAuthed? 'lock_open' : 'lock'}
					</span>
				</div>
				<Navbar 
					filterText={filterText}
					clearSearch={clearSearch}
					searchInputHandler={searchInputHandler}
					setActiveState={setActiveState} 
					allPersons={allPersons}/>

			</div>

			<div style={{height: '40vh', overflowY: 'auto'}}>
				{isLoading && <Spinner />}
				{!isLoading && <Persons 
					persons={searchResults.filter(
						p => {
							switch(activeState){
								case 1:
									return p.isActive && p.personType === 0;	
								case 0:
									return !p.isActive;
								case -1:
									return p;
								default:
									console.log(activeState, p);
									return p;
							}
						})
						.filter(p => {
							return p.fullname.toLowerCase().includes(filterText.toLowerCase()) 
							|| p.phone.includes(filterText) 
							|| p.email.toLowerCase().includes(filterText.toLowerCase())
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
				<Route path="/workcrm/upcomingworks" render={
					props => <UpcomingWorks
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
						reference={reference}
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