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

      <div className="fl-col fl-gap">
        <h2>{t("homePage.sectionLinkManagementHeading")}</h2>
        <p>{t("homePage.sectionLinkManagementBody")}</p>
      </div>

      <div className="fl-col fl-gap">
        <h2>{t("homePage.sectionMultipleLanguagesHeading")}</h2>
        <p>{t("homePage.sectionMultipleLanguagesBody")}</p>
      </div>

      <div className="fl-col fl-gap">
        <h2>{t("homePage.sectionResponsiveDesignHeading")}</h2>
        <p>{t("homePage.sectionResponsiveDesignBody")}</p>
      </div>

      <div className="fl-col fl-gap">
        <h2>{t("homePage.sectionOpenSourceHeading")}</h2>
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
