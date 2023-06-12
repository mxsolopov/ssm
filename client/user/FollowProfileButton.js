import React from "react"
import { Button } from "react-bootstrap"
import PropTypes from "prop-types"
import { unfollow, follow } from "./api-user.js"

export default function FollowProfileButton(props) {
  const followClick = () => {
    props.onButtonClick(follow)
  }
  const unfollowClick = () => {
    props.onButtonClick(unfollow)
  }
  return (
    <div>
      {props.following ? (
        <Button size="sm" className={props.classes} onClick={unfollowClick}>Отписаться</Button>
      ) : (
        <Button size="sm" className={props.classes} onClick={followClick}>Подписаться</Button>
      )}
    </div>
  )
}
FollowProfileButton.propTypes = {
  following: PropTypes.bool.isRequired,
  onButtonClick: PropTypes.func.isRequired,
}
