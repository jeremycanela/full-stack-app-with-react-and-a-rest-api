// Imports
import React, {Component} from 'react';
import {BrowserRouter, Switch, Route, Redirect} from 'react-router-dom';
import {CookiesProvider, Cookies} from 'react-cookie';
import axios from 'axios';

// Components
import Home from './components/Home';
import UserSignUp from './components/UserSignUp';
import UserSignIn from './components/UserSignIn';
import UserSignOut from './components/UserSignOut';
import CreateCourse from './components/CreateCourse';
import CourseDetail from './components/CourseDetail';
import UpdateCourse from './components/UpdateCourse';
import NotFound from './components/NotFound';
import Forbidden from './components/Forbidden';
import UnhandledError from './components/Error';

const cookies = new Cookies();

// Renders the entire app
class App extends Component {
  // `user` stores the global state for authenticated users
  // `loggedIn` stores the authentication status of the user
  // `emailAddres` stores the user's email address
  // `password` stores the user's password
  state = {
    user: {
      userId: cookies.get("userId"),
      fullName: cookies.get("user"),
      emailAddress: cookies.get("emailAddress"),
      password: cookies.get("password")
    },
    loggedIn: cookies.get("user") ? true : false,
    errors: [],
    redirect: false
  };

  // Validates the inputs
  validateInput = (input, value, errorsList) => {
    if(value === "") {
      errorsList.push(`${input} is required.`);

      this.setState(prevState => ({
        ...prevState,
        errors: errorsList
      }));
    }
  };

  // Handles signing in a user
  signin = (status, userData, event) => {
    if(event) event.preventDefault();
    const errors = [];

    const emailAddress = userData.emailAddress;
    const password = userData.password;

    this.validateInput("Email address", emailAddress, errors);
    this.validateInput("Password", password, errors);

    if(errors.length === 0) {
      axios({
        method: "get",
        url: "http://localhost:5000/api/users",
        auth: {
          username: emailAddress,
          password
        }
      }).then(user => {
        const cookies = new Cookies();
        const fullName = `${user.data.firstName} ${user.data.lastName}`;

        const userId = user.data._id;
        
        cookies.set("userId", userId, {path: "/"});
        cookies.set("user", fullName, {path: "/"});
        cookies.set("emailAddress", emailAddress, {path: "/"});
        cookies.set("password", password, {path: "/"});

        this.setState({
          user: {
            userId,
            fullName,
            emailAddress: emailAddress,
            password: password
          },
          loggedIn: status
        });

        this.setState({redirect: true});
      }).catch(err => {
        const error = err.response.data;
        errors.push(error);

        this.setState(prevState => ({
          ...prevState,
          errors
        }));
      });
    }
  };

  // Handles signing out a user
  signout = () => {
    this.setState({
      loggedIn: false
    });
  };

  render() {
    return (
        <div>
          <CookiesProvider>
            <BrowserRouter>
              <Switch>
                <Route exact path="/" render={() => <Home user={this.state.user.fullName} loggedIn={this.state.loggedIn} />} />
                <Route exact path="/signup" render={() => this.state.loggedIn ? <Redirect to="/" /> : <UserSignUp user={this.state.user.fullName} signin={this.signin.bind(this)} loggedIn={this.state.loggedIn} />} />
                <Route exact path="/signin" render={props => <UserSignIn user={this.state.user.fullName} signin={this.signin.bind(this)} loggedIn={this.state.loggedIn} errors={this.state.errors} redirect={this.state.redirect} {...props} />} />
                <Route exact path="/signout" render={() => <UserSignOut signout={this.signout.bind(this)} />} />
                <Route exact path="/courses/create" render={props => <CreateCourse user={this.state.user.fullName} loggedIn={this.state.loggedIn} emailAddress={this.state.user.emailAddress} password={this.state.user.password} {...props} />} />
                <Route exact path="/courses/:id" render={props => <CourseDetail user={this.state.user.fullName} loggedIn={this.state.loggedIn} {...props} userId={this.state.user.userId} emailAddress={this.state.user.emailAddress} password={this.state.user.password} />} />
                <Route exact path="/courses/:id/update" render={props => <UpdateCourse user={this.state.user.fullName} loggedIn={this.state.loggedIn} {...props} userId={this.state.user.userId} emailAddress={this.state.user.emailAddress} password={this.state.user.password} />} />
                <Route exact path="/forbidden" render={() => <Forbidden user={this.state.user.fullName} loggedIn={this.state.loggedIn} />} />
                <Route exact path="/error" render={() => <UnhandledError user={this.state.user.fullName} loggedIn={this.state.loggedIn} />} />
                <Route exact path="*" render={() => <NotFound user={this.state.user.fullName} loggedIn={this.state.loggedIn} />} />
              </Switch>
            </BrowserRouter>
          </CookiesProvider>
        </div>
      );
  }
}

export default App;
