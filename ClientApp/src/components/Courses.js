import React from 'react'
import { Link } from 'react-router-dom'
import Service from '../util/Service';
export default class Courses extends React.Component {
    state = {
        courses: null
    }
    componentDidMount() {
        //get courses from the api using the Service module 
        Service.getCourses()
            .then(courses => this.setState({ courses }))
            .catch( ()=> this.props.history.push('/error')) // redirect to error if request fails
    }
    render() {
        const { courses } = this.state;
        return (
            <div className="bounds">
                {courses ? courses.map((course, index) => <CouresTile course={course} key={index} />) : null}
                <div className="grid-33">
                    <Link className="course--module course--add--module" to="/courses/create">
                        <h3 className="course--add--title">
                            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 13 13" className="add">
                                <polygon points="7,6 7,0 6,0 6,6 0,6 0,7 6,7 6,13 7,13 7,7 13,7 13,6 "></polygon>
                            </svg>New Course
            </h3>
                    </Link>
                </div>
            </div>
        )
    }
}

//Helper pure component to render individual course tiles
const CouresTile = ({ course }) => {
    return (
        <div className="grid-33">
            <Link className="course--module course--link" to={`courses/${course.courseId}`}>
                <h4 className="course--label">Course</h4>
                <h3 className="course--title">{course.title}</h3>
            </Link>
        </div>
    )
}