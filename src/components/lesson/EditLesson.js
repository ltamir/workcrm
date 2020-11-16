import React, {useEffect, useState} from 'react';
import {getEntities} from '../../server/firebase'
import Input from '../gui/Input';
import TextArea from '../gui/TextArea';
import Select from '../gui/Select';
import Button from '../gui/Button';
import './EditLesson.css'



const EditLesson = ({match, location, persons, onSaveLesson, setIsUpdated, navTo}) =>{
	const [title, SetTitle] = useState('');
	const [startDate, setStartDate] = useState('');
	const [startTime, setStartTime] = useState('');
	const [person, setPerson] = useState(0);
	const [charge, setCharge] = useState(0);
	const [payment, setPayment] = useState(-1);
	const [duration, setDuration] = useState(1);
	const [isDone, setIsDone] = useState(false);
	const [notes, setNotes] = useState('');
	const [subjects, setSubjects] = useState(0);
	const [id, setId] = useState(-1);

	const [availableSubjects, setAvailableSubjects] = useState([]);


	const setLesson = lesson => {
		SetTitle(lesson.title);
		setStartDate(lesson.startDatetime.split(" ")[0])
		setStartTime(lesson.startDatetime.split(" ")[1]);
		setDuration(lesson.duration);
		setPerson(lesson.person);
		setCharge(+lesson.charge);
		setPayment(lesson.payment);
		setIsDone(lesson.isDone);
		setNotes(lesson.notes);
		setSubjects(lesson.subjects);
		setId(lesson.id);
	}

	useEffect(() => {
		const theToken = localStorage.getItem('idToken');
		getEntities('reference/subjects', theToken)
		.then(response => {
			const arr = [];
			for(let k in response){
				arr.push({id: k, title: response[k]})
			}
			setAvailableSubjects([...arr])
				
			if(location && location.state.lesson){
				console.log("EditLesson CTOR");
				setLesson(location.state.lesson);
			} else {
				const now = new Date().toISOString().replace('T', ' ').substr(0, 16)
				const lesson = {id: -1, title: '', startDatetime: now, 
					duration: 1, person: persons[0].id, isDone: false, charge: 0.00, payment: -1, 
					subjects: arr[0].id, notes: ''}	
				setLesson(lesson);
			}
		})

	}, [match, location, persons])


	const saveLesson = () => {
		const touchUpdatedLessons = id !== -1 && location.state.lesson.isDone !== isDone ? !isDone : id === -1 ? true : null;
		onSaveLesson({id, title, startDatetime: startDate + " " + startTime, duration, person, isDone, charge, payment, subjects, notes}, navTo, setIsUpdated, touchUpdatedLessons)
	}

	return(
		<div className="EditLesson">
			<form>
				<div className="EditLessonRow">
					<Input 
						label="Title" 
						value={title} 
						size="10"
						onChange={e => SetTitle(e.target.value)} 
						title="Title" />
					<Input 
						label="Date" 
						type="date" 
						value={startDate} 
						onChange={e => setStartDate(e.target.value)} 
						title="Start date"/>
					<Input 
						label="Time"
						type="time" 
						value={startTime} 
						onChange={e => setStartTime(e.target.value)} 
						Title="Start time"/>
					<Select 
						label="Subjects"
						value={subjects}
						onChange={e => setSubjects(e.target.value)}
						optionsArr={availableSubjects.length && availableSubjects.map(sub =>{
							return {id: sub.id, name: sub.id}
						})} />
					<Select 
						label="Student" 
						value={person} 
						onChange={e => setPerson(e.target.value)}
						optionsArr={persons.map(p => { return {id: p.id, name: p.fullname}} )}/>	
					<Input 
						label="Duration"
						title="Duration in hours"
						size="4"
						type="number" 
						value={duration} onChange={e => setDuration(e.target.value)} />													
					<Input 
						label="Charge"
						size="4"
						type="number" 
						value={charge} onChange={e => setCharge(+e.target.value)} />	
					<Input 
						label="Done"
						title="Was lesson done"
						type="checkbox" 
						checked={isDone} 
						value={isDone} 
						onChange={e => setIsDone(e.target.checked)}/>	
				</div>
				<div className="EditLessonRow">
					<TextArea label="Notes" cols="80" value={notes} onChange={e => setNotes(e.target.value)}/>
					<Button label="SAVE" onClick={saveLesson}/>
				</div>
			</form>

		</div>
	)

}

export default EditLesson;