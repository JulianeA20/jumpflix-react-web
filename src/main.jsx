import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import ContentDetails from './pages/ContentDetails';
import Movies from './pages/Movies';
import Series from './pages/Series';
import Animes from './pages/Animes';
import Kdramas from './pages/Kdramas';

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/dashboard', element: <Dashboard /> },
  { path: '/profile', element: <Profile /> },
  { path: '/content/:id', element: <ContentDetails /> },
  { path: '/movies', element: <Movies /> },
  { path: '/series', element: <Series /> },
  { path: '/animes', element: <Animes /> },
  { path: '/kdramas', element: <Kdramas /> },
  // Add more routes as needed
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
