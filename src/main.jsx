import React from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import './conversion.css'
import './group-home.css'
import './home-enhancements.css'
import './interior-gallery.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
