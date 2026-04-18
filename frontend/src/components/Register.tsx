import React, { useContext, useEffect, useState } from "react"
import { Link, Navigate, useNavigate } from "react-router"
import { useTranslation } from "react-i18next"
import AuthContext from "../AuthContext"
import api from "../api"
import "../i18n"

function Register() {
  const {t} = useTranslation()

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
      setErrorMessage(t("registerErrValidUsername"))
      return
    }

    if ((password1.trim() === "") || password1.includes(" ") || (password1.length < 8)) {
      setErrorMessage(t("registerErrValidPassword"))
      return
    }

    if (password1 !== password2) {
      setErrorMessage(t("registerErrMismatch"))
      return
    }

    try {
      await api.post("users/register/", {username: username, password: password1})

      navigate("/login")
    } catch (error: any) {
      if (error?.response?.status === 429) {
	setErrorMessage(`${t("registerErrThrottle1")} ${error.response.headers["retry-after"]} ${t("registerErrThrottle2")}`)
      } else {
	setErrorMessage(t("registerErrResponse"))
      }
    }
  }

  if (auth.user) {
    return <Navigate to="/" />
  }

  return (
    <div className="fl-center-main fl-center-cross vertical-padding">
      <title>{`${t("registerTitle")} - QWShortLink`}</title>

      <div className="card fl-col fl-gap">
        <h2>{t("registerHeading")}</h2>

        <form onSubmit={handleRegister}>
	  <div className="fl-col">
            <label htmlFor="userName">{t("registerUsername")}</label>
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
            <label htmlFor="userPassword1">{t("registerPassword")}</label>
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
            <label htmlFor="userPassword2">{t("registerConfirmPassword")}</label>
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

          <button className="btn btn-primary" type="submit">{t("registerSubmit")}</button>
        </form>

	<hr/>

        <p>{t("registerHaveAccount")} <Link to="/login">{t("registerLogin")}</Link></p>
      </div>
    </div>
  )
}

export default Register
