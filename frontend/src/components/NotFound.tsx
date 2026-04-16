import {Link} from "react-router"

function NotFound() {
  return (
    <div className="fl-center-main fl-center-cross vertical-padding">
      <div className="fl-col fl-gap">
	<h2>404 Not Found</h2>
	<p>This page does not exist</p>
	<Link to="/">Home</Link>
      </div>
    </div>
  )
}

export default NotFound
