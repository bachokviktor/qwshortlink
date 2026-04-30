import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import api from "../api"
import "../i18n"

interface PropsInterface {
  setIsChangingPassword: (value: boolean) => void;
}

function PasswordChange({setIsChangingPassword}: PropsInterface) {
  const {t} = useTranslation()

  const [password, setPassword] = useState<string>("")
  const [newPassword, setNewPassword] = useState<string>("")
  const [errorMessage, setErrorMessage] = useState<string>("")

  useEffect(() => {
    setErrorMessage("")
  }, [password, newPassword])

  const changePassword = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    if ((newPassword.trim() === "") || newPassword.includes(" ") || (newPassword.length < 8)) {
      setErrorMessage(t("validation.passwordRequirements"))
      return
    }

    if (password === newPassword) {
      setErrorMessage(t("validation.samePasswords"))
      return
    }

    try {
      await api.put("users/user/password/", {
        password: password,
        new_password: newPassword
      })

      setIsChangingPassword(false)
    } catch (error) {
      setErrorMessage(t("passwordChangePage.error"))
    }
  }

  return (
    <div className="fl-center-main fl-center-cross vertical-padding">
      <title>{`${t("passwordChangePage.title")} - QWShortLink`}</title>

      <div className="card fl-col fl-gap">
        <h2>{t("passwordChangePage.title")}</h2>

        <form onSubmit={changePassword}>
          <div className="fl-col">
            <label htmlFor="oldPassword">{t("auth.oldPassword")}</label>
            <input
              name="oldPassword"
              id="oldPassword"
              type="password"
              placeholder="Password..."
              required
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setPassword(e.target.value) }}
              value={password}
            />
          </div>

          <div className="fl-col">
            <label htmlFor="newPassword">{t("auth.newPassword")}</label>
            <input
              name="newPassword"
              id="newPassword"
              type="password"
              placeholder="New password..."
              required
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setNewPassword(e.target.value) }}
              value={newPassword}
            />
          </div>

          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <button className="btn btn-primary" type="submit">{t("actions.change")}</button>
          <button className="btn btn-neutral" onClick={() => {setIsChangingPassword(false)}}>{t("actions.cancel")}</button>
        </form>
      </div>
    </div>
  )
}

export default PasswordChange
