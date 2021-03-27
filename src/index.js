import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Login from './components/Login';
import { BrowserRouter } from 'react-router-dom'
import thunk from 'redux-thunk'
import { createStore, combineReducers, applyMiddleware, compose} from 'redux'
import { Provider } from 'react-redux';
import reducer from './store/reducers'
import reportWebVitals from './reportWebVitals';

const rootReducer = combineReducers( {
	workcrm: reducer,
});

const middlewareLogger = store => {
  return next =>{
   return action => {
     console.log('middlewareLogger before nxt', action);
     const result = next(action);
     console.log('middlewareLogger after nxt', store.getState());
     return result;
   }
  }
 };
const reduxDevTool = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(rootReducer, reduxDevTool((applyMiddleware(middlewareLogger, thunk))));

ReactDOM.render(
  <React.StrictMode>
		<BrowserRouter>
      <Provider store={store}><Login /></Provider>
		</BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
