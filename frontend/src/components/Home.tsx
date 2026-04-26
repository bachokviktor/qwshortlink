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
	  <p>{t("verificationBannerFirst")} {auth.user.email}</p>

	  <p>{t("verificationBannerSecond")} <a href="#" onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {e.preventDefault(); setIsVerifyingEmail(true)}}>{t("verificationBannerLink")}</a></p>
	</div>
      )}

      <div className="fl-col fl-gap fl-center-cross">
	<img alt="Logo" src="/logo.svg" height="256px" width="256px" />
	<h1>QWShortLink</h1>
	<p>{t("projectSummary")}</p>
      </div>

      <div className="fl-col fl-gap">
	<h2>{t("sectionLinkManagementHeading")}</h2>
	<p>{t("sectionLinkManagementBody")}</p>
      </div>

      <div className="fl-col fl-gap">
	<h2>{t("sectionMultipleLanguagesHeading")}</h2>
	<p>{t("sectionMultipleLanguagesBody")}</p>
      </div>

      <div className="fl-col fl-gap">
	<h2>{t("sectionResponsiveDesignHeading")}</h2>
	<p>{t("sectionResponsiveDesignBody")}</p>
      </div>

      <div className="fl-col fl-gap">
	<h2>{t("sectionOpenSourceHeading")}</h2>
	<p>{t("sectionOpenSourceBody")}</p>
	<p className="text-break">{t("sectionOpenSourceGitHub")} <a href="https://github.com/bachokviktor/qwshortlink">https://github.com/bachokviktor/qwshortlink</a></p>
      </div>

      <div className="card card-danger fl-col fl-gap">
	<p>{t("sectionDisclaimerHeading")}</p>

	<p>{t("sectionDisclaimerBody")}</p>

	<p>{t("sectionDisclaimerUrl")} <a href="https://qwsl.click">https://qwsl.click</a></p>
      </div>
    </div>
  )
}

export default Home
