import React, {useState, useEffect, useCallback, useRef} from 'react';
import WorkCrm from '../containers/WorkCrm';
import {signIn} from '../server/firebase';
import {useHistory} from 'react-router-dom';
import TitleField from './gui/TitleField';
import Input from './gui/Input';
import Button from './gui/Button';

const Login = () =>{
	const [email, setEmail] = useState(process.env.REACT_APP_FB_DEFAULT_EMAIL);
	const [password, setPassword] = useState(process.env.REACT_APP_FB_DEFAULT_PASSWORD);
	const [isAuth, setIsAuth] = useState(false);
	const [logoutTime, setLogoutTime] = useState(0);

	const logoutTimer = useRef(null);
	
	const history = useHistory();

	const logout = useCallback(() => {
		setIsAuth(true);
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
			setIsAuth(false);

			history.push('/workcrm');
		}, timelength);

		logoutTimer.current = timeout;

	}, [history]);

	const login = () => {
		localStorage.removeItem('idToken');
		signIn(email, password, logout);
		
	}

	//  for auto login

	const authStatus = useCallback(() => {
		const idTokenStamp = localStorage.getItem('idTokenStamp');
		const tokenDate = new Date(idTokenStamp);
		const now = new Date();
		
		if(idTokenStamp && now.getTime() < tokenDate.getTime()){
			setIsAuth(true)
			setLogoutTime(tokenDate.getTime());
			console.log(tokenDate.toISOString(), 'AUTH');
		}	else {

			console.log(tokenDate.toISOString() || 'no token date', 'NOT AUTH');
		}		
	}, [])

	useEffect( () => {
		authStatus();
	}, [isAuth])


	return(
		<span>
			{isAuth && <WorkCrm isAuthed={true} logoutTime={logoutTime}/>}
			{!isAuth && <div style={{margin: '15%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-start'}}>
				<div style={{width: '50%', margin: '10px'}}>
						<Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
						<Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
					</div>
					<div style={{width: '50%', margin: '10px'}}>
						<div style={{margin: '8px'}}>  </div>
						<TitleField value={isAuth ? 'AUTHENTICATED' : 'NOT AUTHENTICATED'} />
						<Button label="AUTHENTICATE" onClick={login}/>
					</div>
				</div>}
		</span>
	)
}

export default Login;
