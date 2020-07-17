import React from 'react'
import CourseTile from './CourseTile'
import {Link, Redirect} from 'react-router-dom'
export default function Home({ context, ...props }) {
    if(context.redirectToError){
        context.actions.refresh();
        return <Redirect to='/error' />
    }

    if(props.location && props.location.state && props.location.state.update){
        props.location.state = null;
        context.actions.refresh();
    }
    return (
        <div className="bounds">
            <Courses courses = {context.courses} />
            <NewCourseButton/>
        </div>
    )
}
const NewCourseButton = () => (
    <div className="grid-33">
        <Link className="course--module course--add--module" to="/add-course">
            <h3 className="course--add--title">
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 13 13" className="add">
                    <polygon points="7,6 7,0 6,0 6,6 0,6 0,7 6,7 6,13 7,13 7,7 13,7 13,6 "></polygon>
                </svg>New Course
            </h3>
        </Link>
    </div>
)
const Courses = ({courses}) => {
    if(courses)
        return courses.map( (course, index) => <CourseTile course={course} key={index} />);
    return null;
}     