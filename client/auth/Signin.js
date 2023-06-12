import React from "react"
import { Container, Form, Button, Row, Col, Image } from "react-bootstrap"
import Layout from "../core/Layout.js"
import mobile_login from "../assets/images/mobile_login.svg"
import { useNavigate } from "react-router"
import auth from "./../auth/auth-helper.js"
import { signin } from "./api-auth.js"

const Signin = (props) => {
  const navigate = useNavigate()

  const initValues = {
    password: "",
    email: "",
    error: "",
  }

  const [values, setValues] = React.useState(initValues)

  const clickSubmit = (event) => {
    event.preventDefault()
    const user = {
      email: values.email || undefined,
      password: values.password || undefined,
    }

    signin(user).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error })
      } else {
        auth.authenticate(data, () => {
          setValues({ ...values, error: "" })
        })
        setValues(initValues)
        navigate("/")
      }
    })
  }

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value })
  }

  return (
    <>
      <Layout>
        <Container className="align-self-center">
          <Row xs={1} md={2} className="align-items-center">
            <Col>
              <Image src={mobile_login} className="w-100" />
            </Col>
            <Col>
              <h1 className="mb-4 text-center mt-4 mt-md-0">Авторизация</h1>
              <Form className="px-0 px-md-5">
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
                  Войти
                </Button>
              </Form>
            </Col>
          </Row>
        </Container>
      </Layout>
    </>
  )
}

export default Signin
