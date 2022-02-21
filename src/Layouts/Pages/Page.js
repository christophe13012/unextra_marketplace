import React from "react";
import { Link } from 'react-router-dom'

const page = props => {
    
    return (
        <React.Fragment>
        <section className="page-feature">
            <div className="container text-center">
                <h2>Blog Details</h2>
                <div className="breadcrumb">
                <Link to="home.html">Home</Link>
                <span>/ Blog Details</span>
                </div>
            </div>
        </section>
        
        <section className="page">
            <div className="container">
                <div className="row">
                    <div className="col-md-8">
                        {props.children}
                    </div>
                    <div className="col-md-4">
                        <aside className="sidebar">
                            <div className="widget widget_search">
                                <form action="#">
                                    <input type="text" name="s" placeholder="Search ..." required="" />
                                    <i className="ti-search"></i>
                                </form>
                            </div>
                            <div className="widget categories">
                                <h3 className="widget-title">Categories</h3>
                                <ul>
                                    <li><Link to="#">App Design <span>(5)</span></Link></li>
                                    <li><Link to="#">Web Design <span>(9)</span></Link></li>
                                    <li><Link to="#">UI-UX Design <span>(23)</span></Link></li>
                                    <li><Link to="#">Print Design <span>(7)</span></Link></li>
                                    <li><Link to="#">Game Design <span>(3)</span></Link></li>
                                    <li><Link to="#">Graphic Design <span>(2)</span></Link></li>
                                    <li><Link to="#">Logo Design <span>(5)</span></Link></li>
                                </ul>
                            </div>
                            <div className="widget widget_tag_cloud">
                                <h3 className="widget-title">Tags</h3>
                                <div className="tag-cloud">
                                    <Link to="#"><i className="ti-tag"></i> banking</Link>
                                    <Link to="#"><i className="ti-tag"></i> article</Link>
                                    <Link to="#"><i className="ti-tag"></i> money</Link>
                                    <Link to="#"><i className="ti-tag"></i> saving</Link>
                                    <Link to="#"><i className="ti-tag"></i> invest</Link>
                                    <Link to="#"><i className="ti-tag"></i> safety</Link>
                                    <Link to="#"><i className="ti-tag"></i> credit</Link>
                                    <Link to="#"><i className="ti-tag"></i> debit</Link>
                                </div>
                            </div>
                        </aside>
                    </div>
                    
                </div>
            </div>
        </section>
        </React.Fragment>
    )
}

export default page