import React from 'react'
import Service from '../util/Service';
import { Link, Redirect } from 'react-router-dom';

export default class CourseDetails extends React.Component {


  state = {
    courseData : null
  }

  componentDidMount(){
    const {id} = this.props.match.params;
    Service.getCourseById(id)
      .then( data => {
        if(data != null)
          this.setState( {courseData: data, id: id, redirectToError: false});
        else
          this.props.history.push('/notfound');
      })
      .catch (() => {
        this.setState({redirectToError: true});
      })
  }


render(){
    const {courseData, id, redirectToError} = this.state;
    if(redirectToError){
      return <Redirect to='/error' />
    }
    if(courseData){
      const {user, materialsNeeded, estimatedTime, description} = courseData;
      return(<>
          <div className="actions--bar">
          <div className="bounds">
            <div className="grid-100">
              <Link className="button" to={`/update-course/${id}`} >Update Course</Link>
              <Link className="button" to={"/delete-course/" + id}>Delete Course</Link>
              <Link className="button button-secondary" to="/">Return to List</Link>
            </div>
          </div>
        </div>
          <div className="bounds course--detail">
            <div className="grid-66">
              <div className="course--header">
                <h4 className="course--label">Course</h4>
                <h3 className="course--title">{courseData.title}</h3>
                  <p>By {`${user.firstName} ${user.lastName}`}</p>
              </div>
              <CourseDescription courseDescription={description}/>
            </div>
            <div className="grid-25 grid-right">
              <div className="course--stats">
                <ul className="course--stats--list">
                  <EstimatedTime estimatedTime={estimatedTime}/>
                  <MaterialsNeeded materialsNeeded={materialsNeeded}/>
                </ul>
              </div>
            </div>
          </div>
          </>
      )
    }
    return <></>
  }
}

const EstimatedTime = ({estimatedTime}) => {
  return(
    <li className="course--stats--list--item">
      <h4>Estimated Time</h4>
      <h3>{estimatedTime? estimatedTime: 'Not specified'}</h3>
    </li>
  )
}
const MaterialsNeeded = ({materialsNeeded}) => {  
    return(
      <li className="course--stats--list--item">
        <h4>Materials Needed</h4>
          <ul>
            { materialsNeeded? 
                materialsNeeded.trim().split('\n').map( (item,index) => <li key={index}>{item.replace("*", '').trim()}</li>)
              : <li> No materials specified</li>
            } 
          </ul>
      </li>
    )
}

const CourseDescription = ({courseDescription}) => {
  if(courseDescription)
    return(
      <div className="course--description">
        {
          courseDescription.split('\n\n').map( (p,i) => <p key={i}> {p} </p>)
        } 
      </div>
    )
  return <></>
}