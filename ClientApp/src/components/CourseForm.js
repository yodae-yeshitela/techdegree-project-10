import React from 'react'
import { Redirect } from 'react-router-dom'
import Service from '../util/Service'

export default class NewCourse extends React.Component{
    state = {
        formData: {},
        isLoading: true,
        errors: null
    }

    componentDidMount(){
        const {updateMode, context } = this.props;
        const authenticatedUser = context.authenticatedUser;
        const id = this.props.match.params.id
        if(updateMode && authenticatedUser){
            Service.getCourseById(id)
                .then( data => {
                    if(data){
                        const {user: courseOwner} = data;
                        const {authenticatedUser} = this.props.context;
                        if(courseOwner.emailAddress !== authenticatedUser.emailAddress)
                            this.setState({isOwner: false, id: id, isLoading: false});
                        else 
                            this.setState({formData: data, id: id, isOwner: true, isLoading: false})
                    }
                })
        }
        else 
            this.setState({isLoading: false})
    }
    handleSubmit = (e) => {
        e.preventDefault();
        const authenticatedUser = this.props.context.authenticatedUser;
        const {formData} = this.state;
        const updateMode = this.props.updateMode;
        const {id} = this.props.match.params;
        if(updateMode)
            Service.updateCourse( id, formData, {username: authenticatedUser.emailAddress, password: authenticatedUser.password})
            .then( data => {
                if(data.errors){
                    this.setState({errors: data.errors, redirectToError: false})
                }
                else {
                    this.setState({showSuccess: true });
                    setTimeout( () => this.setState({redirect: true, redirectTo: `/course/${id}` , showSuccess: false, redirectToError: false}), 4000);
                }
            })
            .catch( () => {
                this.setState({redirectToError: true})
            })
        else{
            Service.createCourse( formData, {username: authenticatedUser.emailAddress, password: authenticatedUser.password})
                .then( data => {
                    if(data.errors){
                        this.setState({errors: data.errors, redirectToError: false})
                    }
                    else {
                        this.setState({showSuccess: true });
                        setTimeout( () => this.setState({redirect: true, showSuccess: false}), 4000);
                    }
                })
                .catch( () => {
                    this.setState({redirectToError: true})
                })
        }
    }
    handleChange = (e) => {
        const {name, value} = e.target;
        this.setState( (prevState) => {
            prevState.formData[name] = value;
            return prevState;
        })
    }
    render(){
        const {authenticatedUser} = this.props.context;
        const {formData, isOwner, errors} = this.state;
        const {updateMode} = this.props;
        const {redirect, redirectTo, redirectToError} = this.state;

        let fromPath = '';
        if(updateMode && authenticatedUser){
            fromPath = `/course/${this.props.match.params.id}`;
        }
        else if( !authenticatedUser && updateMode){
            fromPath = `/update-course/${this.props.match.params.id}`
        }
        else
            fromPath = '/add-course'
        if(redirect){
            return <Redirect to={{pathname: redirectTo, state: {update: true}}}/>
        }
        if(redirectToError){
            return <Redirect to='/error' />
        }
        if( (authenticatedUser && !updateMode) || (authenticatedUser && isOwner && updateMode))
            return(
            <>
                <SuccessAlert show={this.state.showSuccess} updateMode={updateMode}/>
                <hr/>
                <div className="bounds course--detail">
                    <h1>{updateMode?'Update Course':'Create Course'}</h1>
                    <div>
                    <ServerErrors errors={errors}/>
                    <form onSubmit={this.handleSubmit}>
                        <div className="grid-66">
                            <div className="course--header">
                                <h4 className="course--label">Course</h4>
                                <div>
                                    <input 
                                        id="title" 
                                        name="title" 
                                        type="text" 
                                        className="input-title course--title--input" 
                                        placeholder="Course title..."
                                        value={formData.title || ''}
                                        onChange={this.handleChange} 
                                    />
                                </div>
                                <p>By {authenticatedUser.name}</p>
                            </div>
                        <div className="course--description">
                            <div>
                                <textarea 
                                    id="description" 
                                    name="description"  
                                    placeholder="Course description..." 
                                    value={formData.description}
                                    onChange={this.handleChange} 
                                />
                            </div>
                        </div>
                        </div>
                        <div className="grid-25 grid-right">
                            <div className="course--stats">
                                <ul className="course--stats--list">
                                    <li className="course--stats--list--item">
                                        <h4>Estimated Time</h4>
                                        <div>
                                            <input 
                                                id="estimatedTime" 
                                                name="estimatedTime" 
                                                type="text" 
                                                className="course--time--input"
                                                placeholder="Hours" 
                                                value={formData.estimatedTime || ''}
                                                onChange={this.handleChange} 
                                            />
                                        </div>
                                    </li>
                                    <li className="course--stats--list--item">
                                        <h4>Materials Needed</h4>
                                        <div>
                                            <textarea 
                                                id="materialsNeeded" 
                                                name="materialsNeeded" 
                                                className="" 
                                                placeholder="List materials..."
                                                value={formData.materialsNeeded || ''}
                                                onChange={this.handleChange}
                                            />
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="grid-100 pad-bottom">
                            <button className="button" type="submit">{updateMode? 'Update': 'Create'} Course</button>
                            <button className="button button-secondary" 
                                type='button' 
                                onClick={()=>this.props.history.goBack()}>
                                    Cancel
                            </button>
                        </div>
                    </form>
                </div>
                </div>
            </>)
        if(this.state.isLoading)
            return null;
        return <Redirect to={{pathname: '/forbidden', state: {from: fromPath, updateMode: updateMode, notAuthenticated: authenticatedUser?false:true, notOwner: !isOwner}}}/> 
        
    }
}



const ServerErrors = ({errors}) => {
    if(errors)
        return(
            <div>
                <h2 className="validation--errors--label">Validation errors</h2>
                
                <div className="validation-errors">
                    <span style={{margin: '10px 0px 0px 0px', display: 'inline-block', color: '#7c689b'}}>Please fix the following errors and try again</span>
                    <ul>
                        {errors.map( (err, index)=> <li key={index}>{err}</li>)}
                    </ul>
                    
                </div>
            </div>
        )
    return null;
}

const SuccessAlert = ({show, updateMode}) => {
    if(show)
      return (
        <div className="success-alert success">
          <h3>Course {updateMode?'updated':'created'} successfully!</h3>
        </div>
      );
    return null;
  }