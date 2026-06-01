import React, { useState, useEffect } from "react"
import {useParams, useNavigate} from "react-router"
import {useTranslation} from "react-i18next"
import api from "../api"
import "../i18n"

function PasswordReset() {
  const {t} = useTranslation()

  const navigate = useNavigate()

  const {uid, token} = useParams()

  const [newPassword1, setNewPassword1] = useState<string>("")
  const [newPassword2, setNewPassword2] = useState<string>("")
  const [errorMessage, setErrorMessage] = useState<string>("")

  useEffect(() => {
    setErrorMessage("")
  }, [newPassword1, newPassword2])

  const handleReset = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    if ((newPassword1.trim() === "") || newPassword1.includes(" ") || (newPassword1.length < 8)) {
      setErrorMessage(t("validation.passwordRequirements"))
      return
    }

    if (newPassword1 !== newPassword2) {
      setErrorMessage(t("validation.mismatchPasswords"))
      return
    }

    try {
      await api.post(
        "auth/password/reset/confirm/",
        {
          uid: uid,
          token: token,
          new_password1: newPassword1,
          new_password2: newPassword2
        }
      )

      navigate("/")
    } catch (error) {
      setErrorMessage(t("errors.badResponse"))
    }
  }

  return (
    <div className="fl-center-main fl-center-cross vertical-padding">
      <title>Password Reset</title>

      <div className="card fl-col fl-gap">  
        <h2>Reset your password?</h2>

        <form onSubmit={handleReset}>
          <div className="fl-col">
            <label htmlFor="newPassword1">New Password</label>
            <input
              name="newPassword1"
              id="newPassword1"
              type="password"
              placeholder="New password..."
              required
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setNewPassword1(e.target.value) }}
              value={newPassword1}
            />
          </div>

          <div className="fl-col">
            <label htmlFor="newPassword2">Confirm New Password</label>
            <input
              name="newPassword2"
              id="newPassword2"
              type="password"
              placeholder="Confirm new password..."
              required
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setNewPassword2(e.target.value) }}
              value={newPassword2}
            />
          </div>

          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <button className="btn btn-primary" type="submit">{t("actions.continue")}</button>
          <button className="btn btn-neutral" type="button" onClick={() => navigate("/")}>{t("actions.goBack")}</button>
        </form>
      </div>
    </div>
  )
}

export default PasswordReset
