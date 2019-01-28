// Imports
import React from 'react';

// Components
import Header from './Header';

// Renders an error message
const UnhandledError = (props) => {

		return(
			<div>
				<Header user={props.user} loggedIn={props.loggedIn} />
				<div className="bounds">
			        <h1>Error</h1>
			        <p>Sorry! We just encountered an unexpected error.</p>
				</div>
			</div>
		);
};

export default UnhandledError;