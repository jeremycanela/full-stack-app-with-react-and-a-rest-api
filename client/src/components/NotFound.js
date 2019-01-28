// Imports
import React from 'react';

// Components
import Header from './Header';

// Renders a not found message
const NotFound = (props) => {

		return(
			<div>
				<Header user={props.user} loggedIn={props.loggedIn} />
				<div className="bounds">
			        <h1>Not Found</h1>
			        <p>Sorry! We couldn't find the page you're looking for.</p>
				</div>
			</div>
		);
};

export default NotFound;