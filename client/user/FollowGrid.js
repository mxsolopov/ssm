import React from "react"
import { Image, Button, ListGroup } from "react-bootstrap"
import { useNavigate } from "react-router"
import { ArrowRight, User } from "phosphor-react"

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
            </ListGroup.Item>
          )
        })}
      </ListGroup>
    </div>
  )
}

export default FollowGrid
