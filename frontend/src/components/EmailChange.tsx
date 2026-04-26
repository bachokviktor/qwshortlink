import { useState, useEffect, useContext } from "react"
import { useTranslation } from "react-i18next"
import AuthContext from "../AuthContext"
import api from "../api"
import "../i18n"

interface PropsInterface {
  setIsChangingEmail: (value: boolean) => void;
}

function EmailChange({setIsChangingEmail}: PropsInterface) {
  const {t} = useTranslation()

  const auth = useContext(AuthContext)

  const [editEmail, setEditEmail] = useState<string>(
    auth.user?.email ? auth.user.email : ""
  )

  const [errorMessage, setErrorMessage] = useState<string>("")

  useEffect(() => {
    setErrorMessage("")
  }, [editEmail])

  const handleEditEmail = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      await api.put("users/user/email/", {
	email: editEmail,
      })

      setIsChangingEmail(false)
      auth.fetchUser()
    } catch (error) {
      setErrorMessage(t("changeEmailErrResponse"))
    }
  }

  return (
    <div className="fl-center-main fl-center-cross vertical-padding">
      <title>{`${t("changeEmailTitle")} - QWShortLink`}</title>

      <div className="card fl-col fl-gap">
	<h2>{t("changeEmailHeader")}</h2>

        <form onSubmit={handleEditEmail}>
	  <div className="fl-col">
	    <label htmlFor="editEmail">Email</label>
            <input
	      name="editEmail"
	      id="editEmail"
	      type="email"
	      placeholder="Email..."
	      onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setEditEmail(e.target.value) }}
	      value={editEmail}
	    />
	  </div>

	  {errorMessage && <p className="error-message">{errorMessage}</p>}

	  <button className="btn btn-primary" type="submit">{t("changeEmailSubmit")}</button>
	  <button className="btn btn-neutral" onClick={() => {setIsChangingEmail(false)}}>{t("changeEmailCancel")}</button>
        </form>
      </div>
    </div>
  )
}

export default EmailChange
