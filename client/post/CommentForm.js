import React from "react"
import { Form, Button } from "react-bootstrap"
import auth from "../auth/auth-helper.js"
import { comment } from "./api-post.js"
import { read } from "../user/api-user.js"
import { nanoid } from "nanoid"

const CommentForm = ({ postId, addComment}) => {
  const [values, setValues] = React.useState({
    text: "",
    error: "",
    user: {},
  })

  const jwt = auth.isAuthenticated()
  React.useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    // Чтение данных для профиля пользователя
    read({ userId: jwt.user._id }, { t: jwt.token }, signal).then((data) => {
      if (data && data.error) {
        console.log(data.error)
      } else {
        setValues({ ...values, user: {_id: data._id, name: data.name, avatar: data.avatar} })
      }
    })

    return function cleanup() {
      abortController.abort()
    }
  }, [])
  const clickComment = (event) => {
    event.preventDefault()
    const commentData = {
      _id: nanoid(),
      text: values.text,
      postedBy: values.user,
      created: Date.now(),
    }
    comment(
      {
        userId: jwt.user._id,
      },
      {
        t: jwt.token,
      },
      postId,
      commentData
    ).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error })
      } else {
        addComment(postId, commentData)
        setValues({ ...values, text: "" })
      }
    })
  }
  return (
    <Form onSubmit={clickComment}>
      <Form.Group controlId="formComment">
        <Form.Label>Добавить комментарий</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={values.text}
          onChange={(event) => setValues({ ...values, text: event.target.value })}
        />
      </Form.Group>
      <Button variant="primary" type="submit" className="mt-3">
        Отправить
      </Button>
    </Form>
  )
}

export default CommentForm
