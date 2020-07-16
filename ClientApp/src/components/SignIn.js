import React, { useState } from 'react'
import { Link, Redirect } from 'react-router-dom'

export default function SignIn(props) {

  const {context, history} = props;
  const formData = {}
  const [status, setStatus] = useState({
    showMessage: false,
    success: false,
    message: ''
  });
  const Result = ({status}) => {
    if(status.showMessage){
      return (
        <React.Fragment>
          <div className={status.success ? 'success signin-message' : 'error signin-message'} >
            {status.message}
          </div>
        </React.Fragment>
      )
    }
    return null;
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    context.actions.signIn(formData.username.value, formData.password.value)
      .then( user => {
        if(user === null){
          setStatus({
            showMessage: true,
            success: false,
            message: 'Sign in failed! Check your input and try again',
            redirectToError: false
          })
        }
        else{
          setStatus({
            showMessage: true,
            success: true,
            message: 'Sign in successful!',
            redirectToError : false
          });
          
          setTimeout( () => history.push('/'), 3000)
        }
      })
      .catch( () => {
        setStatus ( status => {
          status.redirectToError = true;
          return {...status};
        })
      })

  }

  if(status.redirectToError){
    return <Redirect to='/error' />
  }
  return (
    <div className="bounds">
      <div className="grid-33 centered signin">
        <h1>Sign In</h1>
        <div>
          <Result status={status}/>
          <form onSubmit={handleSubmit}>
            <div>
              <input type="text" placeholder="Email Address"  ref={ (e) => formData.username = e} />
            </div>
            <div>
              <input type="password" placeholder="Password" ref={ (e) => formData.password = e} />
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
