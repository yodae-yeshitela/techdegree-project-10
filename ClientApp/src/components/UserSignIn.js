import React from 'react'
import { Link } from 'react-router-dom'

export default class SignIn extends React.Component {
  state = {
    formData: {}
  }

  //handle user sign in attempt
  handleSubmit = async (e) => {
    e.preventDefault();
    const {formData} = this.state;
    const {context,history, location} = this.props;
    //use the sign in action from context
    context.actions.signIn(formData.email.value, formData.password.value)
      .then(user => {
        //if user is empty the user did not authenticate so show errors
        if (user === null) {
          context.actions.showFeedback('Sign in failed! Check credentials and try again!', 'error')
        }
        //otherwise show success message and redirec to the page the user was on
        else {
          context.actions.showFeedback('Sign in successful!', 'success')
          setTimeout(() => history.push((location.state && location.state.from) || '/'), 3000)
        }
      })
      .catch( ()=> this.props.history.push('/error'))//redirect to the error page if request fails

  }
  render() {
    return (
      <div className="bounds">
        <div className="grid-33 centered signin">
          <h1>Sign In</h1>
          <div>
            <form onSubmit={this.handleSubmit}>
              <div>
                <input
                  type="text"
                  placeholder="Email Address"
                  ref={(e) => this.setState((prev) => {
                    prev.formData.email = e
                  })}//use of refs to handle user input
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Password"
                  ref={(e) => this.setState((prev) => {
                    prev.formData.password = e
                  })}//use of refs to handle user input
                />
              </div>
              <div className="grid-100 pad-bottom">
                <button className="button" type={"submit"}>Sign In</button>
                <Link className="button button-secondary" to='/'>Cancel</Link>
              </div>
            </form>
          </div>
          <p>&nbsp;</p>
          <p>Don't have a user account? <Link to="/signup">Click here</Link> to sign up!</p>
        </div>
      </div>
    )
  }
}
