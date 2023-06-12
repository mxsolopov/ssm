import React from "react"
import { Container, ListGroup } from "react-bootstrap"
import Layout from "../core/Layout.js"
import { list } from "./api-user.js"
import UserListItem from "./UserListItem.js"
import auth from "../auth/auth-helper.js"
import EmptyBlock from "../core/EmptyBlock.js"

const Users = () => {
  const [users, setUsers] = React.useState([])

  const id = auth.isAuthenticated().user._id

  React.useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    list(signal).then((data) => {
      if (data && data.error) {
        console.log(data.error)
      } else {
        setUsers(data.filter((user) => user._id !== id))
      }
    })

    return function cleanup() {
      abortController.abort()
    }
  }, [])

  return (
    <Layout>
      <Container fluid="xl">
        <h1>Пользователи</h1>
        <ListGroup as="ol" className="mt-4">
          {users.length !== 0 ? (
            users.map((user, i) => {
              return <UserListItem key={i} user={user} iterator={i} />
            })
          ) : (
            <EmptyBlock />
          )}
        </ListGroup>
      </Container>
    </Layout>
  )
}

export default Users
