import React, { useState, useEffect } from "react"
import api from "../api"

interface PropsInterface {
  setIsChangingPassword: (value: boolean) => void;
}

function PasswordChange({setIsChangingPassword}: PropsInterface) {
  const [password, setPassword] = useState<string>("")
  const [newPassword, setNewPassword] = useState<string>("")
  const [errorMessage, setErrorMessage] = useState<string>("")

  useEffect(() => {
    setErrorMessage("")
  }, [password, newPassword])

  const changePassword = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    if ((newPassword.trim() === "") || newPassword.includes(" ") || (newPassword.length < 8)) {
      setErrorMessage("Password must be at least 8 characters long, contain letters and numbers, not contain whitespaces, and not be too common.")
      return
    }

    if (password === newPassword) {
      setErrorMessage("Passwords must be different.")
      return
    }

    try {
      await api.put("users/user/password/", {
	password: password,
	new_password: newPassword
      })

      setIsChangingPassword(false)
    } catch (error) {
      setErrorMessage("Failed to change password.")
    }
  }

  return (
    <div className="centered-wrapper">
      <div className="card fl-col fl-gap">
        <h2>Change Password</h2>

        <form onSubmit={changePassword}>
	  <div className="fl-col">
	    <label htmlFor="oldPassword">Old password</label>
            <input
	      name="oldPassword"
	      id="oldPassword"
	      type="password"
	      placeholder="Password..."
	      required
	      onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setPassword(e.target.value) }}
	      value={password}
	    />
	  </div>

	  <div className="fl-col">
            <label htmlFor="newPassword">New password</label>
            <input
	      name="newPassword"
	      id="newPassword"
	      type="password"
	      placeholder="New password..."
	      required
	      onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setNewPassword(e.target.value) }}
	      value={newPassword}
	    />
	  </div>

	  {errorMessage && <p className="error-message">{errorMessage}</p>}

	  <button className="btn btn-primary" type="submit">Change</button>
	  <button className="btn btn-neutral" onClick={() => {setIsChangingPassword(false)}}>Cancel</button>
        </form>
      </div>
    </div>
  )
}

export default PasswordChange
