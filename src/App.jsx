import { Routes, Route, useLocation } from 'react-router-dom'
import VereHeader from './components/VereHeader'
import SavedProfiles from './pages/SavedProfiles'
import MyProfile from './pages/MyProfile'
import EditProfessionalProfile from './pages/EditProfessionalProfile'
import RequireAdmin from './admin/RequireAdmin'
import AdminDashboard from './admin/AdminDashboard'
import AdminLogin from './admin/AdminLogin'
import AdminSetup from './admin/AdminSetup'
import Tables from './admin/Tables'
import HomePage from './pages/HomePage'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Links from './pages/Links'
import Customize from './pages/Customize'
import ProfileView from './pages/ProfileView'
import ProfessionalProfileView from './pages/ProfessionalProfileView'
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
        <Route path="/saved-profiles" element={<SavedProfiles />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/my-profile" element={<MyProfile />} />
        <Route path="/edit-professional-profile" element={<EditProfessionalProfile />} />
        <Route path="/my-profiles" element={<MyProfiles />} />
        <Route path="/links" element={<Links />} />
        <Route path="/customize" element={<Customize />} />
        <Route path="/themes" element={<Themes />} />
        <Route path="/u/:username" element={<ProfileView />} />
        <Route path="/u/:username/:profileType" element={<ProfileView />} />
        <Route path="/pro/:username" element={<ProfessionalProfileView />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/create-account" element={<Signup />} />
        {/* Admin routes (protected) */}
        <Route path="/admin" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
        <Route path="/admin/tables" element={<RequireAdmin><Tables /></RequireAdmin>} />
        {/* Admin auth / setup */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/setup" element={<AdminSetup />} />
      </Routes>
    </>
  )
}

export default App