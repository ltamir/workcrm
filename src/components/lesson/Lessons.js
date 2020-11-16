import React, {useState, useEffect} from 'react';
import Lesson from './Lesson';
import Spinner from '../gui/Spinner';
import * as utils from '../gui/utils';

const Lessons = ({lessons, clickHandler, editLesson, doubleClickHandler, navToPayment}) =>{
	const [isReady, setIsReady] = useState(false);
	const [lessonsToRender, setLessonsToRender] = useState([]);


	useEffect( () => {
		const lessonsArr = Object.entries(lessons)
			.map(([p, v]) => {return {...v, id: p} })
			.sort( (l1, l2)=> l1.startDatetime < l2.startDatetime ? 1 : -1);
		
		setIsReady(prev => {
			setLessonsToRender(lessonsArr);
			return true;
		})
		
	}, [lessons])


	
	return(
		<div style={utils.calculateHeight(lessonsToRender.length)}>
			{!isReady && <Spinner />}
			{isReady && lessonsToRender.map(lesson => <Lesson 
				key={lesson.id} 
				lesson={lesson} 
				showPayment={true}
				clickHandler={clickHandler} 
				editLesson={editLesson}
				doubleClickHandler={doubleClickHandler}
				navToPayment={navToPayment}/>
			)}	
		</div>		
	)
}

export default Lessons;