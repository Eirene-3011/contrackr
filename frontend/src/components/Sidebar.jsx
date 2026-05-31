import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard, Package, FolderOpen, ClipboardList,
  ShoppingCart, Warehouse, Truck, ArrowLeftRight,
  BarChart3, Users, Building2, X, LogOut
} from 'lucide-react'

const sidebarStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

  :root {
    --primary: #0f172a;
    --primary-soft: rgba(15, 23, 42, 0.95);
    --accent: #f97316;
    --accent-soft: rgba(249, 115, 22, 0.1);
    --text-main: #f8fafc;
    --text-muted: #94a3b8;
    --border-soft: rgba(255, 255, 255, 0.05);
  }

  .sidebar-seamless {
    font-family: 'Plus Jakarta Sans', sans-serif;
    height: 100vh;
    background: var(--primary-soft);
    backdrop-filter: blur(16px);
    color: var(--text-main);
    display: flex;
    flex-direction: column;
    transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1), transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    z-index: 100;
    border-right: 1px solid var(--border-soft);
    flex-shrink: 0;
    overflow: hidden;
    width: 280px;
  }

  .sidebar-seamless.closed {
    width: 0;
    transform: translateX(-100%);
  }

  .sidebar-seamless.open {
    width: 280px;
    transform: translateX(0);
  }

  @media (max-width: 767px) {
    .sidebar-seamless {
      position: fixed;
      top: 0;
      left: 0;
      height: 100vh;
      z-index: 200;
    }

    .sidebar-seamless.closed {
      width: 280px;
      transform: translateX(-100%);
    }

    .sidebar-seamless.open {
      transform: translateX(0);
    }
  }

  /* Header Section */
  .header-minimal {
    padding: 2rem 1.5rem 1.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
  }

  .brand-minimal {
    display: flex;
    align-items: center;
    gap: 0.875rem;
    text-decoration: none;
  }

  .logo-minimal {
    width: 38px;
    height: 38px;
    background: var(--accent);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8px 20px -4px rgba(249, 115, 22, 0.3);
    flex-shrink: 0;
  }

  .logo-minimal img {
    width: 22px;
    height: 22px;
    filter: brightness(0) invert(1);
  }

  .brand-text-minimal {
    display: flex;
    flex-direction: column;
    white-space: nowrap;
  }

  .brand-name-minimal {
    font-size: 1.3rem;
    font-weight: 800;
    letter-spacing: -0.03em;
    color: #fff;
    line-height: 1;
  }

  .brand-tag-minimal {
    font-size: 0.65rem;
    font-weight: 700;
    color: var(--accent);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-top: 0.2rem;
  }

  /* Navigation Area */
  .nav-minimal {
    flex: 1;
    overflow-y: auto;
    padding: 0.75rem 1rem;
    scrollbar-width: none;
  }

  .nav-minimal::-webkit-scrollbar { display: none; }

  .nav-item-minimal {
    display: flex;
    align-items: center;
    padding: 0.8rem 0.875rem;
    margin-bottom: 0.2rem;
    border-radius: 10px;
    color: var(--text-muted);
    text-decoration: none;
    transition: all 0.3s ease;
    position: relative;
    font-weight: 500;
    white-space: nowrap;
  }

  .nav-item-minimal:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.03);
  }

  .nav-item-minimal.active {
    color: #fff;
    background: var(--accent-soft);
  }

  /* The "Liquid" Indicator */
  .nav-item-minimal.active::before {
    content: '';
    position: absolute;
    left: -1rem;
    top: 20%;
    height: 60%;
    width: 4px;
    background: var(--accent);
    border-radius: 0 4px 4px 0;
    box-shadow: 4px 0 12px var(--accent);
  }

  .icon-minimal {
    margin-right: 0.875rem;
    width: 20px;
    height: 20px;
    transition: transform 0.3s ease;
    flex-shrink: 0;
  }

  .nav-item-minimal:hover .icon-minimal {
    transform: scale(1.1);
    color: var(--accent);
  }

  .nav-item-minimal.active .icon-minimal {
    color: var(--accent);
  }

  .label-minimal {
    font-size: 0.9rem;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* Footer / User Section */
  .footer-minimal {
    padding: 1.25rem 1.5rem;
    border-top: 1px solid var(--border-soft);
    flex-shrink: 0;
  }

  .user-minimal {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    gap: 0.5rem;
  }

  .user-info-minimal {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    min-width: 0;
  }

  .avatar-minimal {
    width: 34px;
    height: 34px;
    border-radius: 9px;
    background: var(--accent);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    color: #fff;
    font-size: 0.85rem;
    flex-shrink: 0;
  }

  .user-text-minimal {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .user-name-minimal {
    font-size: 0.875rem;
    font-weight: 700;
    color: #fff;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .user-role-minimal {
    font-size: 0.7rem;
    color: var(--text-muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .logout-minimal {
    width: 30px;
    height: 30px;
    border-radius: 7px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-muted);
    transition: all 0.2s;
    cursor: pointer;
    border: none;
    background: transparent;
    flex-shrink: 0;
  }

  .logout-minimal:hover {
    background: rgba(239, 68, 68, 0.1);
    color: #ef4444;
  }

  /* Mobile Overlay */
  .overlay-minimal {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    z-index: 190;
    opacity: 0;
    visibility: hidden;
    transition: all 0.4s ease;
  }

  .overlay-minimal.active {
    opacity: 1;
    visibility: visible;
  }

  @media (min-width: 768px) {
    .overlay-minimal { display: none; }
  }

  .close-btn-minimal {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-muted);
    transition: all 0.2s;
    cursor: pointer;
    border: none;
    background: rgba(255,255,255,0.05);
    flex-shrink: 0;
  }

  .close-btn-minimal:hover {
    background: rgba(255,255,255,0.1);
    color: #fff;
  }

  @media (min-width: 768px) {
    .close-btn-minimal { display: none; }
  }
`

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['Administrator','Procurement Officer','Site Engineer','Warehouse Manager','Project Manager'] },
  { to: '/projects', icon: FolderOpen, label: 'Projects', roles: ['Administrator','Site Engineer','Project Manager'] },
  { to: '/materials', icon: Package, label: 'Materials', roles: ['Administrator','Warehouse Manager','Procurement Officer'] },
  { to: '/suppliers', icon: Building2, label: 'Suppliers', roles: ['Administrator','Procurement Officer'] },
  { to: '/material-requests', icon: ClipboardList, label: 'Material Requests', roles: ['Administrator','Site Engineer','Warehouse Manager'] },
  { to: '/procurement', icon: ShoppingCart, label: 'Procurement (PR/PO)', roles: ['Administrator','Procurement Officer','Project Manager'] },
  { to: '/inventory', icon: Warehouse, label: 'Inventory', roles: ['Administrator','Warehouse Manager','Site Engineer','Project Manager'] },
  { to: '/deliveries', icon: Truck, label: 'Deliveries', roles: ['Administrator','Warehouse Manager','Site Engineer'] },
  { to: '/transfers', icon: ArrowLeftRight, label: 'Transfers', roles: ['Administrator','Project Manager','Site Engineer','Warehouse Manager'] },
  { to: '/reports', icon: BarChart3, label: 'Reports', roles: ['Administrator','Project Manager'] },
  { to: '/users', icon: Users, label: 'User Management', roles: ['Administrator'] },
]

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth()
  const visibleItems = navItems.filter(item => item.roles.includes(user?.role))
  const isMobile = () => typeof window !== 'undefined' && window.innerWidth < 768

  const handleNavClick = () => {
    if (isMobile()) onClose()
  }

  return (
    <>
      <style>{sidebarStyles}</style>

      <div
        className={`overlay-minimal ${open ? 'active' : ''}`}
        onClick={onClose}
      />

      <aside className={`sidebar-seamless ${open ? 'open' : 'closed'}`}>
        {/* Header */}
        <div className="header-minimal">
          <div className="brand-minimal">
            <div className="logo-minimal">
              <img src="/logo.png" alt="Logo" onError={e => { e.target.style.display = 'none' }} />
            </div>
            <div className="brand-text-minimal">
              <span className="brand-name-minimal">ConTrackr</span>
              <span className="brand-tag-minimal">Materials Monitor</span>
            </div>
          </div>
          <button onClick={onClose} className="close-btn-minimal" aria-label="Close menu">
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="nav-minimal">
          {visibleItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `nav-item-minimal ${isActive ? 'active' : ''}`}
              onClick={handleNavClick}
            >
              <Icon size={18} strokeWidth={2.2} className="icon-minimal" />
              <span className="label-minimal">{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer / User Profile */}
        <div className="footer-minimal">
          <div className="user-minimal">
            <div className="user-info-minimal">
              <div className="avatar-minimal">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="user-text-minimal">
                <span className="user-name-minimal">{user?.name || 'User Name'}</span>
                <span className="user-role-minimal">{user?.role || 'Role'}</span>
              </div>
            </div>
            <button
              onClick={logout}
              className="logout-minimal"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
