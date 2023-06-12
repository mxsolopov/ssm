import React from "react"
import { Routes, Route } from "react-router-dom"
import Home from "./core/Home.js"
import Signup from "./user/Signup.js"
import Users from "./user/Users.js"
import Signin from "./auth/Signin.js"
import Profile from "./user/Profile.js"
import ProtectedRoute from "./ProtectedRoute.js"

const MainRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <Users />
          </ProtectedRoute>
        }
      />
      <Route path="/signup" element={<Signup />} />
      <Route path="/signin" element={<Signin />} />
      <Route
        path="/user/:userId"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default MainRouter
