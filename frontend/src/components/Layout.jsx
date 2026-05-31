import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import { useState, useEffect } from 'react'

export default function Layout() {
  const isMobile = () => window.innerWidth < 768
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile())
  const location = useLocation()

  useEffect(() => {
    const handleResize = () => {
      if (!isMobile()) setSidebarOpen(true)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (isMobile()) setSidebarOpen(false)
  }, [location.pathname])

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f0f4f8', overflow: 'hidden' }}>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        <Header onMenuClick={() => setSidebarOpen(o => !o)} />
        <main style={{ flex: 1, overflowY: 'auto', boxSizing: 'border-box' }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
