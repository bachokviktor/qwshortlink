import React, { useContext, useEffect, useState } from "react"
import { Link, Navigate, useNavigate } from "react-router"
import { GoogleLogin } from "@react-oauth/google"
import { useTranslation } from "react-i18next"
import AuthContext from "../AuthContext"
import api from "../api"
import "../i18n"

import PasswordRequestReset from "./PasswordRequestReset"

interface GoogleAuthInterface {
  clientId: string;
  credential: string;
  select_by: string;
}

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
      setErrorMessage(t("validation.invalidUsername"))
      return
    }

    if ((password.trim() === "") || password.includes(" ")) {
      setErrorMessage(t("validation.invalidPassword"))
      return
    }

    try {
      await auth.login({username, password})

      navigate("/")
    } catch (error) {
      setErrorMessage(t("errors.badResponse"))
    }
  }

  const handleGoogleSignIn = async (credentialResponse: GoogleAuthInterface) => {
    try {
      const response = await api.post("auth/google/", credentialResponse)

      localStorage.setItem("access-token", response.data.access)
      localStorage.setItem("refresh-token", response.data.refresh)

      await auth.fetchUser()
    } catch (error) {
      setErrorMessage(t("errors.badResponse"))
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

        <div className="google-auth">
          <GoogleLogin
            onSuccess={credentialResponse => {
              if (credentialResponse.clientId && credentialResponse.credential && credentialResponse.select_by) {
                handleGoogleSignIn({
                  clientId: credentialResponse.clientId,
                  credential: credentialResponse.credential,
                  select_by: credentialResponse.select_by
                })
              }
            }}
            onError={() => {
              setErrorMessage(t("errors.badResponse"))
            }}
          />
        </div>

        <p>{t("loginPage.forgotPassword")} <a href="#" onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {e.preventDefault(); setIsRequestingReset(true)}}>{t("actions.reset")}</a></p>

        <p>{t("loginPage.noAccount")} <Link to="/register">{t("auth.register")}</Link></p>
      </div>
    </div>
  )
}

export default Login
