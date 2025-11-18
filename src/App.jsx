import { Routes, Route } from 'react-router-dom'
import VereHeader from './components/VereHeader'
import HomePage from './pages/HomePage'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Links from './pages/Links'
import AICreate from './pages/AICreate'
import Customize from './pages/Customize'
import ProfileView from './pages/ProfileView'
import './App.css'

function App() {
  return (
    <>
      
      <VereHeader />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/links" element={<Links />} />
        <Route path="/customize" element={<Customize />} />
        <Route path="/u/:username" element={<ProfileView />} />
        <Route path="/ai-create" element={<AICreate />} />
        <Route path="/create-account" element={<Signup />} />
      </Routes>
    </>
  )
}

export default App