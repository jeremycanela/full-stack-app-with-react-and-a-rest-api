// Imports
import React from 'react';
import {Link} from 'react-router-dom';

// Renders the header
const Header = (props) => {
	const checkUserStatus = () => {
		if(props.loggedIn && props.user) {
			return(<nav><span>Welcome {props.user}!</span><Link className="signout" to="/signout">Sign Out</Link></nav>);
		} else {
			return(
				<nav>
					<Link className="signup" to="/signup">Sign Up</Link>
					<Link className="signin" to={{pathname: '/signin', state: { from: window.location.pathname }}}>Sign In</Link>
				</nav>
			);
		}
	};
	
	return (
		<div className="header">
			<div className="bounds">
				<h1 className="header--logo"><Link to="/">Courses</Link></h1>
				{checkUserStatus()}
			</div>
		</div>
	);	
};

export default Header;