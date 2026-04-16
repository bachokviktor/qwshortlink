import React, { useState, useEffect } from "react"
import api from "../api"

interface PropsInterface {
  editLinkId: number | null;
  setEditLinkId: (value: number | null) => void;
  editLinkUrl: string;
  setEditLinkUrl: (value: string) => void;
  setIsEditingLink: (value: boolean) => void;
  fetchLinks: () => void;
}

function LinkEdit({editLinkId, setEditLinkId, editLinkUrl, setEditLinkUrl, setIsEditingLink, fetchLinks}: PropsInterface) {
  const [errorMessage, setErrorMessage] = useState<string>("")

  useEffect(() => {
    setErrorMessage("")
  }, [editLinkUrl])

  const editLink = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    if ((editLinkUrl.trim() === "") || editLinkUrl.includes(" ")) {
      setErrorMessage("Enter a valid URL!")
      return
    }

    try {
      await api.patch(`links/${editLinkId}/`, {url: editLinkUrl})

      setEditLinkId(null)
      setEditLinkUrl("")

      setIsEditingLink(false)
      fetchLinks()
    } catch (error) {
      setErrorMessage("Something went wrong.")
    }
  }

  return (
    <div className="fl-center-main fl-center-cross">
      <div className="card fl-col fl-gap">
        <h2>Edit Link</h2>

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

	  <button className="btn btn-primary" type="submit">Save</button>
	  <button className="btn btn-neutral" onClick={() => {setEditLinkId(null); setEditLinkUrl(""); setIsEditingLink(false)}}>Cancel</button>
        </form>
      </div>
    </div>
  )
}

export default LinkEdit
