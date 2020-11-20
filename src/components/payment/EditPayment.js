import React, {useEffect, useState} from 'react';
import {getEntity} from '../../server/firebase'
import Lesson from '../lesson/Lesson';
import Input from '../gui/Input';
import Select from '../gui/Select';
import Button from '../gui/Button';
import TitleField from '../gui/TitleField';
import './EditPayment.css'

const now = new Date().toISOString().split('T');
const defaultDate = now[0];
const time = now[1].split(':');
const defaultTime = time[0] + ":" + time[1];

const EditPayment = ({match, location, payChannels, persons, onSavePayment, setIsUpdated, navTo}) =>{
	const [date, setDate] = useState(defaultDate);
	const [time, setTime] = useState(defaultTime);
	const [payer, setPayer] = useState('');
	const [payChannel, setPayChannel] = useState({id:''});
	const [amount, setAmount] = useState(0.0);
	const [lessons, setLessons] = useState('');
	const [customer, setCustomer] = useState(match.params.customerId);
	const [id, setId] = useState(-1);

	const [lesson, setLesson] = useState(null);

	const setPayment = payment => {
		setDate(payment.datetime.split(" ")[0])
		setTime(payment.datetime.split(" ")[1]);
		setPayer(payment.payer);
		setPayChannel(payment.payChannel);
		setAmount(+(payment.amount));
		setLessons(payment.lessons);
		setCustomer(payment.customer);
		setId(payment.id);
	}

	useEffect(() => {

		if(match && match.params.paymentId){

			const paymentId = match.params.paymentId;
			const theToken = localStorage.getItem('idToken');
			console.log("EditPayment CTOR with id", paymentId);
			getEntity('payments', theToken, paymentId)
			.then(payment => {
				console.log("EditPayment CTOR", payment);
				payment.id = paymentId;
				setPayment(payment);
				if(location.state.lesson.id !== -1){
					console.log("EditPayment CTOR with locartion", location.state.lesson);
					setLesson(location.state.lesson)
				}
			})
		} else {
			const lessonDatetime = location.state.lesson.startDatetime;
			const payment = {
				datetime: lessonDatetime, 
				payer: location.state.lesson.person,
				lessons: location.state.lesson.id, 
				amount: +(location.state.lesson.charge),
				customer: match.params.customerId,
				payChannel: {...payChannels['Bit'], id: 'Bit'}
			}
			setPayment(payment)
			setLesson(location.state.lesson);
		} 
		
	},[match, persons, location, payChannels])

	const savePayment = event => {
		event.preventDefault();
		// console.log({id, datetime: date +  ' ' + time, customer, payer, amount:+amount, payChannel, lessons});
		onSavePayment({id, datetime: date +  ' ' + time, customer, payer, amount:+amount, payChannel, lessons}, navTo, setIsUpdated)
	}

	
	return(
		<div className="EditPayment">
			<TitleField value={(id === -1? 'New' : 'Edit') + ' payment for lesson'} />
			{lesson && <Lesson lesson={lesson} showPayment={false}/>}
			<hr/>
			<form >
				<div className="EditPaymentRow">
				<Input label="Date" type="date" value={date} onChange={e => setDate(e.target.value)} />
				<Input label="Time" type="time" value={time} onChange={e => setTime(e.target.value)} />
				<Select 
					label="Payer" 
					value={payer} 
					onChange={e => setPayer(e.target.value)}
					optionsArr={persons.map(p => { return {id: p.id, name: p.fullname}} )}/>
				<Select 
					label="Paychannel" 
					value={payChannel.id} 
					onChange={e => {
						const pc = {...payChannels[e.target.value], id: e.target.value}
						console.log(e.target.value, pc);
						setPayChannel(pc)
					}}
					optionsArr={Object.entries(payChannels).map(([k, v]) => { return {name: k + ' +' + v.delay, id: k}})}
					/>
				<Input label="Amount" type="number" value={amount} onChange={e => setAmount(+(e.target.value))} />
				<Button label="SAVE" onClick={event => savePayment(event)} style={{float: 'right'}} />
				</div>

			</form>				
		</div>
	)

}

export default EditPayment;