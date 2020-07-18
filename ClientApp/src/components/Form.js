import React from 'react'
import { useHistory } from 'react-router-dom'

export default function Form({ handleChange, courseData, ownerName, updateMode, handleSubmit}) {
    //A form component used by update course and create course pages.
    const history = useHistory(); // get access to history object for redirection
    return (
        <form onSubmit={handleSubmit}>
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
                            value={courseData.title || ''}
                            onChange={handleChange}
                        />
                    </div>
                    <p>By {ownerName}</p>
                </div>
                <div className="course--description">
                    <div>
                        <textarea
                            id="description"
                            name="description"
                            placeholder="Course description..."
                            value={courseData.description}
                            onChange={handleChange}
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
                                    value={courseData.estimatedTime || ''}
                                    onChange={handleChange}
                                />
                            </div>
                        </li>
                        <li className="course--stats--list--item">
                            <h4>Materials Needed</h4>
                            <div>
                                <textarea
                                    id="materialsNeeded"
                                    name="materialsNeeded"
                                    placeholder="List materials..."
                                    value={courseData.materialsNeeded || ''}
                                    onChange={handleChange}
                                />
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="grid-100 pad-bottom">
                <button className="button" type="submit">{updateMode ? 'Update' : 'Create'} Course</button>
                <button className="button button-secondary"
                    type='button'
                    onClick={() => history.goBack()}>
                    Cancel
                </button>
            </div>
        </form>


    )

}