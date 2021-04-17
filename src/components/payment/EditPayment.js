import React, {useEffect, useState} from 'react';
import {getEntity} from '../../server/firebase'
import {NavLink, useParams} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
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

const EditPayment = ({location, onSavePayment, setIsUpdated, navTo}) =>{
	const params = useParams();
	const customer = useSelector(state => state.workcrm.customers.find(c => c.id === params.customerId));
	const customerPersons = [];
	for(let pid in customer.persons){
		customerPersons.push(customer.persons[pid]);
	}
	const payment = useSelector( state => params.paymentId !== '0' ? state.workcrm.payments.find(p => p.id === params.paymentId) : null);
	const lesson = customer[payment.lessons];
	const persons = useSelector(state => state.workcrm.persons.filter(p => customerPersons.includes(p.id)))
	const payChannels = useSelector(state=> state.workcrm.reference.payChannel)

	console.log('payChannels', persons);

	const [date, setDate] = useState(defaultDate);
	const [time, setTime] = useState(defaultTime);
	const [payer, setPayer] = useState('');
	const [payChannel, setPayChannel] = useState({id:''});
	const [amount, setAmount] = useState(0.0);
	const [recipt, setRecipt] = useState('');
	const [lessons, setLessons] = useState('');
	const [id, setId] = useState(-1);

	const setPayment = payment => {
		setDate(payment.datetime.split(" ")[0])
		setTime(payment.datetime.split(" ")[1]);
		setPayer(payment.payer);
		setPayChannel(payment.payChannel);
		setAmount(+(payment.amount));
		setRecipt(payment.recipt || '');
		setLessons(payment.lessons);
		setId(payment.id);
	}

	useEffect(() => {

		if(params.paymentId !== '0'){
			console.log("EditPayment CTOR with id", params.paymentId, payment);
			setPayment(payment);
		} else {
			const lessonDatetime = location.state.lesson.startDatetime;
			const payment = {
				datetime: lessonDatetime, 
				payer: lesson.person,
				lessons: lesson.id, 
				amount: +(lesson.charge),
				payChannel: {...payChannels['Bit'], id: 'Bit'}
			}
			setPayment(payment)
		} 
		
	},[persons, payChannels])

	const savePayment = event => {
		event.preventDefault();
		console.log(lesson);
		// console.log({id, datetime: date +  ' ' + time, customer, payer, amount:+amount, payChannel, lessons});
		const workType = lesson.workType && lesson.workType === 'work' ? true : false;
		onSavePayment({id, datetime: date +  ' ' + time, customer:customer.id, payer, amount:+amount, recipt, payChannel, lessons}, navTo, setIsUpdated, workType)
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
				<Input label="Recipt ID" value={recipt} onChange={e => setRecipt(e.target.value)} />
				<Button label="SAVE" onClick={event => savePayment(event)} style={{float: 'right'}} />
				</div>

			</form>				
		</div>
	)

}

export default EditPayment;