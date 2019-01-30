// Impotrts
import React, {Component} from 'react';
import {Redirect, Link} from 'react-router-dom';
import axios from 'axios';

// Components
import PrivateRoute from './PrivateRoute';
import Header from './Header';

// Renders the update course page
class UpdateCourse extends Component {
	// `editcourse` stores all course's info
	// `user` stores the instructor's information
	// `errors` stores all the possible errors encountered when submitting the update
	// `redirect` stores a boolean to redirect when the update is successful
	// `notfound` stores a boolean to redirect when the course is not found
	// `forbidden` stores a boolean to redirect when an unauthorized user visits the page
	// `error` stores a boolean to redirect when there is a 500 error returned after update attempt
	state = {
		editcourse: {
			title: '',
			description: '',
			estimatedTime: '',
			materialsNeeded: '',
			user: {
				firstName: '',
				lastName: ''
			}
		},
		errors: [],
		redirect: false,
		notFound: false,
		forbidden: false,
		error: false
	};

	componentDidMount() {
		const courseId = this.props.match.params.id;

		axios.get(`http://localhost:5000/api/courses/${courseId}`)
		.then(course => {
			this.setState({
				editcourse: {
					...course.data
				}
			});

			return course;
		}).then(course => {
			if(course.data.user._id !== this.props.userId) {
				this.setState({forbidden: true});
			}
		}).catch(err => {
			if(err.message === "Network Error") {
				this.setState({error: true});
			} else if(err.response.status === 500) {
				this.setState({error: true});
			} else if(err.response.status === 400 || 404) {
				this.setState({notFound: true});
			}
		});
	};

	handleChange = (event) => {
		const input = event.target;
		this.setState(prevState => ({
			editcourse: {
				...prevState.editcourse,
				[input.name]: input.value
			}
		}));
	};

	// Handles updating the course
	editcourse = (e) => {
		e.preventDefault();
		const errors = [];

		if(errors.length === 0) {
			axios({
				method: "put",
				url: `http://localhost:5000/api/courses/${this.props.match.params.id}`,
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
				auth: {
					username: this.props.emailAddress,
					password: this.props.password
				},
				data: this.state.editcourse
			}).then(course => {
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
				{this.state.error ? <Redirect to="/error" /> : null}
				{this.state.forbidden ? <Redirect to="/forbidden" /> : null}
				{this.state.notFound ? <Redirect to="/notfound" /> : null}
				{this.state.redirect ? <Redirect to={`/courses/${this.props.match.params.id}`} /> : null}
				<Header user={this.props.user} loggedIn={this.props.loggedIn} />
				<div className="bounds course--detail">
					<h1>Update Course</h1>
					<div>
						{this.checkForErrors()}
						<form onSubmit={this.editcourse} action={`/courses/${this.props.match.params.id}/update`}>
							<div className="grid-66">
								<div className="course--header">
									<h4 className="course--label">Course</h4>
									<div>
										<input id="title" name="title" type="text" className="input-title course--title--input" placeholder="Course title..." defaultValue={this.state.editcourse.title} onChange={this.handleChange} />
									</div>
									<p>By {this.state.editcourse.user.firstName} {this.state.editcourse.user.lastName}</p>
								</div>
								<div className="course--description">
									<div>
										<textarea id="description" name="description" className="" placeholder="Course description" value={this.state.editcourse.description} onChange={this.handleChange} />
									</div>
								</div>
							</div>
							<div className="grid-25 grid-right">
								<div className="course--stats">
									<ul className="course--stats--list">
										<li className="course--stats--list--item">
											<h4>Estimated Time</h4>
											<div>
												<input id="estimatedTime" name="estimatedTime" type="text" className="course--time--input" placeholder="Hours" defaultValue={this.state.editcourse.estimatedTime} onChange={this.handleChange} />
											</div>
										</li>
										<li className="course--stats--list--item">
											<h4>Materials Needed</h4>
											<div>
												<textarea id="materialsNeeded" name="materialsNeeded" className="" placeholder="List materials..." value={this.state.editcourse.materialsNeeded} onChange={this.handleChange} />
											</div>
										</li>
									</ul>
								</div>
							</div>
							<div className="grid-100 pad-bottom">
								<button className="button" type="submit">Update Course</button>
								<Link className="button button-secondary" to={`/courses/${this.props.match.params.id}`}>Cancel</Link>
							</div>
						</form>
					</div>
				</div>
			</div>
		);
	}
}

export default PrivateRoute(UpdateCourse);