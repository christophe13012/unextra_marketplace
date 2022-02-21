import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom'
import axios from '../axios-orders'
import Page from '../Layouts/Pages/Page'
import Comments from './Comments'

class SinglePost extends Component {

    state = {
        post: null
    }

    componentDidMount() {
        const postId = this.props.match.params.id
        axios.get('/posts/' + postId + '.json' )
            .then( res => {
                this.setState({ post: res.data })
                // console.log(res.data)
            })
    }

    render() {
        let post = "Loading..."
        if(this.state.post) {
            post = <Fragment>
                <article className="entry-content">
                    <img src={ require("../assets/images/post/1.jpg") } alt="" />
                    <div className="meta-tags">
                    <Link to="#" className="post-meta"><i className="ti-time"></i>{this.state.post.meta.created}</Link  >
                    <Link to="#" className="post-meta"><i className="ti-package"></i>{this.state.post.meta.categories.join(', ')}</Link >
                    <Link to="#" className="post-meta"><i className="ti-tag"></i>{this.state.post.meta.tags.join(', ')}</Link   >
                    </div>
                    <h3>{ this.state.post.title }</h3>
                    <p>{ this.state.post.body }</p>
                </article>
                <Comments postId={ this.state.post.id } />
            </Fragment>
        }
        return (
            <Page>
                { post }
            </Page>
        )
    }
}

export default SinglePost