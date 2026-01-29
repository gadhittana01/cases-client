import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext'
import './index.css'

const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
if (!stripeKey) {
  console.warn('VITE_STRIPE_PUBLISHABLE_KEY is not set');
}
const stripePromise = loadStripe(stripeKey || '')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App stripePromise={stripePromise} />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
