import {useState, useEffect} from 'react';
import Input from '../gui/Input';
import TextArea from '../gui/TextArea';
import Field from '../gui/Field';
import Button from '../gui/Button';
import './Task.css';

export default function Task(props){
	const {task, updateTask, deleteTask} = props;

	const [title, setTitle] = useState('');
	const [details, setDetails] = useState('');
	const [isDone, setIsDone] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	useEffect( ()=> {
		if(task){
			setTitle(task.title || '');
			setDetails(task.details || '');
			setIsDone(task.isDone || false);
			setIsLoading(false);
		}
	}, [task])

	useEffect( () => {
		if(!isLoading){
			updateTask({id: task.id,title, details, isDone});
		}
	}, [title, details, isDone])


	return(
		<div className="EditTaskRow">
			<Field name="TASK" />
			<Input title="Title" size={15} value={title} onChange={(e)=>setTitle(e.target.value)}/>
			<TextArea title="Details" rows={2} cols={70} value={details} onChange={(e)=>setDetails(e.target.value)}/>
			<Input title="Done" type="checkbox" value={isDone} onChange={(e)=>setIsDone(e.target.checked)}/>
			<Button label="X" onClick={()=> deleteTask({id: task.id, title: task.title})}/>
		</div>
	)
}