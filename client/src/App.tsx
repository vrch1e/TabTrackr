
import { useState, useEffect } from 'react'
import services from './services/services.js';
import TabList from './components/TabList.js';
import { Visit } from '../../types.js';
// @ts-ignore
import './App.css';

function App() {

  const [tabsToday, setTabsData] = useState<Visit[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('today')

  useEffect(() => {
    const fetchSites = async () => {
      const data: Visit[] = await services.getSites(selectedPeriod); // todo: services. for readability ?
      console.log('data: ', data) // todo: remove?
      setTabsData(data);
      console.log('re-rendered');// todo: remove?
    }
    fetchSites();
    const intervalId: number = setInterval(fetchSites, 10000);
    return () => clearInterval(intervalId);
  }, [selectedPeriod])

  // todo: unnec. fragments
  return (
    <>
      <div id='container'>
        <div id='dashboard'>
          <h1>Time Tracked: {selectedPeriod}</h1>
          <Buttons />
        </div>
        <hr></hr>
        <TabList tabs ={tabsToday} /> {/*todo type never?*/}
      </div>
    </>
  )

  // todo: indentation + refactor? + separate file
  function Buttons() {
    if (selectedPeriod === 'today') {
      return (
        <>
          <button onClick={() => { setSelectedPeriod('week') }}>Week</button>
          <button onClick={() => { setSelectedPeriod('month') }}>Month</button>
        </>
      )
    } else if (selectedPeriod === 'week') {
      return (
        <>
          <button onClick={() => { setSelectedPeriod('today') }}>Today</button>
          <button onClick={() => { setSelectedPeriod('month') }}>Month</button>
        </>
      )
    } else {
      return (
        <>
          <button onClick={() => { setSelectedPeriod('today') }}>Today</button>
          <button onClick={() => { setSelectedPeriod('week') }}>Week</button>
        </>
      )
    }
  }
}

export default App
