// Imports
import React, {Component} from 'react';
import {Redirect, Link} from 'react-router-dom';

// Components
import Header from './Header';

// Renders the sign in page
class UserSignIn extends Component {
	// `signin` stores all the input data
	// `redirect` stores a boolean to redirect when signing in
	// `redirectTo` stores the pathname to redirect to after signing in (the previous page the user visited)
	state = {
		signin: {
			emailAddress: '',
			password: ''
		},
		redirect: false,
		redirectTo: '/'
	};

	componentDidMount() {
		if(this.props.loggedIn) {
			this.setState({
				redirect: true,
				redirectTo: '/'
			});
		}
	}

	handleChange = (event) => {
		const input = event.target;
		this.setState(prevState => ({
			signin: {
				...prevState.signin,
				[input.name]: input.value
			}
		}));
	};

	// Diisplays validation errors
	checkForErrors() {
		if(this.props.errors.length > 0) {
			return React.createElement("div", {className: "validation-errors"},
				React.createElement("ul", null, this.props.errors.map((error, index) => <li key={index}>{error}</li>))
			);
		}
	}

	// Handles signing in globally
	login = (event) => {
		this.props.signin(true, {...this.state.signin}, event);
		
		let location = this.props.location.state.from;
		if(location === "/signin") location = "/";
		this.setState({redirect: true, redirectTo: location});
	};

	render() {
		return (
			<div>
				{this.state.redirect ? <Redirect to={this.state.redirectTo} /> : null}
				
				<Header loggedIn={this.props.loggedIn} />
				<div className="bounds">
					<div className="grid-33 centered signin">
						<h1>Sign In</h1>
						<div>
						
						{this.checkForErrors()}

						<form onSubmit={this.login} action="/signin" method="GET">
							<div>
								<input id="emailAddress" name="emailAddress" type="text" className="" placeholder="Email Address" onChange={this.handleChange} />
							</div>
							<div>
								<input id="password" name="password" type="password" className="" placeholder="Password" onChange={this.handleChange} />
							</div>
							<div className="grid-100 pad-bottom">
								<button className="button" type="submit">Sign In</button>
								<Link className="button button-secondary" to="/">Cancel</Link>
							</div>
						</form>
						</div>
						<p>&nbsp;</p>
						<p>Don't have a user account? <Link to="/signup">Click here</Link> to sign up!</p>
					</div>
				</div>
			</div>
		);
	}
}

export default UserSignIn;