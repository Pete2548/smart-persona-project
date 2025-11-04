import { Routes, Route } from 'react-router-dom'
import VereHeader from './components/VereHeader'
import HomePage from './pages/HomePage'

function App() {
  return (
    <>
      
      <VereHeader />

      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </>
  )
}

export default App