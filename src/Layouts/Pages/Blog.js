import React, { Component } from 'react'
import Posts from '../../Sections/Posts'

class blog extends Component {


    render() {
        return (
            // Blog section start
            <section className="blog">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8 col-md-10 m-auto">
                            <div className="sec-heading">
                                <h3 className="sec-title">Latest From Blog</h3>
                                <p>To doesn't his appear replenish together called he of mad place won't wherein blessed second every wherein were meat kind wherein and martcin</p>
                            </div>
                        </div>
                    </div>

                    {/* Posts */}
                    <Posts />

                </div>      
            </section>
            // Blog section end
        )
    }
}

export default blog