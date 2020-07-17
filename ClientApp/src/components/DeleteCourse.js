import React, { useEffect, useState } from 'react'
import Service from '../util/Service'
import { Redirect } from 'react-router-dom';
export default function DeleteCourse(props) {
    const {authenticatedUser} = props.context;
    const {id} = props.match.params;
    const [status, setStatus] = useState({
        success: false,
        isLoading: true
    });

    const deleteUsingService = () => {
        if (authenticatedUser){
        Service.deleteCourse(id, {username: authenticatedUser.emailAddress, password: authenticatedUser.password})
            .then( (response) => {
                if(response){
                    setStatus( (currState) => {
                        currState.success = false;
                        currState.error = response.error;
                        currState.errorCode = response.status;
                        currState.isLoading = false
                        currState.redirectToError = false;
                        return {...currState}
                    })
                }
                else{
                    setStatus ( currState => {
                        currState.success = true;
                        currState.isLoading = false;
                        currState.redirectToError = false;
                        return {...currState};
                    })
                    setTimeout( () => 
                            setStatus(currState => {
                                currState.redirect = true;
                                return {...currState}
                            }), 3000)
                }
            })
            .catch( () => {
                setStatus( status => {
                    status.redirectToError = true;
                    return {...status};
                })
            })
        }
    }
    useEffect( deleteUsingService, []);
    
    if(status.redirectToError){
        return <Redirect to='/error' />
    }

    if(!authenticatedUser){
        return <Redirect to={{pathname: '/forbidden', state: {from: `/delete-course/${id}`, deleteMode: true, notAuthenticated: true}}}/>
    }

    if(status.isLoading){
        return null;
    }

    if(!status.success){
       if(status.errorCode === 403)
        return <Redirect to={{pathname: '/forbidden', state : { from: `/course/${id}`, deleteMode: true}}}/>
    }

    if(status.redirect){
        return <Redirect to={{pathname: '/', state:{update: true}}}/>
    }

    if(status.success){
        return (
            <div className="bounds">
                <h1>Course deleted successfully</h1>
            </div>
            
            
        )
    }
    return <Redirect to={{pathname: '/forbidden', state : { from: `/delete-course/${id}`, deleteMode: true}}}/>

    
}