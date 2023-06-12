import React from "react"
import { ListGroup } from "react-bootstrap"
import { list } from "./api-user.js"
import UserListItem from "./UserListItem.js"
import auth from "../auth/auth-helper.js"
import EmptyBlock from "../core/EmptyBlock.js"

const Sidebar = () => {
  const [users, setUsers] = React.useState([])
  const id = auth.isAuthenticated().user._id

  const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = (Math.floor(Math.random() * (i + 1))[(array[i], array[j])] = [
        array[j],
        array[i],
      ])
    }
    return array
  }

  React.useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    list(signal).then((data) => {
      if (data && data.error) {
        console.log(data.error)
      } else {
        setUsers(shuffle(data.filter((user) => user._id !== id && !user.followers.includes(id))))
      }
    })

    return function cleanup() {
      abortController.abort()
    }
  }, [])

  return (
    <ListGroup as="ol" className="mt-4">
      {users.length !== 0 ? (
        users.map((user, i) => {
          if (i <= 10) {
            return <UserListItem key={i} user={user} iterator={i} />
          }
        })
      ) : (
        <EmptyBlock />
      )}
    </ListGroup>
  )
}

export default Sidebar
