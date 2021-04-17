import React, {useState, useEffect, useCallback} from 'react';
import {getEntity} from '../../server/firebase';
import {useParams} from 'react-router-dom'
import {useSelector} from 'react-redux'
import Payment from './Payment';
import Spinner from '../gui/Spinner';
import * as utils from '../gui/utils';

const Payments = ({ persons, editPayment, navToPayment}) =>{
	const params = useParams();
	const customer = useSelector(state => state.workcrm.customers.find(c => c.id === params.customerId));

	const paymentss = useSelector(state => state.workcrm.payments.filter(p =>  customer.payments[p.id]))
	const personss = useSelector(state => state.workcrm.persons)
	const [payments, setPayments] = useState(paymentss);

	return(
		<div style={utils.calculateHeight(payments.length)}>
			
			{payments.map(p => <Payment 
				key={p.id} 
				payment={p} 
				person={personss.find(prs => prs.id === p.payer)}
				/>
			
				)}	
		</div>		
	)
}

export default Payments;