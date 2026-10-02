import * as React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { Toaster } from 'react-hot-toast'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="bottom-center"
        toastOptions={{
          duration: 2600,
          style: {
            background: '#0C0C0D',
            color: '#F5F5F7',
            borderRadius: '999px',
            padding: '10px 18px',
            fontSize: '14px',
          },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>,
)