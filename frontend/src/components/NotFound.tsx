import {Link} from "react-router"

function NotFound() {
  return (
    <div className="centered-container">
      <h2>404 Not Found</h2>
      <p>This page does not exist</p>
      <Link to="/">Home</Link>
    </div>
  )
}

export default NotFound
