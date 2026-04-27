import React, { useContext, useEffect, useState } from "react"
import { Link, Navigate, useNavigate } from "react-router"
import { useTranslation } from "react-i18next"
import AuthContext from "../AuthContext"
import "../i18n"

import PasswordRequestReset from "./PasswordRequestReset"

function Login() {
  const {t} = useTranslation()

  const auth = useContext(AuthContext)

  const navigate = useNavigate()

  const [isRequestingReset, setIsRequestingReset] = useState<boolean>(false)

  const [username, setUsername] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [errorMessage, setErrorMessage] = useState<string>("")

  useEffect(() => {
    setErrorMessage("")
  }, [username, password])

  const handleLogin = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    if ((username.trim() === "") || username.includes(" ")) {
      setErrorMessage(t("loginErrValidUsername"))
      return
    }

    if ((password.trim() === "") || password.includes(" ")) {
      setErrorMessage(t("loginErrValidPassword"))
      return
    }

    try {
      await auth.login({username, password})

      navigate("/")
    } catch (error) {
      setErrorMessage(t("loginErrResponse"))
    }
  }

  if (auth.user) {
    return <Navigate to="/" />
  }

  if (isRequestingReset) {
    return <PasswordRequestReset setIsRequestingReset={setIsRequestingReset} />
  }

  return (
    <div className="fl-center-main fl-center-cross vertical-padding">
      <title>{`${t("loginTitle")} - QWShortLink`}</title>

      <div className="card fl-col fl-gap">
        <h2>{t("loginHeader")}</h2>

        <form onSubmit={handleLogin}>
	  <div className="fl-col">
            <label htmlFor="userName">{t("loginUsername")}</label>
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
            <label htmlFor="userPassword">{t("loginPassword")}</label>
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

          <button className="btn btn-primary" type="submit">{t("loginSubmit")}</button>
        </form>

	<hr/>

	<p>{t("loginForgotPassword")} <a href="#" onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {e.preventDefault(); setIsRequestingReset(true)}}>{t("loginResetPassword")}</a></p>

        <p>{t("loginNoAccount")} <Link to="/register">{t("loginRegister")}</Link></p>
      </div>
    </div>
  )
}

export default Login
