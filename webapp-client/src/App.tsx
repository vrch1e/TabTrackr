import './App.css'
import { useEffect } from 'react'
import { Redis } from '@upstash/redis'
import Dashboard from './components/Dashboard'
import Homepage from './components/Homepage'
import { Outlet } from 'react-router'

function App() {

  useEffect(() => {
  }, [])

  return (
    <>
      <Dashboard />
      <Outlet />
    </>
  )
}

export default App
