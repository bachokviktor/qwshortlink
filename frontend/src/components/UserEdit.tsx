import React, { useContext, useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import AuthContext from "../AuthContext"
import api from "../api"
import "../i18n"

interface PropsInterface {
  setIsEditingUser: (value: boolean) => void;
}

function UserEdit({setIsEditingUser}: PropsInterface) {
  const {t} = useTranslation()

  const auth = useContext(AuthContext)

  const [editUsername, setEditUsername] = useState<string>(
    auth.user?.username ? auth.user.username : ""
  )
  const [editFirstName, setEditFirstName] = useState<string>(
    auth.user?.first_name ? auth.user.first_name : ""
  )
  const [editLastName, setEditLastName] = useState<string>(
    auth.user?.last_name ? auth.user.last_name : ""
  )

  const [errorMessage, setErrorMessage] = useState<string>("")

  useEffect(() => {
    setErrorMessage("")
  }, [editUsername, editFirstName, editLastName])

  const editUser = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    if ((editUsername.trim() === "") || editUsername.includes(" ") || (editUsername.length < 5)) {
      setErrorMessage(t("validation.usernameRequirements"))
      return
    }

    try {
      await api.put("users/user/", {
        username: editUsername,
        first_name: editFirstName,
        last_name: editLastName
      })

      setIsEditingUser(false)
      auth.fetchUser()
    } catch (error) {
      setErrorMessage(t("errors.badResponse"))
    }
  }

  return (
    <div className="fl-center-main fl-center-cross vertical-padding">
      <title>{`${t("userEditPage.title")} - QWShortLink`}</title>

      <div className="card fl-col fl-gap">
        <h2>{t("userEditPage.title")}</h2>

        <form onSubmit={editUser}>
          <div className="fl-col">
            <label htmlFor="editUsername">{t("auth.username")}</label>
            <input
              name="editUsername"
              id="editUsername"
              type="text"
              placeholder="Username..."
              required
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setEditUsername(e.target.value) }}
              value={editUsername}
            />
          </div>

          <div className="fl-col">
            <label htmlFor="editLastName">{t("auth.lastName")}</label>
            <input
              name="editLastName"
              id="editLastName"
              type="text"
              placeholder="Last name..."
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setEditLastName(e.target.value) }}
              value={editLastName}
            />
          </div>

          <div className="fl-col">
            <label htmlFor="editFirstName">{t("auth.firstName")}</label>
            <input
              name="editFirstName"
              id="editFirstName"
              type="text"
              placeholder="First name..."
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setEditFirstName(e.target.value) }}
              value={editFirstName}
            />
          </div>

          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <button className="btn btn-primary" type="submit">{t("actions.save")}</button>
          <button className="btn btn-neutral" onClick={() => {setIsEditingUser(false)}}>{t("actions.cancel")}</button>
        </form>
      </div>
    </div>
  )
}

export default UserEdit
