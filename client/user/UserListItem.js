import React from "react"
import { ListGroup, Button, Image } from "react-bootstrap"
import { useNavigate } from "react-router"
import { ArrowRight } from "phosphor-react"
import auth from "../auth/auth-helper.js"
import FollowProfileButton from "./FollowProfileButton.js"
import { read } from "./api-user.js"
import avatarTemplate from "../assets/images/avatar-template.png"

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
    <ListGroup.Item
      as="li"
      className="d-flex justify-content-between align-items-center"
    >
      <Image
        src={user.avatar === "" ? avatarTemplate : `/api/avatar/${user.avatar}`}
        rounded
        style={{
          width: "40px",
          height: "40px",
          objectFit: "cover",
        }}
      />
      <div className="ms-2 me-auto fw-bold">{user.name}</div>
      <FollowProfileButton
        following={following}
        onButtonClick={clickFollowButton}
      />
      <Button
        variant="outline-secondary"
        size="sm"
        className="mx-2"
        onClick={() => navigate("/user/" + user._id)}
      >
        <ArrowRight size={16} />
      </Button>
    </ListGroup.Item>
  )
}

export default UserListItem
