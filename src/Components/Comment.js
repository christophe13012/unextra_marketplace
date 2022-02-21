import React from 'react'
import { Link } from 'react-router-dom'

const comment = props => {
    return(
        <div className="single-comment">
            <div className="user-thumb">
                <img className="avatar-small circle" src={ require("../assets/images/avatar-small.png") } alt="" />
            </div>
            <div className="comments-body">
                <h4>{props.username}</h4>                  
                <p>{props.message}</p>
                <Link to="#"><i className="ti-back-right"></i>Reply</Link>
            </div>
        </div>
    )
}

export default comment