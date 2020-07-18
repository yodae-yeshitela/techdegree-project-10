import React from 'react';
import Layout from './components/Layout';
import {Provider} from './util/Context'
import Service from './util/Service'
import cookie from 'js-cookie'
import Feedback from './components/Feedback';

class App extends React.Component {

  state = {
    authenticatedUser: cookie.getJSON('authenticatedUser')
  };

  render() {
    const value = {
      authenticatedUser: this.state.authenticatedUser,
      actions: {
        signIn: this.signIn,
        signOut: this.signOut,
        showFeedback: this.showFeedback
      }
    }
    return (<>
      <Feedback {...this.state.Feedback}/>
      <Provider value={value}>
          <Layout />
      </Provider>
      </>);
  }

  showFeedback = (message, type, duration = 4000) => {
    this.setState({
      Feedback : {
        message, type, show: true
      }
    })
    setTimeout( () => {
      this.setState ({ Feedback: null})
    }, duration );
  }
  signIn = async(emailAddress, password) => {
    const user = await Service.getUser(emailAddress, password);
    if(user != null){
      this.setState( () => { 
        return {authenticatedUser: {fullName: `${user.firstName} ${user.lastName}`, password, ...user}}
      })
      cookie.set('authenticatedUser', {fullName: `${user.firstName} ${user.lastName}`, password, ...user});
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
