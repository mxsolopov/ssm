import React from "react"
import {
  Container,
  Row,
  Col,
  Image,
  Button,
  Form,
  Modal,
  Tabs,
  Tab,
} from "react-bootstrap"
import auth from "../auth/auth-helper.js"
import { read, update, remove, list } from "./api-user.js"
import { useNavigate } from "react-router"
import { useParams } from "react-router-dom"
import Layout from "../core/Layout.js"
import { Trash, PencilSimple, FloppyDisk, User } from "phosphor-react"
import FollowProfileButton from "./FollowProfileButton.js"
import FollowGrid from "./FollowGrid.js"
import PostList from "../post/PostList.js"
import { listNewsFeed } from "../post/api-post.js"
import { removeUserPosts } from "../post/api-post.js"
import { upload } from "./api-avatar.js"
import avatarTemplate from "../assets/images/avatar-template.png"

const Profile = () => {
  const { userId } = useParams()
  const [user, setUser] = React.useState({})
  const [following, setFollowing] = React.useState(false)
  const [redirectToSignin, setRedirectToSignin] = React.useState(false)
  const navigate = useNavigate()
  // На кого подписан и подписчики пользователя
  const [followingUsers, setFollowingUsers] = React.useState([])
  const [followersUsers, setFollowersUsers] = React.useState([])
  // Состояние редактирования полей профиля
  const [edit, setEdit] = React.useState(false)
  // Поля профиля
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [about, setAbout] = React.useState("")
  // Состояние модалки удаления профиля
  const [deleteModal, setDeleteModal] = React.useState(false)
  // Токен и данные пользователя
  const jwt = auth.isAuthenticated()
  // Файл аватарки
  const [avatar, setAvatar] = React.useState(null)
  const [avatarFileId, setAvatarFileId] = React.useState(null)
  // Посты
  const [posts, setPosts] = React.useState([])

  const isAuthenticated =
    auth.isAuthenticated().user && auth.isAuthenticated().user._id == user._id

  // Проверка подписки на пользователя
  const checkFollow = (user) => {
    const match = user.followers.some((follower) => {
      return follower._id == jwt.user._id
    })
    return match
  }

  // Обновление данных в профиле
  React.useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    // Чтение данных для профиля пользователя
    read({ userId: userId }, { t: jwt.token }, signal).then((data) => {
      if (data && data.error) {
        setRedirectToSignin(true)
      } else {
        let following = checkFollow(data)
        setFollowing(following)
        setUser(data)
        setName(data.name)
        setEmail(data.email)
        setAbout(data.about)
        setAvatarFileId(data.avatar)
        setPassword("")

        // Отображение данных о тех, на кого подписан
        list(signal).then((data2) => {
          if (data2 && data2.error) {
            console.log(data2.error)
          } else {
            setFollowingUsers(
              data2.filter((user) =>
                data.following.map((item) => item._id).includes(user._id)
              )
            )
            setFollowersUsers(
              data2.filter((user) =>
                data.followers.map((item) => item._id).includes(user._id)
              )
            )
          }
        })
      }
    })

    // Получение постов для профиля
    listNewsFeed(
      {
        userId: userId,
      },
      {
        t: jwt.token,
      },
      signal
    ).then((data) => {
      if (data.error) {
        console.log(data.error)
      } else {
        setPosts(data.filter((post) => post.postedBy._id === userId))
      }
    })

    return function cleanup() {
      abortController.abort()
    }
  }, [userId, edit])

  if (redirectToSignin) navigate("/signin")

  const clickFollowButton = (callApi) => {
    callApi(
      {
        userId: jwt.user._id,
      },
      {
        t: jwt.token,
      },
      user._id
    ).then((data) => {
      if (data.error) {
      } else {
        setFollowing(!following)
      }
    })
  }

  const deleteAccount = () => {
    // Удаление профиля
    remove(
      {
        userId: userId,
      },
      { t: jwt.token }
    ).then((data) => {
      if (data && data.error) {
        console.log(data.error)
      } else {
      }
    })
    // Удаление постов
    removeUserPosts(
      {
        userId: userId,
      },
      { t: jwt.token }
    ).then((data) => {
      if (data && data.error) {
        console.log(data.error)
      } else {
        auth.clearJWT(() => console.log("deleted"))
        navigate("/")
      }
    })
  }

  // Обработчик редактирования полей
  const editSubmit = () => {
    const user = {
      name: name || undefined,
      email: email || undefined,
      password: password || undefined,
      about: about || undefined,
    }
    update(
      {
        userId: userId,
      },
      {
        t: jwt.token,
      },
      user
    ).then((data) => {
      setUser(data)
      setPassword("")
      setEdit(false)
    })
  }

  // Сохраняем выбранный файл аватарки в состоянии компонента
  const handleAvatarChange = (e) => {
    setAvatar(e.target.files[0])
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    upload(avatar, userId)
      .then((data) => {
        setAvatar(null)
        setAvatarFileId(data.fileId)
        console.log("Аватар загружен:", data.fileId)
      })
      .catch((error) => {
        console.error("Ошибка при загрузке аватарки:", error)
      })
  }

  const addComment = (postId, comment) => {
    const updatedPosts = posts.map((post) => {
      if (post._id === postId) {
        const updatedComments = [...post.comments, comment]
        return { ...post, comments: updatedComments }
      }
      return post
    })
    setPosts(updatedPosts)
  }

  const updatePost = (postId, newData) => {
    setPosts(() => {
      const updatedPosts = posts.map((post) => {
        if (post._id === postId) {
          return { ...post, ...newData }
        }
        return post
      })
      return updatedPosts
    })
  }

  return (
    <>
      <Layout>
        <Container fluid="xl">
          <Row xs={1} md={2} className="g-4">
            <Col xl={4}>
              {isAuthenticated ? (
                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="profile-photo">
                    <Form.Label style={{ cursor: "pointer" }}>
                      {avatar && (
                        <Image
                          src={URL.createObjectURL(avatar)}
                          alt="Avatar"
                          roundedCircle
                          style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "cover",
                          }}
                        />
                      )}
                      {avatarFileId && (
                        <Image
                          src={`/api/avatar/${avatarFileId}`}
                          alt="Avatar"
                          roundedCircle
                          style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "cover",
                          }}
                        />
                      )}
                      {!avatar && !avatarFileId && (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "100px",
                            height: "100px",
                            background: "#dddddd",
                            borderRadius: "50%",
                          }}
                        >
                          <User color="#b8b8b8" size={64} weight="fill" />
                        </div>
                      )}
                    </Form.Label>
                    <Form.Control
                      type="file"
                      onChange={handleAvatarChange}
                      className="d-none"
                    />
                  </Form.Group>
                  {avatar && <Button type="submit">Загрузить</Button>}
                </Form>
              ) : avatarFileId ? (
                <Image
                  src={`/api/avatar/${avatarFileId}`}
                  alt="Avatar"
                  roundedCircle
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100px",
                    height: "100px",
                    background: "#dddddd",
                    borderRadius: "50%",
                  }}
                >
                  <User color="#b8b8b8" size={64} weight="fill" />
                </div>
              )}

              <div className="d-flex">
                <div className="mt-2 me-1">{user.name}</div>
              </div>
              <div className="mt-1 text-muted">
                {new Date(
                  user.updated ? user.updated : user.created
                ).toLocaleDateString("ru-RU", {
                  day: "numeric",
                  month: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                })}
              </div>
              {auth.isAuthenticated().user &&
              auth.isAuthenticated().user._id == user._id ? (
                <Button
                  variant="outline-danger"
                  size="sm"
                  className="mt-2"
                  onClick={() => setDeleteModal(true)}
                >
                  <Trash size={16} /> Удалить аккаунт
                </Button>
              ) : (
                <FollowProfileButton
                  following={following}
                  onButtonClick={clickFollowButton}
                  classes="mt-3"
                />
              )}
            </Col>
            <Col xl={8}>
              <Row>
                <Col xl={6}>
                  {edit ? (
                    <Form.Control
                      placeholder="Имя"
                      type="text"
                      className="mb-3"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  ) : (
                    <div className="mb-3">
                      <div className="text-muted">Имя</div>
                      <div className="mt-1">{user.name}</div>
                    </div>
                  )}
                </Col>
                <Col xl={6}>
                  {edit ? (
                    <Form.Control
                      placeholder="Email"
                      type="email"
                      className="mb-3"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  ) : (
                    <div className="mb-3">
                      <div className="text-muted">Email</div>
                      <div className="mt-1">{user.email}</div>
                    </div>
                  )}
                </Col>
              </Row>
              {isAuthenticated && (
                <Row>
                  <Col xl={6}>
                    {edit ? (
                      <Form.Control
                        placeholder="Новый пароль"
                        type="password"
                        className="mb-3"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    ) : (
                      <div className="mb-3">
                        <div className="text-muted">Пароль</div>
                        <div className="mt-1">**********</div>
                      </div>
                    )}
                  </Col>
                </Row>
              )}
              <Row>
                <Col>
                  {edit ? (
                    <Form.Control
                      as="textarea"
                      placeholder="Кратко о себе"
                      className="mb-3"
                      value={about}
                      onChange={(e) => setAbout(e.target.value)}
                    />
                  ) : (
                    <div className="mb-3">
                      <div className="text-muted">О себе</div>
                      <div className="mt-1">{user.about}</div>
                    </div>
                  )}
                </Col>
              </Row>
              <hr />
              {isAuthenticated && (
                <Button
                  variant="outline-primary"
                  size="md"
                  className="float-end"
                  onClick={() => {
                    setEdit(true)
                    if (edit) {
                      editSubmit()
                    }
                  }}
                >
                  <span className="d-inline-block me-1">
                    {edit ? (
                      <FloppyDisk size={16} />
                    ) : (
                      <PencilSimple size={16} />
                    )}
                  </span>
                  {edit ? "Сохранить" : "Редактировать"}
                </Button>
              )}
            </Col>
          </Row>
          <div className="mt-5">
            <Row>
              <Tabs
                defaultActiveKey="profile"
                id="justify-tab-example"
                className="mb-3"
                justify
              >
                <Tab eventKey="home" title="Посты">
                  <PostList
                    posts={posts}
                    addComment={addComment}
                    updatePost={updatePost}
                  />
                </Tab>
                <Tab eventKey="profile" title="Подписан">
                  <FollowGrid followUsers={followingUsers} />
                </Tab>
                <Tab eventKey="longer-tab" title="Подписчики">
                  <FollowGrid followUsers={followersUsers} />
                </Tab>
              </Tabs>
            </Row>
          </div>
        </Container>
      </Layout>
      <Modal show={deleteModal} onHide={() => setDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Удалить аккаунт</Modal.Title>
        </Modal.Header>
        <Modal.Body>Подтвердите удаление аккаунта</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setDeleteModal(false)}>
            Отмена
          </Button>
          <Button variant="primary" onClick={() => deleteAccount()}>
            Удалить
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default Profile
