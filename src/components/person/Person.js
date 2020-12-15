import React from 'react';
import PersonType from './PersonType';
import Field from '../gui/Field';
import NotesField from '../gui/NotesField';
import TitleField from '../gui/TitleField';
import * as gui from '../gui/utils'
import './Person.css'

const Person = ({person, personType, onClick, onDblCLick}) =>(
	
	<div className="Person" onDoubleClick={onDblCLick? () => onDblCLick(person.id) : null} onClick={onClick? () => onClick(person): null}>
			<div className="PersonRow">
				<TitleField value={person.fullname} />
				<span className="PersonRow" style={{marginLeft: '10px'}}>
					{person.email && <Field icon="email" value={person.email} />}
					<Field icon="phone" value={person.phone} />
				</span>
				<div className="PersonType">
					Type: <PersonType personType={personType}/>
				</div>
				{!onClick && (
					<span style={{marginLeft: '5px', flexGrow: 4}}>
						<NotesField icon="note" value={person.notes}/>
					</span>
				)}

			</div>
			{onClick && (<div className="PersonRow" style={gui.getDirectionStyle(person.notes)}>
				<NotesField icon="note" value={person.notes}/>
			</div>)}
	</div>
)

export default Person;