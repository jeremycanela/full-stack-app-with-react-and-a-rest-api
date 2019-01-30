// Imports
import React, {Component} from 'react';
import {Redirect, Link} from 'react-router-dom';
import axios from 'axios';

// Components
import PrivateRoute from './PrivateRoute';
import Header from './Header';

// Renders the create course page
class CreateCourse extends Component {
	// `title` stores the course's title
	// `description` stores the course's description
	// `estimatedTime` stores the course's estimated time
	// `materialsNeeded` stores the materials needed for the course
	// `redirect` stores a boolean to redirect the user after a course is created
	state = {
		newcourse: {
			title: '',
			description: '',
			estimatedTime: '',
			materialsNeeded: ''
		},
		redirect: false,
		errors: []
	};

	handleChange = (event) => {
		const input = event.target;
		this.setState(prevState => ({
			newcourse: {
				...prevState.newcourse,
				[input.name]: input.value
			}
		}));
	};

	// Handles creating a new course
	newcourse = (e) => {
		e.preventDefault();
		const errors = [];

		if(errors.length === 0) {
			axios({
				method: "post",
				url: "http://localhost:5000/api/courses",
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
				auth: {
					username: this.props.emailAddress,
					password: this.props.password
				},
				data: this.state.newcourse
			}).then(() => {
				this.setState({
					redirect: true
				});
				
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
		}
	};

	// Displays validation errors
	checkForErrors = () => {
		if(this.state.errors.length > 0) {
			return React.createElement("div", null, 
				React.createElement("h2", {className: "validation--errors--label"}, "Uh Oh!"),
				React.createElement("div", {className: "validation-errors"}, 
					React.createElement("ul", null, 
						this.state.errors.map((error, index) => <li key={index}>{error}</li>))
				)
			);
		}
	}

	render() {
		return(
			<div>
				{this.state.redirect ? <Redirect to="/" /> : null}
				<Header user={this.props.user} loggedIn={this.props.loggedIn} />
				<div className="bounds course--detail">
			        <h1>Create Course</h1>
			        <div>
				        {this.checkForErrors()}
				        <form onSubmit={this.newcourse} action="/courses/create" method="POST">
					        <div className="grid-66">
						        <div className="course--header">
							        <h4 className="course--label">Course</h4>
							        <div>
							        	<input id="title" name="title" type="text" className="input-title course--title--input" placeholder="Course title..." onChange={this.handleChange} />
								    </div>
							        <p>By {this.props.user}</p>
						        </div>
						        <div className="course--description">
							        <div>
							        	<textarea id="description" name="description" className="" placeholder="Course description..." onChange={this.handleChange}></textarea>
							        </div>
						        </div>
					        </div>
					        <div className="grid-25 grid-right">
						        <div className="course--stats">
							        <ul className="course--stats--list">
								        <li className="course--stats--list--item">
									        <h4>Estimated Time</h4>
									        <div>
									        	<input id="estimatedTime" name="estimatedTime" type="text" className="course--time--input" placeholder="Hours" onChange={this.handleChange} />
									    	</div>
								        </li>
								        <li className="course--stats--list--item">
								        	<h4>Materials Needed</h4>
								        	<div>
								        		<textarea id="materialsNeeded" name="materialsNeeded" className="" placeholder="List materials..." onChange={this.handleChange}></textarea>
								        	</div>
								        </li>
							        </ul>
						        </div>
					        </div>
					        <div className="grid-100 pad-bottom">
					        	<button className="button" type="submit">Create Course</button>
					        	<Link className="button button-secondary" to="/">Cancel</Link>
					        </div>
				        </form>
			        </div>
		        </div>
	        </div>
		);
	}
}

export default PrivateRoute(CreateCourse);