import React from 'react';
import Field from '../gui/Field';
import Button from '../gui/Button';
import * as utils from '../gui/utils';

import './Payment.css'

const Payment = ({payment, person, editPayment}) =>{

	return(
		<div 
			className="Payment" 
			// onDoubleClick={doubleClickHandler? () => doubleClickHandler(payment.id) :null}
			>
			<div className="PaymentRow">
				<Field name="Date" value={utils.toIsrDate(payment.datetime)} />
				{/* <Field name="Customer" value={payment.customer} /> */}
				<Field name="Payer" value={person.fullname} />
				<Field name="Amount" value={payment.amount} />
				<Field name="Via" value={payment.payChannel.id} />
				{/* <Field name="Lesson" value={payment.lessons} /> */}
				<div style={{marginLeft: 'auto'}}> <Button label='EDIT PAYMENT' onClick={() =>editPayment(null, payment.id)}/></div>
			</div>
		</div>
	)
	
}

export default Payment;