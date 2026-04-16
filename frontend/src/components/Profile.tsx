import { useContext, useState, useEffect } from "react"
import AuthContext from "../AuthContext"
import api from "../api"

import LinkAdd from "./LinkAdd"
import LinkEdit from "./LinkEdit"
import UserEdit from "./UserEdit"
import PasswordChange from "./PasswordChange"

interface LinkInterface {
  id: number;
  url: string;
  short_code: string;
}

function Profile() {
  const baseUrl = import.meta.env.VITE_WEBSITE_URL

  const auth = useContext(AuthContext)

  const [links, setLinks] = useState<LinkInterface[]>([])
  const [totalLinks, setTotalLinks] = useState<number>(0)

  const [currentPage, setCurrentPage] = useState<number>(1)
  const [nextPage, setNextPage] = useState<number | null>(null)
  const [previousPage, setPreviousPage] = useState<number | null>(null)
  const [totalPages, setTotalPages] = useState<number>(1)

  const [isAddingLink, setIsAddingLink] = useState<boolean>(false)

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
      setTotalLinks(response.data.count)

      setNextPage(response.data.next)
      setPreviousPage(response.data.previous)
      setTotalPages(response.data.total_pages)
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

  const copyShortCode = (shortCode: string) => {
    navigator.clipboard.writeText(`${baseUrl}l/${shortCode}`)
  }

  const deleteUser = async () => {
    try {
      await api.delete("users/user/")

      auth.logout()
    } catch (error) {
      setErrorMessage("Failed to delete user.")
    }
  }

  if (isAddingLink) {
    return <LinkAdd setIsAddingLink={setIsAddingLink} fetchLinks={fetchLinks} />
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
    <div className="profile-grid">
      <div className="error-container">
	{errorMessage && (
	  <div className="card card-danger">
	    <p>{errorMessage}</p>
	  </div>
	)}
      </div>

      <div className="profile-container">
	<div className="card fl-col fl-gap">
	  <h2>{auth.user?.username}</h2>
	  { (auth.user?.first_name || auth.user?.last_name) &&
	  <p>{auth.user?.first_name} {auth.user?.last_name}</p> }
	  <p>Email: {auth.user?.email ? auth.user.email : "Not specified"}</p>
	  <p>Total Links: {totalLinks}</p>

	  <hr/>

	  <button className="btn btn-primary" onClick={() => setIsEditingUser(true)}>Edit</button>
	  <button className="btn btn-primary" onClick={() => setIsChangingPassword(true)}>Change password</button>
	  <button className="btn btn-danger" onClick={deleteUser}>Delete</button>
	</div>
      </div>

      <div className="links-container">
	<div className="fl-col fl-gap">
	  <button className="btn btn-primary" onClick={() => setIsAddingLink(true)}>Add link</button>

	  {links.length > 0 ? links.map((link, index) => (
	    <div className="card fl-gap fl-center-cross fl-wrap" key={index}>
	      <p className="linklist-link">{baseUrl}l/{link.short_code}: <a href={link.url}>{link.url}</a></p>
	      <button className="btn btn-primary" onClick={() => {copyShortCode(link.short_code)}}>Copy</button>
	      <button className="btn btn-primary" onClick={() => {setEditLinkId(link.id); setEditLinkUrl(link.url); setIsEditingLink(true)}}>Edit</button>
	      <button className="btn btn-danger" onClick={() => deleteLink(link.id)}>Delete</button>
	    </div>
	  )) : (
	    <div className="card">
	      <p>No links yet.</p>
	    </div>
	  )}

	  {(previousPage || nextPage) && (
	    <div className="card fl-space-between fl-center-cross">
	      {previousPage && <button className="btn btn-primary" onClick={() => setCurrentPage(previousPage)}>Previous</button>}
	      <div></div>
	      <p>{currentPage}/{totalPages}</p>
	      <div></div>
	      {nextPage && <button className="btn btn-primary" onClick={() => setCurrentPage(nextPage)}>Next</button>}
	    </div>
	  )}
	</div>
      </div>
    </div>
  )
}

export default Profile
