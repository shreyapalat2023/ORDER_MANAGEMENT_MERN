
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Toaster } from "react-hot-toast";
import Header from './components/nav/Header.jsx';
import Home from './pages/Home/Home.jsx'
import Login from './pages/auth/Login.jsx'
import Register from './pages/auth/Register.jsx'
import './App.css'

import ForgotPassword from "./pages/auth/ForgotPassword.jsx"
import VerifyOtp from './pages/auth/VerifyOtp.jsx';
import ResetPassword from "./pages/auth/ResetPassword.jsx"

import AdminDashboard from "./pages/admin/Dashboard.jsx"
import AdminRoute from './routes/AdminRoute.jsx';

function App() {
  const PageNotFound = () => {
    return <div className="d-flex justify-content-center align-items-center vh-100">404 | page not found</div>
  }

  return (
    <>
      <BrowserRouter>
    <Header/>
        <Toaster />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/verify-otp' element={<VerifyOtp />} />
          <Route path='/reset-password' element={<ResetPassword />} />
          {/* dashboard */}
          <Route path='/dashboard' element={<AdminRoute/>}>
            <Route path="admin" element={<AdminDashboard />}></Route>
          </Route>
          <Route path="*" element={<PageNotFound />} replace></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
