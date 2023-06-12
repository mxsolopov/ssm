import React from "react"
import PostForm from "./PostForm.js"
import PostList from "./PostList.js"
import auth from "../auth/auth-helper.js"
import { listNewsFeed } from "./api-post.js"

const Feed = () => {
  const [posts, setPosts] = React.useState([])
  const jwt = auth.isAuthenticated()

  React.useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    listNewsFeed(
      {
        userId: jwt.user._id,
      },
      {
        t: jwt.token,
      },
      signal
    ).then((data) => {
      if (data.error) {
        console.log(data.error)
      } else {
        setPosts(data)
      }
    })
    return function cleanup() {
      abortController.abort()
    }
  }, [])

  const addPost = (post) => {
    const updatedPosts = [...posts]
    updatedPosts.unshift(post)
    setPosts(updatedPosts)
  }

  const deletePost = (postId) => {
    const updatedPosts = [...posts.filter((post) => post._id !== postId)]
    setPosts(updatedPosts)
  }

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

  const deleteComment = (postId, commentId) => {
    setPosts((prevPosts) => {
      // Клонируем массив постов
      const updatedPosts = [...prevPosts]

      // Находим индекс поста, содержащего комментарий
      const postIndex = updatedPosts.findIndex((post) => post._id === postId)

      if (postIndex !== -1) {
        // Клонируем комментарии поста
        const updatedComments = [...updatedPosts[postIndex].comments]

        // Находим индекс комментария для удаления
        const commentIndex = updatedComments.findIndex(
          (comment) => comment._id === commentId
        )

        if (commentIndex !== -1) {
          // Удаляем комментарий из массива комментариев
          updatedComments.splice(commentIndex, 1)

          // Обновляем комментарии в посте
          updatedPosts[postIndex].comments = updatedComments
        }
      }
      return updatedPosts
    })
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
      <PostForm addPost={addPost} />
      <PostList
        posts={posts}
        addComment={addComment}
        updatePost={updatePost}
        deletePost={deletePost}
        deleteComment={deleteComment}
      />
    </>
  )
}

export default Feed
