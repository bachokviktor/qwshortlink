import React, { useEffect, useState, useContext } from "react"

import AuthContext from "../AuthContext"
import AlertPopUp from "./AlertPopUp"
import api from "../api"

interface PropsInterface {
  setIsChangingEmail: (value: boolean) => void;
}

function ChangeEmail({setIsChangingEmail}: PropsInterface) {
  const auth = useContext(AuthContext)

  const [email, setEmail] = useState<string>("")
  const [isAlertShown, setIsAlertShown] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>("")

  useEffect(() => {
    setErrorMessage("")
  }, [email])

  const handleChangeEmail = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      await api.post("auth/user/change-email/", {email})

      setIsAlertShown(true)
    } catch (error) {
      setErrorMessage("Something went wrong.")
    }
  }

  return (
    <div className="fl-center-main fl-center-cross vertical-padding">
      <div className="card fl-col fl-gap">
        <h2>Change Email</h2>

        <form onSubmit={handleChangeEmail}>
          <div className="fl-col">
            <label htmlFor="email">Email</label>
            <input
              name="email"
              id="email"
              type="email"
              placeholder="Email..."
              required
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setEmail(e.target.value) }}
              value={email}
            />
          </div>

          {errorMessage && <p className="error-message">{errorMessage}</p>}
      
          <button className="btn btn-primary" type="submit">Continue</button>
          <button className="btn btn-neutral" onClick={() => {setIsChangingEmail(false)}}>Cancel</button>
        </form>
      </div>

      {isAlertShown && <AlertPopUp
                         title="Verify Your Email"
                         message="After verification your new email will replace the current one. Check your email inbox for a verification link."
                         setIsAlertShown={setIsAlertShown}
                         additionalHandler={async () => {
                           try {
                             await auth.fetchUser()
                             setIsChangingEmail(false)
                           } catch (error) {
                             setErrorMessage("Something went wrong.")
                           }
                         }}
      />}
    </div>
  )
}

export default ChangeEmail
