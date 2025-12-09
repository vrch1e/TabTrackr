import './App.css'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { updateSites, updateTotalDays } from './features/sitesUpdater/sitesSlice'
import Dashboard from './components/Dashboard'
import Homepage from './components/homepage-components/Homepage'
import { Outlet } from 'react-router'

function App() {

  console.log('app.jsx rendered')
  const dispatch = useDispatch()

  useEffect(() => {
    const handle = (event) => {
        if (event.data?.type === "CONTENT_SCRIPT_RUNNING") {
          window.postMessage({ type: "REQUEST_SITE_TABS" });
          window.postMessage({ type: "REQUEST_TOTAL_DAYS" });
        }
        if (event.data?.type === "RECEIVE_SITE_TABS") {
          console.log('sites sent to dispatch: ', event.data.sites)
          dispatch(updateSites(event.data.sites));
        } else if (event.data?.type === "RECEIVE_TOTAL_DAYS") {
          console.log('sites sent to dispatch (total days): ', event.data.totalDays)
          dispatch(updateTotalDays(event.data.totalDays));
        }
    };

    window.addEventListener("message", handle);

    // Fire request in case CS is already ready:
    window.postMessage({ type: "REQUEST_SITE_TABS" });

    return () => {
        window.removeEventListener("message", handle);
    };
  }, []);

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
