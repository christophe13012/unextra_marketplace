import React from 'react'
import { Link } from 'react-router-dom'

const error = props => {
    return (
        <section className="container error text-center">
            <strong>404</strong>
            <h2>Oops! Page Not Found</h2>
            <Link to="/" className="btn btn-filled btn-round">Back to Home</Link>
        </section>
    )
}

export default error