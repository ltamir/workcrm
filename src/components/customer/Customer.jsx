import React from 'react';
import './Customer.css'
import Field from '../gui/Field';
import Button from '../gui/Button';


const Customer = ({customer, leadingPerson, editHandler, setShowCustomerEdit}) =>{
	
	const calculatePayments = () => {
		let profit = 0;
		customer.payments && Object.entries(customer.payments).forEach( el => profit += el[1]);
		return profit === 0? '0.00' : profit;
	}
	
	const calculateBalance = () => {
		let balance = calculatePayments() - customer.commission;
		return balance === 0? '0.00' : balance;
	}

	const calculateCharges = () => {
		let charge = 0;
		customer.lessons && Object.entries(customer.lessons).forEach( el => charge += +el[1].isDone? +el[1].charge : 0);
		return charge === 0? '0.00' : charge;
	}

	const calculateDebts = () =>{
		return calculatePayments() - calculateCharges();
	}

	return(
		<div className="Customer">
			<div className="CustomerRow">
				{/* {leadingPerson && leadingPerson.fullname !== customer.title && <Field value={customer.title} />} */}
				<Field name="Lessons" value={customer.lessons? Object.entries(customer.lessons).length : 0} />
				<Field name="Charges" value={calculateCharges()} />
				<Field name="Payments" value={calculatePayments()} />
				<Field name="Debts" value={calculateDebts()} />
				<Field name="Balance" value={calculateBalance()} />
				<Field value=" | " />
				<Field name="Rate" value={customer.chargeRate} />
				<Field name="Commission" value={customer.commission} />
				<Field value={customer.isActive? 'Active' : 'Inactive'} />
				<span style={{marginRight: '8px', marginLeft: 'auto'}}> 
					<Button label="Edit" onClick={() => setShowCustomerEdit(prev => !prev)}/>
				</span>
			</div>
		</div>
	)
}

export default Customer;