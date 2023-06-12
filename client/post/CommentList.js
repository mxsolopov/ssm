import React from "react"
import Comment from "./Comment.js"

const CommentList = ({ comments, deleteComment, postId, formatDateToLocal }) => {
  return (
    <>
      <div>
        <h5>Комментарии ({comments.length})</h5>
        {comments.map((comment, i) => {
          return (
            <Comment
              key={i}
              comment={comment}
              postId={postId}
              commentId={comment._id}
              deleteComment={deleteComment}
              formatDateToLocal={formatDateToLocal}
            />
          )
        })}
      </div>
    </>
  )
}

export default CommentList
