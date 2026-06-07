import React, { useEffect, useState } from "react"
import {useTranslation} from "react-i18next"
import "../i18n"

import AlertPopUp from "./AlertPopUp"
import api from "../api"

interface PropsInterface {
  setIsRequestingReset: (value: boolean) => void;
}

function RequestReset({setIsRequestingReset}: PropsInterface) {
  const {t} = useTranslation()

  const [email, setEmail] = useState<string>("")

  const [isAlertShown, setIsAlertShown] = useState<boolean>(false)

  const [errorMessage, setErrorMessage] = useState<string>("")

  useEffect(() => {
    setErrorMessage("")
  }, [email])

  const handleRequestReset = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      await api.post("auth/password/reset/", {email})

      setIsAlertShown(true)
    } catch (error) {
      setErrorMessage(t("errors.badResponse"))
    }
  }

  return (
    <div className="fl-center-main fl-center-cross vertical-padding">
      <div className="card fl-col fl-gap">
        <h2>{t("requestPasswordResetPage.title")}</h2>

        <form onSubmit={handleRequestReset}>
          <div className="fl-col">
            <label htmlFor="email">Email</label>
            <input
              name="email"
              id="email"
              type="email"
              placeholder="Email..."
              required
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setEmail(e.target.value) }}
              value={email}
            />
          </div>

          {errorMessage && <p className="error-message">{errorMessage}</p>}
      
          <button className="btn btn-primary" type="submit">{t("actions.continue")}</button>
          <button className="btn btn-neutral" onClick={() => {setIsRequestingReset(false)}}>{t("actions.cancel")}</button>
        </form>
      </div>

      {isAlertShown && <AlertPopUp
                         title={t("requestPasswordResetPage.popupTitle")}
                         message={t("requestPasswordResetPage.popupMessage")}
                         setIsAlertShown={setIsAlertShown}
                         additionalHandler={() => {setIsRequestingReset(false)}}
      />}
    </div>
  )
}

export default RequestReset
