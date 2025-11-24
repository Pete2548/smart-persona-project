import { Routes, Route, useLocation } from 'react-router-dom'
import VereHeader from './components/VereHeader'
import HomePage from './pages/HomePage'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Links from './pages/Links'
import AICreate from './pages/AICreate'
import Customize from './pages/Customize'
import ProfileView from './pages/ProfileView'
import Themes from './pages/Themes'
import Explore from './pages/Explore'
import MyProfiles from './pages/MyProfiles'
import './App.css'

function App() {
  const location = useLocation()
  const isProfileView = location.pathname.startsWith('/u/')

  return (
    <>
      
      {!isProfileView && <VereHeader />}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/my-profiles" element={<MyProfiles />} />
        <Route path="/links" element={<Links />} />
        <Route path="/customize" element={<Customize />} />
        <Route path="/themes" element={<Themes />} />
        <Route path="/u/:username" element={<ProfileView />} />
        <Route path="/u/:username/:profileType" element={<ProfileView />} />
        <Route path="/ai-create" element={<AICreate />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/create-account" element={<Signup />} />
      </Routes>
    </>
  )
}

export default App