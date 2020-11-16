export const reference = {
	personType:[{id: 1, name: 'student'}, {id: 2, name: 'sybling'}],
	subjects:[{id: 1, name: 'Java'}, {id: 2, name: 'React'}, {id: 3, name: 'Redux'}, {id: 4, name: 'SQL'}],
	payChannel: [{id: 1, name: 'Payme'}, {id: 2, name: 'Paypal'}, {id: 3, name: 'PepperPay'}, {id: 4, name: 'Bit'}],
}

export const database = {
	customers: [
		{id: 1, title: 'Uri Regev SQL', persons:[1], balance: 0.0, profit: 80.00},
		{id: 2, title: 'cust 2', persons:[2], balance: 0.0},
		{id: 3, title: 'cust 3', persons:[3,4], balance: 0.0}
	],
	persons: [
		{id: 1, customer: 1, fullName: 'Uri Regev', email:'uri.regev.gmail.com', phone:'045123456', notes:'Needs to go over SQL exam',personType:1},
		{id: 2, customer: 2, fullName: 'Rinat Greenberg', email:'gr.@mail.com', phone:'0521234567', notes:'needs BA',personType:1},
		{id: 3, customer: 3, fullName: 'aaa bbb', email:'a.b', phone:'', notes:'',personType:1},
		{id: 4, customer: 3, fullName: 'aaa sss', email:'', phone:'', notes:'',personType:2},
	],
	lessons: [
		{id: 1, person: 1, title: 'SQL exam review', startDatetime: '2020-10-18 13:00:00', duration: 1, isDone: true, notes:'', subjects:[4]},
		{id: 2, person: 2, title: 'Java graphs', startDatetime: '2020-10-20 20:30:00', duration: 1, isDone: false, notes:'', subjects:[1]}
	],
	payments: [
		{id: 1, customer: 1, payer: 1, lessons: [1], payChannel: 1, amount: 80}
	]
}

export const initialState = {
	customers: [],
	persons:[],
	payments:[],
	customer: {id: -1, title: '', profit: 0.0, balance: 0.0},
	person:{id: 0, fullname: '', email:'', phone:'', notes:'',personType:1},
	lesson:null,
	payment:null,
}