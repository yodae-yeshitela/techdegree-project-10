import React from 'react'
import Service from '../util/Service';
import { Redirect, Link } from 'react-router-dom';

export default class SignUp extends React.Component {

  state = { data: {}, clientErrors: {}, serverErrors: null, showSuccess: false, redirect: false }

  handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    this.setState((prev) => {
      prev.data[name] = value;
      return { ...prev };
    })
  }

  clientValidate = () => {
    let isValid = true;
    const err = {};
    if (!this.state.data['firstName'] || this.state.data['firstName'] === '') {
      err['firstName'] = {
        isValid: false,
        message: 'First name can not be empty'
      }
      isValid = false;
    }
    else {
      err['firstName'] = {
        isValid: true,
      }
    }
    if (!this.state.data['lastName'] || this.state.data['email'] === '') {
      err['lastName'] = {
        isValid: false,
        message: 'Last name can not be empty'
      }
      isValid = false;
    }
    else {
      err['lastName'] = {
        isValid: true,
      }
    }
    if (!this.state.data['emailAddress'] || this.state.data['emailAddress'] === '') {
      err['emailAddress'] = {
        isValid: false,
        message: 'Email name can not be empty'
      }
      isValid = false;
    }
    else if (!/[^@]+@[^.]+..+/.test(this.state.data['emailAddress'])) {
      err['emailAddress'] = {
        isValid: false,
        message: 'Email is not valid'
      }
      isValid = false;
    }
    else {
      err['email'] = {
        isValid: true,
      }
    }
    if (!this.state.data['password'] || this.state.data['password'] === '') {
      err['password'] = {
        isValid: false,
        message: 'Password can not be empty'
      }
      isValid = false;
    }
    else if (this.state.data['password'] !== this.state.data['confirmPassword']) {
      err['password'] = {
        isValid: false,
        message: 'Passwords do not match'
      }
      isValid = false;
    }
    else {
      err['password'] = {
        isValid: true,
      }
    }
    if (!this.state.data['confirmPassword'] || this.state.data['confirmPassword'] === '') {
      err['confirmPassword'] = {
        isValid: false,
        message: 'Confirmation can not be empty'
      }
      isValid = false;
    }
    else if (this.state.data['password'] !== this.state.data['confirmPassword']) {
      err['confirmPassword'] = {
        isValid: false,
        message: 'Passwords do not match'
      }
      isValid = false;
    }
    else {
      err['confirmPassword'] = {
        isValid: true,
      }
    }


    this.setState((prevState) => {
      prevState.clientErrors = err;
      return prevState
    });

    return isValid;
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const isValid = this.clientValidate();
    if (isValid) {
      Service.createUser(this.state.data)
        .then(result => {
          if (result === null) {
            this.props.context.actions.signIn(this.state.data['emailAddress'], this.state.data['password'])
              .then(() => {
                this.setState({ serverErrors: null, showSuccess: true });
                setTimeout( () => {this.setState({showSuccess: false, redirect: true, redirectToError: false})}, 4000)
              })

          }
          else {
            this.setState({ serverErrors: result.errors , redirectToError: false});
          }
        })
        .catch( () => {
          this.setState({redirectToError: true})
        });

    }
  }


  render() {

    const { clientErrors, serverErrors, redirect, redirectToError } = this.state;
    const { handleChange } = this;
    if(redirectToError){
      return <Redirect to='/error'/>
    }
    if (redirect) {
      return <Redirect to='/' />
    } 
    return (
      <>
      <SuccessAlert show={this.state.showSuccess}/>
      <div className="bounds">
        <div className="grid-33 centered signin">
          <h1>Sign Up</h1>
          <div>
            <ServerError data={serverErrors} />
            <form onSubmit={this.handleSubmit}>
              <div>
                <input id="firstName" name="firstName" type="text" className="" placeholder="First Name" onChange={handleChange} />
                <ClientError data={clientErrors['firstName']} />
              </div>
              <div>
                <input id="lastName" name="lastName" type="text" className="" placeholder="Last Name" onChange={handleChange} />
                <ClientError data={clientErrors['lastName']} />
              </div>
              <div>
                <input id="emailAddress" name="emailAddress" type="text" className="" placeholder="Email Address" onChange={handleChange} />
                <ClientError data={clientErrors['emailAddress']} /></div>
              <div>
                <input id="password" name="password" type="password" className="" placeholder="Password" onChange={handleChange} />
                <ClientError data={clientErrors['password']} /></div>
              <div>
                <input id="confirmPassword" name="confirmPassword" type="password" className="" placeholder="Confirm Password" onChange={handleChange} />
                <ClientError data={clientErrors['confirmPassword']} /></div>
              <div className="grid-100 pad-bottom">
                <button className="button" type="submit">Sign Up</button>
                <Link className="button button-secondary" to='/'>Cancel</Link>
              </div>
            </form>
          </div>
          <p>&nbsp;</p>
          <p>Already have a user account? <Link to="sign-in.html">Click here</Link> to sign in!</p>
        </div>
      </div>
      </>
    )
  }
}

const ClientError = ({ data }) => {
  if (data)
    return <span className='client-error' >{data.message}</span>
  else
    return <></>

}

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

const SuccessAlert = ({show}) => {
  if(show)
    return (
      <div className="success-alert success">
        <h3>Account created successfully! You are now signed in and will be redirected to home page shortly!</h3>
      </div>
    );
  return null;
}