import React, { Component } from 'react'
import Post from '../Components/Post'
import axios from '../axios-orders'

class Posts extends Component {

    state = {
        posts: []
    }

    componentDidMount() {
        axios.get('/posts.json')
            .then( res => {
                // console.log(res)
                this.setState({ posts: res.data.slice(0, 3) })
            })
            .catch( err => {
                console.log(err)
            })
    }

    // selectedPostId = (id) => {
    //     console.log(id)
    // }

    render() {
        // console.log(this.props)

        const posts = this.state.posts.map( post => {
            return (
                <Post 
                    key={post.id}
                    id={post.id}
                    title={post.title}
                    excerpt={post.excerpt}
                    body={post.body}
                    url={'/blog/'+post.id}
                />
            )            
        })

        return (
            // Posts section start
            <div className="row">
                { posts }
            </div>
            // Posts section end
        )
    }
}

export default Posts