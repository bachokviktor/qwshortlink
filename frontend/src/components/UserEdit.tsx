import React, { useContext, useState, useEffect } from "react"
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

  useEffect(() => {
    setErrorMessage("")
  }, [editUsername, editEmail, editFirstName, editLastName])

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
    <div className="fl-center-main fl-center-cross">
      <div className="card fl-col fl-gap">
	<h2>Edit User</h2>

        <form onSubmit={editUser}>
	  <div className="fl-col">
            <label htmlFor="editUsername">Username</label>
            <input
	      name="editUsername"
	      id="editUsername"
	      type="text"
	      placeholder="Username..."
	      required
	      onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setEditUsername(e.target.value) }}
	      value={editUsername}
	    />
	  </div>

	  <div className="fl-col">
	    <label htmlFor="editEmail">Email</label>
            <input
	      name="editEmail"
	      id="editEmail"
	      type="email"
	      placeholder="Email..."
	      onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setEditEmail(e.target.value) }}
	      value={editEmail}
	    />
	  </div>

	  <div className="fl-col">
	    <label htmlFor="editLastName">Last Name</label>
            <input
	      name="editLastName"
	      id="editLastName"
	      type="text"
	      placeholder="Last name..."
	      onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setEditLastName(e.target.value) }}
	      value={editLastName}
	    />
	  </div>

	  <div className="fl-col">
	    <label htmlFor="editFirstName">First Name</label>
            <input
	      name="editFirstName"
	      id="editFirstName"
	      type="text"
	      placeholder="First name..."
	      onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setEditFirstName(e.target.value) }}
	      value={editFirstName}
	    />
	  </div>

	    {errorMessage && <p className="error-message">{errorMessage}</p>}

	    <button className="btn btn-primary" type="submit">Save</button>
	    <button className="btn btn-neutral" onClick={() => {setIsEditingUser(false)}}>Cancel</button>
          </form>
      </div>
    </div>
  )
}

export default UserEdit
