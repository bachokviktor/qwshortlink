import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"
import NotFound from "./NotFound"
import api from "../api"

function Redirect() {
  const navigate = useNavigate()

  const {shortCode} = useParams()

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null)

  useEffect(() => {
    lookUpLink()
  }, [])

  const lookUpLink = async () => {
    try {
      const response = await api.get(`links/?short_code=${shortCode}`)

      setRedirectUrl(response.data.results[0].url)
    } catch (error) {
      setRedirectUrl(null)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <p>Loading...</p>
  }

  if (!redirectUrl) {
    return <NotFound />
  }

  return (
    <div className="centered-container">
      <h2>Redirect...</h2>
      <p>You are about to be redirected to <a href={redirectUrl}>{redirectUrl}</a></p>

      <button className="btn-primary" onClick={() => window.location.href = redirectUrl}>Continue</button>
      <button className="btn-primary" onClick={() => navigate("/")}>Go back</button>
    </div>
  )
}

export default Redirect
