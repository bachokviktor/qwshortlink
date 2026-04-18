import {useContext, useEffect, useState} from "react"
import {Outlet, NavLink} from "react-router"
import {useTranslation} from "react-i18next"
import AuthContext from "../AuthContext"
import "../i18n"


function Layout() {
  const {t} = useTranslation()

  const {isLoading, user} = useContext(AuthContext)

  const [isNavbarOpen, setIsNavbarOpen] = useState<boolean>(false)
  const [isDarkmode, setIsDarkmode] = useState<boolean>(() => {
    return localStorage.getItem("darkmode") === "active"
  })

  useEffect(() => {
    if (isDarkmode) {
      localStorage.setItem("darkmode", "active")
      document.body.classList.add("darkmode")
    } else {
      localStorage.removeItem("darkmode")
      document.body.classList.remove("darkmode")
    }
  }, [isDarkmode])

  if (isLoading) {
    return <p>Loading...</p>
  }

  return (
    <>
      <header>
	<strong>QWSL</strong>

	<nav className={isNavbarOpen ? "show" : ""} id="navbar">
	  <ul>
	    <li>
	      <button
		className="nav-hamburger"
		aria-label={t("navAriaClose")}
		onClick={() => {setIsNavbarOpen(false)}}
	      >
		<svg xmlns="http://www.w3.org/2000/svg" height="1.5rem" viewBox="0 -960 960 960" width="1.5rem" fill="#1f1f1f"><path d="m291-240-51-51 189-189-189-189 51-51 189 189 189-189 51 51-189 189 189 189-51 51-189-189-189 189Z"/></svg>
	      </button>
	    </li>
            <li>
	      <NavLink to="/" onClick={() => {setIsNavbarOpen(false)}}>{t("navHome")}</NavLink>
	    </li>
	    { user ? (
	      <>
		<li>
		  <NavLink to="/profile" onClick={() => {setIsNavbarOpen(false)}}>{t("navProfile")}</NavLink>
		</li>
		<li>
		  <NavLink to="/logout" onClick={() => {setIsNavbarOpen(false)}}>{t("navLogout")}</NavLink>
		</li>
	      </>
	    ) : (
	      <>
		<li>
		  <NavLink to="/login" onClick={() => {setIsNavbarOpen(false)}}>{t("navLogin")}</NavLink>
		</li>
		<li>
		  <NavLink to="/register" onClick={() => {setIsNavbarOpen(false)}}>{t("navRegister")}</NavLink>
		</li>
	      </>
	    )}
	  </ul>
	</nav>

	<div className="nav-overlay" onClick={() => {setIsNavbarOpen(false)}} aria-hidden="true"></div>

	<button
	  className="btn-svg"
	  aria-label={t("navAriaDarkmode")}
	  onClick={() => {setIsDarkmode((prev) => !prev)}}
	>
	  {isDarkmode ? (
	    <svg xmlns="http://www.w3.org/2000/svg" height="1.5rem" viewBox="0 -960 960 960" width="1.5rem" fill="#1f1f1f"><path d="M565-395q35-35 35-85t-35-85q-35-35-85-35t-85 35q-35 35-35 85t35 85q35 35 85 35t85-35Zm-226.5 56.5Q280-397 280-480t58.5-141.5Q397-680 480-680t141.5 58.5Q680-563 680-480t-58.5 141.5Q563-280 480-280t-141.5-58.5ZM200-440H40v-80h160v80Zm720 0H760v-80h160v80ZM440-760v-160h80v160h-80Zm0 720v-160h80v160h-80ZM256-650l-101-97 57-59 96 100-52 56Zm492 496-97-101 53-55 101 97-57 59Zm-98-550 97-101 59 57-100 96-56-52ZM154-212l101-97 55 53-97 101-59-57Zm326-268Z"/></svg>
	  ) : (
	    <svg xmlns="http://www.w3.org/2000/svg" height="1.5rem" viewBox="0 -960 960 960" width="1.5rem" fill="#1f1f1f"><path d="M480-120q-150 0-255-105T120-480q0-150 105-255t255-105q14 0 27.5 1t26.5 3q-41 29-65.5 75.5T444-660q0 90 63 153t153 63q55 0 101-24.5t75-65.5q2 13 3 26.5t1 27.5q0 150-105 255T480-120Zm0-80q88 0 158-48.5T740-375q-20 5-40 8t-40 3q-123 0-209.5-86.5T364-660q0-20 3-40t8-40q-78 32-126.5 102T200-480q0 116 82 198t198 82Zm-10-270Z"/></svg>
	  )}
	</button>

	<button
	  className="nav-hamburger"
	  aria-label={t("navAriaOpen")}
	  aria-expanded={isNavbarOpen}
	  aria-controls="navbar"
	  onClick={() => {setIsNavbarOpen(true)}}
	>
	  <svg xmlns="http://www.w3.org/2000/svg" height="1.5rem" viewBox="0 -960 960 960" width="1.5rem" fill="#1f1f1f"><path d="M144-264v-72h672v72H144Zm0-180v-72h672v72H144Zm0-180v-72h672v72H144Z"/></svg>
	</button>
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
