import React, { useContext, useEffect, useState } from "react"
import { Link, Navigate, useNavigate } from "react-router"
import { useTranslation } from "react-i18next"
import AuthContext from "../AuthContext"
import api from "../api"
import "../i18n"

import ResendVerification from "./ResendVerification"
import RequestReset from "./RequestReset"
import GoogleAuthButton from "./GoogleAuthButton"

function Login() {
  const {t} = useTranslation()

  const auth = useContext(AuthContext)

  const navigate = useNavigate()

  const [username, setUsername] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [errorMessage, setErrorMessage] = useState<string>("")

  const [isResendingVerification, setIsResendingVerification] = useState<boolean>(false)
  const [isRequestingReset, setIsRequestingReset] = useState<boolean>(false)

  useEffect(() => {
    setErrorMessage("")
  }, [username, password])

  const handleLogin = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    if ((username.trim() === "") || username.includes(" ")) {
      setErrorMessage(t("validation.invalidUsername"))
      return
    }

    if ((password.trim() === "") || password.includes(" ")) {
      setErrorMessage(t("validation.invalidPassword"))
      return
    }

    try {
      await api.post("auth/login/", {username, password})

      await auth.fetchUser()

      navigate("/")
    } catch (error) {
      setErrorMessage(t("errors.badResponse"))
    }
  }

  if (auth.user) {
    return <Navigate to="/" />
  }

  if (isResendingVerification) {
    return <ResendVerification setIsResendingVerification={setIsResendingVerification} />
  }

  if (isRequestingReset) {
    return <RequestReset setIsRequestingReset={setIsRequestingReset} />
  }

  return (
    <div className="fl-center-main fl-center-cross vertical-padding">
      <title>{`${t("auth.login")} - QWShortLink`}</title>

      <div className="card fl-col fl-gap">
        <h2>{t("auth.login")}</h2>

        <form onSubmit={handleLogin}>
          <div className="fl-col">
            <label htmlFor="userName">{t("auth.username")}</label>
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
            <label htmlFor="userPassword">{t("auth.password")}</label>
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

          <button className="btn btn-primary" type="submit">{t("actions.continue")}</button>
        </form>

        <hr/>

        <GoogleAuthButton />

        <p>{t("loginPage.noVerification")} <a href="#" onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {e.preventDefault(); setIsResendingVerification(true)}}>{t("actions.resend")}</a></p>

        <p>{t("loginPage.forgotPassword")} <a href="#" onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {e.preventDefault(); setIsRequestingReset(true)}}>{t("actions.reset")}</a></p>

        <p>{t("loginPage.noAccount")} <Link to="/register">{t("auth.register")}</Link></p>
      </div>
    </div>
  )
}

export default Login
