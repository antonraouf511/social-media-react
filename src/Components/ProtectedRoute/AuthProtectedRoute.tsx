import { Navigate } from "react-router-dom"
import React from "react"

export default function AuthProtectedRoute({ children }: { children: React.ReactNode }) {
  if (!localStorage.getItem("userToken")) {
    return <>{children}</>
  } else {
    return <Navigate to="/home" />
  }
}
