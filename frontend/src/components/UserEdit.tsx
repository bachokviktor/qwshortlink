import React, { useContext, useState } from "react"
import AuthContext from "../AuthContext"
import api from "../api"

interface PropsInterface {
  setIsEditingUser: (value: boolean) => void;
}

function UserEdit({setIsEditingUser}: PropsInterface) {
  const auth = useContext(AuthContext)

  const [editUsername, setEditUsername] = useState<string>(
    auth.user?.username ? auth.user.username : ""
  )
  const [editEmail, setEditEmail] = useState<string>(
    auth.user?.email ? auth.user.email : ""
  )
  const [editFirstName, setEditFirstName] = useState<string>(
    auth.user?.first_name ? auth.user.first_name : ""
  )
  const [editLastName, setEditLastName] = useState<string>(
    auth.user?.last_name ? auth.user.last_name : ""
  )

  const [errorMessage, setErrorMessage] = useState<string>("")

  const editUser = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    if ((editUsername.trim() === "") || editUsername.includes(" ") || (editUsername.length < 5)) {
      setErrorMessage("Username must be at least 5 characters long and not contain whitespaces.")
      return
    }

    try {
      await api.put("users/user/", {
	username: editUsername,
	email: editEmail,
	first_name: editFirstName,
	last_name: editLastName
      })

      setIsEditingUser(false)
      auth.fetchUser()
    } catch (error) {
      setErrorMessage("Something went wrong.")
    }
  }

  return (
    <div className="centered-wrapper">
      <div className="auth-container">
	<div className="centered-wrapper">
          <h2>Edit User</h2>

          <form onSubmit={editUser}>
            <label htmlFor="editUsername">Username</label><br/>
            <input
	      name="editUsername"
	      id="editUsername"
	      type="text"
	      placeholder="Username..."
	      required
	      onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setEditUsername(e.target.value) }}
	      value={editUsername}
	    /><br/>

	    <label htmlFor="editEmail">Email</label><br/>
            <input
	      name="editEmail"
	      id="editEmail"
	      type="email"
	      placeholder="Email..."
	      onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setEditEmail(e.target.value) }}
	      value={editEmail}
	    /><br/>

	    <label htmlFor="editLastName">Last Name</label><br/>
            <input
	      name="editLastName"
	      id="editLastName"
	      type="text"
	      placeholder="Last name..."
	      onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setEditLastName(e.target.value) }}
	      value={editLastName}
	    /><br/>

	    <label htmlFor="editFirstName">First Name</label><br/>
            <input
	      name="editFirstName"
	      id="editFirstName"
	      type="text"
	      placeholder="First name..."
	      onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setEditFirstName(e.target.value) }}
	      value={editFirstName}
	    /><br/>

	    <div className="centered-wrapper">
	      {errorMessage && <p className="error-message">{errorMessage}</p>}
	      <div>
		<button className="btn-primary" type="submit">Save</button>
		<button className="btn-primary" onClick={() => {setIsEditingUser(false)}}>Cancel</button>
	      </div>
	    </div>
          </form>
	</div>
      </div>
    </div>
  )
}

export default UserEdit
