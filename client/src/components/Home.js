// Imports
import React from 'react';

// Components
import Courses from './Courses';
import Header from './Header';

// Renders the home page (list of all courses)
const Home = (props) => {
	return(
		<div>
			<Header user={props.user} loggedIn={props.loggedIn} />
			<Courses loggedIn={props.loggedIn} user={props.user} />
		</div>
	);
};

export default Home;