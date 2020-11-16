import React, {useState, useEffect, useCallback} from 'react';
import {getEntity} from '../../server/firebase';
import Payment from './Payment';
import Spinner from '../gui/Spinner';
import * as utils from '../gui/utils';

const Payments = ({paymentIds,  persons, editPayment, navToPayment}) =>{
	const [payments, setPayments] = useState([]);
	const [isReady, setIsReady] = useState(false);


	const fetchPayments = useCallback((theToken, keys, paymentsArr) => {
		
		getEntity('payments', theToken, keys[0])
		.then(payment => {
			payment.id = keys[0];
			paymentsArr.push(payment)
			keys.shift();
			if(keys.length === 0){
				paymentsArr.sort( (a, b) => a.datetime < b.datetime ? 1 : -1)
				setPayments(paymentsArr);
				setIsReady(true);
				return;
			}
			fetchPayments(theToken, keys, paymentsArr);
		})
	}, [])

	useEffect(() => {
		if(paymentIds){
			console.log('Payments CTOR');

			const theToken = localStorage.getItem('idToken');
			const keys = [];
			const paymentsArr = [];
			for(let p in paymentIds){
				keys.push(p)
			}
			fetchPayments(theToken, keys, paymentsArr)	
		} else {
			setIsReady(true);
		}
	}, [paymentIds, fetchPayments])


	return(
		<div style={utils.calculateHeight(!isReady? 3 :  payments.length)}>
			{!isReady && <Spinner />}
			{isReady && payments.map(p => <Payment 
				key={p.id} 
				payment={p} 
				person={persons.find(prs => prs.id === p.payer)}
				editPayment={editPayment}
				navToPayment={navToPayment}/>)}	
		</div>		
	)
}

export default Payments;