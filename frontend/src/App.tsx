import {BrowserRouter, Routes, Route} from "react-router"
import Layout from "./components/Layout"
import Home from "./components/Home"
import Login from "./components/Login"
import Register from "./components/Register"
import NotFound from "./components/NotFound"

function App() {
  return (
    <>
      <BrowserRouter>
	<Routes>
	  <Route element={<Layout />}>
	    <Route index element={<Home />} />
	    <Route path="/login" element={<Login />} />
	    <Route path="/register" element={<Register />} />
	    <Route path="*" element={<NotFound />} />
	  </Route>
	</Routes>
      </BrowserRouter>
    </>
  )
}

export default App
