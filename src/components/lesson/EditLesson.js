import React, {useEffect, useState} from 'react';
import Payment from '../payment/Payment'
import { useParams } from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux';
import {getEntities, getEntity} from '../../server/firebase'
import Input from '../gui/Input';
import TextArea from '../gui/TextArea';
import Select from '../gui/Select';
import Button from '../gui/Button';
import Spinner from '../gui/Spinner';
import './EditLesson.css'



const EditLesson = (props) =>{
	const {match, location, persons, paymentIds, onSaveLesson, setIsUpdated, navTo} = props;
	const dispatch = useDispatch()
	const params = useParams();
	console.log(params)
	const subjectsList = useSelector( state => state.workcrm.reference.subjects)
	const workTypeList = useSelector( state => state.workcrm.reference.workType)
	const lesson = useSelector( state => {
		const customer = state.workcrm.customers.find(c => c.id && c.id === params.customerId);
		return customer.lessons[params.lessonId];
	})
	const paymentObj = useSelector(state => params.lessonId !== '0' ? state.workcrm.payments.find( p => p.id === lesson.payment): null)
	console.log(lesson);
	console.log('paymentObj', paymentObj);

	const [title, SetTitle] = useState('');
	const [startDate, setStartDate] = useState('');
	const [startTime, setStartTime] = useState('');
	const [person, setPerson] = useState(0);
	const [charge, setCharge] = useState(0);
	const [payment, setPayment] = useState(-1);
	const [duration, setDuration] = useState(1);
	const [isDone, setIsDone] = useState(false);
	const [notes, setNotes] = useState('');
	const [subjects, setSubjects] = useState(0);
	const [id, setId] = useState(-1);
	const [workType, setWorkType] = useState(0);

	const [payments, setPayments] = useState([{id: -2, name: 'Load payment'}]);
	const [isLoading, setIsLoading] = useState(false);


	const setLesson = lesson => {
		SetTitle(lesson.title);
		setStartDate(lesson.startDatetime.split(" ")[0])
		setStartTime(lesson.startDatetime.split(" ")[1]);
		setDuration(lesson.duration);
		setPerson(lesson.person);
		setCharge(+lesson.charge);
		setPayment(lesson.payment);
		setIsDone(lesson.isDone);
		setNotes(lesson.notes);
		setSubjects(lesson.subjects);
		setWorkType(lesson.workType || 'lesson')
		setId(lesson.id);
	}

	// **** retrieve payments:
	const fetchPayments = (theToken, keys, paymentsArr) => {
		getEntity('payments', theToken, keys[0])
		.then(payment => {
			const p = {};
			p.id = keys[0];
			p.name = `${payment.datetime} ${payment.amount}`
			paymentsArr.push(p)
			keys.shift();
			if(keys.length === 0){
				paymentsArr.sort( (a, b) => a.datetime < b.datetime ? 1 : -1)
				setPayments([{id: -1, name: 'Select payment'}, ...paymentsArr]);
				setPayment(-2)
				setIsLoading(false);
				return;
			}
			fetchPayments(theToken, keys, paymentsArr);
		})
	}

	const buildPayments = () => {
		console.log(payment)
		if(payment !== -1){
			return
		}

		if(paymentIds){
			setIsLoading(true)
			const theToken = localStorage.getItem('idToken');
			const keys = [];
			const paymentsArr = [];
			for(let p in paymentIds){
				keys.push(p)
			}
			
			fetchPayments(theToken, keys, paymentsArr)	
		} 
}


	useEffect(() => {
		const theToken = localStorage.getItem('idToken');
		if(lesson){
			console.log("EditLesson CTOR", lesson);
			setLesson(lesson);
		} else {
			const now = new Date().toISOString().replace('T', ' ').substr(0, 16)
			setLesson({id: -1, title: '', startDatetime: now, 
				duration: 1, person: persons[0].id, isDone: false, charge: 0.00, payment: -1, 
				subjects: 'React', notes: ''})	
		}

	}, [match, location, persons])


	const saveLesson = () => {
		const touchUpdatedLessons = id !== -1 && location.state.lesson.isDone !== isDone ? !isDone : id === -1 ? true : null;
		//dispatch
		onSaveLesson({id, title, startDatetime: startDate + " " + startTime, workType, duration, person, isDone, charge, payment, subjects, notes}, navTo, setIsUpdated, touchUpdatedLessons)
	}

	return(
		<div className="EditLesson">
			{props.type && <h4>WORK</h4>}
			<form>
				<div className="EditLessonRow">
					<Input 
						label="Title" 
						value={title} 
						size="15"
						onChange={e => SetTitle(e.target.value)} 
						title="Title" />
					<Input 
						label="Date" 
						type="date" 
						value={startDate} 
						onChange={e => setStartDate(e.target.value)} 
						title="Start date"/>
					<Input 
						label="Time"
						type="time" 
						value={startTime} 
						onChange={e => setStartTime(e.target.value)} 
						Title="Start time"/>
					<Select 
						label="Subjects"
						value={subjects}
						onChange={e => setSubjects(e.target.value)}
						optionsArr={Object.keys(subjectsList).map(k => {return {id: k, name: k}})} />
					<Select 
						label="Student" 
						value={person} 
						onChange={e => setPerson(e.target.value)}
						optionsArr={persons.map(p => { return {id: p.id, name: p.fullname}} )}/>	

					<Input 
						label="Done"
						title="Was lesson done"
						type="checkbox" 
						checked={isDone} 
						value={isDone} 
						onChange={e => setIsDone(e.target.checked)}/>							
				</div>
				<div className="EditLessonRow">
					<Input 
						label="Duration"
						title="Duration in hours"
						size="4"
						type="number" 
						value={duration} onChange={e => setDuration(e.target.value)} />													
					<Input 
						label="Charge"
						size="4"
						type="number" 
						value={charge} onChange={e => setCharge(+e.target.value)} />	
					<Select 
						label="Type" 
						value={workType} 
						onChange={e => setWorkType(e.target.value)}
						optionsArr={Object.keys(workTypeList).map(k => { return {id: k, name: workTypeList[k]} })}/>
					{isLoading && <Spinner sm/>}
					{payment !== -1 && payment !== -2 ? <Payment payment={paymentObj} person={{fullname: ' '}}/>  : 
					!isLoading && <Select 
						label="Set payment" 
						value={payment} 
						onClick={buildPayments}
						onChange={e => setPayment(e.target.value)}
						optionsArr={payments.map(p => { return {id: p.id, name: p.name}})}/>}							
				</div>
				<div className="EditLessonRow" style={{justifyContent: 'space-between'}}>
					
					<TextArea label="Notes" cols={80} rows={3} value={notes} onChange={e => setNotes(e.target.value)}/>
					<Button label="SAVE" onClick={saveLesson}/>
				</div>
			</form>

		</div>
	)

}

export default EditLesson;