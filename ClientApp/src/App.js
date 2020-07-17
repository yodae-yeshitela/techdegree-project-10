import React from 'react';
import Layout from './components/Layout';
import './Global.css'
import {Provider} from './util/Context'
import Service from './util/Service'
import cookie from 'js-cookie'

class App extends React.Component {

  state = {
    courses: null,
    authenticatedUser: cookie.getJSON('authenticatedUser')
  };
  componentDidMount(){
    this.getProjects();
  }
  render() {
    const value = {
      redirectToError: this.state.redirect,
      authenticatedUser: this.state.authenticatedUser,
      courses: this.state.courses,
      actions: {
        signIn: this.signIn,
        signOut: this.signOut,
        refresh: this.refreshCourses
      }
    }
    return (
      <Provider value={value}>
          <Layout />
      </Provider>
      );
  }
  signIn = async(emailAddress, password) => {
    const user = await Service.getUser(emailAddress, password);
    if(user != null){
      this.setState( () => { 
        return {authenticatedUser: {emailAddress, password, name: `${user.firstName} ${user.lastName}`}}
      })
      cookie.set('authenticatedUser', {emailAddress, password, name: `${user.firstName} ${user.lastName}`});
    }
    return user;
  }   

  signOut = () => {
      cookie.remove('authenticatedUser');
      cookie.remove('isAuthenticated')
      this.setState({authenticatedUser: null})
  }

  getProjects = () => {
    Service.getCourses()
      .then( response => this.setState( currState => { 
        currState.courses = response;
        currState.redirect = false;
        return {...currState}
      }))
      .catch( () => {
        this.setState({redirect: true})
      });
  }

  refreshCourses = () => {
    this.getProjects()
  }
}

export default App;
