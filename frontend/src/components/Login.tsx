import React, { useContext, useEffect, useState } from "react"
import { Link, Navigate, useNavigate } from "react-router"
import AuthContext from "../AuthContext"

function Login() {
  const auth = useContext(AuthContext)

  const navigate = useNavigate()

  const [username, setUsername] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [errorMessage, setErrorMessage] = useState<string>("")

  useEffect(() => {
    setErrorMessage("")
  }, [username, password])

  const handleLogin = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    if ((username.trim() === "") || username.includes(" ")) {
      setErrorMessage("Enter a valid username!")
      return
    }

    if ((password.trim() === "") || password.includes(" ")) {
      setErrorMessage("Enter a valid password!")
      return
    }

    try {
      await auth.login({username, password})

      navigate("/")
    } catch (error) {
      setErrorMessage("Something went wrong.")
    }
  }

  if (auth.user) {
    return <Navigate to="/" />
  }

  return (
    <div className="centered-wrapper">
      <div className="auth-container">
	<div className="centered-wrapper">
          <h2>Login</h2>

          <form onSubmit={handleLogin}>
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

            <label htmlFor="userPassword">Password</label><br/>
            <input
	      name="userPassword"
	      id="userPassword"
	      type="password"
	      placeholder="password..."
	      required
	      onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setPassword(e.target.value) }}
	      value={password}
	    /><br/>

	    <div className="centered-wrapper">
	      {errorMessage && <p className="error-message">{errorMessage}</p>}
              <button className="btn-primary" type="submit">Login</button>
	    </div>
          </form>

          <p>
               Don't have an account? <Link to="/register">Register</Link>
          </p>
	</div>
      </div>
    </div>
  )
}

export default Login
