import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './i18n' // Import i18n configuration

// 1. นำเข้า CSS หลักของ Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
// 2. นำเข้า Bootstrap Icons
import 'bootstrap-icons/font/bootstrap-icons.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
  </React.StrictMode>,
)