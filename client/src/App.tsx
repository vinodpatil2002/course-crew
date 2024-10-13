import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import SignUp from "./pages/SignUp"
import SignIn from "./pages/SignIn"
import ViewCourse from "./pages/ViewCourse"
import CreateCourse from "./pages/CreateCourse"
import OnlyAdminPrivateRoute from "./components/OnlyAdminPrivateRoute"
import PrivateRoute from './components/PrivateRoute';
import Dashboard from "./pages/Dashboard"
import UpdateCourse from "./pages/UpdateCourse"


function App() {

  return (
    <BrowserRouter>
      <Routes>
        {/* Routes go here */}
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/course:id" element={<ViewCourse />} />
        <Route element={<PrivateRoute/>}>
          <Route path='/dashboard' element={<Dashboard/>}/>
        </Route>
        <Route element={<OnlyAdminPrivateRoute/>}>
          <Route path='/create-course' element={<CreateCourse/>}/>
          <Route path='/update-post/:postId' element={<UpdateCourse/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
