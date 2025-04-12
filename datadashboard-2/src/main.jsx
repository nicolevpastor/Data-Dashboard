import { StrictMode } from 'react'
import { render } from "react-dom"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import DetailView from './DetailView.jsx';
import { createRoot } from 'react-dom/client'
import './index.css'
import Layout from './Layout.jsx'

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
  <BrowserRouter>
  <Routes>
  <Route path="/" element={<Layout />}>
      <Route index element={<App />} />
      <Route path="detail/:city" element={<DetailView />} /> {/* New Route */}
    </Route>
  </Routes>
</BrowserRouter>
)
