// Imports
import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';

// HOC - Requires user authentication whenever used
const PrivateRoute = (WrappedComponent) => {
	return class PrivateRoute extends Component {
		render() {
			return this.props.loggedIn && this.props.user ? <WrappedComponent {...this.props} /> : <Redirect to ="/forbidden" />;
		}
	}
}

export default PrivateRoute;