import { useState, useEffect, useRef } from 'react'
import services from './services/services';
import TabList from './components/TabList';
import './App.css'

function App() {
  const [tabs, setTabsData] = useState([])
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const websocketRef = useRef(null);

  useEffect(() => {
    websocketRef.current = new WebSocket('ws://locahost:3010/socket')

    websocketRef.current.onmessage = (event) => {
      let data = JSON.parse(event.data);
      console.log('parsed data in app.jsx: ', data);
    };

    return () => {
      websocketRef.current.close()
    }
  }, [])

  useEffect(() => {

    const fetchSites = async () => { // get userId from their chromes storage
      chrome.storage.local.get(['userId'], async (result) => {
        if (!result.userId) {
          console.log('no userId')
        }

        console.log('if statement didnt trigger, userId is here: ', result.userId)

        let userId = result.userId
        const data = await services.getSites(selectedPeriod, userId)
        console.log('data: ', data)
        setTabsData(data)
        console.log('re-rendered')
      })
    }
    fetchSites()
    return;
  }, [selectedPeriod]) // Re-renders App() and updates tab data whenever user changes time period

  return (
    <>
    <div id='container'>
      <div id='dashboard'>
        <h1>Time Tracked: {selectedPeriod}</h1>
        <Buttons />
      </div>
      <hr></hr>
      <TabList tabs={tabs} />
    </div>
    </>
  )

  function Buttons() {
    if (selectedPeriod === 'today') {
      return (
        <>
        <button onClick={() => {setSelectedPeriod('week')}}>Week</button>
        <button onClick={() => {setSelectedPeriod('month')}}>Month</button>
        </>
      )
    } else if (selectedPeriod === 'week') {
      return (
        <>
        <button onClick={() => {setSelectedPeriod('today')}}>Today</button>
        <button onClick={() => {setSelectedPeriod('month')}}>Month</button>
        </>
      )
    } else {
      return (
        <>
        <button onClick={() => {setSelectedPeriod('today')}}>Today</button>
        <button onClick={() => {setSelectedPeriod('week')}}>Week</button>
        </>
      )
    }
  }
}

export default App
