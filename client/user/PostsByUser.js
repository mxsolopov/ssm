import React from "react"
import PostList from "../post/PostList.js"
import auth from "../auth/auth-helper.js"
import { listNewsFeed } from "../post/api-post.js"

const PostsByUser = ({ userId }) => {
  const [posts, setPosts] = React.useState([])
  const jwt = auth.isAuthenticated()

  React.useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    listNewsFeed(
      {
        userId: userId,
      },
      {
        t: jwt.token,
      },
      signal
    ).then((data) => {
      if (data.error) {
        console.log(data.error)
      } else {
        setPosts(data.filter((post) => post.postedBy._id === userId))
      }
    })
    return function cleanup() {
      abortController.abort()
    }
  }, [])

  const addComment = (postId, comment) => {
    const updatedPosts = posts.map((post) => {
      if (post._id === postId) {
        const updatedComments = [...post.comments, comment]
        return { ...post, comments: updatedComments }
      }
      return post
    })
    setPosts(updatedPosts)
  }

  const updatePost = (postId, newData) => {
    setPosts(() => {
      const updatedPosts = posts.map((post) => {
        if (post._id === postId) {
          return { ...post, ...newData }
        }
        return post
      })
      return updatedPosts
    })
  }

  return (
    <>
      <PostList posts={posts} addComment={addComment} updatePost={updatePost} />
    </>
  )
}

export default PostsByUser
