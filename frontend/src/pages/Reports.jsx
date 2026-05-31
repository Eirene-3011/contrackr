import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { FileText, Download, TrendingUp, Calendar } from 'lucide-react'
import { format } from 'date-fns'

/**
 * Enhanced Reports Component
 * 
 * Design Philosophy: Matches all components - Modern Professional
 * - Light background with excellent text contrast
 * - Tabbed interface for different report types
 * - Orange accent color (#f97316) for actions
 * - Responsive design with professional charts
 * - Comprehensive analytics and data visualization
 */

const reportsStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :root {
    --primary-color: #0f172a; /* Darker primary for text/elements */
    --accent-color: #f97316;
    --accent-light: #fb923c;
    --accent-soft: rgba(249, 115, 22, 0.1);
    
    --success-color: #10b981;
    --warning-color: #f59e0b;
    --danger-color: #ef4444;
    --info-color: #3b82f6;
    
    --bg-main: #f0f4f8; /* Lighter main background */
    --bg-card: #ffffff;
    --bg-secondary: #f8fafc;
    --bg-tertiary: #f1f5f9;
    
    --text-primary: #0f172a;
    --text-secondary: #64748b;
    --text-tertiary: #94a3b8;
    
    --border-color: #e2e8f0;
    --border-light: #f1f5f9;
    
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

  .reports-container {
    background: linear-gradient(135deg, var(--bg-main) 0%, #f8fbfc 100%);
    min-height: 100vh;
    padding: 2rem 2.5rem;
    font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
    color: var(--text-primary);
    position: relative;
    overflow-x: hidden;
  }

  /* Decorative Background Accents */
  .reports-container::before {
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

  .reports-inner {
    max-width: 1700px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
    animation: fadeIn 0.8s cubic-bezier(0.2, 0, 0.2, 1);
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* Page Header */
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 2rem;
    margin-bottom: 3rem;
    padding-bottom: 2rem;
    border-bottom: 1.5px solid var(--border-color);
  }

  .page-title {
    font-size: 2.75rem;
    font-weight: 800;
    color: var(--primary-color);
    margin-bottom: 0.75rem;
    letter-spacing: -0.02em;
    line-height: 1.2;
    padding-bottom: 4px;
    background: linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    display: block;
    width: fit-content;
  }

  .page-subtitle {
    font-size: 1rem;
    color: var(--text-secondary);
    font-weight: 600;
  }

  /* Tabs */
  .tabs-container {
    background-color: var(--bg-card);
    border: 1.5px solid var(--border-color);
    border-radius: var(--radius-xl);
    margin-bottom: 2rem;
    overflow: hidden;
    box-shadow: var(--shadow-sm);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .tabs-container:hover {
    border-color: var(--accent-light);
    box-shadow: var(--shadow-2xl);
    transform: translateY(-4px);
  }

  .tabs-header {
    display: flex;
    border-bottom: 1.5px solid var(--border-color);
    overflow-x: auto;
    background: linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-card) 100%);
  }

  .tab-button {
    flex: 1;
    min-width: 150px;
    padding: 1rem 1.5rem;
    background: none;
    border: none;
    font-size: 0.95rem;
    font-weight: 700;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    white-space: nowrap;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .tab-button:hover {
    color: var(--primary-color);
    background-color: var(--bg-tertiary);
  }

  .tab-button.active {
    color: var(--accent-color);
  }

  .tab-button.active::after {
    content: '';
    position: absolute;
    bottom: -1.5px; /* Adjust to sit on the border */
    left: 0;
    right: 0;
    height: 3px;
    background-color: var(--accent-color);
    border-radius: 2px 2px 0 0;
  }

  /* Card */
  .card {
    background-color: var(--bg-card);
    border: 1.5px solid var(--border-color);
    border-radius: var(--radius-xl);
    overflow: hidden;
    box-shadow: var(--shadow-sm);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .card:hover {
    border-color: var(--accent-light);
    box-shadow: var(--shadow-2xl);
    transform: translateY(-4px);
  }

  .card-header {
    padding: 1.5rem;
    border-bottom: 1.5px solid var(--border-light);
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-card) 100%);
  }

  .card-title {
    font-size: 1.25rem;
    font-weight: 800;
    color: var(--primary-color);
  }

  .card-subtitle {
    font-size: 0.9rem;
    color: var(--text-muted);
    margin-top: 0.5rem;
    font-weight: 500;
  }

  /* Filters */
  .filters-container {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  .filter-input,
  .filter-select {
    padding: 0.875rem 1.25rem;
    border: 1.5px solid var(--border-color);
    border-radius: var(--radius-md);
    font-size: 0.95rem;
    color: var(--text-primary);
    background-color: var(--bg-secondary);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-weight: 500;
    box-shadow: var(--shadow-sm);
  }

  .filter-input:focus,
  .filter-select:focus {
    outline: none;
    border-color: var(--accent-color);
    background-color: var(--bg-card);
    box-shadow: 0 0 0 4px var(--accent-soft);
  }

  /* Table */
  .table-wrapper {
    overflow-x: auto;
  }

  .data-table {
    width: 100%;
    border-collapse: collapse;
  }

  .data-table thead {
    background: linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-card) 100%);
    border-bottom: 1.5px solid var(--border-color);
  }

  .data-table th {
    padding: 1.25rem 1.75rem;
    text-align: left;
    font-size: 0.85rem;
    font-weight: 700;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    white-space: nowrap;
  }

  .data-table tbody tr {
    border-bottom: 1px solid var(--border-light);
    transition: background-color 0.2s ease-in-out;
  }

  .data-table tbody tr:hover {
    background-color: var(--bg-secondary);
  }

  .data-table tbody tr:last-child {
    border-bottom: none;
  }

  .data-table td {
    padding: 1rem 1.75rem;
    font-size: 0.95rem;
    color: var(--text-primary);
    font-weight: 500;
  }

  .cell-material {
    font-weight: 700;
    color: var(--primary-color);
  }

  .cell-category {
    color: var(--text-secondary);
  }

  .cell-quantity,
  .cell-po-id,
  .cell-cost {
    font-family: 'Plus Jakarta Sans', sans-serif; /* Consistent font */
    font-weight: 600;
    color: var(--primary-color);
  }

  .cell-po-id {
    color: var(--accent-color);
  }

  .cell-date {
    color: var(--text-tertiary);
    font-size: 0.85rem;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem 1rem;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    white-space: nowrap;
    border: none;
  }

  .badge-low-stock {
    background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
    color: #b91c1c;
  }

  .badge-adequate {
    background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
    color: #059669;
  }

  .badge-in {
    background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
    color: #059669;
  }

  .badge-out {
    background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
    color: #b91c1c;
  }

  .badge-transfer {
    background: linear-gradient(135deg, #e0f2fe 0%, #bfdbfe 100%);
    color: #1e40af;
  }

  .badge-pending {
    background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
    color: #92400e;
  }

  .badge-signed {
    background: linear-gradient(135deg, #e0f2fe 0%, #bfdbfe 100%);
    color: #1e40af;
  }

  .badge-delivered {
    background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
    color: #059669;
  }

  .badge-cancelled {
    background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
    color: #b91c1c;
  }

  /* Empty State */
  .empty-state {
    text-align: center;
    padding: 5rem 2rem;
    background: white;
    border-radius: var(--radius-xl);
    border: 1.5px solid var(--border-color);
    box-shadow: var(--shadow-sm);
    color: var(--text-tertiary);
  }

  .empty-state-title {
    font-size: 1.25rem;
    font-weight: 800;
    color: var(--primary-color);
    margin-bottom: 0.75rem;
  }

  /* Charts */
  .charts-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
    margin-bottom: 2rem;
  }

  .charts-grid-2 {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
    gap: 2rem;
    margin-bottom: 2rem;
  }

  .chart-card {
    background-color: var(--bg-card);
    border: 1.5px solid var(--border-color);
    border-radius: var(--radius-xl);
    padding: 1.5rem;
    box-shadow: var(--shadow-sm);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .chart-card:hover {
    border-color: var(--accent-light);
    box-shadow: var(--shadow-2xl);
    transform: translateY(-4px);
  }

  .chart-title {
    font-size: 1.25rem;
    font-weight: 800;
    color: var(--primary-color);
    margin-bottom: 1.5rem;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .reports-container {
      padding: 1rem;
    }

    .page-header {
      flex-direction: column;
      align-items: stretch;
    }

    .page-title {
      font-size: 1.75rem;
    }

    .tabs-header {
      overflow-x: auto;
    }

    .tab-button {
      min-width: 120px;
      padding: 0.75rem 1rem;
      font-size: 0.85rem;
    }

    .filters-container {
      flex-direction: column;
    }

    .filter-input,
    .filter-select {
      width: 100%;
    }

    .data-table th,
    .data-table td {
      padding: 0.75rem 1rem;
      font-size: 0.8rem;
    }

    .charts-grid-2 {
      grid-template-columns: 1fr;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`

const COLORS = ['#f97316', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899']

export default function Reports() {
  const [tab, setTab] = useState('inventory')
  const [dateFilter, setDateFilter] = useState({ start: '', end: '', type: '' })

  const { data: inventoryReport = [] } = useQuery({
    queryKey: ['report-inventory'],
    queryFn: () => axios.get('/api/reports/inventory').then(r => r.data),
    enabled: tab === 'inventory',
  })
  const { data: transactions = [] } = useQuery({
    queryKey: ['report-transactions', dateFilter],
    queryFn: () => axios.get('/api/reports/transactions', { params: { start_date: dateFilter.start, end_date: dateFilter.end, type: dateFilter.type || undefined } }).then(r => r.data),
    enabled: tab === 'transactions',
  })
  const { data: stockMovement = [] } = useQuery({
    queryKey: ['report-stock-movement'],
    queryFn: () => axios.get('/api/reports/stock-movement').then(r => r.data),
    enabled: tab === 'charts',
  })
  const { data: mostUsed = [] } = useQuery({
    queryKey: ['report-most-used'],
    queryFn: () => axios.get('/api/reports/most-used').then(r => r.data),
    enabled: tab === 'charts',
  })
  const { data: projectConsumption = [] } = useQuery({
    queryKey: ['report-project-consumption'],
    queryFn: () => axios.get('/api/reports/project-consumption').then(r => r.data),
    enabled: tab === 'charts',
  })
  const { data: procurementHistory = [] } = useQuery({
    queryKey: ['report-procurement'],
    queryFn: () => axios.get('/api/reports/procurement-history').then(r => r.data),
    enabled: tab === 'procurement',
  })

  const tabs = [
    { id: 'inventory', label: 'Inventory Summary' },
    { id: 'transactions', label: 'Transaction Logs' },
    { id: 'charts', label: 'Charts & Graphs' },
    { id: 'procurement', label: 'Procurement History' },
  ]

  return (
    <>
      <style>{reportsStyles}</style>
      <div className="reports-container">
        <div className="reports-inner">
          {/* Header */}
          <div className="page-header">
            <div>
              <h1 className="page-title">Reports & Analytics</h1>
              <p className="page-subtitle">Comprehensive system reports and insights</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="tabs-container">
            <div className="tabs-header">
              {tabs.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`tab-button ${tab === t.id ? 'active' : ''}`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Inventory Tab */}
          {tab === 'inventory' && (
            <div className="card">
              <div className="card-header">
                <div>
                  <div className="card-title">Inventory Summary Report</div>
                  <div className="card-subtitle">Complete inventory status across all locations</div>
                </div>
              </div>
              <div className="card-body">
                <div className="table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Material</th>
                        <th>Category</th>
                        <th>Unit</th>
                        <th>Warehouse</th>
                        <th>Project Sites</th>
                        <th>Total</th>
                        <th>Reorder Level</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inventoryReport.length === 0 ? (
                        <tr>
                          <td colSpan="8" className="empty-state">
                            <div className="empty-state-title">No inventory data available</div>
                          </td>
                        </tr>
                      ) : (
                        inventoryReport.map(r => (
                          <tr key={r.id}>
                            <td className="cell-material">{r.name}</td>
                            <td className="cell-category">{r.category || '—'}</td>
                            <td>{r.unit}</td>
                            <td className="cell-quantity">{parseFloat(r.warehouse_qty).toLocaleString()}</td>
                            <td className="cell-quantity">{parseFloat(r.project_qty).toLocaleString()}</td>
                            <td className="cell-quantity">{parseFloat(r.total_qty).toLocaleString()}</td>
                            <td className="cell-quantity">{parseFloat(r.reorder_level).toLocaleString()}</td>
                            <td>
                              <span className={`badge ${r.status === 'LOW STOCK' ? 'badge-low-stock' : 'badge-adequate'}`}>
                                {r.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Transactions Tab */}
          {tab === 'transactions' && (
            <div className="card">
              <div className="card-header">
                <div>
                  <div className="card-title">Transaction Logs</div>
                  <div className="card-subtitle">All stock movements and transfers</div>
                </div>
              </div>
              <div className="card-body">
                <div className="filters-container">
                  <input
                    type="date"
                    value={dateFilter.start}
                    onChange={e => setDateFilter(p => ({ ...p, start: e.target.value }))}
                    className="filter-input"
                    placeholder="Start date"
                  />
                  <input
                    type="date"
                    value={dateFilter.end}
                    onChange={e => setDateFilter(p => ({ ...p, end: e.target.value }))}
                    className="filter-input"
                    placeholder="End date"
                  />
                  <select
                    value={dateFilter.type}
                    onChange={e => setDateFilter(p => ({ ...p, type: e.target.value }))}
                    className="filter-select"
                  >
                    <option value="">All Types</option>
                    <option value="IN">Stock In</option>
                    <option value="OUT">Stock Out</option>
                    <option value="TRANSFER">Transfer</option>
                  </select>
                </div>

                <div className="table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Type</th>
                        <th>Material</th>
                        <th>Quantity</th>
                        <th>Unit</th>
                        <th>Location</th>
                        <th>Reference</th>
                        <th>By</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.length === 0 ? (
                        <tr>
                          <td colSpan="8" className="empty-state">
                            <div className="empty-state-title">No transactions found</div>
                          </td>
                        </tr>
                      ) : (
                        transactions.map(t => (
                          <tr key={t.id}>
                            <td>
                              <span className={`badge ${t.type === 'IN' ? 'badge-in' : t.type === 'OUT' ? 'badge-out' : 'badge-transfer'}`}>
                                {t.type}
                              </span>
                            </td>
                            <td className="cell-material">{t.material_name}</td>
                            <td className="cell-quantity">{parseFloat(t.quantity).toLocaleString()}</td>
                            <td>{t.unit}</td>
                            <td>{t.project_name || 'Warehouse'}</td>
                            <td className="cell-date" style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>{t.reference_type}</td>
                            <td>{t.created_by_name || '—'}</td>
                            <td className="cell-date">{format(new Date(t.transaction_date), 'MMM d, yyyy h:mm a')}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Charts Tab */}
          {tab === 'charts' && (
            <div className="charts-grid">
              <div className="chart-card">
                <div className="card-header">
                  <div className="card-title">Stock Movement (Last 30 Days)</div>
                </div>
                <div className="card-body">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={stockMovement}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                      <XAxis dataKey="date" tickFormatter={d => d.slice(5)} tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} />
                      <YAxis tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'var(--bg-card)',
                          border: '1.5px solid var(--border-color)',
                          borderRadius: 'var(--radius-md)',
                          color: 'var(--text-primary)',
                          boxShadow: 'var(--shadow-md)'
                        }}
                        labelStyle={{ color: 'var(--primary-color)', fontWeight: 700 }}
                        itemStyle={{ color: 'var(--text-primary)', fontWeight: 500 }}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="stock_in" name="Stock In" stroke="#10b981" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="stock_out" name="Stock Out" stroke="#f97316" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="transfers" name="Transfers" stroke="#3b82f6" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="charts-grid-2">
                <div className="chart-card">
                  <div className="card-header">
                    <div className="card-title">Top 10 Most Used Materials</div>
                  </div>
                  <div className="card-body">
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={mostUsed} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                        <XAxis type="number" tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} />
                        <YAxis dataKey="name" type="category" width={130} tick={{ fontSize: 10, fill: 'var(--text-tertiary)' }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'var(--bg-card)',
                            border: '1.5px solid var(--border-color)',
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--text-primary)',
                            boxShadow: 'var(--shadow-md)'
                          }}
                          labelStyle={{ color: 'var(--primary-color)', fontWeight: 700 }}
                          itemStyle={{ color: 'var(--text-primary)', fontWeight: 500 }}
                        />
                        <Bar dataKey="total_out" name="Total Used" fill="#f97316" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="chart-card">
                  <div className="card-header">
                    <div className="card-title">Project Consumption</div>
                  </div>
                  <div className="card-body">
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={projectConsumption}
                          dataKey="total_consumed"
                          nameKey="project_name"
                          cx="50%"
                          cy="50%"
                          outerRadius={90}
                          label={({ project_name, percent }) => `${project_name}: ${(percent * 100).toFixed(0)}%`}
                          labelLine={false}
                        >
                          {projectConsumption.map((_, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'var(--bg-card)',
                            border: '1.5px solid var(--border-color)',
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--text-primary)',
                            boxShadow: 'var(--shadow-md)'
                          }}
                          labelStyle={{ color: 'var(--primary-color)', fontWeight: 700 }}
                          itemStyle={{ color: 'var(--text-primary)', fontWeight: 500 }}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Procurement Tab */}
          {tab === 'procurement' && (
            <div className="card">
              <div className="card-header">
                <div>
                  <div className="card-title">Procurement History</div>
                  <div className="card-subtitle">All purchase orders and their status</div>
                </div>
              </div>
              <div className="card-body">
                <div className="table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>PO #</th>
                        <th>Supplier</th>
                        <th>Items</th>
                        <th>Total Cost</th>
                        <th>Status</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {procurementHistory.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="empty-state">
                            <div className="empty-state-title">No procurement records</div>
                          </td>
                        </tr>
                      ) : (
                        procurementHistory.map(p => (
                          <tr key={p.id}>
                            <td className="cell-po-id">PO-{String(p.id).padStart(4, '0')}</td>
                            <td>{p.supplier_name}</td>
                            <td className="cell-quantity">{p.item_count}</td>
                            <td className="cell-cost">
                              ₱{parseFloat(p.total_cost).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                            </td>
                            <td>
                              <span className={`badge ${
                                p.status === 'delivered'
                                  ? 'badge-delivered'
                                  : p.status === 'signed'
                                  ? 'badge-signed'
                                  : p.status === 'pending'
                                  ? 'badge-pending'
                                  : 'badge-cancelled'
                              }`}>
                                {p.status}
                              </span>
                            </td>
                            <td className="cell-date">{format(new Date(p.created_at), 'MMM d, yyyy')}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}