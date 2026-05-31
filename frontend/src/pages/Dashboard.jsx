import React, { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Legend, Cell, AreaChart, Area, LineChart, Line
} from 'recharts'
import { 
  Package, FolderOpen, ClipboardList, ShoppingCart, 
  ArrowLeftRight, AlertTriangle, DollarSign, TrendingUp, 
  Calendar, Filter, Download, Settings, Search, Bell, 
  MoreVertical, ArrowUpRight, ArrowDownRight, Activity,
  Layers, RefreshCcw, X, ChevronRight, LayoutDashboard,
  Box, Users, FileText, PieChart, Info, Zap, Target, Eye
} from 'lucide-react'
import { format } from 'date-fns'

/**
 * ConTrackr Dashboard - Professional Enhanced Edition
 * 
 * Design Enhancements:
 * - Modern gradient backgrounds and glassmorphism effects
 * - Refined typography hierarchy and spacing
 * - Enhanced color palette with better contrast
 * - Smooth animations and transitions
 * - Improved visual hierarchy and component consistency
 * - Better data visualization with enhanced charts
 * - Professional status indicators and badges
 */

const dashboardStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

  :root {
    --primary: #0f172a;
    --primary-light: #1e293b;
    --primary-lighter: #334155;
    --accent: #f97316;
    --accent-light: #fb923c;
    --accent-glow: rgba(249, 115, 22, 0.4);
    --accent-soft: rgba(249, 115, 22, 0.08);
    
    --success: #10b981;
    --success-soft: rgba(16, 185, 129, 0.1);
    --warning: #f59e0b;
    --warning-soft: rgba(245, 158, 11, 0.1);
    --danger: #ef4444;
    --danger-soft: rgba(239, 68, 68, 0.1);
    --info: #3b82f6;
    --info-soft: rgba(59, 130, 246, 0.1);
    
    --bg-main: #f0f4f8;
    --bg-card: #ffffff;
    --border: #e2e8f0;
    --border-light: #f1f5f9;
    
    --text-main: #0f172a;
    --text-muted: #64748b;
    --text-dim: #94a3b8;
    
    --shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.08);
    --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.08);
    --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
    --shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.15);
    
    --radius-sm: 8px;
    --radius-md: 12px;
    --radius-lg: 16px;
    --radius-xl: 24px;
  }

  * {
    box-sizing: border-box;
  }

  .dashboard-wrapper {
    min-height: 100vh;
    padding: 2rem 2.5rem;
    background: linear-gradient(135deg, var(--bg-main) 0%, #f8fbfc 100%);
    font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
    color: var(--text-main);
    position: relative;
    overflow-x: hidden;
  }

  /* Decorative Background Accents */
  .dashboard-wrapper::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(circle at 5% 5%, rgba(249, 115, 22, 0.04) 0%, transparent 40%),
      radial-gradient(circle at 95% 95%, rgba(59, 130, 246, 0.03) 0%, transparent 40%),
      radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.02) 0%, transparent 60%);
    pointer-events: none;
    z-index: 0;
  }

  .dashboard-container {
    max-width: 1700px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
    animation: dashboardFadeIn 0.8s cubic-bezier(0.2, 0, 0.2, 1);
  }

  @keyframes dashboardFadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* --- Header --- */
  .header-section {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 3rem;
    gap: 2rem;
  }

  .welcome-group h1 {
    font-size: 2.75rem;
    font-weight: 800;
    letter-spacing: -0.06em;
    color: var(--primary);
    margin-bottom: 0.75rem;
    background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .welcome-group p {
    color: var(--text-muted);
    font-size: 1rem;
    display: flex;
    align-items: center;
    gap: 0.6rem;
    font-weight: 600;
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .search-input-wrapper {
    position: relative;
    width: 340px;
  }

  .search-input-wrapper input {
    width: 100%;
    height: 50px;
    padding: 0 1.2rem 0 3.2rem;
    background: white;
    border: 1.5px solid var(--border);
    border-radius: 14px;
    font-size: 0.95rem;
    font-weight: 500;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: var(--shadow-sm);
  }

  .search-input-wrapper input::placeholder {
    color: var(--text-dim);
  }

  .search-input-wrapper input:focus {
    outline: none;
    border-color: var(--accent);
    box-shadow: 0 0 0 4px var(--accent-soft), var(--shadow-md);
  }

  .search-input-wrapper svg {
    position: absolute;
    left: 1.2rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-dim);
    transition: color 0.3s;
  }

  .search-input-wrapper input:focus ~ svg {
    color: var(--accent);
  }

  .btn-icon-modern {
    width: 50px;
    height: 50px;
    border-radius: 14px;
    background: white;
    border: 1.5px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-muted);
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    box-shadow: var(--shadow-sm);
  }

  .btn-icon-modern:hover {
    border-color: var(--accent);
    color: var(--accent);
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
  }

  .btn-primary-modern {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1.75rem;
    height: 50px;
    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
    color: white;
    border: none;
    border-radius: 14px;
    font-weight: 700;
    font-size: 0.95rem;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 15px rgba(15, 23, 42, 0.2);
  }

  .btn-primary-modern:hover {
    background: linear-gradient(135deg, var(--accent) 0%, var(--accent-light) 100%);
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(249, 115, 22, 0.35);
  }

  /* --- Alert Banner --- */
  .alert-card {
    background: linear-gradient(135deg, #fffbeb 0%, #fef9e7 100%);
    border: 1.5px solid #fde68a;
    border-left: 5px solid var(--warning);
    border-radius: var(--radius-lg);
    padding: 1.75rem 2.25rem;
    margin-bottom: 2.5rem;
    display: flex;
    align-items: center;
    gap: 1.5rem;
    box-shadow: 0 4px 20px rgba(245, 158, 11, 0.1);
    animation: alertSlideDown 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  @keyframes alertSlideDown {
    from { opacity: 0; transform: translateY(-30px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .alert-icon-box {
    width: 56px;
    height: 56px;
    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #d97706;
    flex-shrink: 0;
  }

  .alert-body h4 {
    font-size: 1.1rem;
    font-weight: 800;
    color: #92400e;
    margin-bottom: 0.4rem;
  }

  .alert-body p {
    font-size: 0.95rem;
    color: #b45309;
    font-weight: 500;
    line-height: 1.5;
  }

  .alert-close-btn {
    margin-left: auto;
    background: transparent;
    border: none;
    color: #b45309;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 8px;
    transition: all 0.2s;
    flex-shrink: 0;
  }

  .alert-close-btn:hover { background: rgba(180, 83, 9, 0.15); }

  /* --- Stats Grid --- */
  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.75rem;
    margin-bottom: 3rem;
  }

  @media (max-width: 1400px) { .metrics-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 768px) { .metrics-grid { grid-template-columns: 1fr; } }

  .metric-card {
    background: white;
    border: 1.5px solid var(--border);
    border-radius: var(--radius-xl);
    padding: 2.25rem;
    position: relative;
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: default;
    box-shadow: var(--shadow-sm);
  }

  .metric-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--accent), transparent);
    opacity: 0;
    transition: opacity 0.4s;
  }

  .metric-card:hover {
    transform: translateY(-12px);
    border-color: var(--accent-light);
    box-shadow: var(--shadow-2xl);
  }

  .metric-card:hover::before {
    opacity: 1;
  }

  .metric-card::after {
    content: '';
    position: absolute;
    bottom: -50px;
    right: -50px;
    width: 150px;
    height: 150px;
    background: radial-gradient(circle, var(--accent-soft) 0%, transparent 70%);
    opacity: 0;
    transition: opacity 0.4s;
  }

  .metric-card:hover::after { opacity: 1; }

  .metric-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 2rem;
  }

  .metric-icon-wrapper {
    width: 64px;
    height: 64px;
    background: linear-gradient(135deg, var(--bg-main) 0%, var(--border-light) 100%);
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--accent);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .metric-card:hover .metric-icon-wrapper {
    background: linear-gradient(135deg, var(--accent) 0%, var(--accent-light) 100%);
    color: white;
    transform: scale(1.15) rotate(8deg);
    box-shadow: 0 12px 24px rgba(249, 115, 22, 0.35);
  }

  .metric-badge {
    padding: 0.5rem 1rem;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 800;
    display: flex;
    align-items: center;
    gap: 0.4rem;
    letter-spacing: 0.05em;
  }

  .badge-success { 
    background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
    color: #059669; 
  }

  .badge-neutral { 
    background: linear-gradient(135deg, var(--border-light) 0%, var(--border) 100%);
    color: var(--text-muted); 
  }

  .metric-value {
    font-size: 2.5rem;
    font-weight: 800;
    color: var(--primary);
    letter-spacing: -0.04em;
    line-height: 1;
    margin-bottom: 0.75rem;
  }

  .metric-label {
    font-size: 0.9rem;
    font-weight: 700;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .metric-footer {
    margin-top: 1.5rem;
    font-size: 0.85rem;
    color: var(--text-dim);
    font-weight: 500;
  }

  /* --- Main Content Grid --- */
  .content-layout {
    display: grid;
    grid-template-columns: 1.8fr 1.2fr;
    gap: 2rem;
    margin-bottom: 3rem;
  }

  @media (max-width: 1200px) { .content-layout { grid-template-columns: 1fr; } }

  .glass-card-modern {
    background: white;
    border: 1.5px solid var(--border);
    border-radius: var(--radius-xl);
    padding: 2.75rem;
    box-shadow: var(--shadow-sm);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .glass-card-modern:hover { 
    box-shadow: var(--shadow-lg);
    border-color: var(--border);
  }

  .card-header-modern {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 2.5rem;
    gap: 1.5rem;
  }

  .card-title-group h3 {
    font-size: 1.5rem;
    font-weight: 800;
    color: var(--primary);
    margin-bottom: 0.5rem;
  }

  .card-title-group p {
    font-size: 0.95rem;
    color: var(--text-muted);
    font-weight: 500;
  }

  /* --- Modern Table --- */
  .table-scroll {
    overflow-x: auto;
    margin: 0 -1rem;
    padding: 0 1rem;
  }

  .modern-data-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0 0.8rem;
  }

  .modern-data-table th {
    padding: 1.25rem 1.5rem;
    text-align: left;
    font-size: 0.8rem;
    font-weight: 800;
    color: var(--text-dim);
    text-transform: uppercase;
    letter-spacing: 0.12em;
  }

  .modern-data-table tbody tr {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .modern-data-table td {
    padding: 1.5rem;
    background: white;
    border-top: 1px solid var(--border-light);
    border-bottom: 1px solid var(--border-light);
    font-size: 1rem;
    font-weight: 500;
  }

  .modern-data-table td:first-child {
    border-left: 1.5px solid var(--border-light);
    border-top-left-radius: 16px;
    border-bottom-left-radius: 16px;
    font-weight: 700;
    color: var(--primary);
  }

  .modern-data-table td:last-child {
    border-right: 1.5px solid var(--border-light);
    border-top-right-radius: 16px;
    border-bottom-right-radius: 16px;
  }

  .modern-data-table tbody tr:hover td {
    background: linear-gradient(90deg, var(--bg-main) 0%, white 100%);
    border-color: var(--accent-soft);
    transform: scale(1.008);
    box-shadow: 0 6px 20px rgba(249, 115, 22, 0.08);
  }

  .status-pill {
    padding: 0.6rem 1.1rem;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: 800;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    letter-spacing: 0.04em;
  }

  .status-in { 
    background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
    color: #059669; 
  }

  .status-out { 
    background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
    color: #dc2626; 
  }

  .status-transfer { 
    background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
    color: #2563eb; 
  }

  .qty-box {
    display: flex;
    align-items: baseline;
    gap: 0.4rem;
  }

  .qty-number {
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--primary);
  }

  .qty-unit-label {
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--text-muted);
  }

  .timestamp-group {
    display: flex;
    flex-direction: column;
  }

  .time-main {
    font-weight: 700;
    color: var(--text-main);
  }

  .time-sub {
    font-size: 0.8rem;
    color: var(--text-dim);
    margin-top: 0.2rem;
  }

  /* --- Custom Scrollbar --- */
  ::-webkit-scrollbar { width: 8px; height: 8px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
  ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

  /* --- Loader --- */
  .loader-overlay {
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, var(--bg-main) 0%, #f8fbfc 100%);
  }

  .custom-spinner {
    width: 70px;
    height: 70px;
    border: 4px solid var(--border-light);
    border-top: 4px solid var(--accent);
    border-radius: 50%;
    animation: spin-anim 1.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  }

  @keyframes spin-anim { 
    0% { transform: rotate(0deg); } 
    100% { transform: rotate(360deg); } 
  }

  .loader-text {
    margin-top: 2rem;
    color: var(--text-muted);
    font-weight: 700;
    letter-spacing: 0.15em;
    font-size: 0.95rem;
  }

  /* ---- Mobile Responsive ---- */
  @media (max-width: 768px) {
    .dashboard-wrapper {
      padding: 1rem 1.25rem;
    }

    .header-section {
      flex-direction: column;
      align-items: flex-start;
      gap: 1.25rem;
      margin-bottom: 2rem;
    }

    .welcome-group h1 {
      font-size: 1.75rem;
    }

    .welcome-group p {
      font-size: 0.85rem;
    }

    .header-actions {
      flex-wrap: wrap;
      width: 100%;
    }

    .search-input-wrapper {
      width: 100%;
    }

    .btn-primary-modern {
      width: 100%;
      justify-content: center;
    }

    .alert-card {
      flex-direction: column;
      align-items: flex-start;
      padding: 1.25rem;
    }

    .metric-card {
      padding: 1.5rem;
    }
  }

  @media (max-width: 480px) {
    .dashboard-wrapper {
      padding: 0.75rem;
    }

    .metrics-grid {
      gap: 1rem;
    }
  }
`

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(12px)',
        border: '1.5px solid rgba(255,255,255,0.15)',
        borderRadius: '16px',
        padding: '1.5rem',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)',
        color: 'white',
        minWidth: '220px'
      }}>
        <p style={{ 
          fontWeight: 800, 
          fontSize: '1rem', 
          marginBottom: '1rem', 
          color: '#f97316', 
          borderBottom: '1px solid rgba(255,255,255,0.1)', 
          paddingBottom: '0.75rem' 
        }}>
          {label ? format(new Date(label), 'MMMM d, yyyy') : 'Timeline'}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {payload.map((entry, index) => (
            <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: 12, height: 12, borderRadius: '4px', backgroundColor: entry.color }} />
                <span style={{ fontSize: '0.9rem', color: '#cbd5e1', fontWeight: 600 }}>{entry.name}</span>
              </div>
              <span style={{ fontSize: '1rem', fontWeight: 800, color: '#f1f5f9' }}>{entry.value}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }
  return null
}

const MetricCard = ({ icon: Icon, label, value, sub, trend, index }) => (
  <div className="metric-card" style={{ animationDelay: `${index * 0.08}s` }}>
    <div className="metric-header">
      <div className="metric-icon-wrapper">
        <Icon size={32} strokeWidth={2} />
      </div>
      {trend ? (
        <div className="metric-badge badge-success">
          <ArrowUpRight size={16} strokeWidth={2.5} />
          {trend}
        </div>
      ) : (
        <div className="metric-badge badge-neutral">
          <Activity size={16} strokeWidth={2.5} />
          Live
        </div>
      )}
    </div>
    <div className="metric-value">{value ?? '—'}</div>
    <div className="metric-label">{label}</div>
    <div className="metric-footer">
      {sub || "Updated in real-time"}
    </div>
  </div>
)

export default function Dashboard() {
  const [isAlertVisible, setAlertVisible] = useState(true)

  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => axios.get('/api/reports/dashboard').then(r => r.data?.data || r.data),
    refetchInterval: 30000,
  })
  
  const { data: movement } = useQuery({
    queryKey: ['stock-movement'],
    queryFn: () => axios.get('/api/reports/stock-movement').then(r => Array.isArray(r.data) ? r.data : r.data?.data || []),
  })
  
  const { data: mostUsed } = useQuery({
    queryKey: ['most-used'],
    queryFn: () => axios.get('/api/reports/most-used').then(r => Array.isArray(r.data) ? r.data : r.data?.data || []),
  })

  const metrics = useMemo(() => [
    { icon: Package, label: "Total Materials", value: data?.total_materials, trend: "+12%" },
    { icon: Layers, label: "Active Projects", value: data?.total_projects },
    { icon: ClipboardList, label: "Material Requests", value: data?.pending_mr, sub: "Awaiting review" },
    { icon: ShoppingCart, label: "Purchase Pipeline", value: data?.pending_pr, sub: "Active PRs & POs" },
    { icon: ArrowLeftRight, label: "Stock Transfers", value: data?.pending_transfers, sub: "In-progress movements" },
    { icon: AlertTriangle, label: "Inventory Health", value: data?.low_stock_count, sub: "Items below reorder" },
    { 
      icon: DollarSign, 
      label: "Procurement Value", 
      value: `₱${parseFloat(data?.total_po_value || 0).toLocaleString('en-PH', { maximumFractionDigits: 0 })}`,
      sub: "Total active procurement"
    },
    { icon: Zap, label: "System Uptime", value: "99.9%", sub: "Node cluster active" }
  ], [data])

  if (isLoading) {
    return (
      <div className="loader-overlay">
        <style>{dashboardStyles}</style>
        <div className="custom-spinner"></div>
        <p className="loader-text">INITIALIZING DASHBOARD...</p>
      </div>
    )
  }

  return (
    <div className="dashboard-wrapper">
      <style>{dashboardStyles}</style>
      
      <div className="dashboard-container">
        
        {/* --- Header Section --- */}
        <header className="header-section">
          <div className="welcome-group">
            <h1>Dashboard</h1>
            <p>
              <Calendar size={18} />
              {format(new Date(), 'EEEE, MMMM do yyyy')}
            </p>
          </div>
          
          <div className="header-actions">
            <div className="search-input-wrapper">
              <input type="text" placeholder="Search resources, projects, or assets..." />
              <Search size={20} />
            </div>
          </div>
        </header>

        {/* --- Critical Alerts --- */}
        {isAlertVisible && data?.low_stock_items?.length > 0 && (
          <div className="alert-card">
            <div className="alert-icon-box">
              <AlertTriangle size={28} strokeWidth={2} />
            </div>
            <div className="alert-body">
              <h4>Inventory Shortage Detected</h4>
              <p>
                <strong>{data.low_stock_items.length} critical items</strong> are currently below threshold. 
                <span style={{ opacity: 0.8, marginLeft: '0.6rem', borderLeft: '1px solid #fde68a', paddingLeft: '0.6rem' }}>
                  Most urgent: {data.low_stock_items.slice(0, 3).map(i => i.name).join(', ')}
                </span>
              </p>
            </div>
            <button className="alert-close-btn" onClick={() => setAlertVisible(false)}>
              <X size={22} strokeWidth={2.5} />
            </button>
          </div>
        )}

        {/* --- High-Level Metrics --- */}
        <div className="metrics-grid">
          {metrics.map((metric, i) => (
            <MetricCard key={i} {...metric} index={i} />
          ))}
        </div>

        {/* --- Visual Analytics Grid --- */}
        <div className="content-layout">
          {/* Stock Velocity Chart */}
          <div className="glass-card-modern">
            <div className="card-header-modern">
              <div className="card-title-group">
                <h3>Inventory Velocity</h3>
                <p>30-day inflow and outflow trend analysis</p>
              </div>
              <div className="header-actions">
                <div className="status-pill status-in">
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'currentColor' }}></div>
                  Inflow
                </div>
                <div className="status-pill status-out">
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'currentColor' }}></div>
                  Outflow
                </div>
              </div>
            </div>
            <div style={{ width: '100%', height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={movement || []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradientIn" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="gradientOut" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={d => d ? format(new Date(d), 'MMM d') : ''} 
                    tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 700 }}
                    axisLine={false}
                    tickLine={false}
                    dy={15}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 700 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#f97316', strokeWidth: 2, strokeDasharray: '5 5' }} />
                  <Area 
                    type="monotone" 
                    dataKey="stock_in" 
                    name="Stock In" 
                    stroke="#10b981" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#gradientIn)" 
                    animationDuration={1500}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="stock_out" 
                    name="Stock Out" 
                    stroke="#f97316" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#gradientOut)" 
                    animationDuration={2000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Resource Intensity Bar Chart */}
          <div className="glass-card-modern">
            <div className="card-header-modern">
              <div className="card-title-group">
                <h3>Resource Intensity</h3>
                <p>Most consumed materials</p>
              </div>
            </div>
            <div style={{ width: '100%', height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mostUsed || []} layout="vertical" margin={{
                  top: 5,
                  right: 30,
                  left: 100,
                  bottom: 5
                }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={true} stroke="#f1f5f9" />
                  <XAxis 
                    type="number"
                    tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 700 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    width={100} 
                    tick={{ fontSize: 12, fill: '#64748b', fontWeight: 700 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--bg-main)', opacity: 0.5 }} />
                  <Bar dataKey="total_out" name="Consumption" radius={[0, 10, 10, 0]} barSize={28}>
                    {(mostUsed || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#f97316' : '#1e293b'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* --- Recent Activity Ledger --- */}
        <div className="glass-card-modern" style={{ padding: '2.75rem' }}>
          <div className="card-header-modern" style={{ marginBottom: '2rem' }}>
            <div className="card-title-group">
              <h3>Live Activity Ledger</h3>
              <p>Comprehensive audit trail of inventory transactions</p>
            </div>
            <button className="btn-icon-modern" style={{ width: 'auto', padding: '0 1.5rem', gap: '0.6rem', height: 'auto' }}>
              <Filter size={18} strokeWidth={2} />
              <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>Filter Ledger</span>
            </button>
          </div>
          
          <div className="table-scroll">
            <table className="modern-data-table">
              <thead>
                <tr>
                  <th>Material Asset</th>
                  <th>Classification</th>
                  <th>Quantity</th>
                  <th>Source / Destination</th>
                  <th>Timestamp</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {data?.recent_transactions?.map((t, i) => (
                  <tr key={i}>
                    <td>{t.material_name}</td>
                    <td>
                      <span className={`status-pill ${t.type === 'IN' ? 'status-in' : t.type === 'OUT' ? 'status-out' : 'status-transfer'}`}>
                        {t.type === 'IN' && <ArrowDownRight size={14} strokeWidth={2.5} />}
                        {t.type === 'OUT' && <ArrowUpRight size={14} strokeWidth={2.5} />}
                        {t.type === 'TRANSFER' && <ArrowLeftRight size={14} strokeWidth={2.5} />}
                        {t.type}
                      </span>
                    </td>
                    <td>
                      <div className="qty-box">
                        <span className="qty-number">{parseFloat(t.quantity).toLocaleString()}</span>
                        <span className="qty-unit-label">{t.unit}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)' }}>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: t.project_name ? 'var(--accent)' : 'var(--text-dim)' }}></div>
                        <span style={{ fontWeight: 600 }}>{t.project_name || 'Central Warehouse'}</span>
                      </div>
                    </td>
                    <td>
                      <div className="timestamp-group">
                        <span className="time-main">{format(new Date(t.transaction_date), 'MMM d, yyyy')}</span>
                        <span className="time-sub">{format(new Date(t.transaction_date), 'h:mm a')}</span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="btn-icon-modern" style={{ width: 36, height: 36, border: 'none', background: 'transparent', boxShadow: 'none' }}>
                        <ChevronRight size={22} strokeWidth={2} />
                      </button>
                    </td>
                  </tr>
                ))}
                {!data?.recent_transactions?.length && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '6rem 0' }}>
                      <div style={{ opacity: 0.1, marginBottom: '1.5rem' }}>
                        <Box size={80} style={{ margin: '0 auto' }} />
                      </div>
                      <p style={{ color: 'var(--text-dim)', fontWeight: 600, fontSize: '1.1rem' }}>No transaction history recorded.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
