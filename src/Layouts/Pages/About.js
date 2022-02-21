import React, { Component, Fragment } from 'react'
import AboutSec from '../../Sections/About'
import Team from '../../Sections/Team'
import Testimonial from '../../Sections/Testimonial'

class About extends Component {
    render() {
        return (
            <Fragment>
                <AboutSec />
                <Team />
                <Testimonial />
            </Fragment>
        )
    }
}

export default About