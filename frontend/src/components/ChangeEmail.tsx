import React, { useEffect, useState, useContext } from "react"
import {useTranslation} from "react-i18next"

import AuthContext from "../AuthContext"
import AlertPopUp from "./AlertPopUp"
import api from "../api"
import "../i18n"

interface PropsInterface {
  setIsChangingEmail: (value: boolean) => void;
}

function ChangeEmail({setIsChangingEmail}: PropsInterface) {
  const {t} = useTranslation()

  const auth = useContext(AuthContext)

  const [email, setEmail] = useState<string>("")
  const [isAlertShown, setIsAlertShown] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>("")

  useEffect(() => {
    setErrorMessage("")
  }, [email])

  const handleChangeEmail = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      await api.post("auth/user/change-email/", {email})

      setIsAlertShown(true)
    } catch (error) {
      setErrorMessage(t("errors.badResponse"))
    }
  }

  return (
    <div className="fl-center-main fl-center-cross vertical-padding">
      <div className="card fl-col fl-gap">
        <h2>{t("emailChangePage.title")}</h2>

        <form onSubmit={handleChangeEmail}>
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
          <button className="btn btn-neutral" onClick={() => {setIsChangingEmail(false)}}>{t("actions.cancel")}</button>
        </form>
      </div>

      {isAlertShown && <AlertPopUp
                         title={t("emailChangePage.popupTitle")}
                         message={t("emailChangePage.popupMessage")}
                         setIsAlertShown={setIsAlertShown}
                         additionalHandler={async () => {
                           try {
                             await auth.fetchUser()
                             setIsChangingEmail(false)
                           } catch (error) {
                             setErrorMessage(t("errors.badResponse"))
                           }
                         }}
      />}
    </div>
  )
}

export default ChangeEmail
