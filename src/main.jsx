import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy loading das páginas
const Home = React.lazy(() => import('./pages/Home'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Profile = React.lazy(() => import('./pages/Profile'));
const ContentDetails = React.lazy(() => import('./pages/ContentDetails'));
const Movies = React.lazy(() => import('./pages/Movies'));
const Series = React.lazy(() => import('./pages/Series'));
const Animes = React.lazy(() => import('./pages/Animes'));
const Kdramas = React.lazy(() => import('./pages/Kdramas'));

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/profile", element: <Profile /> },
  { path: "/content/:type/:id", element: <ContentDetails /> },
  { path: "/movies", element: <Movies /> },
  { path: "/series", element: <Series /> },
  { path: "/animes", element: <Animes /> },
  { path: "/kdramas", element: <Kdramas /> },
  // Add more routes as needed
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen bg-zinc-800 text-white">Carregando...</div>}>
        <RouterProvider router={router} />
      </Suspense>
    </ErrorBoundary>
  </React.StrictMode>,
)
