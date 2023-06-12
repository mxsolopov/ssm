import React from "react"
import { Card, Image, Button } from "react-bootstrap"
import { TrashSimple } from "phosphor-react"
import auth from "../auth/auth-helper.js"
import { removeComment } from "./api-post.js"
import avatarTemplate from "../assets/images/avatar-template.png"

const Comment = ({
  comment,
  postId,
  commentId,
  deleteComment,
  formatDateToLocal,
}) => {
  const jwt = auth.isAuthenticated()
  const userId = jwt.user._id

  const fullDeleteComment = () => {
    removeComment(
      {
        postId: postId,
        commentId: commentId,
      },
      {
        t: jwt.token,
      }
    ).then((data) => {
      if (data.error) {
        console.log(data.error)
      } else {
        deleteComment(postId, commentId)
      }
    })
  }

  return (
    <Card className="mb-3">
      <Card.Header className="d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center gap-2">
          <Image
            src={
              comment.postedBy.avatar === ""
                ? avatarTemplate
                : `/api/avatar/${comment.postedBy.avatar}`
            }
            roundedCircle
            style={{
              width: "30px",
              height: "30px",
              objectFit: "cover",
            }}
          />
          <div>
            <div style={{ fontSize: "14px" }}>{comment.postedBy.name}</div>
            <div style={{ fontSize: "12px" }} className="text-muted">
              {formatDateToLocal(comment.created)}
            </div>
          </div>
        </div>
        {comment.postedBy._id === userId && (
          <Button
            variant="outline-danger"
            size="sm"
            onClick={fullDeleteComment}
          >
            <TrashSimple size={16} style={{ transform: "translateY(-2px)" }} />
          </Button>
        )}
      </Card.Header>
      <Card.Body>
        <Card.Text>{comment.text}</Card.Text>
      </Card.Body>
    </Card>
  )
}

export default Comment
