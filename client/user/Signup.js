import React from "react"
import {
  Container,
  Form,
  Button,
  Row,
  Col,
  Image,
  Modal,
} from "react-bootstrap"
import Layout from "../core/Layout.js"
import registration from "../assets/images/registration.svg"
import { create } from "./api-user.js"
import { useNavigate } from "react-router"

const Signup = () => {
  const navigate = useNavigate()

  const initValues = {
    name: "",
    password: "",
    email: "",
    open: false,
    error: "",
  }

  const [values, setValues] = React.useState(initValues)

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value })
  }

  const clickSubmit = (event) => {
    event.preventDefault()
    const user = {
      name: values.name || undefined,
      email: values.email || undefined,
      password: values.password || undefined,
    }
    create(user).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error })
      } else {
        setValues({ ...values, error: "", open: true })
      }
    })
  }

  const afterSignUp = () => {
    setValues(initValues)
    navigate("/signin")
  }

  return (
    <>
      <Layout>
        <Container className="align-self-center">
          <Row xs={1} md={2} className="align-items-center">
            <Col>
              <Image src={registration} className="w-100" />
            </Col>
            <Col>
              <h1 className="mb-4 text-center mt-4 mt-md-0">Регистрация</h1>
              <Form className="px-0 px-md-5">
                <Form.Group className="mb-3" controlId="signUpName">
                  <Form.Label>Имя</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Введите имя"
                    onChange={handleChange("name")}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="signUpEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Введите email"
                    onChange={handleChange("email")}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="signUpPassword">
                  <Form.Label>Пароль</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Введите пароль"
                    onChange={handleChange("password")}
                  />
                </Form.Group>
                <Form.Text className="text-danger d-block mb-3">
                  {values.error}
                </Form.Text>
                <Button variant="primary" type="submit" onClick={clickSubmit}>
                  Зарегистрироваться
                </Button>
              </Form>
            </Col>
          </Row>
        </Container>
      </Layout>
      <Modal show={values.open} onHide={afterSignUp}>
        <Modal.Header closeButton>
          <Modal.Title>Успешная регистрация</Modal.Title>
        </Modal.Header>
        <Modal.Body>Ваш профиль создан. Благодарим за регистрацию!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={afterSignUp}>
            Закрыть
          </Button>
          <Button variant="primary" onClick={afterSignUp}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default Signup
