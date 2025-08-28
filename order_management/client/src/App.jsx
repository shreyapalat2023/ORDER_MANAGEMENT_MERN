
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

import AdminRoute from './routes/AdminRoute.jsx';
import MainLayout from "./pages/MainLayout.jsx"
import Dashboard from "./pages/admin/Dashboard.jsx"
import Customer from "./pages/customer/Customer.jsx"
import Supplier from "./pages/Supplier/Supplier.jsx"
import ItemMasterPage from "./pages/ItemMaster/ItemMasterPage.jsx"
import CustomerPOPage from './pages/customerPO/customerPOPage.jsx';
import ManagePurchases from './pages/PurchaseOrder/ManagePurchase.jsx';

function App() {
  const PageNotFound = () => {
    return <div className="d-flex justify-content-center align-items-center vh-100">404 | page not found</div>
  }

  return (
    <>
      <BrowserRouter>
        <Header />
        <Toaster />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/verify-otp' element={<VerifyOtp />} />
          <Route path='/reset-password' element={<ResetPassword />} />
          {/* dashboard */}
          <Route path='/admin' element={<AdminRoute />}>
            <Route path="main" element={<MainLayout />}>
            <Route path='dashboard' element={<Dashboard/>}></Route>
              <Route path="customers" element={<Customer />}></Route>
              <Route path="suppliers" element={<Supplier />}></Route>
              <Route path='item-master' element={<ItemMasterPage/>}></Route>
              <Route path='customer-po' element={<CustomerPOPage/>}></Route>
              <Route path='purchase-order' element={<ManagePurchases/>}></Route>
            </Route>
          </Route>
          <Route path="*" element={<PageNotFound />} replace></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
