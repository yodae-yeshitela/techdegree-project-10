import React from 'react'
import { Link, useLocation } from 'react-router-dom'
export default function Header({context}) {
  //Header component to show on top of page
  const location = useLocation(); //get access to location for redirection to sign in page
  return (
    <div className="header">
      <div className="bounds">
        <Link to='/'><h1 className="header--logo">Courses</h1></Link>
        <Link to='/courses/create'>
          <h5 className="header--logo" style={{fontSize: "1em"}}> 
            <svg 
              style={{width: '13px',height: 'auto',margin: '0 5px 0 0',fill: '#999'}}
              version="1.1" 
              xmlns="http://www.w3.org/2000/svg" 
              x="0px" 
              y="0px" 
              viewBox="0 0 13 13" 
              className="add">
                <polygon points="7,6 7,0 6,0 6,6 0,6 0,7 6,7 6,13 7,13 7,7 13,7 13,6 "></polygon>
              </svg>
            Add Course
          </h5>
        </Link>
        <nav>
          {
            context.authenticatedUser ? 
              <React.Fragment>
                <span>Welcome, {context.authenticatedUser? context.authenticatedUser.fullName:''}!</span>
                  <Link className="signout" to='/signout' >Sign Out</Link>
              </React.Fragment>
              : 
              <React.Fragment>
                <Link className="signin" to={{pathname:'/signin', state: {from : location.pathname}}}>Sign in</Link>
                <Link className="signup" to="/signup">Sign up</Link>
              </React.Fragment>
          }
        </nav>
      </div>
    </div>
  )

}