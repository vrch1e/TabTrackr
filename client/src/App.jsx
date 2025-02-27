import { useState } from 'react'
import TabItem from './components/TabItem'
import './App.css'

function App() {

  return (
    <>
    <div id='container'>
      <div id='dashboard'>
        <h1>Time Tracked Today</h1>
        <button>Week</button>
        <button>Month</button>
        <button id='manage-btn'>Manage Sites</button>
      </div>
      <TabItem website='test.com'/>
    </div>
    </>
  )
}

export default App
