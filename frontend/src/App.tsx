import { useEffect } from "react"
import {BrowserRouter, Routes, Route} from "react-router"
import {AuthProvider} from "./AuthContext"
import ProtectedRoute from "./ProtectedRoute"
import Layout from "./components/Layout"
import Home from "./components/Home"
import Login from "./components/Login"
import Register from "./components/Register"
import Logout from "./components/Logout"
import Profile from "./components/Profile"
import Redirect from "./components/Redirect"
import NotFound from "./components/NotFound"

import {useTranslation} from "react-i18next"
import "./i18n"

function App() {
  const {i18n} = useTranslation()

  useEffect(() => {
    const preferredLanguage = localStorage.getItem("preferredLanguage")
    if (preferredLanguage) {
      i18n.changeLanguage(preferredLanguage)
    } else {
      i18n.changeLanguage(navigator.language)
    }
  }, [])

  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/logout" element={<Logout />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/profile" element={<Profile />} />
              </Route>

              <Route path="/l/:shortCode" element={<Redirect />} />

              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  )
}

export default App
