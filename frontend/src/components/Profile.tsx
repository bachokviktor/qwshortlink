import { useContext, useState, useEffect } from "react"
import AuthContext from "../AuthContext"
import api from "../api"

interface LinkInterface {
  id: number;
  url: string;
  short_url: string;
}

function Profile() {
  const auth = useContext(AuthContext)

  const [links, setLinks] = useState<LinkInterface[]>([])

  useEffect(() => {
    fetchLinks()
  }, [])

  const fetchLinks = async () => {
    try {
      const response = await api.get("users/user/links/")

      setLinks(response.data.results)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      <div className="profile-container">
	<h2>{auth.user?.username}</h2>
	{ (auth.user?.first_name || auth.user?.last_name) &&
	  <p>{auth.user?.first_name} {auth.user?.last_name}</p> }
	<p>Email: {auth.user?.email ? auth.user.email : "Not specified"}</p>
      </div>
      <div className="links-container">
	<div className="container-heading">
	  <p>Links</p>
	  <button className="btn-primary">New link</button>
	</div>
	{links.map((link, index) => (
	  <div className="container-item" key={index}>
	    <p><strong>{link.short_url}:</strong> {link.url}</p>
	    <div>
	      <button className="btn-primary">Edit</button>
	      <button className="btn-danger">Delete</button>
	    </div>
	  </div>
	) )}
      </div>
    </div>
  )
}

export default Profile
