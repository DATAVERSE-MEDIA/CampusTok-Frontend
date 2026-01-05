import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { QueryProvider } from './QueryProvider'
import { GoogleOAuthProvider } from '@react-oauth/google';

const env = (import.meta ).env
const clientId = env.VITE_APP_GOOGLE_CLIENT_ID || 
    '742970125508-huruco1fq1l11jb0k8kikvsvdb24bkhq.apps.googleusercontent.com';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
    <QueryProvider>
    <BrowserRouter>
         <App />
    </BrowserRouter>
    </QueryProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>,
)

