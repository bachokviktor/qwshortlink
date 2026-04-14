import React, { useContext, useEffect, useState } from "react"
import { Link, Navigate, useNavigate } from "react-router"
import AuthContext from "../AuthContext"
import api from "../api"

function Register() {
  const auth = useContext(AuthContext)

  const navigate = useNavigate()

  const [username, setUsername] = useState<string>("")
  const [password1, setPassword1] = useState<string>("")
  const [password2, setPassword2] = useState<string>("")
  const [errorMessage, setErrorMessage] = useState<string>("")

  useEffect(() => {
    setErrorMessage("")
  }, [username, password1, password2])

  const handleRegister = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    if ((username.trim() === "") || username.includes(" ") || (username.length < 5)) {
      setErrorMessage("Username must be at least 5 characters long and not contain whitespaces.")
      return
    }

    if ((password1.trim() === "") || password1.includes(" ") || (password1.length < 8)) {
      setErrorMessage("Password must be at least 8 characters long, contain letters and numbers, not contain whitespaces, and not be too common.")
      return
    }

    if (password1 !== password2) {
      setErrorMessage("Passwords doesn't match!")
      return
    }

    try {
      await api.post("users/register/", {username: username, password: password1})

      navigate("/login")
    } catch (error) {
      setErrorMessage("Something went wrong.")
    }
  }

  if (auth.user) {
    return <Navigate to="/" />
  }

  return (
    <div className="centered-wrapper">
      <div className="card fl-col fl-gap">
        <h2>Registration</h2>

        <form onSubmit={handleRegister}>
	  <div className="fl-col">
            <label htmlFor="userName">Username</label>
            <input
	      name="userName"
	      id="userName"
	      type="text"
	      placeholder="username..."
	      required
	      onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setUsername(e.target.value) }}
	      value={username}
	    />
	  </div>

	  <div className="fl-col">
            <label htmlFor="userPassword1">Password</label>
            <input
	      name="userPassword1"
	      id="userPassword1"
	      type="password"
	      placeholder="password..."
	      required
	      onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setPassword1(e.target.value) }}
	      value={password1}
	    />
	  </div>

	  <div className="fl-col">
            <label htmlFor="userPassword2">Confirm password</label>
            <input
	      name="userPassword2"
	      id="userPassword2"
	      type="password"
	      placeholder="confirm password..."
	      required
	      onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setPassword2(e.target.value) }}
	      value={password2}
	    />
	  </div>

	  {errorMessage && <p className="error-message">{errorMessage}</p>}

          <button className="btn btn-primary" type="submit">Register</button>
        </form>

	<hr/>

        <p>
             Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  )
}

export default Register
