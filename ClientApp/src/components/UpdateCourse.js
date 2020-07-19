import React from 'react'
import Service from '../util/Service';
import Form from './Form';
import { Redirect } from 'react-router-dom';

export default class UpdateCourse extends React.Component {
    state = {
        courseData: {},
        isLoading: true //state used to check if the course to be update has been loaded
    }

    //handle submissions to update the course
    handleSubmit = (e) => {
        e.preventDefault();
        const { authenticatedUser, actions } = this.props.context;
        const { courseData, id } = this.state;
        const credentials = { username: authenticatedUser.emailAddress, password: authenticatedUser.password };
        Service.updateCourse(id, courseData, credentials)
            .then(data => {
                //if course update fails show errors
                if (data) {
                    this.setState({ errors: data.errors})
                }
                //otherwise show confirmation and redirect to the course details page
                else {
                    actions.showFeedback('Course updated successfully!', 'success');
                    setTimeout(() => this.props.history.push(`courses/${id}`), 1000);
                }
            })
            .catch( ()=> this.props.history.push('/error'))//redirect to error page on api request failure        
    }
    //handle user inputs
    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState((prevState) => {
            prevState.courseData[name] = value;
            return { ...prevState };
        })
    }

    componentDidMount() {
        const {id} = this.props.match.params;
        const {authenticatedUser} = this.props.context;
        //get the course details of the course to update
        Service.getCourseById(id)
            .then( courseData => {
                if(courseData){
                const {user} = courseData;
                const isOwner = authenticatedUser ? authenticatedUser.emailAddress === user.emailAddress : false;
                this.setState({courseData, isOwner, isLoading: false, id: courseData.courseId})
                }
                else
                    this.props.history.push('/notfound')
            })
            .catch( ()=> this.props.history.push('/error'))//redirect to error page on api request failure        
    }

    render() {
        const { courseData, isOwner, isLoading, errors } = this.state;
        const { authenticatedUser } = this.props.context;
        //if the authenticated user is not the owner of the course then redirect to forbidden page
        if (authenticatedUser && !isLoading && !isOwner){
            return <Redirect to='/forbidden' />
        }
        return (
            <>
                <hr />
                <div className="bounds course--detail">
                    <ServerError errors={errors} />
                    <h1>Update Course</h1>
                    <div></div>
                    <Form
                        courseData={courseData}
                        handleChange={this.handleChange}
                        ownerName={authenticatedUser.name}
                        handleSubmit={this.handleSubmit}
                        updateMode
                    />
                </div>
            </>
        );
    }
}
//Helper pure component to show server validatio erros
const ServerError = ({ errors }) => {
    return errors ?
        <div>
            <h2 className="validation--errors--label">Submission Errors</h2>
            <div className="validation-errors">
                <ul>
                    {errors.map((error, index) => <li key={index}>{error}</li>)}
                    <span style={{ display: 'block', marginTop: '1em' }}> ------Fix the above error(s) and try again------</span>
                </ul>
            </div>
        </div>
        : null;
}