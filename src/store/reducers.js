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
			console.log('start loading');
			return {...state, isLoading: true}
		case actTypes.LOADING_STOP:
			console.log('stop loading');
			return {...state, isLoading: false}
		case(actTypes.auth.LOGIN):
			return {...state, auth:action.payload}
		case(actTypes.auth.LOAD_DATA):
			return updateObject(state, action.payload);
		case(actTypes.auth.LOAD_REFERENCE):
			return updateObject(state,{reference:action.payload});
		case(actTypes.contactActions.LOAD):
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
		case(actTypes.customerActions.ADD):
			return updateObject(state, {customers:[...state.customers, action.payload]});
		default:
			return {...state};
	}
};

export default reducer;