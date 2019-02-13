// Imports
import React, {Component} from 'react';

// Components
import Courses from './Courses';
import Header from './Header';

// Renders the home page (list of all courses)
class Home extends Component {
	state = {
		loaded: false
	};

	loaded(state) {
		this.setState({
			loaded: state
		});
	}

	render() {
		return(
			<div>
				<Header user={this.props.user} loggedIn={this.props.loggedIn} />
				<Courses loggedIn={this.props.loggedIn} user={this.props.user} loaded={this.loaded.bind(this)} loading={this.state.loaded} />
			</div>
		);
	}
};

export default Home;