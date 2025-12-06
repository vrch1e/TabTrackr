import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import store from './app/store.js';
import { Provider } from 'react-redux';
import Homepage from './components/homepage-components/Homepage.jsx';
import Reports from './components/Reports.jsx';
import App from './App.jsx';
import './index.css';

const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      { path: "homepage", Component: Homepage },
      { path: "reports", Component: Reports }
    ]
  }
]);

createRoot(document.getElementById('root')).render( // redux and react routing data mode plugged in
  <StrictMode>
    <Provider store={store}>  
      <RouterProvider router={router} fallbackElement={<div>loading...</div>}/>
    </ Provider>
  </StrictMode>
);
