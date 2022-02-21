import React, { Component } from 'react'
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';

class Service extends Component {

    state= {
        responsive:{
            0: {
                items: 2,
            },
            576: {
                items: 3,
            },
            768: {
                items: 4,
            },
        },
    }

    render() {
         return (
        // Service section start
        <section className="service">
            <OwlCarousel
                autoplay
                className="service-caro"
                dots={false}
                items={4}
                loop
                margin={5}
                nav={false}
                responsive={this.state.responsive}
            >
                <div className="single-service">
                    <img src={ require("../assets/images/service/1.jpg") } alt="" />
                    <div className="service-hover">
                        <img src={ require("../assets/images/icons/1.png") } alt="" />
                        <span>Body Treatment</span>
                    </div>
                </div>

                <div className="single-service">
                    <img src={ require("../assets/images/service/2.jpg") } alt="" />
                    <div className="service-hover">
                        <img src={ require("../assets/images/icons/1.png") } alt="" />
                        <span>Body Treatment</span>
                    </div>
                </div>

                <div className="single-service">
                    <img src={ require("../assets/images/service/3.jpg") } alt="" />
                    <div className="service-hover">
                        <img src={ require("../assets/images/icons/1.png") } alt="" />
                        <span>Body Treatment</span>
                    </div>
                </div>

                <div className="single-service">
                    <img src={ require("../assets/images/service/4.jpg") } alt="" />
                    <div className="service-hover">
                        <img src={ require("../assets/images/icons/1.png") } alt="" />
                        <span>Body Treatment</span>
                    </div>
                </div>
            </OwlCarousel>
        </section>
        // Service section end
    )
    }
   
}

export default Service