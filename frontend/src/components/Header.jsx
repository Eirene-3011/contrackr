import { Bell, LogOut, User, ChevronDown, Settings, AlertCircle, Shield, CreditCard, LayoutDashboard, Menu } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useQuery } from '@tanstack/react-query'
import { useState, useEffect, useRef } from 'react'
import axios from 'axios'

const headerStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

  :root {
    --primary: #0f172a;
    --primary-light: #1e293b;
    --accent: #f97316;
    --accent-light: #fb923c;
    --accent-soft: rgba(249, 115, 22, 0.08);
    
    --success: #10b981;
    --warning: #f59e0b;
    --warning-soft: rgba(245, 158, 11, 0.1);
    --danger: #ef4444;
    --danger-soft: rgba(239, 68, 68, 0.1);
    
    --bg-main: #f0f4f8;
    --border: #e2e8f0;
    --border-light: #f1f5f9;
    
    --text-main: #0f172a;
    --text-muted: #64748b;
    --text-dim: #94a3b8;
    
    --shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.08);
    --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
    --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.08);
    --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);
  }

  .header-contrackr {
    background: rgba(255, 255, 255, 0.75);
    backdrop-filter: blur(16px) saturate(180%);
    -webkit-backdrop-filter: blur(16px) saturate(180%);
    border-bottom: 1px solid rgba(226, 232, 240, 0.8);
    position: sticky;
    top: 0;
    z-index: 100;
    font-family: 'Plus Jakarta Sans', sans-serif;
    width: 100%;
    transition: all 0.3s ease;
    flex-shrink: 0;
  }

  .header-content {
    padding: 0.875rem 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 1920px;
    margin: 0 auto;
    gap: 1rem;
  }

  @media (max-width: 768px) {
    .header-content {
      padding: 0.75rem 1rem;
    }
  }

  /* Hamburger button */
  .hamburger-btn {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: transparent;
    border: 1px solid var(--border);
    color: var(--text-muted);
    cursor: pointer;
    display: none;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    flex-shrink: 0;
  }

  .hamburger-btn:hover {
    background: white;
    color: var(--accent);
    border-color: var(--accent);
  }

  @media (max-width: 767px) {
    .hamburger-btn {
      display: flex;
    }
  }

  /* Branding Section */
  .branding-group {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    text-decoration: none;
    transition: transform 0.2s ease;
    flex-shrink: 0;
  }

  .branding-group:hover {
    transform: scale(1.02);
  }

  .logo-icon {
    width: 36px;
    height: 36px;
    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    box-shadow: 0 8px 16px rgba(15, 23, 42, 0.15);
    position: relative;
    overflow: hidden;
    flex-shrink: 0;
  }

  .logo-icon::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent);
    transform: rotate(45deg);
    animation: shine 3s infinite;
  }

  @keyframes shine {
    0% { transform: translateX(-100%) rotate(45deg); }
    100% { transform: translateX(100%) rotate(45deg); }
  }

  .branding-text {
    display: flex;
    flex-direction: column;
  }

  .brand-name {
    font-size: 1.2rem;
    font-weight: 800;
    color: var(--text-main);
    letter-spacing: -0.03em;
    line-height: 1;
    margin-bottom: 2px;
  }

  .brand-tagline {
    font-size: 0.65rem;
    font-weight: 700;
    color: var(--accent);
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  @media (max-width: 480px) {
    .brand-tagline {
      display: none;
    }
    .brand-name {
      font-size: 1.05rem;
    }
  }

  /* Spacer */
  .header-spacer {
    flex: 1;
  }

  /* Actions Section */
  .header-actions {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .action-btn {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: transparent;
    border: 1px solid transparent;
    color: var(--text-muted);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    flex-shrink: 0;
  }

  .action-btn:hover {
    background: white;
    border-color: var(--border);
    color: var(--accent);
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);
  }

  .notif-dot {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 9px;
    height: 9px;
    background: var(--danger);
    border: 2px solid white;
    border-radius: 50%;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
    70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(239, 68, 68, 0); }
    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
  }

  /* User Profile Section */
  .profile-trigger {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    padding: 0.4rem 0.625rem 0.4rem 0.4rem;
    background: white;
    border: 1px solid var(--border);
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: var(--shadow-sm);
    flex-shrink: 0;
  }

  .profile-trigger:hover {
    border-color: var(--accent);
    box-shadow: var(--shadow-md);
    transform: translateY(-1px);
  }

  .avatar-wrapper {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: linear-gradient(135deg, var(--accent) 0%, var(--accent-light) 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 700;
    font-size: 0.8rem;
    box-shadow: 0 4px 8px rgba(249, 115, 22, 0.2);
    flex-shrink: 0;
  }

  .user-meta {
    display: none;
    flex-direction: column;
    text-align: left;
  }

  @media (min-width: 640px) {
    .user-meta { display: flex; }
  }

  .user-display-name {
    font-size: 0.8rem;
    font-weight: 700;
    color: var(--text-main);
    line-height: 1.2;
    white-space: nowrap;
    max-width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .user-display-role {
    font-size: 0.65rem;
    font-weight: 600;
    color: var(--text-dim);
    text-transform: uppercase;
    letter-spacing: 0.02em;
  }

  /* Dropdown Menus */
  .dropdown-card {
    position: absolute;
    top: calc(100% + 0.75rem);
    right: 0;
    width: 300px;
    background: white;
    border: 1px solid var(--border);
    border-radius: 18px;
    box-shadow: var(--shadow-xl);
    overflow: hidden;
    animation: dropdownFade 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    z-index: 1000;
  }

  @media (max-width: 480px) {
    .dropdown-card {
      width: calc(100vw - 2rem);
      right: -0.5rem;
    }
  }

  @keyframes dropdownFade {
    from { opacity: 0; transform: translateY(10px) scale(0.95); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }

  .dropdown-header {
    padding: 1.25rem;
    background: linear-gradient(135deg, var(--bg-main) 0%, white 100%);
    border-bottom: 1px solid var(--border-light);
  }

  .dropdown-body {
    padding: 0.5rem;
  }

  .dropdown-link {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 0.875rem;
    color: var(--text-main);
    text-decoration: none;
    font-size: 0.875rem;
    font-weight: 600;
    border-radius: 10px;
    transition: all 0.2s;
    width: 100%;
    border: none;
    background: transparent;
    cursor: pointer;
    text-align: left;
  }

  .dropdown-link:hover {
    background: var(--bg-main);
    color: var(--accent);
  }

  .dropdown-link svg {
    width: 16px;
    height: 16px;
    color: var(--text-dim);
    flex-shrink: 0;
  }

  .dropdown-link:hover svg {
    color: var(--accent);
  }

  .logout-link {
    color: var(--danger);
  }

  .logout-link:hover {
    background: var(--danger-soft);
    color: var(--danger);
  }

  .logout-link svg {
    color: var(--danger);
  }

  /* Notification List */
  .notif-list {
    max-height: 320px;
    overflow-y: auto;
  }

  .notif-item {
    padding: 0.875rem 1.125rem;
    display: flex;
    gap: 0.875rem;
    border-bottom: 1px solid var(--border-light);
    transition: background 0.2s;
  }

  .notif-item:hover {
    background: var(--bg-main);
  }

  .notif-icon-box {
    width: 34px;
    height: 34px;
    border-radius: 9px;
    background: var(--warning-soft);
    color: var(--warning);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .notif-content {
    flex: 1;
    min-width: 0;
  }

  .notif-title {
    font-size: 0.825rem;
    font-weight: 700;
    color: var(--text-main);
    margin-bottom: 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .notif-desc {
    font-size: 0.72rem;
    color: var(--text-dim);
    font-weight: 500;
  }
`

export default function Header({ onMenuClick }) {
  const { user, logout } = useAuth()
  const [isUserOpen, setIsUserOpen] = useState(false)
  const [isNotifOpen, setIsNotifOpen] = useState(false)
  const userRef = useRef(null)
  const notifRef = useRef(null)

  useEffect(() => {
    const closeAll = (e) => {
      if (userRef.current && !userRef.current.contains(e.target)) setIsUserOpen(false)
      if (notifRef.current && !notifRef.current.contains(e.target)) setIsNotifOpen(false)
    }
    document.addEventListener('mousedown', closeAll)
    return () => document.removeEventListener('mousedown', closeAll)
  }, [])

  const { data: lowStock = [] } = useQuery({
    queryKey: ['low-stock-count'],
    queryFn: () => axios.get('/api/inventory/low-stock').then(r => r.data),
    refetchInterval: 60000,
  })

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'

  return (
    <>
      <style>{headerStyles}</style>
      <header className="header-contrackr">
        <div className="header-content">
          {/* Hamburger — mobile only */}
          <button
            className="hamburger-btn"
            onClick={onMenuClick}
            aria-label="Toggle navigation"
          >
            <Menu size={20} strokeWidth={2} />
          </button>

          {/* Branding */}
          <div className="branding-group">
            <div className="logo-icon">
              <LayoutDashboard size={20} strokeWidth={2.5} />
            </div>
            <div className="branding-text">
              <span className="brand-name">ConTrackr</span>
              <span className="brand-tagline">Construction Intelligence</span>
            </div>
          </div>

          <div className="header-spacer" />

          {/* Actions */}
          <div className="header-actions">
            {/* Notifications */}
            <div style={{ position: 'relative' }} ref={notifRef}>
              <button
                className="action-btn"
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                title="Notifications"
              >
                <Bell size={20} strokeWidth={2} />
                {lowStock.length > 0 && <span className="notif-dot" />}
              </button>

              {isNotifOpen && (
                <div className="dropdown-card">
                  <div className="dropdown-header">
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)' }}>Notifications</h3>
                  </div>
                  <div className="notif-list">
                    {lowStock.length === 0 ? (
                      <div style={{ padding: '2.5rem 1.5rem', textAlign: 'center' }}>
                        <Bell size={28} style={{ color: 'var(--text-dim)', opacity: 0.2, marginBottom: '0.75rem' }} />
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>All caught up!</p>
                      </div>
                    ) : (
                      lowStock.map((item, i) => (
                        <div key={i} className="notif-item">
                          <div className="notif-icon-box">
                            <AlertCircle size={16} />
                          </div>
                          <div className="notif-content">
                            <p className="notif-title">Low Stock: {item.name}</p>
                            <p className="notif-desc">Only {item.quantity} {item.unit} remaining</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  {lowStock.length > 0 && (
                    <div style={{ padding: '0.625rem', borderTop: '1px solid var(--border-light)', textAlign: 'center' }}>
                      <button className="dropdown-link" style={{ justifyContent: 'center', color: 'var(--accent)' }}>
                        View All Alerts
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* User Profile */}
            <div style={{ position: 'relative' }} ref={userRef}>
              <button
                className="profile-trigger"
                onClick={() => setIsUserOpen(!isUserOpen)}
              >
                <div className="avatar-wrapper">{initials}</div>
                <div className="user-meta">
                  <span className="user-display-name">{user?.name || 'User'}</span>
                  <span className="user-display-role">{user?.role || 'Member'}</span>
                </div>
                <ChevronDown size={14} style={{ color: 'var(--text-dim)', transform: isUserOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s', flexShrink: 0 }} />
              </button>

              {isUserOpen && (
                <div className="dropdown-card" style={{ width: '240px' }}>
                  <div className="dropdown-header">
                    <p style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</p>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</p>
                  </div>
                  <div className="dropdown-body">
                    <button className="dropdown-link">
                      <User size={16} />
                      My Profile
                    </button>
                    <button className="dropdown-link">
                      <Shield size={16} />
                      Security
                    </button>
                    <button className="dropdown-link">
                      <Settings size={16} />
                      Settings
                    </button>
                    <div style={{ height: '1px', background: 'var(--border-light)', margin: '0.375rem' }} />
                    <button
                      className="dropdown-link logout-link"
                      onClick={() => { setIsUserOpen(false); logout(); }}
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
