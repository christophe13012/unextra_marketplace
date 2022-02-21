import React from 'react'
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'


const layout = props => {
    return (
        <React.Fragment>
            <Navbar />
            { props.children }
            <Footer />
        </React.Fragment>
    )
}

export default layout