import { useState, useEffect } from 'react'
import services from './services/services';
import TabList from './components/TabList';
import './App.css'

function App() {
  const [tabsToday, setTabsData] = useState([])
  const [selectedPeriod, setSelectedPeriod] = useState('today')

  useEffect(() => {
    const fetchSites = async () => {
      const data = await services.getSites(selectedPeriod)
      console.log('data: ', data)
      setTabsData(data)
      console.log('re-rendered')
    }
    fetchSites()
    const intervalId = setInterval(fetchSites, 10000)
    return () => clearInterval(intervalId)

  }, [selectedPeriod])

  return (
    <>
    <div id='container'>
      <div id='dashboard'>
        <h1>Time Tracked: {selectedPeriod}</h1>
        <button onClick={() => {setSelectedPeriod('week')}}>Week</button>
        <button onClick={() => {setSelectedPeriod('month')}}>Month</button>
        <button id='manage-btn'>Manage Sites</button>
      </div>
      <TabList tabs={tabsToday} />
    </div>
    </>
  )
}

export default App
