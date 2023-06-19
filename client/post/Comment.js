import React from "react"
import { Card, Image, Button } from "react-bootstrap"
import { TrashSimple, User } from "phosphor-react"
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
          {comment.postedBy.avatar === "" ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "40px",
                height: "40px",
                background: "#dddddd",
                borderRadius: "50%",
              }}
            >
              <User color="#b8b8b8" size={24} weight="fill" />
            </div>
          ) : (
            <Image
              src={`/api/avatar/${comment.postedBy.avatar}`}
              roundedCircle
              style={{
                width: "40px",
                height: "40px",
                objectFit: "cover",
              }}
            />
          )}
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
