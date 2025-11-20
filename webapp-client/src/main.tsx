import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Router } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import Homepage from './components/Homepage.tsx'
import Reports from './components/Reports.tsx'
import './index.css'
import App from './App.tsx'

const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      {
        index: true,
        Component: Homepage
      },
      {
        path: "reports",
        Component: Reports
      }
    ]
  }
])

createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />,
)
