import React from 'react'
import { Link } from 'react-router-dom'

export default function CouresTile({course}){
    return(
        <div className="grid-33">
            <Link className="course--module course--link" to={`course/${course.courseId}`}>
                <h4 className="course--label">Course</h4>
                <h3 className="course--title">{course.title}</h3>
            </Link>
        </div>
    )
}