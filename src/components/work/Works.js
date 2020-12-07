import React, {useState, useEffect} from 'react';
import Work from './Work';
import Spinner from '../gui/Spinner';
import * as utils from '../gui/utils';

const Works = ({lessons, clickHandler, customerId, doubleClickHandler, navToPayment}) =>{
	const [isReady, setIsReady] = useState(false);
	const [lessonsToRender, setLessonsToRender] = useState([]);


	useEffect( () => {
		const lessonsArr = Object.entries(lessons)
			.map(([p, v]) => {return {...v, id: p, customerId} })
			.sort( (l1, l2)=> l1.startDatetime < l2.startDatetime ? 1 : -1);
		
		setIsReady(prev => {
			setLessonsToRender(lessonsArr);
			return true;
		})
		
	}, [lessons])


	
	return(
		<div style={utils.calculateHeight(lessonsToRender.length)}>
			{!isReady && <Spinner />}
			{isReady && lessonsToRender.map(lesson => <Work 
				key={lesson.id} 
				lesson={lesson} 
				showPayment={true}
				clickHandler={clickHandler} 
				doubleClickHandler={doubleClickHandler}
				navToPayment={navToPayment}/>
			)}	
		</div>		
	)
}

export default Works;