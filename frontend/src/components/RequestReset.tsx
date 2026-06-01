import React, { useEffect, useState } from "react"

import api from "../api"

interface PropsInterface {
  setIsRequestingReset: (value: boolean) => void;
}

function RequestReset({setIsRequestingReset}: PropsInterface) {
  const [email, setEmail] = useState<string>("")
  const [errorMessage, setErrorMessage] = useState<string>("")

  useEffect(() => {
    setErrorMessage("")
  }, [email])

  const handleRequestReset = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      await api.post("auth/password/reset/", {email})

      setIsRequestingReset(false)
    } catch (error) {
      setErrorMessage("Something went wrong.")
    }
  }

  return (
    <div className="fl-center-main fl-center-cross vertical-padding">
      <div className="card fl-col fl-gap">
        <h2>Request Password Reset</h2>

        <form onSubmit={handleRequestReset}>
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
          <button className="btn btn-neutral" onClick={() => {setIsRequestingReset(false)}}>Cancel</button>
        </form>
      </div>
    </div>
  )
}

export default RequestReset
