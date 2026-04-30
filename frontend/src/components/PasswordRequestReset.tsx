import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import api from "../api"
import "../i18n"

interface PropsInterface {
  setIsRequestingReset: (value: boolean) => void;
}

function PasswordRequestReset({setIsRequestingReset}: PropsInterface) {
  const {t} = useTranslation()

  const [username, setUsername] = useState<string>("")

  const [resetCode, setResetCode] = useState<string>("")
  const [password1, setPassword1] = useState<string>("")
  const [password2, setPassword2] = useState<string>("")

  const [isProceedingReset, setIsProceedingReset] = useState<boolean>(false)

  const [errorMessage, setErrorMessage] = useState<string>("")

  useEffect(() => {
    setErrorMessage("")
  }, [username, resetCode, password1, password2])

  const requestReset = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      await api.post("users/user/request-reset/", { username: username })

      setIsProceedingReset(true)
    } catch (error: any) {
      if (error?.response?.status === 429) {
        setErrorMessage(t("errors.throttle", { value: error.response.headers["retry-after"] }))
      } else {
        setErrorMessage(t("errors.badResponse"))
      }
    }
  }

  const proceedeReset = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    if ((password1.trim() === "") || password1.includes(" ") || (password1.length < 8)) {
      setErrorMessage(t("validation.passwordRequirements"))
      return
    }

    if (password1 !== password2) {
      setErrorMessage(t("validation.mismatchPasswords"))
      return
    }

    try {
      await api.post("users/user/reset/", {
        username: username,
        code: resetCode,
        password: password1
      })

      handleCancel()
    } catch (error: any) {
      if (error?.response?.status === 429) {
        setErrorMessage(t("errors.throttle", { value: error.response.headers["retry-after"] }))
      } else {
        setErrorMessage(t("errors.badResponse"))
      }
    }
  }

  const handleCancel = () => {
    setIsProceedingReset(false)
    setIsRequestingReset(false)
  }

  if (isProceedingReset) {
    return (
      <div className="fl-center-main fl-center-cross vertical-padding">
        <title>{`${t("passwordResetPage.title")} - QWShortLink`}</title>

        <div className="card fl-col fl-gap">
          <h2>{t("passwordResetPage.title")}</h2>

          <p>{t("passwordResetPage.secondStageText")}</p>

          <form onSubmit={proceedeReset}>
            <div className="fl-col">
              <label htmlFor="resetCode">{t("passwordResetPage.resetCode")}</label>
              <input
                name="resetCode"
                id="resetCode"
                type="text"
                placeholder="code..."
                required
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setResetCode(e.target.value) }}
                value={resetCode}
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

            <button className="btn btn-primary" type="submit">{t("actions.reset")}</button>
            <button className="btn btn-neutral" onClick={handleCancel}>{t("actions.cancel")}</button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="fl-center-main fl-center-cross vertical-padding">
      <title>{`${t("passwordResetPage.title")} - QWShortLink`}</title>

      <div className="card fl-col fl-gap">
        <h2>{t("passwordResetPage.title")}</h2>

        <p>{t("passwordResetPage.firstStageText")}</p>

        <form onSubmit={requestReset}>
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

          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <button className="btn btn-primary" type="submit">{t("actions.continue")}</button>
          <button className="btn btn-neutral" onClick={handleCancel}>{t("actions.cancel")}</button>
        </form>
      </div>
    </div>
  )
}

export default PasswordRequestReset
