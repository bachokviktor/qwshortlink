import React, { useContext, useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import AuthContext from "../AuthContext"
import api from "../api"
import "../i18n"

import LinkAdd from "./LinkAdd"
import LinkEdit from "./LinkEdit"
import LinkDelete from "./LinkDelete"
import EmailVerification from "./EmailVerification"
import UserEdit from "./UserEdit"
import EmailChange from "./EmailChange"
import PasswordChange from "./PasswordChange"
import UserDelete from "./UserDelete"

interface LinkInterface {
  id: number;
  url: string;
  short_code: string;
  clicks: number;
}

function Profile() {
  const baseUrl = import.meta.env.VITE_WEBSITE_URL

  const {t} = useTranslation()

  const auth = useContext(AuthContext)

  const [links, setLinks] = useState<LinkInterface[]>([])

  const [searchString, setSearchString] = useState<string>("")

  const [totalLinks, setTotalLinks] = useState<number>(0)
  const [totalClicks, setTotalClicks] = useState<number>(0)
  const [topLink, setTopLink] = useState<string>("")
  const [topClicks, setTopClicks] = useState<number>(0)

  const [currentPage, setCurrentPage] = useState<number>(1)
  const [nextPage, setNextPage] = useState<number | null>(null)
  const [previousPage, setPreviousPage] = useState<number | null>(null)
  const [totalPages, setTotalPages] = useState<number>(1)

  const [isAddingLink, setIsAddingLink] = useState<boolean>(false)

  const [isEditingLink, setIsEditingLink] = useState<boolean>(false)
  const [editLinkId, setEditLinkId] = useState<number | null>(null)
  const [editLinkUrl, setEditLinkUrl] = useState<string>("")

  const [isDeletingLink, setIsDeletingLink] = useState<boolean>(false)
  const [deleteLinkId, setDeleteLinkId] = useState<number | null>(null)

  const [isVerifyingEmail, setIsVerifyingEmail] = useState<boolean>(false)

  const [isEditingUser, setIsEditingUser] = useState<boolean>(false)

  const [isChangingEmail, setIsChangingEmail] = useState<boolean>(false)

  const [isChangingPassword, setIsChangingPassword] = useState<boolean>(false)

  const [isDeletingUser, setIsDeletingUser] = useState<boolean>(false)

  const [errorMessage, setErrorMessage] = useState<string | undefined>("")

  useEffect(() => {
    fetchLinks()
  }, [])

  useEffect(() => {
    fetchLinks()
  }, [currentPage])

  const fetchStatistics = async () => {
    try {
      const response = await api.get("users/user/stat/")

      setTotalLinks(response.data.total_links)
      setTotalClicks(response.data.total_clicks)
      setTopLink(response.data.top_link)
      setTopClicks(response.data.top_clicks)
    } catch (error) {
      setErrorMessage(t("profilePage.errorStat"))
    }
  }

  const fetchLinks = async () => {
    try {
      const response = await api.get(`users/user/links/?page=${currentPage}&q=${searchString}`)

      setLinks(response.data.results)

      setNextPage(response.data.next)
      setPreviousPage(response.data.previous)
      setTotalPages(response.data.total_pages)

      await fetchStatistics()
    } catch (error) {
      setErrorMessage(t("profilePage.errorFetch"))
    }
  }

  const deleteLink = async (id: number | null) => {
    try {
      await api.delete(`links/${id}/`)

      setDeleteLinkId(null)
      setIsDeletingLink(false)

      if (links.length === 1 && previousPage) {
        setCurrentPage(previousPage)
      } else {
        fetchLinks()
      }
    } catch (error) {
      setErrorMessage(t("profilePage.errorDelete"))
    }
  }

  const copyShortCode = (shortCode: string) => {
    navigator.clipboard.writeText(`${baseUrl}l/${shortCode}`)
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

  if (isDeletingLink) {
    return <LinkDelete
             deleteLinkId={deleteLinkId}
             setDeleteLinkId={setDeleteLinkId}
             setIsDeletingLink={setIsDeletingLink}
             deleteLink={deleteLink} />
  }

  if (isVerifyingEmail) {
    return <EmailVerification setIsVerifyingEmail={setIsVerifyingEmail} />
  }

  if (isEditingUser) {
    return <UserEdit setIsEditingUser={setIsEditingUser} />
  }

  if (isChangingEmail) {
    return <EmailChange setIsChangingEmail={setIsChangingEmail} />
  }

  if (isChangingPassword) {
    return <PasswordChange setIsChangingPassword={setIsChangingPassword} />
  }

  if (isDeletingUser) {
    return <UserDelete setIsDeletingUser={setIsDeletingUser} />
  }

  return (
    <div className="profile-grid">
      <title>{`${t("profilePage.title")} - QWShortLink`}</title>
      <div className="error-container">
        {auth.user && !auth.user.verified && (
          <div className="card card-danger fl-col fl-gap">
            <p>{t("verificationBanner.firstLine")} {auth.user.email}</p>

            <p>{t("verificationBanner.secondLine")} <a href="#" onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {e.preventDefault(); setIsVerifyingEmail(true)}}>{t("verificationBanner.link")}</a></p>
          </div>
        )}
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
          <p>Email: {auth.user?.email}</p>

          <hr/>

          <button className="btn btn-primary" onClick={() => setIsEditingUser(true)}>{t("actions.edit")}</button>
          { auth.user?.auth_method === "email" && (
            <>
              <button disabled={!auth.user?.verified} className="btn btn-primary" onClick={() => setIsChangingEmail(true)}>{t("emailChangePage.title")}</button>
              <button disabled={!auth.user?.verified} className="btn btn-primary" onClick={() => setIsChangingPassword(true)}>{t("passwordChangePage.title")}</button>
            </>
          )}
          <button className="btn btn-danger" onClick={() => setIsDeletingUser(true)}>{t("actions.delete")}</button>
        </div>
      </div>

      <div className="stat-container">
        <div className="card fl-col fl-gap">
          <h2>{t("profilePage.statHeading")}</h2>

          <p>{t("profilePage.totalLinks")}: {totalLinks}</p>
          <p>{t("profilePage.totalClicks")}: {totalClicks}</p>
          <p>{t("profilePage.topLink", { code: topLink, clicks: topClicks })}</p>
        </div>
      </div>

      <div className="links-container">
        <div className="fl-col fl-gap">
          <form className="fl-row fl-gap" onSubmit={(e: React.SubmitEvent<HTMLFormElement>) => {e.preventDefault(); fetchLinks()}}>
            <input
              className="fl-grow"
              name="searchString"
              type="text"
              placeholder="Search..."
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setSearchString(e.target.value) }}
              value={searchString}
            />
            <button className="btn btn-primary" type="submit">{t("actions.search")}</button>
          </form>

          <button disabled={!auth.user?.verified} className="btn btn-primary" onClick={() => setIsAddingLink(true)}>{t("linkAddPage.title")}</button>

          {links.length > 0 ? links.map((link, index) => (
            <div className="card fl-gap fl-center-cross fl-wrap" key={index}>
              <div className="linklist-container fl-col fl-gap">
                <p className="linklist-link">{baseUrl}l/{link.short_code}</p>
                <a className="linklist-link" href={link.url}>{link.url}</a>
                <p>{t("profilePage.linkClicks")}: {link.clicks}</p>
              </div>
              <div className="fl-gap fl-wrap">
                <button className="btn btn-primary" onClick={() => {copyShortCode(link.short_code)}}>{t("actions.copy")}</button>
                <button disabled={!auth.user?.verified} className="btn btn-primary" onClick={() => {setEditLinkId(link.id); setEditLinkUrl(link.url); setIsEditingLink(true)}}>{t("actions.edit")}</button>
                <button disabled={!auth.user?.verified} className="btn btn-danger" onClick={() => {setDeleteLinkId(link.id); setIsDeletingLink(true)}}>{t("actions.delete")}</button>
                </div>
            </div>
          )) : (
            <div className="card">
              <p>{t("profilePage.noLinks")}</p>
            </div>
          )}

          {(previousPage || nextPage) && (
            <div className="card fl-space-between fl-center-cross">
              {previousPage && <button className="btn btn-primary" onClick={() => setCurrentPage(previousPage)}>{t("actions.previous")}</button>}
              <div></div>
              <p>{currentPage}/{totalPages}</p>
              <div></div>
              {nextPage && <button className="btn btn-primary" onClick={() => setCurrentPage(nextPage)}>{t("actions.next")}</button>}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile
