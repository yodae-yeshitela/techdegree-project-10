import React from 'react'
import Service from '../util/Service';
import { Link } from 'react-router-dom';

export default class SignUp extends React.Component {
  state = { 
    data: {}, 
    serverErrors: null 
  }
  //handle the user input
  handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState((prev) => {
      prev.data[name] = value;
      return { ...prev };
    })
  }
  //handle the submit when user tries to sign up
  handleSubmit = (e) => {
    e.preventDefault();
    const {context, history} = this.props;
    Service.createUser(this.state.data)
      .then(result => {
        //if the account is created successfully sign the user in, show feedback and redirect to the home page
        if (result === null) {
          context.actions.signIn(this.state.data['emailAddress'], this.state.data['password'])
            .then(() => {
              this.setState({ serverErrors: null});
              context.actions
                .showFeedback('Account created successfully! You will be redirected to the home page', 'success')
              setTimeout(() => history.push('/'), 3000);
            })
        }
        //if sign up failed set the errors in the state to show them
        else {
          this.setState({ serverErrors: result.errors});
        }
      })
      .catch( ()=> this.props.history.push('/error')) //redirect to the error page if server request fails
  }

  render() {
    const { serverErrors } = this.state;
    const { handleChange } = this;
    return (
      <>
        <div className="bounds">
          <div className="grid-33 centered signin">
            <h1>Sign Up</h1>
            <div>
              <ServerError data={serverErrors} />
              <form onSubmit={this.handleSubmit}>
                <div>
                  <input 
                    id="firstName" 
                    name="firstName" 
                    type="text" 
                    className="" 
                    placeholder="First Name" 
                    onChange={handleChange} />
                </div>
                <div>
                  <input 
                    id="lastName" 
                    name="lastName" 
                    type="text" className="" 
                    placeholder="Last Name" 
                    onChange={handleChange} />
                </div>
                <div>
                  <input 
                    id="emailAddress" 
                    name="emailAddress" 
                    type="text" 
                    className="" 
                    placeholder="Email Address" 
                    onChange={handleChange} />
                </div>
                <div>
                  <input 
                    id="password" 
                    name="password" 
                    type="password" 
                    className="" 
                    placeholder="Password" 
                    onChange={handleChange} />
                </div>
                <div>
                  <input 
                    id="confirmPassword" 
                    name="confirmPassword" 
                    type="password" 
                    className="" 
                    placeholder="Confirm Password" 
                    onChange={handleChange} />
                </div>
                <div className="grid-100 pad-bottom">
                  <button className="button" type="submit">Sign Up</button>
                  <Link className="button button-secondary" to='/'>Cancel</Link>
                </div>
              </form>
            </div>
            <p>&nbsp;</p>
            <p>Already have a user account? <Link to="/signin">Click here</Link> to sign in!</p>
          </div>
        </div>
      </>
    )
  }
}
//Helper pure component to show server errors
const ServerError = ({ data }) => {
  if (data)
    return (
      <div>
        <h2 className="validation--errors--label">Submission Errors</h2>
        <div className="validation-errors">
          <ul>
            {data.map((error, index) => <li key={index}>{error}</li>)}
            <span style={{ display: 'block', marginTop: '1em' }}> ------Fix the above error(s) and try again------</span>
          </ul>
        </div>

      </div>
    );
  return <></>
}