import { useContext } from "react"
import AuthContext from "../AuthContext"

function Profile() {
  const auth = useContext(AuthContext)

  return (
    <div>
      <h2>Welcome, {auth.user?.username}!</h2>
    </div>
  )
}

export default Profile
