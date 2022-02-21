import React, { Component } from 'react'
import axios from '../axios-orders';
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import SingleTestimonial from '../Components/SingleTestimonial';

class Testimonial extends Component {

    state = {
        testimonials: []
    }

    componentDidMount() {
        axios.get('/testimonials.json')
            .then( res => {
                // console.log(res)
                this.setState({ 
                    testimonials: res.data
                })
            })
            .catch( err => {
                console.log(err)
            })
    }

    render() {

        // console.log(this.state.testimonials)

        let testimonials = 'Loading...'
        if( this.state.testimonials.length) {
            testimonials = <OwlCarousel
                autoplay
                className="test-caro"
                dots={true}
                items={1}
                loop
                margin={0}
                nav={false}
            > 
            {
                this.state.testimonials.map( tsml => {
                    return (
                        <SingleTestimonial 
                            key={tsml.userId}
                            id={tsml.userId}
                            name={tsml.userName}
                            designation={tsml.designation}
                            body={tsml.body}
                        />
                    )
                })
            }
            </OwlCarousel>
        }
        

        return (
            // Testimonial section start 
            <section className="testimonial bg-lightred">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-10 col-md-12 m-auto">
                            {testimonials}
                        </div>
                    </div>
                </div>
            </section>
            // Testimonial section end
        )
    }
}

export default Testimonial