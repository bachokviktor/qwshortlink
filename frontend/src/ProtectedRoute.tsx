import { useContext } from "react"
import { Outlet, Navigate } from "react-router"
import AuthContext from "./AuthContext"

function ProtectedRoute() {
  const auth = useContext(AuthContext)

  if (auth.isLoading) {
    return <p>Loading...</p>
  }

  if (!auth.user) {
    return <Navigate to="/login" />
  }

  return <Outlet />
}

export default ProtectedRoute
