import { useContext, useEffect } from "react"
import { useNavigate } from "react-router"
import AuthContext from "../AuthContext"
import api from "../api"

function Logout() {
  const auth = useContext(AuthContext)

  const navigate = useNavigate()

  useEffect(() => {
    handleLogout()
  }, [])

  const handleLogout = async () => {
    try {
      await api.post("auth/logout/")

      await auth.fetchUser()

      navigate("/")
    } catch (error) {
      navigate("/")
    }
  }

  return <p>Logout...</p>
}

export default Logout
