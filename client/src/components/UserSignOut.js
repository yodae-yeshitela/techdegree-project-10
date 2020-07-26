import React, { useEffect } from 'react'
import {Redirect} from 'react-router-dom'
export default function SignOut({context}){
    //helper function that uses the context action sign out to sign out user then
    //show feedback
    const signOut = () => {
        context.actions.signOut()
        context.actions.showFeedback('You have been signed out successfully!', 'success')
    }
    //wrapping the action to prevent React error: "Cannot update during an existing state transition 
    //(such as within `render`). Render methods should be a pure function of props and state." which occurs
    //during sign out
    useEffect( signOut, [])
    return <Redirect to='/'></Redirect>
}