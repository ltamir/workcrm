import React from 'react';
import {NavLink, useParams} from 'react-router-dom'
import Field from '../gui/Field';
import Button from '../gui/Button';
import * as utils from '../gui/utils';

import './Payment.css'

const Payment = ({payment, person}) =>{
	const params = useParams();

	return(
		<div 
			className="Payment" 
			>
			<div className="PaymentRow">
				<Field name="Date" value={utils.toIsrDate(payment.datetime)} />
				{/* <Field name="Customer" value={payment.customer} /> */}
				<Field name="Payer" value={person.fullname} />
				<Field name="Amount" value={payment.amount} />
				<Field name="Via" value={payment.payChannel.id} />
				{/* <Field name="Lesson" value={payment.lessons} /> */}
				<div style={{marginLeft: 'auto'}} className="Menu"> 
				<NavLink className="ButtonData" to={{pathname: `/workcrm/customers/${params.customerId}/payments/${payment.id}`, state:{isNew: true}}}>EDIT</NavLink>
				</div>
			</div>
		</div>
	)
	
}

export default Payment;