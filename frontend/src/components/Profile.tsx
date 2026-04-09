import React, { useContext, useState, useEffect } from "react"
import AuthContext from "../AuthContext"
import api from "../api"

interface LinkInterface {
  id: number;
  url: string;
  short_url: string;
}

function Profile() {
  const auth = useContext(AuthContext)

  const [links, setLinks] = useState<LinkInterface[]>([])
  const [addingLink, setAddingLink] = useState<boolean>(false)
  const [editingLink, setEditingLink] = useState<boolean>(false)
  const [newLink, setNewLink] = useState<string>("")
  const [editID, setEditID] = useState<number | null>(null)
  const [errorMessage, setErrorMessage] = useState<string>("")

  useEffect(() => {
    fetchLinks()
  }, [])

  const fetchLinks = async () => {
    try {
      const response = await api.get("users/user/links/")

      setLinks(response.data.results)
    } catch (error) {
      console.log(error)
    }
  }

  const createLink = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      await api.post("links/", {url: newLink})

      setAddingLink(false)
      setNewLink("")
      setErrorMessage("")
      fetchLinks()
    } catch (error) {
      setErrorMessage("Something went wrong.")
    }
  }

  const updateLink = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      await api.patch(`links/${editID}/`, {url: newLink})

      setEditingLink(false)
      setNewLink("")
      setEditID(null)
      setErrorMessage("")
      fetchLinks()
    } catch (error) {
      setErrorMessage("Something went wrong.")
    }
  }

  const deleteLink = async (id: number) => {
    try {
      await api.delete(`links/${id}/`)

      fetchLinks()
    } catch (error) {
      console.log(error)
    }
  }

  if (addingLink) {
    return (
      <div className="centered-wrapper">
	<div className="auth-container">
	  <div className="centered-wrapper">
            <h2>New Link</h2>

            <form onSubmit={createLink}>
              <label htmlFor="newLink">URL</label><br/>
              <input
		name="newLink"
		id="newLink"
		type="text"
		placeholder="URL..."
		required
		onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setNewLink(e.target.value) }}
		value={newLink}
	      /><br/>

	      <div className="centered-wrapper">
		{errorMessage && <p className="error-message">{errorMessage}</p>}
		<button className="btn-primary" type="submit">Create</button>
	      </div>
            </form>
	  </div>
	</div>
      </div>
    )
  }

  if (editingLink) {
    return (
      <div className="centered-wrapper">
	<div className="auth-container">
	  <div className="centered-wrapper">
            <h2>Edit Link</h2>

            <form onSubmit={updateLink}>
              <label htmlFor="newLink">URL</label><br/>
              <input
		name="newLink"
		id="newLink"
		type="text"
		placeholder="URL..."
		required
		onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setNewLink(e.target.value) }}
		value={newLink}
	      /><br/>

	      <div className="centered-wrapper">
		{errorMessage && <p className="error-message">{errorMessage}</p>}
		<button className="btn-primary" type="submit">Save</button>
	      </div>
            </form>
	  </div>
	</div>
      </div>
    )
  }

  return (
    <div>
      <div className="profile-container">
	<h2>{auth.user?.username}</h2>
	{ (auth.user?.first_name || auth.user?.last_name) &&
	  <p>{auth.user?.first_name} {auth.user?.last_name}</p> }
	<p>Email: {auth.user?.email ? auth.user.email : "Not specified"}</p>
      </div>
      <div className="links-container">
	<div className="container-heading">
	  <p>Links</p>
	  <button className="btn-primary" onClick={() => setAddingLink(true)}>New link</button>
	</div>
	{links.map((link, index) => (
	  <div className="container-item" key={index}>
	    <p><strong>{link.short_url}:</strong> {link.url}</p>
	    <div>
	      <button className="btn-primary" onClick={() => {setEditID(link.id); setNewLink(link.url); setEditingLink(true)}}>Edit</button>
	      <button className="btn-danger" onClick={() => deleteLink(link.id)}>Delete</button>
	    </div>
	  </div>
	) )}
      </div>
    </div>
  )
}

export default Profile
