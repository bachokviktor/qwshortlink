import React, { useContext, useEffect, useState } from "react"
import { Link, Navigate, useNavigate } from "react-router"
import { GoogleLogin } from "@react-oauth/google"
import { useTranslation } from "react-i18next"
import AuthContext from "../AuthContext"
import api from "../api"
import {useNavOpen} from "./Layout"
import "../i18n"

function Register() {
  const {t} = useTranslation()

  const auth = useContext(AuthContext)
  
  const {isNavbarOpen} = useNavOpen()

  const navigate = useNavigate()

  const [username, setUsername] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [password1, setPassword1] = useState<string>("")
  const [password2, setPassword2] = useState<string>("")
  const [errorMessage, setErrorMessage] = useState<string>("")

  useEffect(() => {
    setErrorMessage("")
  }, [username, email, password1, password2])

  const handleRegister = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    if ((username.trim() === "") || username.includes(" ") || (username.length < 5)) {
      setErrorMessage(t("validation.usernameRequirements"))
      return
    }

    if ((email.trim() === "") || email.includes(" ")) {
      setErrorMessage(t("validation.invalidEmail"))
      return
    }

    if ((password1.trim() === "") || password1.includes(" ") || (password1.length < 8)) {
      setErrorMessage(t("validation.passwordRequirements"))
      return
    }

    if (password1 !== password2) {
      setErrorMessage(t("validation.mismatchPasswords"))
      return
    }

    try {
      await api.post("users/register/", {username: username, email: email, password: password1})

      navigate("/login")
    } catch (error: any) {
      if (error?.response?.status === 429) {
        setErrorMessage(t("errors.throttle", { value: error.response.headers["retry-after"] }))
      } else {
        setErrorMessage(t("errors.badResponse"))
      }
    }
  }

  if (auth.user) {
    return <Navigate to="/" />
  }

  return (
    <div className="fl-center-main fl-center-cross vertical-padding">
      <title>{`${t("auth.registration")} - QWShortLink`}</title>

      <div className="card fl-col fl-gap">
        <h2>{t("auth.registration")}</h2>

        <form onSubmit={handleRegister}>
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
            <label htmlFor="userEmail">Email</label>
            <input
              name="userEmail"
              id="userEmail"
              type="email"
              placeholder="email..."
              required
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setEmail(e.target.value) }}
              value={email}
            />
          </div>

          <div className="fl-col">
            <label htmlFor="userPassword1">{t("auth.password")}</label>
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
            <label htmlFor="userPassword2">{t("auth.confirmPassword")}</label>
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

          <button className="btn btn-primary" type="submit">{t("auth.register")}</button>
        </form>

        <hr/>

        {!isNavbarOpen &&
          <div className="google-auth">
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                if (credentialResponse.credential) {
                  try {
                    await auth.googleSignIn(credentialResponse.credential)
                  } catch (error: any) {
                    if (error?.response?.status === 403) {
                      setErrorMessage(t("errors.emailAuth"))
                    } else {
                      setErrorMessage(t("errors.badResponse"))
                    }
                  }
                }
              }}
              onError={() => {
                setErrorMessage(t("errors.badResponse"))
              }}
              theme="filled_blue"
            />
          </div>
        }

        <p>{t("registrationPage.haveAccount")} <Link to="/login">{t("auth.login")}</Link></p>
      </div>
    </div>
  )
}

export default Register
