// Imports
import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import {Cookies} from 'react-cookie';

// Components
import Header from './Header';

// Renders the user sign up page
class UserSignUp extends Component {
	// `signup` stores all the input data
	// `confirmPassword` stores the password confirmation
	// `errors` stores all the possible errors when signing up
	state = {
		signup: {
			firstName: '',
			lastName: '',
			emailAddress: '',
			password: ''
		},
		confirmPassword: '',
		errors: []
	};

	handleChange = (event) => {
		const input = event.target;
		this.setState(prevState => ({
			signup: {
				...prevState.signup,
				[input.name]: input.value
			}
		}));
	};

	// Handles confirm input(s)
	handleChangeConfirm = (event) => {
		const input = event.target.name;

		this.setState({
			[input]: event.target.value
		});
	};

	// Handles signing up a user
	signUp = (e) => {
		e.preventDefault();
		const errors = [];

		const emailAddress = this.state.signup.emailAddress;
		const password = this.state.signup.password;
		const confirmPassword = this.state.confirmPassword;

		if(errors.length === 0 && password === confirmPassword) {
			axios({
				method: "post",
				url: "http://localhost:5000/api/users",
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
				data: this.state.signup
			}).then(() => {
				const cookies = new Cookies();
				const fullName = `${this.state.signup.firstName} ${this.state.signup.lastName}`;
				cookies.set("user", fullName, {path: "/"});
				cookies.set("emailAddress", emailAddress, {path: "/"});
		        cookies.set("password", password, {path: "/"});
				this.props.signin(true, {fullName, emailAddress, password});
			}).catch(err => {

				let error;
				if(Object.keys(err.response.data.error.errors)[0] === "message") {
					error = err.response.data.error;
				} else {
					error = err.response.data.error.errors;
				}
				
				for(let i = 0; i < Object.keys(error).length; i++) {
					errors.push(error[Object.keys(error)[i]].message);
				}

				this.setState(prevState => ({
					...prevState,
					errors
				}));
			});
		} else {
			errors.push("Passwords do not match.");
			this.setState(prevState => ({
				...prevState,
				errors
			}));
		}
	};

	// Displays validation errors
	checkForErrors = () => {
		if(this.state.errors.length > 0) {
			return React.createElement("div", {className: "validation-errors"},
				React.createElement("ul", null, this.state.errors.map((error, index) => <li key={index}>{error}</li>))
			);
		}
	}

	render() {
		return(
			<div>
				<Header user={this.props.user} />
				<div className="bounds">
					<div className="grid-33 centered signin">
						<h1>Sign Up</h1>
						<div>
							{this.checkForErrors()}

							<form onSubmit={this.signUp} action="/singup" method="POST">
								<div>
									<input id="firstName" name="firstName" type="text" className="" placeholder="First Name" onChange={this.handleChange} />
								</div>
								<div>
									<input id="lastName" name="lastName" type="text" className="" placeholder="Last Name" onChange={this.handleChange} />
								</div>
								<div>
									<input id="emailAddress" name="emailAddress" type="text" className="" placeholder="Email Address" onChange={this.handleChange} />
								</div>
								<div>
									<input id="password" name="password" type="password" className="" placeholder="Password" onChange={this.handleChange} />
								</div>
								<div>
									<input id="confirmPassword" name="confirmPassword" type="password" className="" placeholder="Confirm Password"
								onChange={this.handleChangeConfirm} />
								</div>
								<div className="grid-100 pad-bottom">
									<button className="button" type="submit">Sign Up</button>
									<Link className="button button-secondary" to="/">Cancel</Link>
								</div>
							</form>
						</div>
						<p>&nbsp;</p>
						<p>Already have a user account? <Link to="/signin">Click here</Link> to sign in!</p>
					</div>
				</div>
			</div>
		);
	}
}

export default UserSignUp;