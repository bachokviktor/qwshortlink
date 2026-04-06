import {BrowserRouter, Routes, Route} from "react-router"
import {AuthProvider} from "./AuthContext"
import ProtectedRoute from "./ProtectedRoute"
import Layout from "./components/Layout"
import Home from "./components/Home"
import Login from "./components/Login"
import Register from "./components/Register"
import Logout from "./components/Logout"
import Profile from "./components/Profile"
import NotFound from "./components/NotFound"

function App() {
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

	      <Route path="*" element={<NotFound />} />
	    </Route>
	  </Routes>
	</AuthProvider>
      </BrowserRouter>
    </>
  )
}

export default App
