import { useEffect, useContext } from "react"
import { useNavigate } from "react-router"

import AuthContext from "../AuthContext"
import api from "../api"

function GoogleCallback() {
  const auth = useContext(AuthContext)

  const navigate = useNavigate()

  useEffect(() => {
    handleGoogleCallback()
  }, [])

  const handleGoogleCallback = async () => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get("code")

    try {
      await api.post("auth/google/", { code })

      await auth.fetchUser()

      navigate("/", {replace: true})
    } catch (error) {
      navigate("/", {replace: true})
    }
  }

  return (
    <p>Loading...</p>
  )
}

export default GoogleCallback
