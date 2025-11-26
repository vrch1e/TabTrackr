import './App.css'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { updateToken } from './features/tokenUpdater/counterSlice'
import Dashboard from './components/Dashboard'
import Homepage from './components/Homepage'
import { Outlet } from 'react-router'

function App() {
  
  const authToken = useSelector((state) => state.auth.token)
  console.log('app.jsx rendered')
  const dispatch = useDispatch()

  useEffect(() => {
    console.log('authToken from redux: ', authToken);

    function listener(event) {
      if (event.data.type !== 'RECEIVE_AUTH_TOKEN') return;
      const token = event.data.token;
      console.log('token received from content_script: ', token);
      dispatch(updateToken(token));
    }

    function contentScriptListener(event) {
      if (event.data.type !== "CONTENT_SCRIPT_RUNNING") return;
      window.postMessage({ type: "REQUEST_AUTH_TOKEN" });
    }

    window.addEventListener("message", listener);
    window.addEventListener("message", contentScriptListener)

    return () => {
      window.removeEventListener("message", listener)
      window.removeEventListener("message", contentScriptListener)
    };

  }, [])

  useEffect(() => {
    console.log("AUTH TOKEN UPDATED:", authToken);
  }, [authToken]);

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
