import {useContext} from "react"
import AuthContext from "../AuthContext"

function Home() {
  const {user} = useContext(AuthContext)

  return (
    <div className="centered-container">
      <img alt="Logo" src="https://placehold.co/256" />
      <h1>QWShortLink</h1>
      <p>URL Shortener built with Django REST Framework and React</p>
      {user ? <p>Welcome to the site!</p> : <p>You are not authenticated.</p>}
    </div>
  )
}

export default Home
