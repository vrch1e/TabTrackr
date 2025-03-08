
import { useState, useEffect } from 'react'
import services from './services/services.ts';
import TabList from './components/TabList.tsx';
import Buttons from './components/Button.tsx';
import { VisitFromDB } from '../../types.ts';
// @ts-ignore
import './App.css';

// todo done: semi-colons & camelcase timeSpent
// todo done: remove image files from public folders

function App() {

  const [tabsToday, setTabsData] = useState<VisitFromDB[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('today')

  useEffect(() => {
    const fetchSites = async () => {
      const data: VisitFromDB[] = await services.getSites(selectedPeriod);
      // console.log('data: ', data) // todo done: logs commented out
      setTabsData(data);
      // console.log('re-rendered');
    }
    fetchSites();
    const intervalId: number = setInterval(fetchSites, 10000);
    return () => clearInterval(intervalId);
  }, [selectedPeriod])

  // todo done: unnec. fragments
  return (
    <div id='container'>
      <div id='dashboard'>
        <h1>Time Tracked: {selectedPeriod}</h1>
        <Buttons selectedPeriod={selectedPeriod} setSelectedPeriod={setSelectedPeriod}/>
      </div>
      <hr></hr>
      <TabList tabs={tabsToday} />
    </div>
  )
}

export default App
