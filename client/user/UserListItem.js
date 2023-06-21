import React from "react"
import { ListGroup, Button, Image } from "react-bootstrap"
import { useNavigate } from "react-router"
import { ArrowRight, User } from "phosphor-react"
import auth from "../auth/auth-helper.js"
import FollowProfileButton from "./FollowProfileButton.js"
import { read } from "./api-user.js"

const UserListItem = ({ user }) => {
  const navigate = useNavigate()
  // Токен и данные пользователя
  const jwt = auth.isAuthenticated()
  const [following, setFollowing] = React.useState(false)

  // Проверка подписки на пользователя
  const checkFollow = (user) => {
    const match = user.followers.some((follower) => {
      return follower._id == jwt.user._id
    })
    return match
  }

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

  React.useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    // Чтение данных для профиля пользователя
    read({ userId: user._id }, { t: jwt.token }, signal).then((data) => {
      if (data && data.error) {
        console.log(data.error)
      } else {
        let following = checkFollow(data)
        setFollowing(following)
      }
    })

    return function cleanup() {
      abortController.abort()
    }
  }, [])

  return (
    <ListGroup.Item as="li" className="d-flex flex-column py-3">
      <div className="d-flex justify-content-between align-items-center">
        {user.avatar === "" ? (
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
            src={`/api/avatar/${user.avatar}`}
            roundedCircle
            style={{
              width: "40px",
              height: "40px",
              objectFit: "cover",
            }}
          />
        )}
        <div className="ms-2 me-auto fw-bold">{user.name}</div>
        <Button
          variant="outline-secondary"
          size="sm"
          className="mx-2"
          onClick={() => navigate("/user/" + user._id)}
        >
          <ArrowRight size={16} />
        </Button>
      </div>
      <FollowProfileButton
        following={following}
        onButtonClick={clickFollowButton}
        classes="mx-5"
      />
    </ListGroup.Item>
  )
}

export default UserListItem
