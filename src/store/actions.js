import * as actionTypes from './actionTypes'
import {loginApi, entitiesApi} from '../server/firebase';

// **** store


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

export const loadReference = (entity) => {
	return async dispatch =>{
		const token = localStorage.getItem('idToken');
		if(!token){
			alert('no token')
		}else{
			console.log(token);
		}
		const response = await entitiesApi(entity, token);
		console.log(response);
		dispatch({type: actionTypes.auth.LOAD_REFERENCE, payload: response})
	}
}
export const loadPersons = (entity) => {
	return async dispatch =>{
		const token = localStorage.getItem('idToken');
		const response = await entitiesApi(entity, token);
		dispatch({type: actionTypes.contactActions.LOAD, payload: response})
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