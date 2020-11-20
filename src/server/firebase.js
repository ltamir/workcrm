
const url = process.env.REACT_APP_FB_URL;

export const signIn = async (email, password, logout) => {
	const signinUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.REACT_APP_FB_APP_KEY}`;
	const payLoad = {
		email,
		password,
		returnSecureToken: true
	}

	fetch(signinUrl, {
		method: 'post',
		headers:{'Content-Type': 'application/json'},
		body: JSON.stringify(payLoad)
	})
	.then(response => {
		if(!response.ok){
			console.log(response);
		}
		return response.json();
	})
	.then(response => {
		console.log(response);
		//displayName
		//expiresIn
		if(response.idToken){
			const now = new Date();
			const expirationDate = new Date(now.getTime() + (3600 * 1000) )
			localStorage.setItem('idToken', response.idToken)
			localStorage.setItem('idTokenStamp', expirationDate.toISOString())
			logout()
		}
	})
	.catch( e => console.log('error ', e))
}


export const getPersonTypes = (idToken, setter) => {

	fetch(`${url}/reference/personType.json?auth=${idToken}`)
	.then(response => response.json())
	.then(response => {
		const arr = [];
		for (let k in response){
			arr.push({id: +k, ...response[k]})			
		}
		setter([...arr])
	})
	
}	

export const getPerson = (idToken, id) => {
	return fetch(`${url}/persons/${id}.json?auth=${idToken}`)
	.then(response => response.json())	
}

export const getEntity = (entity, idToken, id) => {
	return fetch(`${url}/${entity}/${id}.json?auth=${idToken}`)
	.then(response => response.json())		
}

export const getEntities = (entity, idToken) => {
	return fetch(`${url}/${entity}.json?auth=${idToken}`)
	.then(response => {
		if(response.status > 200)
			console.log(response);
		return response.json()
	})
	.catch(err => {
		console.log(err);
	})	
}


export const saveData = async (method, entity, payload, cb, func) => {
	const idToken = localStorage.getItem('idToken');

	fetch(`${url}/${entity}.json?auth=${idToken}`, {
		method: method,
		headers:{
			'Content-Type': 'application/json', 
			'Accept': 'application/json'
		},
		body: JSON.stringify(payload)
	})
	.then(response => response.json())
	.then(response => {
		if(cb){
			cb(response.name);
		}
		if(func){
			func()
		}
	});
}

