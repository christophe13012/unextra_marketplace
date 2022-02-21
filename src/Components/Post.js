import React from 'react'
import { Link } from 'react-router-dom'

const post = props => {

    return (
        <div className="col-md-4">
            <article className="post">
                <img src={ require("../assets/images/post/" + props.id + ".jpg") } alt="" />
                <h4><Link to={'/blog/'+props.id}>{props.title}</Link></h4>
                <p>{props.excerpt}</p>
                <Link to={ props.url } className="btn btn-round">read more</Link>
            </article>
        </div>
    )
}

export default post