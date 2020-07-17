import React from 'react'
import { Link } from 'react-router-dom'

export default function Forbidden(props) {
    const {location: {state : {from, updateMode, notAuthenticated, deleteMode} } } = props;
    if(notAuthenticated){
        let action = '';
        if(updateMode)
            action = 'update'
        else if(deleteMode)
            action = 'delete'
        else 
            action = 'create'
        return(
        <div style={{margin: '0 auto', width: '50%'}}>
                <h4 style={{fontSize: '28px'}}>Sorry but you must be signed in, inorder to {action} a course</h4>
                <p style={{display: 'inline-block', margin: '12px 0px'}}>
                     <Link to={{pathname:'/signin', state: {from: from}}}>Click here</Link> to sign in, if you already have an account
                </p>
                <p>Don't have an account? <Link to='/signup'>Click here</Link> to sign up!</p>
        
        </div>
        
    )
    }return (
            <div style={{margin: '0 auto', width: '50%'}}>
            <h4 style={{fontSize: '28px', marginBottom: '10px'}}>
                Sorry but you must the owner of the course in order to {deleteMode?'delete':'update'} a course
            </h4>
            <p>
                <Link to={from}>Click here</Link> to go back to the course
            </p>
        </div>
        )
    
}