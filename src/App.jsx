import { Routes, Route } from 'react-router-dom'
import VereHeader from './components/VereHeader'
import HomePage from './pages/HomePage'
import Signup from './pages/Signup'
import './App.css'

function App() {
  return (
    <>
      
      <VereHeader />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create-account" element={<Signup />} />
      </Routes>
    </>
  )
}

export default App