import React, {useState, useEffect, useCallback} from 'react';
import {getEntity} from '../server/firebase';
import * as entityOperations from '../server/EntityOperations';
import {NavLink, Route, useHistory} from 'react-router-dom'
import Customer from './customer/Customer.jsx';
import EditCustomer from './customer/EditCustomer';
import Person from './person/Person';
import Lessons from './lesson/Lessons'
import Works from './work/Works'
import Persons from './person/Persons'
import Payments from './payment/Payments'
import EditLesson from './lesson/EditLesson';
import EditWork from './work/EditWork';
import EditPerson from './person/EditPerson';
import './EntityView.css';
import EditPayment from './payment/EditPayment';
import TitleField from './gui/TitleField';
import Spinner from './gui/Spinner';


const EntityView = (props) =>{
	const {match, reference} = props;

	const [customer, setCustomer] = useState({});
	const [leadingPerson, setLeadingPerson] = useState(null);
	const [persons, setPersons] = useState([]);
	const [isUpdated, setIsUpdated] = useState(false)
	const [showCustomerEdit, setShowCustomerEdit] = useState(false)

	const [isReady, setIsReady] = useState(false)

	const history = useHistory();

	const fetchPersons = useCallback((token, ids, persons) => {
		const id = ids.pop()
		getEntity('persons', token, id)
		.then(person => {
			person.id = id;
			persons.push(person)
			// console.log(id + " == " + customer.leadingPerson);
			if(ids.length === 0){
				setPersons([...persons]);
				persons.forEach(p => p.id === customer.leadingPerson? setLeadingPerson(prev => {
					setIsReady(true);	
					return p
				}) : null)
					
				return;
			}
			fetchPersons(token, ids, persons);
		})
	}, [customer.leadingPerson])

	useEffect(() => {
		if(match.params.customerId){
			setIsReady(false);
			const theToken = localStorage.getItem('idToken');
			
			getEntity('customers', theToken, match.params.customerId)
			.then(customer => {
				if(!customer.leadingPerson)
					alert('missing leading  person ' + customer.title);
				customer.id = match.params.customerId;
				if(!customer.works){
					customer.works = {}
				}
				Object.keys(customer.works).forEach( w => customer.works[w].id = w);
				setCustomer(customer);
				// console.log("EntityView CTOR", customer);
				const presons = [];
				const pArr = [];
				for(let p in customer.persons){
					pArr.push(customer.persons[p])
				}
				fetchPersons(theToken, pArr, presons);
			})
			.catch(err => {
				console.log(err);
			})	
		} 
	}, [match.params.customerId, isUpdated, fetchPersons])



	const navigateBack = (entity) =>{
		if(entity){
			history.push(`/workcrm/customers/${match.params.customerId}/${entity}`)	
		} else {
			setIsUpdated(false);
			history.push(`/workcrm/customers/${match.params.customerId}`)
		}
	}

	const editCustomer = () => {
		console.log(match.params.id)
		history.push(`/workcrm/customers/${match.params.customerId}`);
	}

	const editPerson = (id) => {
		history.push(`/workcrm/customers/${match.params.customerId}/persons/${id}`)
	}

	const editLesson = (lesson) => {
		history.push({
			pathname: `/workcrm/customers/${match.params.customerId}/lessons/${lesson.id}`,
			state: {lesson: lesson}
		})		
	}

	const insertLessonHandler = (lesson, navTo, setIsUpdated, touchUpdatedLessons) => {
		entityOperations.insertLesson(lesson, customer.id, navTo, setIsUpdated, touchUpdatedLessons)
	}
	const updateLessonHandler = (lesson, navTo, setIsUpdated, touchUpdatedLessons) => {
		customer.lessons[lesson.id] = lesson
		entityOperations.updateLesson(lesson, customer.id, navTo, setIsUpdated, touchUpdatedLessons)
	}

	const insertWorkHandler = (lesson, navTo, setIsUpdated, touchUpdatedLessons) => {
		entityOperations.insertWork(lesson, customer.id, navTo, setIsUpdated, touchUpdatedLessons)
	}
	const updateWorkHandler = (lesson, navTo, setIsUpdated, touchUpdatedLessons) => {
		customer.lessons[lesson.id] = lesson
		entityOperations.updateWork(lesson, customer.id, navTo, setIsUpdated, touchUpdatedLessons)
	}


	const editPayment = (lesson, paymentId) => {
		
		if(paymentId){
			if(!lesson){
				for(let key in customer.lessons){
					const l = customer.lessons[key];
					if(l.payment === paymentId){
						lesson = customer.lessons[key];
					}
				}
			}			
			history.push({
				pathname: `/workcrm/customers/${match.params.customerId}/payments/${paymentId}`,
				state: {lesson: lesson}
			})			
		} else {
			history.push({
				pathname: `/workcrm/customers/${match.params.customerId}/payments/`,
				state: {lesson: lesson}
			})
		}
	}

	return (
		<div>
			{!isReady && ( <Spinner />)}
			{isReady && <div className="Menu">
				<NavLink to={`/workcrm/customers/${match.params.customerId}`} exact>{customer.title || (leadingPerson && leadingPerson.fullname) || ''}</NavLink>
				<div className="Menu">
					<NavLink to={`/workcrm/customers/${match.params.customerId}/persons/0`}>ADD PERSON</NavLink>
					<NavLink to={{pathname: `/workcrm/customers/${match.params.customerId}/lessons/0`, state:{isNew: true}}}>ADD LESSON</NavLink>
					<NavLink to={{pathname: `/workcrm/customers/${match.params.customerId}/works/0`, state:{isNew: true}}}>ADD WORK</NavLink>
				</div>
				<div className="Menu" >
					<NavLink to={`/workcrm/customers/${match.params.customerId}/persons`} exact>PERSONS</NavLink>	
					<NavLink to={`/workcrm/customers/${match.params.customerId}/lessons`} exact>LESSONS</NavLink>	
					<NavLink to={`/workcrm/customers/${match.params.customerId}/works`} exact>WORKS</NavLink>	
					<NavLink to={`/workcrm/customers/${match.params.customerId}/payments`}>PAYMENTS</NavLink>	
				</div>
			</div>}
			{isReady && <Customer 
				customer={customer} 
				navTo={editCustomer} 
				setShowCustomerEdit={setShowCustomerEdit}/>}
			{isReady && <Person 
				person={leadingPerson} 
				onDblCLick={editPerson} 
				personType={reference.personType[leadingPerson.personType]}/>}

			<TitleField value={" "} />

			<Route path="/workcrm/customers/:customerId/persons" exact render={
				() => <Persons persons={persons.filter(p => p.id !== customer.leadingPerson )} personTypes={reference.personType} editHandler={editPerson}/>
			}/>
				
			<Route path="/workcrm/customers/:customerId/lessons" exact render={
				() => <Lessons lessons={customer.lessons || {}} editLesson={editLesson} doubleClickHandler={editLesson} navToPayment={editPayment}/>	
			}/>

			<Route path="/workcrm/customers/:customerId/works" exact render={
				(props) => <Works lessons={customer.works || {}} customerId={props.match.params.customerId} doubleClickHandler={editLesson} navToPayment={editPayment}/>	
			}/>

			<Route path="/workcrm/customers/:customerId/payments" exact render={
				() => <Payments paymentIds={customer.payments} persons={persons} editPayment={editPayment} navToPayment={editPayment}/>
			}/>
				
			<Route path="/workcrm/customers/:customerId/lessons/0" render={
				props => <EditLesson 
					match={props.match}
					navTo={navigateBack}
					location={props.location}
					customerId={customer.id}
					persons={persons}
					subjectsList={reference.subjects}
					workTypeList={reference.workType}
					paymentIds={customer.payments}
					setIsUpdated={setIsUpdated}
					onSaveLesson={insertLessonHandler}
					/>} exact/>	
			<Route path="/workcrm/customers/:customerId/lessons/:lessonId" render={
				props => props.match.params.lessonId !== '0' && <EditLesson 
					match={props.match}
					location={props.location}
					navTo={navigateBack}
					persons={persons}
					subjectsList={reference.subjects}
					workTypeList={reference.workType}
					paymentIds={customer.payments}
					setIsUpdated={setIsUpdated}
					onSaveLesson={updateLessonHandler}
					/>} exact/>	
			<Route path="/workcrm/customers/:customerId/works/:workId" render={
				props => <EditWork 
					match={props.match}
					customer={customer.id}
					work = {props.match.params && props.match.params.workId?customer.works[props.match.params.workId]:null}
					navTo={navigateBack}
					persons={persons}
					subjectsList={reference.subjects}
					workTypeList={reference.workType}					
					paymentIds={customer.payments}
					setIsUpdated={setIsUpdated}
					onSaveLesson={{c: insertWorkHandler, u: updateWorkHandler}}
					/>} exact/>	
				<Route path="/workcrm/customers/:customerId/persons/0" exact render={
					props => <EditPerson 
						match={props.match}
						navTo={navigateBack}
						personTypes={reference.personType}
						setIsUpdated={setIsUpdated}
						onSavePerson={entityOperations.insertPerson}
						/>
					} 
				/>						
				<Route path="/workcrm/customers/:customerId/persons/:personId" exact render={
					props => props.match.params.personId !== '0' && <EditPerson 
						match={props.match}
						navTo={navigateBack}
						personTypes={reference.personType}
						setIsUpdated={setIsUpdated}
						onSavePerson={entityOperations.updatePerson}
						/>
					} 
				/>
				<Route path="/workcrm/customers/:customerId/payments/:paymentId" exact render={
					props => <EditPayment 
						match={props.match}
						location={props.location}
						persons={persons}
						navTo={navigateBack}
						setIsUpdated={setIsUpdated}
						payChannels={reference.payChannel}
						onSavePayment={entityOperations.updatePayment}
						/>
					} 
				/>
				<Route path="/workcrm/customers/:customerId/payments/" exact render={
					props => props.location.state && <EditPayment 
						match={props.match}
						location={props.location}
						persons={persons}
						navTo={navigateBack}
						setIsUpdated={setIsUpdated}
						payChannels={reference.payChannel}
						onSavePayment={entityOperations.insertPayment}
						/>
					} 
				/>
		
				{showCustomerEdit && <Route path="/workcrm/customers/:customerId" render={
					props => <EditCustomer 
						setIsUpdated={setIsUpdated}
						customerPersons={persons}
						customer={customer}
						onUpdateCustomer={entityOperations.updateCustomer}
					/>} 
				/>}							
		</div>

	)

}


export default EntityView;