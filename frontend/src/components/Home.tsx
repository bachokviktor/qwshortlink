import React, { useState, useContext } from "react"
import AuthContext from "../AuthContext"
import "../i18n"
import { useTranslation } from "react-i18next"

import EmailVerification from "./EmailVerification"

function Home() {
  const {t} = useTranslation()

  const auth = useContext(AuthContext)

  const [isVerifyingEmail, setIsVerifyingEmail] = useState<boolean>(false)

  if (isVerifyingEmail) {
    return <EmailVerification setIsVerifyingEmail={setIsVerifyingEmail} />
  }

  return (
    <div className="fl-col fl-gap-large vertical-padding-large horizontal-padding">
      {auth.user && !auth.user.verified && (
        <div className="card card-danger fl-col fl-gap">
          <p>{t("verificationBanner.firstLine")} {auth.user.email}</p>

          <p>{t("verificationBanner.secondLine")} <a href="#" onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {e.preventDefault(); setIsVerifyingEmail(true)}}>{t("verificationBanner.link")}</a></p>
        </div>
      )}

      <div className="fl-col fl-gap fl-center-cross">
        <img alt="Logo" src="/logo.svg" height="256px" width="256px" />
        <h1>QWShortLink</h1>
        <p>{t("homePage.projectSummary")}</p>
      </div>

      <div className="card fl-col fl-gap narrow-width">
        <h2 className="section-svg">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h168q13-36 43.5-58t68.5-22q38 0 68.5 22t43.5 58h168q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm80-80h280v-80H280v80Zm0-160h400v-80H280v80Zm0-160h400v-80H280v80Zm221.5-198.5Q510-807 510-820t-8.5-21.5Q493-850 480-850t-21.5 8.5Q450-833 450-820t8.5 21.5Q467-790 480-790t21.5-8.5ZM200-200v-560 560Z"/></svg>
          {t("homePage.sectionLinkManagementHeading")}
        </h2>
        <p>{t("homePage.sectionLinkManagementBody")}</p>
      </div>

      <div className="card fl-col fl-gap narrow-width">
        <h2 className="section-svg">
          <svg xmlns="http://www.w3.org/2000/svg" height="1.5rem" viewBox="0 -960 960 960" width="1.5rem" fill="#1f1f1f"><path d="m476-80 182-480h84L924-80h-84l-43-122H603L560-80h-84ZM160-200l-56-56 202-202q-35-35-63.5-80T190-640h84q20 39 40 68t48 58q33-33 68.5-92.5T484-720H40v-80h280v-80h80v80h280v80H564q-21 72-63 148t-83 116l96 98-30 82-122-125-202 201Zm468-72h144l-72-204-72 204Z"/></svg>
          {t("homePage.sectionMultipleLanguagesHeading")}
        </h2>
        <p>{t("homePage.sectionMultipleLanguagesBody")}</p>
      </div>

      <div className="card fl-col fl-gap narrow-width">
        <h2 className="section-svg">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M120-120q-33 0-56.5-23.5T40-200v-80q0-33 23.5-56.5T120-360h240q33 0 56.5 23.5T440-280v80q0 33-23.5 56.5T360-120H120Zm480 0q-33 0-56.5-23.5T520-200v-560q0-33 23.5-56.5T600-840h240q33 0 56.5 23.5T920-760v560q0 33-23.5 56.5T840-120H600Zm-480-80h240v-80H120v80Zm480 0h240v-560H600v560Zm120-40q17 0 28.5-11.5T760-280q0-17-11.5-28.5T720-320q-17 0-28.5 11.5T680-280q0 17 11.5 28.5T720-240ZM120-440q-33 0-56.5-23.5T40-520v-240q0-33 23.5-56.5T120-840h240q33 0 56.5 23.5T440-760v240q0 33-23.5 56.5T360-440H120Zm160-200q17 0 28.5-11.5T320-680q0-17-11.5-28.5T280-720q-17 0-28.5 11.5T240-680q0 17 11.5 28.5T280-640ZM120-533l80-107 90 120h70v-240H120v227Zm120 293Zm480-240ZM240-640Z"/></svg>
          {t("homePage.sectionResponsiveDesignHeading")}
        </h2>
        <p>{t("homePage.sectionResponsiveDesignBody")}</p>
      </div>

      <div className="card fl-col fl-gap narrow-width">
        <h2 className="section-svg">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M543.5-63.5Q520-87 520-120q0-23 11-41t29-29v-221q-18-11-29-28.5T520-480q0-33 23.5-56.5T600-560q33 0 56.5 23.5T680-480q0 23-11 40.5T640-411v115l160-53v-62q-18-11-29-28.5T760-480q0-33 23.5-56.5T840-560q33 0 56.5 23.5T920-480q0 23-11 40.5T880-411v119l-240 80v22q18 11 29 29t11 41q0 33-23.5 56.5T600-40q-33 0-56.5-23.5ZM160-160v-560 560Zm0 0q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h240l80 80h320q33 0 56.5 23.5T880-640H447l-80-80H160v480h280v80H160Z"/></svg>
          {t("homePage.sectionOpenSourceHeading")}
        </h2>
        <p>{t("homePage.sectionOpenSourceBody")}</p>
        <p className="text-break">{t("homePage.sectionOpenSourceGitHub")} <a href="https://github.com/bachokviktor/qwshortlink">https://github.com/bachokviktor/qwshortlink</a></p>
      </div>

      <div className="card card-danger fl-col fl-gap">
        <p>{t("homePage.sectionDisclaimerHeading")}</p>

        <p>{t("homePage.sectionDisclaimerBody")}</p>

        <p>{t("homePage.sectionDisclaimerUrl")} <a href="https://qwsl.click">https://qwsl.click</a></p>
      </div>
    </div>
  )
}

export default Home
