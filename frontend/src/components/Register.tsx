import React, { useEffect, useState } from "react"
import { Link } from "react-router"

function Register() {
  const [username, setUsername] = useState<string>("")
  const [password1, setPassword1] = useState<string>("")
  const [password2, setPassword2] = useState<string>("")
  const [errorMessage, setErrorMessage] = useState<string>("")

  useEffect(() => {
    setErrorMessage("")
  }, [username, password1, password2])

  const handleRegister = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    if ((username.trim() === "") || username.includes(" ")) {
      setErrorMessage("Enter a valid username!")
      return
    }

    if ((password1.trim() === "") || password1.includes(" ")) {
      setErrorMessage("Enter a valid password!")
      return
    }

    if (password1 !== password2) {
      setErrorMessage("Passwords doesn't match!")
      return
    }

    console.log("reg")
  }

  return (
    <div className="centered-wrapper">
      <div className="auth-container">
	<div className="centered-wrapper">
          <h2>Registration</h2>

          <form onSubmit={handleRegister}>
            <label htmlFor="userName">Username</label><br/>
            <input
	      name="userName"
	      id="userName"
	      type="text"
	      placeholder="username..."
	      required
	      onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setUsername(e.target.value) }}
	      value={username}
	    /><br/>

            <label htmlFor="userPassword1">Password</label><br/>
            <input
	      name="userPassword1"
	      id="userPassword1"
	      type="password"
	      placeholder="password..."
	      required
	      onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setPassword1(e.target.value) }}
	      value={password1}
	    /><br/>

            <label htmlFor="userPassword2">Confirm password</label><br/>
            <input
	      name="userPassword2"
	      id="userPassword2"
	      type="password"
	      placeholder="confirm password..."
	      required
	      onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setPassword2(e.target.value) }}
	      value={password2}
	    /><br/>

	    <div className="centered-wrapper">
	      {errorMessage && <p className="error-message">{errorMessage}</p>}
              <button type="submit">Register</button>
	    </div>
          </form>

          <p>
               Already have an account? <Link to="/login">Login</Link>
          </p>
	</div>
      </div>
    </div>
  )
}

export default Register
