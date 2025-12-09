import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Turfs from './components/Turfs.jsx'
import TurfDetails from './components/TurfDetails.jsx'
import MyDashboard from './components/MyDashboard.jsx'
import Signup from './components/auth/Signup.jsx'
import { LogIn } from 'lucide-react'
import Login from './components/auth/Login.jsx'
import HowItWorks from './components/HowItWorks.jsx'
import OwnerDashboard from './components/OwnerDashboard.jsx'
import PaymentPage from './components/PaymentPage.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter >
      <Routes>
        <Route path='/' element={<App />} />
        <Route path="/turfs/:gameId" element={<Turfs />} />

        <Route path='/Cricket' element={<Turfs gameName={'Cricket'} />} />
        <Route path='/Football' element={<Turfs gameName={'Football'} />} />
        <Route path='/Tennis' element={<Turfs gameName={'Tennis'} />} />
        <Route path='/Badminton' element={<Turfs gameName={'Badminton'} />} />
        <Route path="/turf/:turfId" element={<TurfDetails />} />

        <Route path="/dashboard" element={<MyDashboard />} />
        <Route path="/owner-dashboard" element={<OwnerDashboard />} />

        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/how-it-works" element={<HowItWorks />} />

        <Route path="/payment" element={<PaymentPage />} />

      </Routes>
    </BrowserRouter>

  </StrictMode>,
)
