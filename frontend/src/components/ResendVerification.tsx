import React, { useEffect, useState } from "react"

import AlertPopUp from "./AlertPopUp"
import api from "../api"

interface PropsInterface {
  setIsResendingVerification: (value: boolean) => void;
}

function ResendVerification({setIsResendingVerification}: PropsInterface) {
  const [email, setEmail] = useState<string>("")
  const [isAlertShown, setIsAlertShown] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>("")

  useEffect(() => {
    setErrorMessage("")
  }, [email])

  const handleResend = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      await api.post("auth/registration/resend-email/", {email})

      setIsAlertShown(true)
    } catch (error) {
      setErrorMessage("Something went wrong.")
    }
  }

  return (
    <div className="fl-center-main fl-center-cross vertical-padding">
      <div className="card fl-col fl-gap">
        <h2>Resend Email Verification</h2>

        <form onSubmit={handleResend}>
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
      
          <button className="btn btn-primary" type="submit">Resend</button>
          <button className="btn btn-neutral" onClick={() => {setIsResendingVerification(false)}}>Cancel</button>
        </form>
      </div>

      {isAlertShown && <AlertPopUp
                         title="Verify Your Email"
                         message="Check your email inbox for a verification link."
                         setIsAlertShown={setIsAlertShown}
                         additionalHandler={() => {setIsResendingVerification(false)}}
      />}
    </div>
  )
}

export default ResendVerification
