import React from "react"
import { Navigate } from "react-router-dom"
import auth from "./auth/auth-helper.js"

const ProtectedRoute = ({ children }) => {

    const isAuthenticated = !!auth.isAuthenticated()

    if (!isAuthenticated) {
      return <Navigate to="/signin" replace />;
    }
  
    return children;
  };

export default ProtectedRoute
