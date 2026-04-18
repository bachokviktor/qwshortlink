import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import api from "../api"
import "../i18n"

interface PropsInterface {
  setIsAddingLink: (value: boolean) => void;
  fetchLinks: () => void;
}

function LinkAdd({setIsAddingLink, fetchLinks}: PropsInterface) {
  const {t} = useTranslation()

  const [linkUrl, setLinkUrl] = useState<string>("")
  const [errorMessage, setErrorMessage] = useState<string>("")

  useEffect(() => {
    setErrorMessage("")
  }, [linkUrl])

  const addLink = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    if ((linkUrl.trim() === "") || linkUrl.includes(" ")) {
      setErrorMessage(t("linkAddErrValidUrl"))
      return
    }

    try {
      await api.post("links/", {url: linkUrl})

      setIsAddingLink(false)
      fetchLinks()
    } catch (error) {
      setErrorMessage(t("linkAddErrResponse"))
    }
  }

  return (
    <div className="fl-center-main fl-center-cross vertical-padding">
      <title>{`${t("linkAddTitle")} - QWShortLink`}</title>

      <div className="card fl-col fl-gap">
        <h2>{t("linkAddHeader")}</h2>

        <form onSubmit={addLink}>
	  <div className="fl-col">
            <label htmlFor="linkUrl">URL</label>
            <input
	      name="linkUrl"
	      id="linkUrl"
	      type="url"
	      placeholder="URL..."
	      required
	      onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setLinkUrl(e.target.value) }}
	      value={linkUrl}
	    />
	  </div>

	  {errorMessage && <p className="error-message">{errorMessage}</p>}
	    
	  <button className="btn btn-primary" type="submit">{t("linkAddSubmit")}</button>
	  <button className="btn btn-neutral" onClick={() => {setIsAddingLink(false)}}>{t("linkAddCancel")}</button>
        </form>
      </div>
    </div>
  )
}

export default LinkAdd
