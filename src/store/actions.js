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

export const authToken = () => {
	return (dispatch) => {
		dispatch({type: actionTypes.auth.USE_TOKEN, payload: {isAuth: true}})
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
			dispatch(loadData())
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
		dispatch({type: actionTypes.personActions.LOAD, payload: persons})
		const customers = await entitiesApi('customers', token);
		dispatch({type: actionTypes.customerActions.LOAD, payload: customers})
		const payments = await entitiesApi('payments', token);
		dispatch({type: actionTypes.paymentActions.LOAD, payload: payments})		
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
		const persons = await entitiesApi('persons', token);
		dispatch({type: actionTypes.personActions.LOAD, payload: persons})
	}
}
export const loadCustomers = (entity) => {
	return async dispatch =>{
		const token = localStorage.getItem('idToken');
		const response = await entitiesApi(entity, token);
		dispatch({type: actionTypes.customerActions.LOAD, payload: response})
	}
}

export const insertCustomer =  (customer, person) => {
	return async dispatch => {
		const newCustomer = await saveApi('post', 'customers', customer);
		await saveApi('PATCH', 'persons/' + customer.persons[0], {customer: newCustomer.name})

		console.log('inserted', customer);
		dispatch({type: actionTypes.customerActions.ADD, payload: customer})
		person.customer = newCustomer.name
		dispatch({type: actionTypes.personActions.UPDATE, payload: person})
	}

}
export const updatePerson =  (person) => {
	return async dispatch => {
		await saveApi('PATCH', 'persons/' + person.id, person);
		console.log('updated', person);
		dispatch({type: actionTypes.personActions.UPDATE , payload: person})
	}

}

export const updateLesson = (lesson, customerId, navTo, setIsUpdated, touchUpdatedLessons) => {
	return async dispatch => {
		await saveApi('PATCH', `customers/${customerId}/lessons/lesson.id,`, lesson);
		dispatch({type: actionTypes.workActions.UPDATE , payload: lesson})
	}
	// saveData('PATCH', 'customers/' + customerId + '/lessons/' + lesson.id, lesson,
	// (lessonId) => {
	// 	saveData('PATCH', 'persons/' + lesson.person + '/lessons', {[lesson.id]: lesson.charge}, () => {
	// 		setIsUpdated(new Date().getTime());
	// 		console.log('updated', lesson);
	// 		navTo('lessons');
	// 	});

	// 	//updateLessonStatus(lesson.id, customerId, touchUpdatedLessons, false);		
	// });
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