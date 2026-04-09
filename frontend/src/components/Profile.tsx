import { useContext } from "react"
import AuthContext from "../AuthContext"

function Profile() {
  const auth = useContext(AuthContext)

  return (
    <div className="centered-container">
      <h2>{auth.user?.username}</h2>
      { (auth.user?.first_name || auth.user?.last_name) && 
	<p>{auth.user?.first_name} {auth.user?.last_name}</p> }
      <p>Email: {auth.user?.email ? auth.user.email : "Not specified"}</p>
    </div>
  )
}

export default Profile
