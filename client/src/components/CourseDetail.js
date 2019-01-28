// Imports
import React, {Component} from 'react';
import {Redirect, Link} from 'react-router-dom';
import axios from 'axios';

// Components
import Header from './Header';

// Renders the course update page
class CourseDetail extends Component {
	// `title` stores the course's title
	// `description` stores the course's description
	// `estimatedTime` stores the course's estimated time
	// `materialsNeeded` stores the materials needed for the course
	// `user` stores the course instructor
	// `notFound` stores a boolean to determine the course's availability
	state = {
		title: '',
		description: '',
		estimatedTime: '',
		materialsNeeded: '',
		user: {
			firstName: '',
			lastName: ''
		},
		redirect: false,
		redirectToCourse: false,
		notFound: false
	};

	componentDidMount() {
		const courseId = this.props.match.params.id;

		axios.get(`http://localhost:5000/api/courses/${courseId}`)
		.then(course => {
			this.setState(course.data);
		}).catch(err => {
			this.setState({notFound: true});
		});
	};

	formatDescription = () => {
		let description = this.state.description;
		description = description.split("\n").map((description, index) => <p key={index}>{description}</p>);
		return description;
	};

	formatMaterialsNeeded = () => {
		let materials = this.state.materialsNeeded;
		materials = materials.split("*").map((material, index) => <li key={index}>{material}</li>);
		materials.shift();
		return materials;
	};

	deleteCourse = () => {
		axios({
			method: "delete",
			url: `http://localhost:5000/api/courses/${this.props.match.params.id}`,
			auth: {
				username: this.props.emailAddress,
				password: this.props.password
			}
		}).then(() => {
			this.setState({
				redirect: true
			});
		});
	};

	// Displays buttons if the authenticated user is the instructor
	checkUserAuth = () => {
		const buttons = <span>
							<Link className="button" to={`/courses/${this.props.match.params.id}/update`}>Update Course</Link>
							<button className="button" onClick={this.deleteCourse}>Delete Course</button>
						</span>;

		if(this.props.userId === this.state.user._id && this.props.loggedIn) return buttons;
	};

	render() {
		return(
			<div>
				{this.state.redirect ? <Redirect to="/" /> : null}
				{this.state.notFound ? <Redirect to="/notfound" /> : null}
				<Header user={this.props.user} loggedIn={this.props.loggedIn} />
				<div className="actions--bar">
					<div className="bounds">
						<div className="grid-100">
							{this.checkUserAuth()}
							<Link className="button button-secondary" to="/">Return to List</Link>
						</div>
					</div>
				</div>
				<div className="bounds course--detail">
					<div className="grid-66">
						<div className="course--header">
							<h4 className="course--label">Course</h4>
							<h3 className="course--title">{this.state.title}</h3>
							<p>By {this.state.user.firstName} {this.state.user.lastName}</p>
						</div>
						<div className="course--description">
							{this.formatDescription()}
						</div>
					</div>
					<div className="grid-25 grid-right">
						<div className="course--stats">
							<ul className="course--stats--list">
								<li className="course--stats--list--item">
									<h4>Estimated Time</h4>
									<h3>{this.state.estimatedTime}</h3>
								</li>
								<li className="course--stats--list--item">
									<h4>Materials Needed</h4>
									<ul>
										{this.formatMaterialsNeeded()}
									</ul>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default CourseDetail;