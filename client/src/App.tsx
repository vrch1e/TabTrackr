import { useState, useEffect } from 'react'
import services from './services/services';
import TabList from './components/TabList';
import Buttons from './components/Button';
import { Visit } from '../../types';
import './App.css';

function App() {

  const [tabsLast24h, setTabsData] = useState<Visit[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('last24h')

  useEffect(() => {
    const fetchSites = async () => {
      const data: Visit[] = await services.getSites(selectedPeriod);
      setTabsData(data);
    }
    fetchSites();
    const intervalId: NodeJS.Timeout = setInterval(fetchSites, 10000);
    return () => clearInterval(intervalId);
  }, [selectedPeriod])

  return (
    <div id='container'>
      <div id='dashboard'>
        <h1>Time Tracked: {selectedPeriod === 'last24h' ? 'Last 24H' : selectedPeriod === 'week' ? 'Week' : 'Month'}</h1>
        <Buttons selectedPeriod={selectedPeriod} setSelectedPeriod={setSelectedPeriod} />
      </div>
      <hr></hr>
      <TabList tabs={tabsLast24h} />
    </div>
  )
}

export default App
