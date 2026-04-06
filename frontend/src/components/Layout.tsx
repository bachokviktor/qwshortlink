import {useContext} from "react"
import {Outlet, NavLink} from "react-router"
import AuthContext from "../AuthContext"

function Layout() {
  const {isLoading} = useContext(AuthContext)

  if (isLoading) {
    return <p>Loading...</p>
  }

  return (
    <>
      <nav>
	<ul>
          <li>
	    <NavLink to="/">Home</NavLink>
	  </li>
          <li>
	    <NavLink to="/login">Login</NavLink>
	  </li>
          <li>
	    <NavLink to="/register">Register</NavLink>
	  </li>
	</ul>
      </nav>

      <Outlet />

      <footer>
	<p>Copyright (c) 2026 Viktor Bachok</p>
	<p>Licensed under the <a href="https://github.com/bachokviktor/qwshortlink/blob/main/LICENSE">MIT License</a></p>
      </footer>
    </>
  )
}

export default Layout
