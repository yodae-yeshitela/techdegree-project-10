import React from 'react'
import Header from './Header'
import SignUp from './UserSignUp'
import SignIn from './UserSignIn'
import withContext from '../util/Context'
import {Route, Switch, BrowserRouter} from 'react-router-dom'
import Courses from './Courses'
import SignOut from './UserSignOut';
import CourseDetail from './CourseDetail'
import Forbidden from './Forbidden'
import NotFound from './NotFound'
import UnhandledError from './UnhandledError'
import PrivateRoute from '../util/PrivateRoute'
import CreateCourse from './CreateCourse'
import UpdateCourse from './UpdateCourse'


//Get the components and give them access to context
const HeaderWithContext = withContext(Header);
const SignInWithContext = withContext(SignIn);
const SignUpWithContext = withContext(SignUp);
const CoursesWithContext = withContext(Courses);
const SignOutWithContext = withContext(SignOut);
const UpdateCourseWithContext = withContext(UpdateCourse);
const CourseDetailWithContext = withContext(CourseDetail)
const CreateCourseWithContext = withContext(CreateCourse);

export default function Layout () {
    return(
        <BrowserRouter>
            <HeaderWithContext />
            <Switch>
                <Route exact path='/' render={(props) => <CoursesWithContext {...props} />}/>
                <PrivateRoute path='/courses/create' component={CreateCourseWithContext} />
                <PrivateRoute path='/courses/:id/update' component={UpdateCourseWithContext}/>
                <Route path='/courses/:id' render={(props) => <CourseDetailWithContext {...props}/>}/>
                <Route path='/signin' render={(props) => <SignInWithContext {...props}/>}/>
                <Route path='/signup' render={(props) => <SignUpWithContext {...props}/>}/>
                <Route path='/signout' render={(props) => <SignOutWithContext {...props}/>}/>  
                <Route path='/forbidden' render={(props) => <Forbidden {...props}/>}/>
                <Route path='/error' component={UnhandledError}/>
                <Route component={NotFound}/>
            </Switch>
        </BrowserRouter>
        
            
    )
}