import * as actTypes from './actionTypes';
import {updateObject} from './utility'

export const initialState = {
	customers: [],
	persons:[],
	payments:[],
	reference:[],
	auth:{isAuth: false},
	isLoading: false
}

const reducer = (state = initialState, action) => {
	switch(action.type){
		case actTypes.LOADING_START:
			return {...state, isLoading: true}
		case actTypes.LOADING_STOP:
			return {...state, isLoading: false}
		case(actTypes.auth.USE_TOKEN):
			return {...state, auth:action.payload}
		case(actTypes.auth.LOGIN):
			return {...state, auth:action.payload}
		case(actTypes.auth.LOAD_DATA):
			return updateObject(state, action.payload);
		case(actTypes.auth.LOAD_REFERENCE):
			return updateObject(state,{reference:action.payload});
		case(actTypes.personActions.LOAD):
			const personArr = [];
			for (let k in action.payload){
				if(action.payload[k]){
					personArr.push({...action.payload[k], id: k});
				}
			}
			return updateObject(state, {persons:personArr});
		case(actTypes.customerActions.LOAD):
			const customerArr = [];
			for (let k in action.payload){
				if(action.payload[k]){
					customerArr.push({...action.payload[k], id: k});
				}
			}
			return updateObject(state, {customers:customerArr});
		case(actTypes.paymentActions.LOAD):
			console.log('action.payload', action.payload)
			const paymentsLoad = [];
			for (let k in action.payload){
				if(action.payload[k]){
					paymentsLoad.push({...action.payload[k], id: k});
				}
			}
			return updateObject(state, {payments:paymentsLoad});
			
		case(actTypes.customerActions.ADD):
			return updateObject(state, {customers:[...state.customers, action.payload]});
		case(actTypes.personActions.UPDATE):
			const persons = state.persons.filter(p => p.id !== action.payload.id);
			persons.push(action.payload)
			return updateObject(state, persons);
		case(actTypes.workActions.UPDATE):
			const updateWorkcustomers = state.customers.filter(p => p.id !== action.payload.customerId);
			const updateWorkCustomer = state.customers.find(p => p.id === action.payload.customerId);
			console.log(updateWorkCustomer);

			return state;
		default:
			return {...state};
	}
};

export default reducer;