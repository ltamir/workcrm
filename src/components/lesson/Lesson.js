import React from 'react';
import Field from '../gui/Field';
import TitleField from '../gui/TitleField';
import Button from '../gui/Button';
import NotesField from '../gui/NotesField';
import * as utils from '../gui/utils';

import './Lesson.css'

const Lesson = ({lesson, clickHandler, changeStatus, showPayment, editLesson, navToPayment}) =>{

	const paymentNavHandler = () => {
		if(lesson.payment === -1){
			navToPayment(lesson)
		} else {
			navToPayment(lesson, lesson.payment)
		}
	}

	const statusHandler = () => {
		changeStatus(lesson.id, lesson.customerId, lesson.isDone, true)
	}

	return(
	<div 
		className="Lesson" 
		onClick={clickHandler?clickHandler:null} 
		title="Double click to edit Lesson">
		<div className="LessonRow">
			{lesson.fullname && <TitleField value={lesson.fullname} />}
			{lesson.title && <Field name="Title" value={lesson.title} setDir={true}/>}
			<Field name="Date" value={utils.toIsrDate(lesson.startDatetime)} />
			<Field name="Charge" value={lesson.charge} />
			<Field name='Status' value={lesson.isDone? 'Done' : <span title='Click to mark as Done' style={{cursor: 'pointer'}} onClick={statusHandler}>Pending</span>} />

			{showPayment && <div style={{marginLeft: 'auto'}}>
				<Button 
					label={lesson.payment === -1 ? 'Create Payment' : 'View Payment'} 
					title={lesson.payment === -1 ? 'Click to create a Payment' : 'Click to view the Payment'} 
					onClick={paymentNavHandler}/>			
			</div>}
		</div>
		<div className="LessonRow">
			<Field name="Subjects" value={lesson.subjects} />
			<Field name="Duration" value={lesson.duration + " h"} />
			<div style={{marginLeft: 'auto'}}> <Button label='EDIT LESSON' onClick={() => editLesson(lesson)}/></div>
		</div>
		{lesson.notes && <div className="LessonRow">
			<NotesField name="Notes" value={lesson.notes} />
		</div>}		
	</div>
	)
	
}

export default Lesson;