import * as actionTypes from './actionTypes'
import {loginApi, entitiesApi, saveApi} from '../server/firebase';

// **** store

export const startLoading = () => {
	return {type: actionTypes.LOADING_START}
}
export const stopLoading = () => {
	return async dispatch => {
		dispatch({type: actionTypes.LOADING_STOP})
	}
	 
}


export const login =  (email, password) => {	// returns an action
	return async (dispatch) =>{
		const response = await loginApi(email, password);
		if(response.idToken){
			console.log('response.idToken');
			const now = new Date();
			const expirationDate = new Date(now.getTime() + (3600 * 1000) )
			localStorage.setItem('idToken', response.idToken)
			localStorage.setItem('idTokenStamp', expirationDate.toISOString())
			dispatch({type: actionTypes.auth.LOGIN, payload: {...response, isAuth: true}})
		} else{
			console.log('response.idToken', response);
			dispatch({type: actionTypes.auth.LOGIN, payload: {...response, isAuth: false}})
		}

	}
};

export const loadData = () => {
	//reference persons customers
	return async dispatch =>{
		const token = localStorage.getItem('idToken');
		if(!token){
			alert('no token')
		}else{
			console.log(token);
		}
		const reference = await entitiesApi('reference', token);
		dispatch({type: actionTypes.auth.LOAD_REFERENCE, payload: reference})
		const persons = await entitiesApi('persons', token);
		dispatch({type: actionTypes.contactActions.LOAD, payload: persons})
		const customers = await entitiesApi('customers', token);
		dispatch({type: actionTypes.customerActions.LOAD, payload: customers})
		dispatch(stopLoading())
	}
}
export const loadReference = (entity) => {
	return async dispatch =>{
		const token = localStorage.getItem('idToken');
		if(!token){
			alert('no token')
		}else{
			console.log(token);
		}
		const reference = await entitiesApi(entity, token);
		console.log(reference);
		dispatch({type: actionTypes.auth.LOAD_REFERENCE, payload: reference})
	
	}
}
export const loadPersons = (entity) => {
	return async dispatch =>{
		const token = localStorage.getItem('idToken');
		const response = await entitiesApi(entity, token);
		dispatch({type: actionTypes.contactActions.LOAD, payload: response})
	}
}
export const loadCustomers = (entity) => {
	return async dispatch =>{
		const token = localStorage.getItem('idToken');
		const response = await entitiesApi(entity, token);
		dispatch({type: actionTypes.customerActions.LOAD, payload: response})
	}
}

export const insertCustomer = async (customer, navTo) => {
	return async dispatch => {
		const customerId = await saveApi('post', 'customers', customer);
		await saveApi('PATCH', 'persons/' + customer.persons[0], {customer: customerId})
		navTo('customer', customerId);

		console.log('inserted', customer);
		dispatch({type: actionTypes.customerActions.ADD, payload: customer})
		if(navTo){
			navTo()
		}
	}

}

// export const store = (cnt) => {	// returns an action
// 	return (dispatch) =>{

// 		setTimeout(()=>{
// 						dispatch(callBackStore(cnt))
// 		}, 2000);		
// 	}
// };

// export const del = (id) => {	// returns an action
// 	return {
// 		type: actionTypes.DELETE,
// 		id: id
// 	}
// };