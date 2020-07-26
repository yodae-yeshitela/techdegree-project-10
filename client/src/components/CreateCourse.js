import React from 'react'
import Form from './Form';
import Service from '../util/Service';
export default class CreateCourse extends React.Component {

    state = {
        courseData: {}
    }
    //form submission handler
    handleSubmit = (e) => {
        e.preventDefault();
        const { authenticatedUser, actions: {showFeedback} } = this.props.context;
        const { courseData } = this.state;
        const credentials = { username: authenticatedUser.emailAddress, password: authenticatedUser.password };
        Service.createCourse(courseData, credentials)
            .then(data => {
                if (data.errors) {
                    this.setState({ errors: data.errors })
                }
                else {
                    showFeedback('Course created successfully', 'success');
                    this.setState({ errors: null });
                    setTimeout(() => this.props.history.push(`/courses/${data.id}`), 1000);
                }
            })
            .catch( ()=> this.props.history.push('/error'))
    }
    //handle input changes
    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState((prevState) => {
            prevState.courseData[name] = value;
            return { ...prevState };
        })
    }
    render() {
        const { courseData, errors } = this.state;
        const { authenticatedUser } = this.props.context;
        return (
            <>
                <hr />
                <div className="bounds course--detail">
                    <h1>Create Course</h1>
                    <ServerError errors={errors} />
                    <div></div>
                    <Form
                        courseData={courseData}
                        handleChange={this.handleChange}
                        ownerName={authenticatedUser.fullName}
                        handleSubmit={this.handleSubmit}
                        handleListFocus={this.handleListFocus}
                    />

                </div>
            </>
        );
    }
}
//Helper pure component to show theserver errors
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