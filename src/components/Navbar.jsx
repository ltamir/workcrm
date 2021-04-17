import {NavLink} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import { loadData} from '../store/actions' 

import Input from './gui/Input';
import StateButton from './gui/StateButton';
import Button from './gui/Button';
import styles from './Navbar.module.css'

const Navbar = props => {
	const {filterText, clearSearch, searchInputHandler, setActiveState} = props;
	const dispatch = useDispatch();

	return (
		<>
			<span className={styles.Menu}>
				<NavLink to="/workcrm/upcominglessons">LESSONS</NavLink>
				<NavLink to="/workcrm/upcomingworks">WORKS</NavLink>
				<NavLink to="/workcrm/upcoming">ALL</NavLink>
				<NavLink to="/workcrm/persons">ADD PERSON</NavLink>
			</span>
			<span className={styles.Menu}>
			<Input 
				title="name or phone" 
				size="10"
				value={filterText} 
				onChange={searchInputHandler}/>
				<StateButton buttons={[
					{icon:'star', title:'Active Persons', value:1}, 
					{icon:'star_border', title:'Inactive Persons', value:0},
					{icon:'star_half', title:'All Persons', value:-1},
					]} setter={setActiveState}/>
				<Button icon="cached" title="Refresh" shadow="2px 4px 8px 0 #696969" onClick={() => dispatch(loadData()) }/>
				<Button icon="search_off" title="Clear search" shadow="2px 4px 8px 0 #696969" onClick={clearSearch}/>
			</span>
		</>
	)
};

export default Navbar;