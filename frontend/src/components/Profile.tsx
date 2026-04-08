import { useContext } from "react"
import AuthContext from "../AuthContext"

function Profile() {
  const auth = useContext(AuthContext)

  return (
    <div className="container">
      <div className="user-container">
	<h2>{auth.user?.username} {auth.user?.is_staff && "(staff)"}</h2>
	<p>First name: </p>
	<p>Last name: </p>
	<p>Email: </p>
	<button>Edit profile</button>
	<button className="btn-danger">Delete user</button>
      </div>
      <div className="links-container">
	<button>Add link</button>
	<div className="link-card">
	  <p>https://djangoproject.com/</p>
	</div>
      </div>
    </div>
  )
}

export default Profile
