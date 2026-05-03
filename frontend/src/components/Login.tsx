import React, { useContext, useEffect, useState } from "react"
import { Link, Navigate, useNavigate } from "react-router"
import { useGoogleLogin } from "@react-oauth/google"
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

  const googleLogin = useGoogleLogin({
    onSuccess: async (codeResponse: any) => {
      try {
        await auth.googleSignIn(codeResponse)

        navigate("/")
      } catch (error) {
        setErrorMessage(t("errors.badResponse"))
      }
    },
    onError: () => {
      setErrorMessage(t("errors.badResponse"))
    },
    flow: "auth-code",
  })

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

        <button className="btn btn-primary btn-google" onClick={() => googleLogin()}>
          <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#FFFFFF"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#FFFFFF"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FFFFFF"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#FFFFFF"/><path d="M1 1h22v22H1z" fill="none"/>
          </svg>
          Continue with Google
        </button>

        <p>{t("loginPage.forgotPassword")} <a href="#" onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {e.preventDefault(); setIsRequestingReset(true)}}>{t("actions.reset")}</a></p>

        <p>{t("loginPage.noAccount")} <Link to="/register">{t("auth.register")}</Link></p>
      </div>
    </div>
  )
}

export default Login
