import React from 'react'

export default function Feedback(props) {
    const {message, type,show} = props;
    //helper component to show feedback to user
    return show? (
        <div className={`success-alert ${type}`}>{message}</div>
    ):null;
}