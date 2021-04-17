import React, {useState, useEffect, useCallback, useRef} from 'react';
import WorkCrm from '../containers/WorkCrm';
import {useHistory} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {loadReference, loadPersons, loadCustomers, loadData, startLoading, stopLoading} from '../store/actions' 
import {login} from '../store/actions' 
import TitleField from './gui/TitleField';
import Input from './gui/Input';
import Button from './gui/Button';

// const AuthCtx = React.createContext();

const Login = () =>{
	const dispatch = useDispatch();
	const auth = useSelector( state => state.workcrm.auth);
	const isLoading = useSelector( state => state.workcrm.isLoading);

	const [email, setEmail] = useState(process.env.REACT_APP_FB_DEFAULT_EMAIL);
	const [password, setPassword] = useState(process.env.REACT_APP_FB_DEFAULT_PASSWORD);
	const [logoutTime, setLogoutTime] = useState(0);

	const logoutTimer = useRef(null);
	
	const history = useHistory();

	const logout = useCallback(() => {
		const idTokenStamp = localStorage.getItem('idTokenStamp');
		const tokenDate = new Date(idTokenStamp).getTime();
		const now = new Date();
		const timelength = tokenDate - now.getTime();

		console.log(
			'Setting timeout to ', 
			Math.floor(timelength/1000/60), 
			' minutes ',
			 now.getHours() + 1 + ':' + now.getMinutes());

		setLogoutTime(tokenDate);

		const timeout = setTimeout( () => {
			if(logoutTimer.current){
				clearTimeout(logoutTimer.current)
				logoutTimer.current = null;
			}
			const now = new Date().toISOString()
			console.log('auto logout', now);
		//	setIsAuth(false);

			history.push('/workcrm');
		}, timelength);

		logoutTimer.current = timeout;

	}, [history]);

	const onLogin = () => {
		localStorage.removeItem('idToken');
		dispatch(startLoading())
		dispatch(login(email, password))		

	}

	//  for auto login

	const authStatus = useCallback(() => {
		const idTokenStamp = localStorage.getItem('idTokenStamp');
		const tokenDate = new Date(idTokenStamp);
		const now = new Date();
		
		if(idTokenStamp && now.getTime() < tokenDate.getTime()){
			//setIsAuth(true)
			setLogoutTime(tokenDate.getTime());
		}	else {

			console.log(tokenDate.toISOString() || 'no token date', 'NOT AUTH');
		}		
	}, [])



	useEffect( () => {
		console.log('in useeffect with ', auth.isAuth);
		const idTokenStamp = localStorage.getItem('idTokenStamp');
		const tokenDate = new Date(idTokenStamp);
		const now = new Date();
		
		if(idTokenStamp && now.getTime() < tokenDate.getTime()){
			//setIsAuth(true)
			dispatch(startLoading())
			dispatch(loadData())
			setLogoutTime(tokenDate.getTime());
		}	else if(auth.isAuth === true){			
			console.log('loading data');
			dispatch(loadData());
		}
	},[])

	console.log('isAuth isLoading', auth.isAuth, isLoading);
	if(auth.isAuth === true && isLoading === false){
		return <WorkCrm isAuthed={true} logoutTime={logoutTime}/>
	}
	return(
		<span>
			<div style={{margin: '5%', display: 'flex', flexDirection: 'row', justifyContent: 'space-around'}}>
				<div style={{width: '50%', margin: '10px'}}>
					<Input label="Email" size={15} type="email" value={email} onChange={e => setEmail(e.target.value)} />
					<Input label="Password" size={15} type="password" value={password} onChange={e => setPassword(e.target.value)} />
				</div>
				<div>
					<div style={{margin: '8px'}}>  </div>
					<TitleField value={auth.isAuth ? 'AUTHENTICATED' : 'NOT AUTHENTICATED'} />
					<div style={{padding: '2px'}}></div>
					<Button label="AUTHENTICATE" onClick={onLogin}/>
				</div>
			</div>
		</span>
	)
}

export default Login;
