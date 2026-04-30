import React, { useState, useEffect, useContext } from "react"
import { useTranslation } from "react-i18next"
import AuthContext from "../AuthContext"
import api from "../api"
import "../i18n"

interface PropsInterface {
  setIsDeletingUser: (value: boolean) => void;
}

function UserDelete({setIsDeletingUser}: PropsInterface) {
  const {t} = useTranslation()

  const auth = useContext(AuthContext)

  const [password, setPassword] = useState<string>("")
  const [errorMessage, setErrorMessage] = useState<string>("")

  useEffect(() => {
    setErrorMessage("")
  }, [password])

  const confirmDeleteUser = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      await api.post("token/", {username: auth.user?.username, password: password})

      await deleteUser()
    } catch (error) {
      setErrorMessage(t("userDeletePage.error"))
    }
  }

  const deleteUser = async () => {
    try {
      await api.delete("users/user/")

      auth.logout()
    } catch (error) {
      setErrorMessage(t("userDeletePage.error"))
    }
  }

  return (
    <div className="fl-center-main fl-center-cross vertical-padding">
      <title>{`${t("userDeletePage.title")} - QWShortLink`}</title>

      <div className="card fl-col fl-gap">
        <h2>{t("userDeletePage.title")}</h2>

        <p>{t("userDeletePage.body")}</p>

        <form onSubmit={confirmDeleteUser}>
          <div className="fl-col">
            <label htmlFor="password">{t("auth.password")}</label>
            <input
              name="password"
              id="password"
              type="password"
              placeholder="Password..."
              required
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setPassword(e.target.value) }}
              value={password}
            />
          </div>

          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <button className="btn btn-danger" type="submit">{t("actions.delete")}</button>
          <button className="btn btn-neutral" onClick={() => {setIsDeletingUser(false)}}>{t("actions.cancel")}</button>
        </form>
      </div>
    </div>
  )
}

export default UserDelete
