
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import React from 'react'
import { ProductProvider } from './Home/ProductContext.tsx'
import {ToggleProvider} from './Vendor/ThemeProvider'

createRoot(document.getElementById('root')!).render(
   <React.StrictMode>
    <ToggleProvider>
      <ProductProvider>
        <App />
      </ProductProvider>
    </ToggleProvider>
  </React.StrictMode>,
)
