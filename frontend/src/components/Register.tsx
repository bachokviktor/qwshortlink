import React, { useContext, useEffect, useState } from "react"
import { Link, Navigate, useNavigate } from "react-router"
import { useGoogleLogin } from "@react-oauth/google"
import { useTranslation } from "react-i18next"
import AuthContext from "../AuthContext"
import api from "../api"
import "../i18n"

function Register() {
  const {t} = useTranslation()

  const auth = useContext(AuthContext)

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

        <button className="btn btn-primary btn-google" onClick={() => googleLogin()}>
          <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#FFFFFF"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#FFFFFF"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FFFFFF"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#FFFFFF"/><path d="M1 1h22v22H1z" fill="none"/>
          </svg>
          Continue with Google
        </button>

        <p>{t("registrationPage.haveAccount")} <Link to="/login">{t("auth.login")}</Link></p>
      </div>
    </div>
  )
}

export default Register
