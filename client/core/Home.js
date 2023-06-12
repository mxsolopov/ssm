import React from "react"
import { Container, Row, Col, Image, Button } from "react-bootstrap"
import Layout from "./Layout.js"
import Feed from "../post/Feed.js"
import auth from "../auth/auth-helper.js"
import social_networking from "../assets/images/social_networking.svg"
import { useMediaQuery } from "react-responsive"
import { useNavigate } from "react-router"
import { Note, ThumbsUp, UsersThree } from "phosphor-react"
import Sidebar from "../user/Sidebar.js"

const Home = () => {
  const isAuthenticated = auth.isAuthenticated()
  const isMobile = useMediaQuery({ maxWidth: 600 })
  const navigate = useNavigate()
  return (
    <Layout>
      {isAuthenticated ? (
        <Container>
          <Row>
            <Col lg={8}>
              <Feed />
            </Col>
            <Col lg={4}>
              <h2>Рекомендации</h2>
              <Sidebar />
            </Col>
          </Row>
        </Container>
      ) : (
        <Container fluid>
          <main>
            <section>
              <div className="d-flex flex-column align-items-center">
                <Image
                  src={social_networking}
                  className={isMobile ? "w-100" : "w-25"}
                />
                <h1 className="text-center mt-3 mt-xl-5">
                  Добро пожаловать в социальную сеть <b>Solopov Space</b>
                </h1>
                <div className="mt-3 mt-xl-5">
                  <Button variant="primary" onClick={() => navigate("/signin")}>
                    Войти
                  </Button>{" "}
                  <Button
                    variant="secondary"
                    onClick={() => navigate("/signup")}
                  >
                    Регистрация
                  </Button>{" "}
                </div>
              </div>
            </section>
            <section
              className="p-5 mt-5"
              style={{
                backgroundColor: "var(--bs-gray-100)",
                marginLeft: "calc(var(--bs-gutter-x) * -0.5)",
                marginRight: "calc(var(--bs-gutter-x) * -0.5)",
                marginBottom: "-3rem",
                borderBottom: "1px solid var(--bs-gray-400)"
              }}
            >
              <h2 className="text-center mb-4">Основные функции</h2>
              <Row>
                <Col md={4} className="text-center">
                  <div
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "50%",
                      border: "2px solid #000",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 15px auto",
                    }}
                  >
                    <Note size={32} />
                  </div>

                  <h3>Посты</h3>
                  <p className="px-lg-5">
                    Публикуйте интересные посты, получайте и оставляйте комментарии.
                  </p>
                </Col>
                <Col md={4} className="text-center">
                  <div
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "50%",
                      border: "2px solid #000",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 15px auto",
                    }}
                  >
                    <ThumbsUp size={32} />
                  </div>

                  <h3>Реакции</h3>
                  <p className="px-lg-5">
                    Оставляйте лайки и дизлайки для постов.
                  </p>
                </Col>
                <Col md={4} className="text-center">
                  <div
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "50%",
                      border: "2px solid #000",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 15px auto",
                    }}
                  >
                    <UsersThree size={32} />
                  </div>
                  <h3>Подписчики</h3>
                  <p className="px-lg-5">
                    Подписывайтесь на интересных пользователей и следите за их публикациями.
                  </p>
                </Col>
              </Row>
            </section>
          </main>
        </Container>
      )}
    </Layout>
  )
}
export default Home
