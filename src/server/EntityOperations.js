import {saveData} from './firebase'


// ***** Person Handling ***** //
export const insertPerson = (person, navTo) => {
	saveData('post', 'persons', person,
	(personId) => {
		person.id = personId;
		if(person.customer !== -1){
			saveData('PATCH', 'customers/' + person.customer + "/persons", {[personId]: personId})
			navTo('customer', person.customer);
		} else{
			navTo('person', personId);
		}
	})
	console.log('inserted', person);
}

export const updatePerson = (person, navTo) => {
	saveData('PATCH','persons/' + person.id, person, navTo);
	
	console.log( 'update', person);
}


// ***** Customer Handling ***** //
export const insertCustomer = (customer, navTo) => {
	saveData('post', 'customers', customer, 
		(customerId) => {
			saveData('PATCH', 'persons/' + customer.persons[0], {customer: customerId})
			navTo('customer', customerId);
		}
	);

	navTo()
	console.log('inserted', customer);
}

export const updateCustomer = (customer, func1, func2) => {
	saveData('PATCH','customers/' + customer.id, customer, func1, func2)

	console.log( 'update', customer);
}


// ***** Lesson Handling ***** //
export const insertLesson = (lesson, customerId, navTo, setIsUpdated, touchUpdatedLessons) => {
	saveData('POST', 'customers/' + customerId + '/lessons/', lesson, 
		(lessonId) => {
			saveData('PATCH', 'persons/' + lesson.person + '/lessons', {[lessonId]: lesson.charge}, () => {
				setIsUpdated(true);
				lesson.id = lessonId;
				updateLessonStatus(lesson.id, customerId, touchUpdatedLessons);			
				console.log('inserted', lesson);
				navTo('lessons');
			})

		}
	);

}

export const updateLesson = (lesson, customerId, navTo, setIsUpdated, touchUpdatedLessons) => {
	saveData('PATCH', 'customers/' + customerId + '/lessons/' + lesson.id, lesson,
	(lessonId) => {
		saveData('PATCH', 'persons/' + lesson.person + '/lessons', {[lesson.id]: lesson.charge}, () => {
			setIsUpdated(new Date().getTime());
			console.log('updated', lesson);
			navTo('lessons');
		});

		updateLessonStatus(lesson.id, customerId, touchUpdatedLessons, false);		
	});
}

export const updateLessonStatus = (lessonId, customerId, status, updateLesson) => {
	console.log(lessonId, customerId, status, updateLesson);

	if(status !== null){
		if(status){
			saveData('PATCH', 'upcomingLessons', {[lessonId]: customerId}, null, () => {
				console.log('updated lesson status to ', status);
				if(updateLesson && updateLesson === true)
					saveData('PATCH', 'customers/' + customerId + '/lessons/' + lessonId, {'isDone': false})
			})
		} else {
			saveData('DELETE', 'upcomingLessons/' + lessonId, null, null, () => {
				console.log('updated lesson status to ', status);
				if(updateLesson && updateLesson === true)
					saveData('PATCH', 'customers/' + customerId + '/lessons/' + lessonId , {'isDone': true})
			} )
		}
	}
}

export const markLessonDone = (lesson) =>{
	saveData('DELETE', 'upcomingLessons/' + lesson.id, null, () =>{

	})
}

// ***** Work Handling ***** //
export const insertWork = (lesson, customerId, navTo, setIsUpdated, touchUpdatedLessons) => {
	saveData('POST', 'customers/' + customerId + '/works/', lesson, 
		(lessonId) => {
			saveData('PATCH', 'persons/' + lesson.person + '/works', {[lessonId]: lesson.charge}, () => {
				setIsUpdated(true);
				lesson.id = lessonId;
				updateWorkStatus(lesson.id, customerId, touchUpdatedLessons);			
				console.log('inserted', lesson);
				navTo('works');
			})
		}
	);
}

export const updateWork = (lesson, customerId, navTo, setIsUpdated, touchUpdatedLessons) => {
	saveData('PATCH', 'customers/' + customerId + '/works/' + lesson.id, lesson,
	(lessonId) => {
		saveData('PATCH', 'persons/' + lesson.person + '/works', {[lesson.id]: lesson.charge}, () => {
			setIsUpdated(new Date().getTime());
			console.log('updated', lesson);
			navTo('works');
		});

		updateWorkStatus(lesson.id, customerId, touchUpdatedLessons, false);		
	});
}

export const updateWorkStatus = (lessonId, customerId, status, updateLesson) => {
	console.log(lessonId, customerId, status, updateLesson);

	if(status !== null){
		if(status){
			saveData('PATCH', 'upcomingWorks', {[lessonId]: customerId}, null, () => {
				console.log('updated work status to ', status);
				if(updateLesson && updateLesson === true)
					saveData('PATCH', 'customers/' + customerId + '/lessons/' + lessonId, {'isDone': false})
			})
		} else {
			saveData('DELETE', 'upcomingWorks/' + lessonId, null, null, () => {
				console.log('updated work status to ', status);
				if(updateLesson && updateLesson === true)
					saveData('PATCH', 'customers/' + customerId + '/lessons/' + lessonId , {'isDone': true})
			} )
		}
	}
}


// ***** Payment Handling ***** //
export const insertPayment = (payment, navTo, setIsUpdated) => {
	saveData('post', 'payments', payment, 
		(paymentId) => {
			saveData('PATCH', 'customers/' + payment.customer + '/payments', {[paymentId]: +payment.amount})
			saveData('PATCH', 'customers/' + payment.customer +'/lessons/' + payment.lessons, {payment: paymentId})
			if(setIsUpdated) setIsUpdated(new Date().getTime());
			console.log('inserted', payment);
			navTo('payments');
		}
	);

}

export const updatePayment = (payment, navTo, setIsUpdated) => {
	saveData('put','payments/' + payment.id, payment, null, () => {
		saveData('PATCH', 'customers/' + payment.customer + '/payments', {[payment.id]: +payment.amount}, null, () => {
			if(setIsUpdated) setIsUpdated(new Date().getTime());
			navTo('payments');
			console.log( 'update', payment);
		})
	});

}


// ***** Person Log Handling ***** //
export const insertPersonLog = (entry, personId, navTo, func) => {
	saveData('POST', `persons/${personId}/log`, entry, null, func);
	console.log('inserted', entry, personId);
	navTo();
}

