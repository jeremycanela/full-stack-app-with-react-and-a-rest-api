// Imports
import React from 'react';

// Components
import Header from './Header';

// Renders an forbidden message
const Forbidden = (props) => {

		return(
			<div>
				<Header user={props.user} loggedIn={props.loggedIn} />
				<div className="bounds">
			        <h1>Forbidden</h1>
			        <p>Oh oh! You can't access this page.</p>
				</div>
			</div>
		);
};

export default Forbidden;