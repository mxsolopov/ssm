import React from "react"
import { Card, Button, Image } from "react-bootstrap"
import CommentList from "./CommentList.js"
import { ThumbsDown, ThumbsUp, TrashSimple } from "phosphor-react"
import CommentForm from "./CommentForm.js"
import { like, removelike, dislike, removedislike, removePost } from "./api-post.js"
import auth from "../auth/auth-helper.js"
import avatarTemplate from "../assets/images/avatar-template.png"

const Post = ({ post, postId, addComment, updatePost, deletePost, deleteComment }) => {
  const jwt = auth.isAuthenticated()
  const userId = jwt.user._id
  const isDislike = post.dislikes.includes(userId)
  const isLike = post.likes.includes(userId)

  const formatDateToLocal = (dateString) => {
    const date = new Date(dateString)

    const day = String(date.getDate()).padStart(2, "0")
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const year = date.getFullYear()
    const hours = String(date.getHours()).padStart(2, "0")
    const minutes = String(date.getMinutes()).padStart(2, "0")

    return `${day}.${month}.${year} ${hours}:${minutes}`
  }

  const upRate = () => {
    let callApi = isLike ? removelike : like
    callApi(
      {
        userId: userId,
      },
      {
        t: jwt.token,
      },
      postId
    ).then((data) => {
      if (data.error) {
        console.log(data.error)
      } else {
        if (isLike) {
          // убрать лайк
          updatePost(post._id, {
            likes: post.likes.filter((item) => {
              return item !== userId
            }),
          })
        } else {
          // добавить лайк
          updatePost(post._id, {
            likes: [...post.likes, userId],
            dislikes: isDislike
              ? post.dislikes.filter((item) => {
                  return item !== userId
                })
              : post.dislikes,
          })
        }
      }
    })

    isDislike &&
      removedislike(
        {
          userId: userId,
        },
        {
          t: jwt.token,
        },
        postId
      ).then((data) => {
        if (data.error) {
          console.log(data.error)
        } else {
        }
      })
  }

  const downRate = () => {
    let callApi = isDislike ? removedislike : dislike
    callApi(
      {
        userId: userId,
      },
      {
        t: jwt.token,
      },
      postId
    ).then((data) => {
      if (data.error) {
        console.log(data.error)
      } else {
        if (isDislike) {
          // убрать дизлайк
          updatePost(post._id, {
            dislikes: post.dislikes.filter((item) => {
              return item !== userId
            }),
          })
        } else {
          // добавить дизлайк
          updatePost(post._id, {
            dislikes: [...post.dislikes, userId],
            likes: isLike
              ? post.likes.filter((item) => {
                  return item !== userId
                })
              : post.likes,
          })
        }
      }
    })

    isLike &&
      removelike(
        {
          userId: userId,
        },
        {
          t: jwt.token,
        },
        postId
      ).then((data) => {
        if (data.error) {
          console.log(data.error)
        } else {
        }
      })
  }

  const fullDeletePost = () => {
    removePost(
      {
        postId: postId,
      },
      {
        t: jwt.token,
      },
    ).then((data) => {
      if (data.error) {
        console.log(data.error)
      } else {
        deletePost(postId)
      }
    })
  }

  return (
    <Card className="mb-4">
      <Card.Header className="d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center gap-2">
          <Image
            src={post.postedBy.avatar === "" ? avatarTemplate : `/api/avatar/${post.postedBy.avatar}`}
            roundedCircle
            style={{
              width: "50px",
              height: "50px",
              objectFit: "cover",
            }}
          />
          <div>
            <div style={{ fontSize: "14px" }}>{post.postedBy.name}</div>
            <div style={{ fontSize: "12px" }} className="text-muted">
              {formatDateToLocal(post.created)}
            </div>
          </div>
        </div>
        {post.postedBy._id === userId && (
          <Button variant="outline-danger" size="sm" onClick={fullDeletePost}>
            <TrashSimple size={16} style={{ transform: "translateY(-2px)" }} />
          </Button>
        )}
      </Card.Header>
      <Card.Body>
        <h3 style={{ fontSize: "18px", fontWeight: 500 }}>{post.title}</h3>
        <Card.Text>{post.text}</Card.Text>
        <Button
          variant={isLike ? "success" : "outline-success"}
          onClick={upRate}
        >
          {post.likes.length > 0 ? post.likes.length + " " : ""}
          <ThumbsUp size={16} style={{ transform: "translateY(-2px)" }} />
        </Button>{" "}
        <Button
          variant={isDislike ? "danger" : "outline-danger"}
          onClick={downRate}
        >
          {post.dislikes.length > 0 ? post.dislikes.length + " " : ""}
          <ThumbsDown size={16} style={{ transform: "translateY(-2px)" }} />
        </Button>
        <hr />
        <CommentList
          comments={post.comments}
          deleteComment={deleteComment}
          postId={postId}
          formatDateToLocal={formatDateToLocal}
        />
      </Card.Body>
      <Card.Footer>
        <CommentForm postId={postId} addComment={addComment} />
      </Card.Footer>
    </Card>
  )
}

export default Post
