import { Navigate } from "react-router-dom"
import React from "react"

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  if (!localStorage.getItem("userToken")) {
    return <Navigate to={"/login"} />
  } else {
    return <>{children}</>
  }
}
