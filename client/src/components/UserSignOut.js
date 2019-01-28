// Imports
import React from 'react';
import {Redirect} from 'react-router-dom';
import {Cookies} from 'react-cookie';

// User sign out
const UserSignOut = (props) => {
	const cookies = new Cookies();
	cookies.remove("user", {path: "/"});
	cookies.remove("emailAddress", {path: "/"});
	cookies.remove("password", {path: "/"});
	cookies.remove("userId", {path: "/"});
	props.signout();
	return(
		<Redirect to="/" />
	);
};

export default UserSignOut;