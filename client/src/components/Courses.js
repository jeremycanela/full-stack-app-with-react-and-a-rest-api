// Imports
import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';

// Components
import Course from './Course';

// Renders all the courses
class Courses extends Component {
	// `courses` stores all the courses' titles
	state = {
		courses: []
	};

	componentDidMount() {
		axios.get("https://project-rest-api.herokuapp.com/api/courses")
		.then(courses => {
			this.setState({
				courses: courses.data
			});

			this.props.loaded(true);
		});
	};

	// Displays the 'New Course' button if the user is authenticated
	checkUserAuth = () => {
		const newCourse = <div className="grid-33">
				        	<Link className="course--module course--add--module" to="/courses/create">
					            <h3 className="course--add--title"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 13 13" className="add"><polygon points="7,6 7,0 6,0 6,6 0,6 0,7 6,7 6,13 7,13 7,7 13,7 13,6 "></polygon></svg>New Course</h3>
				          	</Link>
				        </div>;

		if(this.props.loggedIn && this.props.user) return newCourse;
	};

	render() {
		return (
			<div className="bounds">
		        {!this.props.loading ? <p>Loading...</p> : null}
		        {
		        	this.state.courses.map(course => {
		        		return <Course key={course._id} title={course.title} id={course._id} />;
		        	})
		        }

		        {this.checkUserAuth()}
	      	</div>
		);
	}
};

export default Courses;