import React from "react"
import { Image, Button, ListGroup } from "react-bootstrap"
import { useNavigate } from "react-router"
import { ArrowRight } from "phosphor-react"
import avatarTemplate from "../assets/images/avatar-template.png"

const FollowGrid = ({ followUsers }) => {
  const navigate = useNavigate()

  return (
    <div>
      {" "}
      <ListGroup as="ol">
        {followUsers.map((user, i) => {
          return (
            <ListGroup.Item
              as="li"
              key={i}
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
        })}
      </ListGroup>
    </div>
  )
}

export default FollowGrid
