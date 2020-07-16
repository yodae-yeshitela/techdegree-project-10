import React from 'react'
import Header from './Header'
import SignUp from './SignUp'
import SignIn from './SignIn'
import withContext from '../util/Context'
import {Route, Switch, BrowserRouter} from 'react-router-dom'
import Home from './Home'
import SignOut from './SignOut';
import CourseDetail from './CourseDetail'
import CourseForm from './CourseForm'
import Forbidden from './Forbidden'
import DeleteCourse from './DeleteCourse'
import NotFound from './NotFound'
import Error from './Error'

const HeaderWithContext = withContext(Header);
const SignInWithContext = withContext(SignIn);
const SignUpWithContext = withContext(SignUp);
const HomeWithContext = withContext(Home);
const SignOutWithContext = withContext(SignOut);
const CourseFormWithContext = withContext(CourseForm);
const CourseDetailWithContext = withContext(CourseDetail)
const DeleteCourseWithContext = withContext(DeleteCourse);
export default function Layout () {
    return(
        <BrowserRouter>
            <HeaderWithContext/>
            <Switch>
                <Route exact path='/' render={(props) => <HomeWithContext {...props} />}/>
                <Route path='/signin' render={(props) => <SignInWithContext {...props}/>}/>
                <Route path='/signup' render={(props) => <SignUpWithContext {...props}/>}/>
                <Route path='/signout' render={(props) => <SignOutWithContext {...props}/>}/>  
                <Route path='/course/:id' render={(props) => <CourseDetailWithContext {...props}/>}/>
                <Route path='/add-course' render={(props) => <CourseFormWithContext {...props}/>}/>
                <Route path='/update-course/:id' render={(props) => <CourseFormWithContext updateMode {...props}/>}/>
                <Route path='/forbidden' render={(props) => <Forbidden {...props}/>}/>
                <Route path='/delete-course/:id' render={(props) => <DeleteCourseWithContext {...props}/>}/>
                <Route path='/error' component={Error}/>
                <Route component={NotFound}/>
            </Switch>
        </BrowserRouter>
        
            
    )
}