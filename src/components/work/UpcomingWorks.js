import React, {useState, useEffect, useCallback} from 'react';
import {getEntities, getEntity} from '../../server/firebase';
import Work from './Work';
import Spinner from '../gui/Spinner';
import Toggle from '../gui/Toggle';
import Hoc from '../gui/Hoc';
import './UpcomingWorks.css'

const now = new Date();

const UpcomingWorks = ({clickHandler, editLesson, changeStatus, doubleClickHandler, navToPayment}) =>{
	const [lessons, setLessons] = useState([]);
	const [isReady, setIsReady] = useState(false);
	const [showPastUndone, setShowPastUndone] = useState(false);

	const getPerson = useCallback( (token, pos, lessonsArr) => {
		const personId = lessonsArr[pos].person
		getEntity('persons', token, personId + '/fullname')
			.then(fullname => {
				lessonsArr[pos].fullname = fullname;
				
				if(pos < lessonsArr.length-1){
					getPerson(token, pos + 1, lessonsArr)
				} else {
					lessonsArr.sort( (a, b) => a.startDatetime > b.startDatetime? 1 : -1)
					setLessons(lessonsArr);
					setIsReady(true)
				}
			})
	}, [])

	const fetchLessons = useCallback( (token, keys, lessonsArr) => {
		const pair = keys.pop()
		getEntity('customers', token, pair.customerId + '/works/' + pair.lessonId)
		.then(lesson => {
			console.log(lesson)
			lesson.customerId = pair.customerId;
			lesson.id = pair.lessonId;
			lessonsArr.push(lesson)
			if(keys.length === 0 ){
				getPerson(token, 0, lessonsArr);
				return;
			}
			fetchLessons(token, keys, lessonsArr);
		})
			
	}, [getPerson])

	useEffect(() => {

		async function fetchData () {
			const theToken = localStorage.getItem('idToken');
			const keys = [];
			const lessonsArr = [];
			getEntities('upcomingWorks', theToken)
			.then(lessons => {
				for(let k in lessons){
					keys.push({lessonId: k, customerId: lessons[k]})
				}
				
				if(keys.length > 0){
					fetchLessons(theToken, keys, lessonsArr);
				} else{
					setIsReady(true)
				}
			})
		}

		fetchData()
					
	}, [fetchLessons, isReady])

	const changeStatusHandler = (...args) => {
		setIsReady(false)
		changeStatus(...args)
	}
	
	const filterByDate = (lesson) => {
		const date = lesson.startDatetime.split(' ')[0] + "T23:59:00";
		if(showPastUndone === true){
			return new Date(date) < now
		} else {
			return new Date(date) >= now
		}
	}
	return(
		<div>
			<div className="UpcommingLessons">NEXT LESSONS</div>
			<div className="UpcommingLessonsRow">
				<Toggle 
					name={['SHOW FUTURE LESSONS', 'SHOW PAST LESSONS']} 
					title={'Toggle undone past lessons'} 
					value={showPastUndone}
					clickHandler={() => setShowPastUndone(prev => !prev)}/>
			</div>
			<Hoc height='20vh' overflowY='auto'>
				{!isReady && <Spinner />}
				{isReady && lessons
						.filter(filterByDate)
						.map(p => <Work 
						key={p.id} 
						lesson={p} 
						showPayment={false}
						clickHandler={clickHandler} 
						changeStatus={changeStatusHandler}
						editLesson={editLesson}
						doubleClickHandler={doubleClickHandler}
						/>)
					}	
			</Hoc>	
		</div>	
	)
}

export default UpcomingWorks;