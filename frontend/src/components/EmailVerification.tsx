import React, { useState, useEffect, useContext } from "react"
import { useTranslation } from "react-i18next"
import AuthContext from "../AuthContext"
import api from "../api"
import "../i18n"

interface PropsInterface {
  setIsVerifyingEmail: (value: boolean) => void;
}

function EmailVerification({setIsVerifyingEmail}: PropsInterface) {
  const {t} = useTranslation()

  const auth = useContext(AuthContext)

  const [verificationCode, setVerificationCode] = useState<string>("")

  const [successMessage, setSuccessMessage] = useState<string>("")

  const [errorMessage, setErrorMessage] = useState<string>("")

  useEffect(() => {
    setErrorMessage("")
    setSuccessMessage("")
  }, [verificationCode])

  const resendCode = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()

    try {
      await api.get("users/user/request-verification/")

      setSuccessMessage(t("verificationPage.successfulRequest"))
    } catch (error: any) {
      if (error?.response?.status === 429) {
        setErrorMessage(t("errors.throttle", { value: error.response.headers["retry-after"] }))
      } else {
        setErrorMessage(t("errors.badResponse"))
      }
    }
  }

  const verifyEmail = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      await api.post("users/user/verification/", {
        code: verificationCode,
      })

      setIsVerifyingEmail(false)
      auth.fetchUser()
    } catch (error: any) {
      if (error?.response?.status === 429) {
        setErrorMessage(t("errors.throttle", { value: error.response.headers["retry-after"] }))
      } else {
        setErrorMessage(t("errors.badResponse"))
      }
    }
  }

  return (
    <div className="fl-center-main fl-center-cross vertical-padding">
      <title>{`${t("verificationPage.title")} - QWShortLink`}</title>

      <div className="card fl-col fl-gap">
        <h2>{t("verificationPage.title")}</h2>

        <form onSubmit={verifyEmail}>
          <div className="fl-col">
            <label htmlFor="verificationCode">{t("verificationPage.verificationCode")}</label>
            <input
              name="verificationCode"
              id="verificationCode"
              type="text"
              placeholder="code..."
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setVerificationCode(e.target.value) }}
              value={verificationCode}
            />
          </div>

          {errorMessage && <p className="error-message">{errorMessage}</p>}

          {successMessage && <p>{successMessage}</p>}

          <button className="btn btn-primary" type="submit">{t("actions.submit")}</button>
          <button className="btn btn-neutral" onClick={() => {setIsVerifyingEmail(false)}}>{t("actions.cancel")}</button>
        </form>

        <hr/>

        <p>{t("verificationPage.noCode")} <a href="#" onClick={resendCode}>{t("actions.resend")}</a></p>
      </div>
    </div>
  )
}

export default EmailVerification
