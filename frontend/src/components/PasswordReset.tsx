import React, { useState } from "react"
import api from "../api"

interface PropsInterface {
  setIsResettingPassword: (value: boolean) => void;
}

function PasswordReset({setIsResettingPassword}: PropsInterface) {
  const [password, setPassword] = useState<string>("")
  const [newPassword, setNewPassword] = useState<string>("")
  const [errorMessage, setErrorMessage] = useState<string>("")

  const resetPassword = async (e: React.SubmitEvent<HTMLFormElement>) => {
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

      setIsResettingPassword(false)
    } catch (error) {
      setErrorMessage("Failed to reset password.")
    }
  }

  return (
    <div className="centered-wrapper">
      <div className="auth-container">
	<div className="centered-wrapper">
          <h2>Reset Password</h2>

          <form onSubmit={resetPassword}>
	    <label htmlFor="oldPassword">Old password</label><br/>
            <input
	      name="oldPassword"
	      id="oldPassword"
	      type="password"
	      placeholder="Password..."
	      required
	      onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setPassword(e.target.value) }}
	      value={password}
	    /><br/>

            <label htmlFor="newPassword">New password</label><br/>
            <input
	      name="newPassword"
	      id="newPassword"
	      type="password"
	      placeholder="New password..."
	      required
	      onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setNewPassword(e.target.value) }}
	      value={newPassword}
	    /><br/>

	    <div className="centered-wrapper">
	      {errorMessage && <p className="error-message">{errorMessage}</p>}
	      <div>
		<button className="btn-primary" type="submit">Reset</button>
		<button className="btn-primary" onClick={() => {setIsResettingPassword(false)}}>Cancel</button>
	      </div>
	    </div>
          </form>
	</div>
      </div>
    </div>
  )
}

export default PasswordReset
