import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import api from "../api"
import "../i18n"

interface PropsInterface {
  editLinkId: number | null;
  setEditLinkId: (value: number | null) => void;
  editLinkUrl: string;
  setEditLinkUrl: (value: string) => void;
  setIsEditingLink: (value: boolean) => void;
  fetchLinks: () => void;
}

function LinkEdit({editLinkId, setEditLinkId, editLinkUrl, setEditLinkUrl, setIsEditingLink, fetchLinks}: PropsInterface) {
  const {t} = useTranslation()

  const [errorMessage, setErrorMessage] = useState<string>("")

  useEffect(() => {
    setErrorMessage("")
  }, [editLinkUrl])

  const editLink = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    if ((editLinkUrl.trim() === "") || editLinkUrl.includes(" ")) {
      setErrorMessage(t("linkEditErrValidUrl"))
      return
    }

    try {
      await api.patch(`links/${editLinkId}/`, {url: editLinkUrl})

      setEditLinkId(null)
      setEditLinkUrl("")

      setIsEditingLink(false)
      fetchLinks()
    } catch (error) {
      setErrorMessage(t("linkEditErrResponse"))
    }
  }

  return (
    <div className="fl-center-main fl-center-cross vertical-padding">
      <title>{`${t("linkEditTitle")} - QWShortLink`}</title>

      <div className="card fl-col fl-gap">
        <h2>{t("linkEditHeader")}</h2>

        <form onSubmit={editLink}>
	  <div className="fl-col">
            <label htmlFor="editLinkUrl">URL</label>
            <input
	      name="editLinkUrl"
	      id="editLinkUrl"
	      type="url"
	      placeholder="URL..."
	      required
	      onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setEditLinkUrl(e.target.value) }}
	      value={editLinkUrl}
	    />
	  </div>

	  {errorMessage && <p className="error-message">{errorMessage}</p>}

	  <button className="btn btn-primary" type="submit">{t("linkEditSubmit")}</button>
	  <button className="btn btn-neutral" onClick={() => {setEditLinkId(null); setEditLinkUrl(""); setIsEditingLink(false)}}>{t("linkEditCancel")}</button>
        </form>
      </div>
    </div>
  )
}

export default LinkEdit
