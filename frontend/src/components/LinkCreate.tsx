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
      <div className="auth-container">
	<div className="centered-wrapper">
          <h2>New Link</h2>

          <form onSubmit={createLink}>
            <label htmlFor="newLink">URL</label><br/>
            <input
	      name="linkUrl"
	      id="linkUrl"
	      type="url"
	      placeholder="URL..."
	      required
	      onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setLinkUrl(e.target.value) }}
	      value={linkUrl}
	    /><br/>

	    <div className="centered-wrapper">
	      {errorMessage && <p className="error-message">{errorMessage}</p>}
	      <div>
		<button className="btn-primary" type="submit">Create</button>
		<button className="btn-primary" onClick={() => {setIsCreatingLink(false)}}>Cancel</button>
	      </div>
	    </div>
          </form>
	</div>
      </div>
    </div>
  )
}

export default LinkCreate
