import { useState } from "react"
import {useParams, useNavigate} from "react-router"
import {useTranslation} from "react-i18next"
import api from "../api"
import "../i18n"

function EmailVerification() {
  const {t} = useTranslation()

  const navigate = useNavigate()

  const {key} = useParams()

  const [errorMessage, setErrorMessage] = useState<string>("")

  const handleVerification = async () => {
    try {
      await api.post(
        "auth/registration/verify-email/",
        {key}
      )

      navigate("/login")
    } catch (error) {
      setErrorMessage(t("errors.badResponse"))
    }
  }

  return (
    <div className="fl-center-main fl-center-cross vertical-padding">
      <title>Email Verification</title>

      <div className="card fl-col fl-gap">  
        <h2>Verify your email?</h2>

        {errorMessage && <p className="danger">{errorMessage}</p>}

        <div className="fl-gap fl-wrap">
          <button className="btn btn-primary fl-grow" onClick={handleVerification}>{t("actions.continue")}</button>
          <button className="btn btn-neutral fl-grow" onClick={() => navigate("/")}>{t("actions.goBack")}</button>
        </div>
      </div>
    </div>
  )
}

export default EmailVerification
