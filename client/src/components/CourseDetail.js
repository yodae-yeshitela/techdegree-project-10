import React from 'react'
import Service from '../util/Service';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

export default class CourseDetail extends React.Component {

  state = {
    courseData: null,
    redirectToError: false,
    isOwner: false
  }
  componentDidMount() {
    const { id } = this.props.match.params; 
    const { authenticatedUser } = this.props.context;
    //use Service module to find course
    Service.getCourseById(id)
      .then(courseData => {
        if (courseData != null) {
          //if course is found set application state
          const { user } = courseData;
          //check if the currently authenticated user is the owner of the course
          const isOwner = authenticatedUser ? authenticatedUser.emailAddress === user.emailAddress : false; 
          this.setState({ courseData, isOwner, id: courseData.courseId });
        }
        else
          this.props.history.push('/notfound');
      })
      .catch( ()=> this.props.history.push('/error'))//redirect to error page if request fails
  }
  //function to delete a course
  handleDelete = () => {
    const {authenticatedUser, actions} = this.props.context;
    const {courseData} = this.state;
    const { id } = this.state;
    //doublecheck if the user is actually authenticated
    if (authenticatedUser){
      //confirmation to delete
      if(window.confirm('Are you sure you want to delete this course?'))
        //use Service module to delete course
        Service.deleteCourse(id, {username: authenticatedUser.emailAddress, password: authenticatedUser.password})
            .then( (response) => {
                //if there is a response course deletion failed, so show error for failure
                if(response){
                  actions.showFeedback(`Course can not be deleted: ${response.error}`, 'error')
                }
                //if course was successfully deleted show message and redirect to home
                else{
                  actions.showFeedback(`Course "${courseData.title}" deleted successfully!`, 'success');
                  this.props.history.push('/')
                }
            })
            .catch( () => this.props.history.push('/error'))//redirect to error if request fails
          }
  }
  render() {
    const { id } = this.props.match.params;
    const { courseData, isOwner } = this.state;
    const { authenticatedUser } = this.props.context;

    if (courseData) {
      const { user, materialsNeeded, estimatedTime, description } = courseData;
      return (<>
        
          <div className="actions--bar">
            <div className="bounds">
              <div className="grid-100">
                {authenticatedUser && isOwner ? <>
                <Link className="button" to={`/courses/${id}/update`} >Update Course</Link>
                <button className="button" onClick= {this.handleDelete}>Delete Course</button>
                </>: null}
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
            <div className="course--description">
              <ReactMarkdown source={description}/>{/*Use of react markdown to format text*/}
            </div>
          </div>
          <div className="grid-25 grid-right">
            <div className="course--stats">
              <ul className="course--stats--list">
                <li className="course--stats--list--item">
                  <h4>Estimated Time</h4>
                  <h3>{estimatedTime ? estimatedTime : 'Not specified'}</h3>
                </li>
                <li className="course--stats--list--item">
                  <h4>Materials Needed</h4>
                    {/*Use of react markdown to format text*/}
                    {materialsNeeded?<ReactMarkdown source={materialsNeeded}/>:"No materials specified"} 
                </li>
              </ul>
            </div>
          </div>
        </div>
      </>
      )
    }
    return null;
  }
}