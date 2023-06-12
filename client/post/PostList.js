import React from "react"
import Post from "./Post.js"
import EmptyBlock from "../core/EmptyBlock.js"

const PostList = ({
  posts,
  addComment,
  updatePost,
  deleteComment,
  deletePost,
}) => {
  return (
    <div>
      <h2 className="mb-3">Опубликованные посты</h2>
      {posts.length !== 0 ? (
        posts.map((post, i) => {
          return (
            <Post
              key={i}
              post={post}
              postId={post._id}
              addComment={addComment}
              deleteComment={deleteComment}
              updatePost={updatePost}
              deletePost={deletePost}
            />
          )
        })
      ) : (
        <EmptyBlock />
      )}
    </div>
  )
}

export default PostList
