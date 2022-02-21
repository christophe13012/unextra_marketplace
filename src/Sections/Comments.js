import React, { Component, Fragment } from 'react'
import Comment from '../Components/Comment'
import axios from '../axios-orders'
import CommentForm from './CommentForm'

class Comments extends Component {

    state = {
        comments: null
    }

    componentDidMount() {
        axios.get('/comments.json' )
            .then( res => {
                this.setState({ comments: res.data })
            })
            .catch( err => {
                console.log(err.message)
            })
    }

    render() {
        
        let comments = 'Loading...'
        if( this.state.comments !== null ) {

            comments = Object.keys(this.state.comments).map( cmnt => {
                
                if (this.state.comments[cmnt].postId === this.props.postId) {
                    return (
                        <li key={this.state.comments[cmnt].id}>
                            <Comment                                 
                                id={this.state.comments[cmnt].id}
                                username={this.state.comments[cmnt].username}
                                message={this.state.comments[cmnt].message}
                            />
                        </li>
                    )
                }
                
            })
        }

        return (
            <Fragment>
                <div className="comments">
                    <h4 className="comment-title">comments</h4>
                    <ul>
                        { comments }
                    </ul>
                </div>
                <CommentForm postId={this.props.postId} />
            </Fragment>
        )
    }
}

export default Comments