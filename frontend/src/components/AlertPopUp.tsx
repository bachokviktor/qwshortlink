import type React from "react";
import {useTranslation} from "react-i18next"
import "../i18n"

interface PropsInterface {
  title: string;
  message: string;
  setIsAlertShown: (value: boolean) => void;
  additionalHandler: () => void;
}

function AlertPopUp({title, message, setIsAlertShown, additionalHandler}: PropsInterface) {
  const {t} = useTranslation()

  const handleAlert = () => {
    setIsAlertShown(false)
    additionalHandler()
  }

  return (
    <div
      className="popup-overlay fl-center-main fl-center-cross vertical-padding"
      onClick={handleAlert}
    >
      <div
        className="card fl-col fl-gap"
        onClick={(e: React.BaseSyntheticEvent) => {e.stopPropagation()}}
      >
        <h2>{ title }</h2>

        <p>{ message }</p>

        <button className="btn btn-primary" onClick={handleAlert}>{t("actions.continue")}</button>
      </div>
    </div>
  )
}

export default AlertPopUp
