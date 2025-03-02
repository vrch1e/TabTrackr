import { useState, useEffect } from 'react'
import services from './services/services';
import TabList from './components/TabList';
import './App.css'

function App() {
  const [tabsToday, setTabsToday] = useState([])

  useEffect(() => {
    const fetchSites = async () => {
      const data = await services.getSites('today')
      console.log('data: ', data)
      setTabsToday(data)
      console.log('re-rendered')
    }
    fetchSites()
    const intervalId = setInterval(fetchSites, 10000)
    return () => clearInterval(intervalId)

  }, [])

  return (
    <>
    <div id='container'>
      <div id='dashboard'>
        <h1>Time Tracked Today</h1>
        <button>Week</button>
        <button>Month</button>
        <button id='manage-btn'>Manage Sites</button>
      </div>
      <TabList tabs={tabsToday} />
    </div>
    </>
  )
}

export default App
