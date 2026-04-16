import React, { useState, useEffect } from "react"
import api from "../api"

interface PropsInterface {
  setIsAddingLink: (value: boolean) => void;
  fetchLinks: () => void;
}

function LinkAdd({setIsAddingLink, fetchLinks}: PropsInterface) {
  const [linkUrl, setLinkUrl] = useState<string>("")
  const [errorMessage, setErrorMessage] = useState<string>("")

  useEffect(() => {
    setErrorMessage("")
  }, [linkUrl])

  const addLink = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    if ((linkUrl.trim() === "") || linkUrl.includes(" ")) {
      setErrorMessage("Enter a valid URL!")
      return
    }

    try {
      await api.post("links/", {url: linkUrl})

      setIsAddingLink(false)
      fetchLinks()
    } catch (error) {
      setErrorMessage("Something went wrong.")
    }
  }

  return (
    <div className="fl-center-main fl-center-cross">
      <div className="card fl-col fl-gap">
        <h2>Add Link</h2>

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
	    
	  <button className="btn btn-primary" type="submit">Add</button>
	  <button className="btn btn-neutral" onClick={() => {setIsAddingLink(false)}}>Cancel</button>
        </form>
      </div>
    </div>
  )
}

export default LinkAdd
