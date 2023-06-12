import React from "react"
import { Form, Button } from "react-bootstrap"
import auth from "./../auth/auth-helper.js"
import { create } from "./api-post.js"
import { read } from "../user/api-user.js"

const PostForm = ({ addPost }) => {
  const [values, setValues] = React.useState({
    title: "",
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

  const clickPost = (event) => {
    event.preventDefault()
    const postData = {
      title: values.title,
      text: values.text,
      postedBy: values.user,
      created: Date.now(),
      comments: [],
      likes: [],
      dislikes: [],
    }
    create(
      {
        userId: jwt.user._id,
      },
      {
        t: jwt.token,
      },
      postData
    ).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error })
      } else {
        addPost({ ...postData, _id: data._id })
        setValues({ ...values, title: "", text: "" })
      }
    })
  }

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value })
  }

  return (
    <>
      <h1 className="mb-3">Новый пост</h1>
      <Form onSubmit={clickPost} className="mb-5">
        <Form.Group controlId="formTitle">
          <Form.Label>Заголовок</Form.Label>
          <Form.Control
            type="text"
            value={values.title}
            onChange={handleChange("title")}
          />
        </Form.Group>
        <Form.Group controlId="formContent" className="mt-3">
          <Form.Label>Содержание</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={values.text}
            onChange={handleChange("text")}
          />
        </Form.Group>
        <Button
          variant="primary"
          type="submit"
          disabled={values.text === ""}
          className="mt-3"
        >
          Отправить
        </Button>
      </Form>
    </>
  )
}

export default PostForm
