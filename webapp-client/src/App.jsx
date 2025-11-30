import './App.css'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { updateSites } from './features/sitesUpdater/sitesSlice'
import Dashboard from './components/Dashboard'
import Homepage from './components/Homepage'
import { Outlet } from 'react-router'

function App() {
  const [tabs, setTabs] = useState([]);

  const siteTabs = useSelector((state) => state.sites.sites)
  console.log('app.jsx rendered')
  const dispatch = useDispatch()

  useEffect(() => {
    const handle = (event) => {
        if (event.data?.type === "CONTENT_SCRIPT_RUNNING") {
          window.postMessage({ type: "REQUEST_SITE_TABS" });
          console.log('posted a message')
        }
        if (event.data?.type === "RECEIVE_SITE_TABS") {
          console.log('received message with sites')
          setTabs(event.data.sites);
          dispatch(updateSites(event.data.sites));
          console.log('sites', event.data.sites);
        }
    };

    window.addEventListener("message", handle);

    // Fire request in case CS is already ready:
    window.postMessage({ type: "REQUEST_SITE_TABS" });

    return () => {
        window.removeEventListener("message", handle);
    };
  }, []);

  useEffect(() => {
    console.log("siteTabs updated:", siteTabs);
  }, [siteTabs]);

  return (
    <>
    <div className="container">
      <Dashboard userId="testuserId"/>
      <Outlet />
    </div>
    </>
  )
}

export default App
