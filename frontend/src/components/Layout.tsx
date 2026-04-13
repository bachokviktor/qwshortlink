import {useContext, useState} from "react"
import {Outlet, NavLink} from "react-router"
import AuthContext from "../AuthContext"

function Layout() {
  const {isLoading, user} = useContext(AuthContext)

  const [isNavbarOpen, setIsNavbarOpen] = useState<boolean>(false)

  if (isLoading) {
    return <p>Loading...</p>
  }

  return (
    <>
      <header>
	<strong>QWSL</strong>

	<button
	  className="nav-hamburger"
	  aria-label="Open sidebar"
	  aria-expanded={isNavbarOpen}
	  aria-controls="navbar"
	  onClick={() => {setIsNavbarOpen(true)}}
	>
	  <svg xmlns="http://www.w3.org/2000/svg" height="1.5rem" viewBox="0 -960 960 960" width="1.5rem" fill="#1f1f1f"><path d="M144-264v-72h672v72H144Zm0-180v-72h672v72H144Zm0-180v-72h672v72H144Z"/></svg>
	</button>

	<nav className={isNavbarOpen ? "show" : ""} id="navbar">
	  <ul>
	    <li>
	      <button
		className="nav-hamburger"
		aria-label="Close sidebar"
		onClick={() => {setIsNavbarOpen(false)}}
	      >
		<svg xmlns="http://www.w3.org/2000/svg" height="1.5rem" viewBox="0 -960 960 960" width="1.5rem" fill="#1f1f1f"><path d="m291-240-51-51 189-189-189-189 51-51 189 189 189-189 51 51-189 189 189 189-51 51-189-189-189 189Z"/></svg>
	      </button>
	    </li>
            <li>
	      <NavLink to="/" onClick={() => {setIsNavbarOpen(false)}}>Home</NavLink>
	    </li>
	    { user ? (
	      <>
		<li>
		  <NavLink to="/profile" onClick={() => {setIsNavbarOpen(false)}}>Profile</NavLink>
		</li>
		<li>
		  <NavLink to="/logout" onClick={() => {setIsNavbarOpen(false)}}>Logout</NavLink>
		</li>
	      </>
	    ) : (
	      <>
		<li>
		  <NavLink to="/login" onClick={() => {setIsNavbarOpen(false)}}>Login</NavLink>
		</li>
		<li>
		  <NavLink to="/register" onClick={() => {setIsNavbarOpen(false)}}>Register</NavLink>
		</li>
	      </>
	    )
	    }
	  </ul>
	</nav>

	<div className="nav-overlay" onClick={() => {setIsNavbarOpen(false)}} aria-hidden="true"></div>
      </header>

      <Outlet />

      <footer>
	<p>Copyright (c) 2026 Viktor Bachok</p>
	<p>Licensed under the <a href="https://github.com/bachokviktor/qwshortlink/blob/main/LICENSE">MIT License</a></p>
      </footer>
    </>
  )
}

export default Layout
