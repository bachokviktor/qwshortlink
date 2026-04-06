import { useContext } from "react"
import { Navigate } from "react-router"
import AuthContext from "../AuthContext"

function Logout() {
  const { logout } = useContext(AuthContext)

  logout()

  return <Navigate to="/login" />
}

export default Logout
