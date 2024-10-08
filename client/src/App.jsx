import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Dashboard from './pages/Dashboard'
import CreateCourse from './pages/CreateCourse'
import UpdateCourse from './pages/UpdateCourse'
import CoursePage from './pages/CoursePage'
import PrivateRoute from './components/PrivateRoute';
import OnlyAdminPrivateRoute from './components/OnlyAdminPrivateRoute';


import Search from './pages/Search'

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route path='/search' element={<Search />} />
        <Route element={<PrivateRoute />}>
          <Route path='/dashboard' element={<Dashboard />} />
        </Route>
        <Route element={<OnlyAdminPrivateRoute/>}>
        <Route path='/create-post' element={<CreateCourse/>}/>
        <Route path='/update-post/:postId' element={<UpdateCourse/>}/>
        </Route>
        <Route path='/course/:courseSlug' element={<CoursePage/>}/>
      </Routes>
      <Footer/>
    </BrowserRouter>
  )
}

export default App