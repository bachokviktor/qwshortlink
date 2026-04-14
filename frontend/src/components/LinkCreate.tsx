import React, { useState, useEffect } from "react"
import api from "../api"

interface PropsInterface {
  setIsCreatingLink: (value: boolean) => void;
  fetchLinks: () => void;
}

function LinkCreate({setIsCreatingLink, fetchLinks}: PropsInterface) {
  const [linkUrl, setLinkUrl] = useState<string>("")
  const [errorMessage, setErrorMessage] = useState<string>("")

  useEffect(() => {
    setErrorMessage("")
  }, [linkUrl])

  const createLink = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    if ((linkUrl.trim() === "") || linkUrl.includes(" ")) {
      setErrorMessage("Enter a valid URL!")
      return
    }

    try {
      await api.post("links/", {url: linkUrl})

      setIsCreatingLink(false)
      fetchLinks()
    } catch (error) {
      setErrorMessage("Something went wrong.")
    }
  }

  return (
    <div className="centered-wrapper">
      <div className="card fl-col fl-gap">
        <h2>New Link</h2>

        <form onSubmit={createLink}>
	  <div className="fl-col">
            <label htmlFor="newLink">URL</label>
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
	    
	  <button className="btn btn-primary" type="submit">Create</button>
	  <button className="btn btn-neutral" onClick={() => {setIsCreatingLink(false)}}>Cancel</button>
        </form>
      </div>
    </div>
  )
}

export default LinkCreate
