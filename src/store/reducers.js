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
		case actTypes.LOADING:
			return {...initialState, isLoading: true}
		case(actTypes.auth.LOGIN):
			
			return {...initialState, isLoading: false, auth:action.payload}
			//return updateObject(state, {results: state.results.concat({id: state.results.length, value: action.counter})})
		case(actTypes.auth.LOAD_DATA):
			return updateObject(state, action.payload);
		case(actTypes.auth.LOAD_REFERENCE):
			console.log('actTypes.auth.LOAD_REFERENCE', action.payload);
			return updateObject(state,{isLoading: false, reference:action.payload});
		case(actTypes.contactActions.LOAD):
			console.log('actTypes.contactActions.LOAD', action.payload);
			const personArr = [];
			for (let k in action.payload){
				if(action.payload[k]){
					personArr.push({...action.payload[k], id: k});
				}
			}
			console.log('actTypes.contactActions.LOAD', personArr);
			return updateObject(state, {isLoading: false, persons:personArr});
		default:
			return {...state};
	}
};

export default reducer;