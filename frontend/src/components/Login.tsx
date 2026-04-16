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
    <div className="fl-center-main fl-center-cross vertical-padding">
      <div className="card fl-col fl-gap">
        <h2>Login</h2>

        <form onSubmit={handleLogin}>
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
            <label htmlFor="userPassword">Password</label>
            <input
	      name="userPassword"
	      id="userPassword"
	      type="password"
	      placeholder="password..."
	      required
	      onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setPassword(e.target.value) }}
	      value={password}
	    />
	  </div>

	  {errorMessage && <p className="error-message">{errorMessage}</p>}

          <button className="btn btn-primary" type="submit">Login</button>
        </form>

	<hr/>

        <p>
             Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
