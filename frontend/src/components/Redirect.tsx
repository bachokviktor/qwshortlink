import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"
import { useTranslation } from "react-i18next"
import NotFound from "./NotFound"
import api from "../api"
import "../i18n"

function Redirect() {
  const {t} = useTranslation()

  const navigate = useNavigate()

  const {shortCode} = useParams()

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [redirectId, setRedirectId] = useState<number | null>(null)
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null)

  useEffect(() => {
    lookUpLink()
  }, [])

  const lookUpLink = async () => {
    try {
      const response = await api.get(`links/?short_code=${shortCode}`)

      setRedirectId(response.data.results[0].id)
      setRedirectUrl(response.data.results[0].url)
    } catch (error) {
      setRedirectUrl(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRedirect = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}links/${redirectId}/redirect/`
  }

  if (isLoading) {
    return <p>Loading...</p>
  }

  if (!redirectUrl) {
    return <NotFound />
  }

  return (
    <div className="fl-center-main fl-center-cross vertical-padding">
      <title>{`${t("redirectPage.title")} - QWShortLink`}</title>

      <div className="card fl-col fl-gap redirect-link-break">
        <h2>{t("redirectPage.title")}</h2>
        <p>{t("redirectPage.body")}</p>
        <p>{redirectUrl}</p>

        <div className="fl-gap fl-wrap">
          <button className="btn btn-primary fl-grow" onClick={handleRedirect}>{t("actions.continue")}</button>
          <button className="btn btn-neutral fl-grow" onClick={() => navigate("/")}>{t("actions.goBack")}</button>
        </div>
      </div>
    </div>
  )
}

export default Redirect
