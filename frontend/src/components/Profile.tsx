import { useContext, useState, useEffect } from "react"
import AuthContext from "../AuthContext"
import api from "../api"

import LinkCreate from "./LinkCreate"
import LinkEdit from "./LinkEdit"
import UserEdit from "./UserEdit"
import PasswordChange from "./PasswordChange"

interface LinkInterface {
  id: number;
  url: string;
  short_code: string;
}

function Profile() {
  const auth = useContext(AuthContext)

  const [links, setLinks] = useState<LinkInterface[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [nextPage, setNextPage] = useState<number | null>(null)
  const [previousPage, setPreviousPage] = useState<number | null>(null)

  const [isCreatingLink, setIsCreatingLink] = useState<boolean>(false)

  const [isEditingLink, setIsEditingLink] = useState<boolean>(false)
  const [editLinkId, setEditLinkId] = useState<number | null>(null)
  const [editLinkUrl, setEditLinkUrl] = useState<string>("")

  const [isEditingUser, setIsEditingUser] = useState<boolean>(false)

  const [isChangingPassword, setIsChangingPassword] = useState<boolean>(false)

  const [errorMessage, setErrorMessage] = useState<string | undefined>("")

  useEffect(() => {
    fetchLinks()
  }, [])

  useEffect(() => {
    fetchLinks()
  }, [currentPage])

  const fetchLinks = async () => {
    try {
      const response = await api.get(`users/user/links/?page=${currentPage}`)

      setLinks(response.data.results)
      setNextPage(response.data.next)
      setPreviousPage(response.data.previous)
    } catch (error) {
      setErrorMessage("Failed to fetch links.")
    }
  }

  const deleteLink = async (id: number) => {
    try {
      await api.delete(`links/${id}/`)

      if (links.length === 1 && previousPage) {
	setCurrentPage(previousPage)
      } else {
	fetchLinks()
      }
    } catch (error) {
      setErrorMessage("Failed to delete link.")
    }
  }

  const deleteUser = async () => {
    try {
      await api.delete("users/user/")

      auth.logout()
    } catch (error) {
      setErrorMessage("Failed to delete user.")
    }
  }

  if (isCreatingLink) {
    return <LinkCreate setIsCreatingLink={setIsCreatingLink} fetchLinks={fetchLinks} />
  }

  if (isEditingLink) {
    return <LinkEdit
	     editLinkId={editLinkId}
	     setEditLinkId={setEditLinkId}
	     editLinkUrl={editLinkUrl}
	     setEditLinkUrl={setEditLinkUrl}
	     setIsEditingLink={setIsEditingLink}
	     fetchLinks={fetchLinks} />
  }

  if (isEditingUser) {
    return <UserEdit setIsEditingUser={setIsEditingUser} />
  }

  if (isChangingPassword) {
    return <PasswordChange setIsChangingPassword={setIsChangingPassword} />
  }

  return (
    <div>
      {errorMessage && (
	<div className="centered-container">
	  <p className="error-message">{errorMessage}</p>
	</div>
      )}
      <div className="profile-container">
	<h2>{auth.user?.username}</h2>
	{ (auth.user?.first_name || auth.user?.last_name) &&
	  <p>{auth.user?.first_name} {auth.user?.last_name}</p> }
	<p>Email: {auth.user?.email ? auth.user.email : "Not specified"}</p>
	<div>
	  <button className="btn-primary" onClick={() => setIsEditingUser(true)}>Edit</button>
	  <button className="btn-primary" onClick={() => setIsChangingPassword(true)}>Change password</button>
	  <button className="btn-danger" onClick={deleteUser}>Delete</button>
	</div>
      </div>
      <div className="links-container">
	<div className="container-heading">
	  <p>Links</p>
	  <button className="btn-primary" onClick={() => setIsCreatingLink(true)}>New link</button>
	</div>
	{links.length > 0 ? links.map((link, index) => (
	  <div className="container-item" key={index}>
	    <p><strong>{link.short_code}:</strong> {link.url}</p>
	    <div>
	      <button className="btn-primary" onClick={() => {setEditLinkId(link.id); setEditLinkUrl(link.url); setIsEditingLink(true)}}>Edit</button>
	      <button className="btn-danger" onClick={() => deleteLink(link.id)}>Delete</button>
	    </div>
	  </div>
	)) : (
	  <div className="container-item">
	    <p>No links yet.</p>
	  </div>
	)}
	<div>
	  {previousPage && <button className="btn-primary" onClick={() => setCurrentPage(previousPage)}>Previous</button>}
	  {nextPage && <button className="btn-primary" onClick={() => setCurrentPage(nextPage)}>Next</button>}
	</div>
      </div>
    </div>
  )
}

export default Profile
