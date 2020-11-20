import React, {useState, useEffect, useCallback} from 'react';
import {getEntities, getEntity} from '../../server/firebase';
import Lesson from './Lesson';
import Spinner from '../gui/Spinner';
import Toggle from '../gui/Toggle';
import './UpcomingLessons.css'

const now = new Date();

const UpcomingLessons = ({clickHandler, editLesson, changeStatus, doubleClickHandler, navToPayment}) =>{
	const [lessons, setLessons] = useState([]);
	const [isReady, setIsReady] = useState(false);
	const [showPastUndone, setShowPastUndone] = useState(false);

	const getPerson = useCallback((token, pos, lessonsArr) => {
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

	const fetchLessons = useCallback((token, keys, lessonsArr) => {
		const pair = keys.pop()
		getEntity('customers', token, pair.customerId + '/lessons/' + pair.lessonId)
		.then(lesson => {
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
			getEntities('upcomingLessons', theToken)
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
		if(showPastUndone === true){
			return new Date(lesson.startDatetime) < now
		} else {
			return new Date(lesson.startDatetime) > now
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
		{console.log(lessons.filter(filterByDate))}
			<div style={{height: '20vh', overflowY:'auto'}}>
				{!isReady && <Spinner />}
				{isReady && lessons
						.filter(l => showPastUndone === true ? new Date(l.startDatetime) < now : new Date(l.startDatetime) > now)
						.map(p => <Lesson 
						key={p.id} 
						lesson={p} 
						showPayment={false}
						clickHandler={clickHandler} 
						changeStatus={changeStatusHandler}
						editLesson={editLesson}
						doubleClickHandler={doubleClickHandler}
						/>)
					}	
			</div>	
		</div>	
	)
}

export default UpcomingLessons;