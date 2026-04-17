import React, { useState, useEffect, useContext } from "react"
import AuthContext from "../AuthContext"
import api from "../api"

interface PropsInterface {
  setIsDeletingUser: (value: boolean) => void;
}

function UserDelete({setIsDeletingUser}: PropsInterface) {
  const auth = useContext(AuthContext)

  const [password, setPassword] = useState<string>("")
  const [errorMessage, setErrorMessage] = useState<string>("")

  useEffect(() => {
    setErrorMessage("")
  }, [password])

  const confirmDeleteUser = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      await api.post("token/", {username: auth.user?.username, password: password})

      await deleteUser()
    } catch (error) {
      setErrorMessage("Failed to delete user.")
    }
  }

  const deleteUser = async () => {
    try {
      await api.delete("users/user/")

      auth.logout()
    } catch (error) {
      setErrorMessage("Failed to delete user.")
    }
  }

  return (
    <div className="fl-center-main fl-center-cross vertical-padding">
      <title>Delete User - QWShortLink</title>

      <div className="card fl-col fl-gap">
        <h2>Delete your account?</h2>

	<p>To procede confirm your password.</p>

        <form onSubmit={confirmDeleteUser}>
	  <div className="fl-col">
	    <label htmlFor="password">Password</label>
            <input
	      name="password"
	      id="password"
	      type="password"
	      placeholder="Password..."
	      required
	      onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setPassword(e.target.value) }}
	      value={password}
	    />
	  </div>

	  {errorMessage && <p className="error-message">{errorMessage}</p>}

	  <button className="btn btn-danger" type="submit">Delete</button>
	  <button className="btn btn-neutral" onClick={() => {setIsDeletingUser(false)}}>Cancel</button>
        </form>
      </div>
    </div>
  )
}

export default UserDelete
