import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import Games from './components/Games'
import Guide from './components/Guide'
import Footer from './components/Footer'
function App() {

  return (
    <div>
      <Navbar />
      <HeroSection />
      <Games />
      <Guide />
      <Footer />
    </div>
  )
}

export default App
