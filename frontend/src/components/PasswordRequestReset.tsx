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
  }, [username])

  const requestReset = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      await api.post("users/user/request-reset/", { username: username })

      setIsProceedingReset(true)
    } catch (error) {
      setErrorMessage(t("requestResetErrResponse"))
    }
  }

  const proceedeReset = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    if ((password1.trim() === "") || password1.includes(" ") || (password1.length < 8)) {
      setErrorMessage(t("registerErrValidPassword"))
      return
    }

    if (password1 !== password2) {
      setErrorMessage(t("registerErrMismatch"))
      return
    }

    try {
      await api.post("users/user/reset/", {
	username: username,
	code: resetCode,
	password: password1
      })

      handleCancel()
    } catch (error) {
      setErrorMessage(t("requestResetErrResponse"))
    }
  }

  const handleCancel = () => {
    setIsProceedingReset(false)
    setIsRequestingReset(false)
  }

  if (isProceedingReset) {
    return (
      <div className="fl-center-main fl-center-cross vertical-padding">
	<title>{`${t("requestResetTitle")} - QWShortLink`}</title>

	<div className="card fl-col fl-gap">
	  <h2>{t("requestResetHeader")}</h2>

	  <p>{t("requestParagraph2")}</p>

          <form onSubmit={proceedeReset}>
	    <div className="fl-col">
	      <label htmlFor="resetCode">{t("requestResetCode")}</label>
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

	    <button className="btn btn-primary" type="submit">{t("requestResetComplete")}</button>
	    <button className="btn btn-neutral" onClick={handleCancel}>{t("requestResetCancel")}</button>
          </form>
	</div>
      </div>
    )
  }

  return (
    <div className="fl-center-main fl-center-cross vertical-padding">
      <title>{`${t("requestResetTitle")} - QWShortLink`}</title>

      <div className="card fl-col fl-gap">
	<h2>{t("requestResetHeader")}</h2>

	<p>{t("requestParagraph1")}</p>

        <form onSubmit={requestReset}>
	  <div className="fl-col">
	    <label htmlFor="userName">{t("requestResetUsername")}</label>
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

	  <button className="btn btn-primary" type="submit">{t("requestResetSubmit")}</button>
	  <button className="btn btn-neutral" onClick={handleCancel}>{t("requestResetCancel")}</button>
        </form>
      </div>
    </div>
  )
}

export default PasswordRequestReset
