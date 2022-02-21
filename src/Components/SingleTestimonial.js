import React from 'react'

const singleTestimonial = props => {
    return (
        <div className="single-tst">
            <img src={ require("../assets/images/quote.png") } alt="" />
            <p>{props.body}</p>
            <div className="client-info">
                <img src={ require("../assets/images/client-1.png") } alt="" className="thumb" />
                <p>{props.name}, <span>{props.designation}</span></p>
            </div>
        </div>
    )
}

export default singleTestimonial