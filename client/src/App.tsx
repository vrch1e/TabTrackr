import { useState, useEffect } from 'react'
import services from './services/services';
import TabList from './components/TabList';
import Buttons from './components/Button';
import { Visit } from '../../types';
// @ts-ignore
import './App.css';

// todo done: semi-colons?
// todo done: remove image files from public folders

function App() {

  const [tabsLast24h, setTabsData] = useState<Visit[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('last24h')

  useEffect(() => {
    const fetchSites = async () => {
      const data: Visit[] = await services.getSites(selectedPeriod);
      // console.log('data: ', data) // todo done: logs commented out
      setTabsData(data);
      // console.log('re-rendered');
    }
    fetchSites();
    const intervalId: NodeJS.Timeout = setInterval(fetchSites, 10000);
    return () => clearInterval(intervalId);
  }, [selectedPeriod])

  // todo done: removed unnecessary fragments
  return (
    <div id='container'>
      <div id='dashboard'>
        <h1>Time Tracked: {selectedPeriod}</h1>
        <Buttons selectedPeriod={selectedPeriod} setSelectedPeriod={setSelectedPeriod}/>
      </div>
      <hr></hr>
      <TabList tabs={tabsLast24h} />
    </div>
  )
}

// todo done: moved Buttons component function into own file

export default App
