import React, { Component } from 'react'
import axios from '../axios-orders'

class CommentForm extends Component {

    state = {
        comment: {
            id: null,
            postId: null,
            username: '',
            message: ''
        },
        commentPosted: false
    }

    inputChangeHandler = (e) => {

        const updatedComment = {...this.state.comment}
        updatedComment[e.target.name] = e.target.value
        updatedComment.id = Math.floor(Math.random() * 100)
        updatedComment.postId = this.props.postId


        this.setState({
            ...this.state,
            comment: updatedComment
        })
    }

    onSubmitHandler = (e) => {
        e.preventDefault()

        // console.log(prevComments, 'Comment form')
        axios.post("/comments.json", this.state.comment)
            .then( res => { 
                // console.log("Successfull")
                this.setState({
                    ...this.state,
                    commentPosted: true
                })
            })
            .catch( err => {
                console.log(err.message)
            })
    }

    render() {
        // console.log(this.props)
        let message = ''
        if(this.state.commentPosted) {
            message = "Your comment has been successfully posted. Reload to see your comment."
        }
        return(
            <React.Fragment>
                { message }
                <div className="comment-form">
                    <h4 className="comment-title">Leave a comment</h4>
                    <form onSubmit={ this.onSubmitHandler }>
                        <input name="username" type="text" placeholder="Your name" onChange={ this.inputChangeHandler } required />
                        <textarea name="message" placeholder="Write Comments" onChange={ this.inputChangeHandler } required></textarea>
                        <button type="submit" className="btn btn-filled btn-round">Submit</button>
                    </form>
                </div>
            </React.Fragment>
        )
    }
}

export default CommentForm