import React from "react"
import { Container, Navbar, Button, Stack } from "react-bootstrap"
import { SignOut, UserSwitch } from "phosphor-react"
import logo from "../assets/images/logo.svg"
import { useNavigate } from "react-router-dom"
import auth from "../auth/auth-helper.js"
import { useMediaQuery } from "react-responsive"

const Layout = ({ children }) => {
  const isAuthenticated = auth.isAuthenticated()
  const navigate = useNavigate()
  const headerRef = React.useRef(null)
  const footerRef = React.useRef(null)
  const [contentMinHeight, setContentMinHeight] = React.useState(0)
  React.useEffect(() => {
    setContentMinHeight(
      window.innerHeight -
        headerRef.current.offsetHeight -
        footerRef.current.offsetHeight
    )
  }, [])
  const isMobile = useMediaQuery({ maxWidth: 600 })

  return (
    <>
      <Navbar
        bg="dark"
        expand="lg"
        variant="dark"
        className="sticky-top"
        ref={headerRef}
      >
        <Container fluid="xl">
          <Navbar.Brand role="button" onClick={() => navigate("/")}>
            <UserSwitch size={32} weight="fill" /> Solopov Space
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse
            id="basic-navbar-nav"
            className="justify-content-end"
          >
            <Stack
              direction={isMobile ? "vertical" : "horizontal"}
              gap={3}
              className="mt-3 mt-sm-0"
            >
              {isAuthenticated && (
                <Button
                  variant="outline-light"
                  onClick={() => navigate("/users")}
                >
                  Пользователи
                </Button>
              )}{" "}
              {isAuthenticated ? (
                <>
                  <Button
                    variant="primary"
                    onClick={() =>
                      navigate(`/user/${isAuthenticated.user._id}`)
                    }
                  >
                    Профиль
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      auth.clearJWT(() => {
                        navigate("/")
                        window.location.reload()
                      })
                    }}
                  >
                    {isMobile ? (
                      "Выйти"
                    ) : (
                      <SignOut
                        size={16}
                        style={{ transform: "translateY(-2px)" }}
                      />
                    )}
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="primary" onClick={() => navigate("/signin")}>
                    Войти
                  </Button>{" "}
                  <Button
                    variant="secondary"
                    onClick={() => navigate("/signup")}
                  >
                    Регистрация
                  </Button>{" "}
                </>
              )}
            </Stack>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <main
        className="d-flex py-5"
        style={{ minHeight: contentMinHeight + "px" }}
      >
        {children}
      </main>
      <footer className="bg-light text-center text-lg-start" ref={footerRef}>
        <div className="text-center p-3">
          © 2023 Все права защищены: Solopov Social Network
        </div>
      </footer>
    </>
  )
}
export default Layout
