import React, { useEffect } from 'react'
import {Redirect} from 'react-router-dom'
export default function SignOut({context}){

    const signOut = () => context.actions.signOut()

    useEffect( signOut, [])
    return (
        <Redirect to='/'></Redirect>
    )
}