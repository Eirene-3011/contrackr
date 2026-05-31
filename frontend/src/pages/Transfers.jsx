import React, { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useForm, useFieldArray } from 'react-hook-form'
import { Plus, Trash2, Check, X, ArrowRight, AlertCircle, Package, Calendar, FileText, TrendingUp, Clock, CheckCircle, XCircle, Send } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { format } from 'date-fns'

/**
 * Enhanced Material Transfers Component - Professional Edition
 * 
 * Design Philosophy: Modern Professional with Enhanced UX
 * - Consistent with Procurement and Deliveries styling
 * - Gradient accents and refined visual hierarchy
 * - Improved spacing and typography for better readability
 * - Enhanced interactive elements with better feedback
 * - Optimized for both desktop and mobile experiences
 */

const transfersStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

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
    --success-lighter: rgba(16, 185, 129, 0.05);
    --warning: #f59e0b;
    --warning-soft: rgba(245, 158, 11, 0.1);
    --warning-lighter: rgba(245, 158, 11, 0.05);
    --danger: #ef4444;
    --danger-soft: rgba(239, 68, 68, 0.1);
    --danger-lighter: rgba(239, 68, 68, 0.05);
    --info: #3b82f6;
    --info-soft: rgba(59, 130, 246, 0.1);
    --info-lighter: rgba(59, 130, 246, 0.05);
    
    --bg-main: #f0f4f8;
    --bg-secondary: #f8fafc;
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

  html, body {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
  }

  .transfers-container {
    background: linear-gradient(135deg, var(--bg-main) 0%, #f8fbfc 100%);
    min-height: 100vh;
    padding: 2rem 2.5rem;
    font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
    color: var(--text-main);
    position: relative;
    overflow-x: hidden;
    width: 100%;
  }

  .transfers-container::before {
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

  .transfers-inner {
    max-width: 1700px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
    animation: fadeInProc 0.8s cubic-bezier(0.2, 0, 0.2, 1);
  }

  @keyframes fadeInProc {
    from { 
      opacity: 0; 
      transform: translateY(20px); 
    }
    to { 
      opacity: 1; 
      transform: translateY(0); 
    }
  }

  @keyframes slideInProc {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes scaleInProc {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  /* Page Header */
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 2rem;
    margin-bottom: 3rem;
    padding-bottom: 2rem;
    border-bottom: 1.5px solid var(--border);
    animation: slideInProc 0.6s cubic-bezier(0.2, 0, 0.2, 1);
  }

  .header-left {
    flex: 1;
  }

  .page-title {
    font-size: 2.75rem;
    font-weight: 800;
    color: var(--text-main);
    margin-bottom: 0.75rem;
    letter-spacing: -0.02em;
    line-height: 1.2;
    padding-bottom: 4px;
    background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    display: block;
    width: fit-content;
  }

  .page-subtitle {
    font-size: 1rem;
    color: var(--text-muted);
    font-weight: 600;
  }

  .btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1.75rem;
    height: 50px;
    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
    color: white;
    border: none;
    border-radius: 14px;
    font-size: 0.95rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 15px rgba(15, 23, 42, 0.2);
  }

  .btn-primary:hover {
    background: linear-gradient(135deg, var(--accent) 0%, var(--accent-light) 100%);
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(249, 115, 22, 0.35);
  }

  .btn-primary:active {
    transform: translateY(-2px);
  }

  .btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  /* Stats Grid */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1.5rem;
    margin-bottom: 3rem;
  }

  .stat-card {
    background: var(--bg-card);
    border: 1.5px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 1.5rem;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: var(--shadow-sm);
    position: relative;
    overflow: hidden;
    animation: scaleInProc 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .stat-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, var(--accent), var(--accent-light));
  }

  .stat-card::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 100px;
    height: 100px;
    background: radial-gradient(circle, var(--accent-soft) 0%, transparent 70%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .stat-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
    border-color: var(--accent-light);
  }

  .stat-card:hover::after {
    opacity: 1;
  }

  .stat-content {
    position: relative;
    z-index: 1;
  }

  .stat-icon {
    width: 48px;
    height: 48px;
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
    font-size: 1.5rem;
  }

  .stat-icon.success {
    background: var(--success-soft);
    color: var(--success);
  }

  .stat-icon.warning {
    background: var(--warning-soft);
    color: var(--warning);
  }

  .stat-icon.info {
    background: var(--info-soft);
    color: var(--info);
  }

  .stat-icon.danger {
    background: var(--danger-soft);
    color: var(--danger);
  }

  .stat-label {
    font-size: 0.85rem;
    color: var(--text-muted);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 0.5rem;
  }

  .stat-value {
    font-size: 2rem;
    font-weight: 800;
    color: var(--primary);
  }

  /* Table Card */
  .table-card {
    background: var(--bg-card);
    border: 1.5px solid var(--border);
    border-radius: var(--radius-xl);
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: var(--shadow-sm);
    animation: scaleInProc 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .table-card:hover {
    border-color: var(--accent-light);
    box-shadow: var(--shadow-2xl);
    transform: translateY(-4px);
  }

  .table-wrapper {
    overflow-x: auto;
  }

  .data-table {
    width: 100%;
    border-collapse: collapse;
  }

  .data-table thead {
    background: linear-gradient(180deg, var(--bg-main) 0%, var(--bg-card) 100%);
    border-bottom: 1.5px solid var(--border);
  }

  .data-table th {
    padding: 1.25rem 1.75rem;
    text-align: left;
    font-size: 0.85rem;
    font-weight: 700;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    white-space: nowrap;
  }

  .data-table tbody tr {
    border-bottom: 1px solid var(--border-light);
    transition: background-color 0.2s ease-in-out;
  }

  .data-table tbody tr:hover {
    background-color: var(--bg-main);
  }

  .data-table tbody tr:last-child {
    border-bottom: none;
  }

  .data-table td {
    padding: 1rem 1.75rem;
    font-size: 0.95rem;
    color: var(--text-main);
    font-weight: 500;
  }

  .cell-transfer-id {
    font-family: 'IBM Plex Mono', 'Courier New', monospace;
    font-weight: 700;
    color: var(--accent);
    letter-spacing: 0.05em;
  }

  .cell-project {
    font-weight: 700;
    color: var(--text-main);
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

  .badge-pending {
    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
    color: #92400e;
  }

  .badge-approved {
    background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
    color: #059669;
  }

  .badge-completed {
    background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
    color: #1d4ed8;
  }

  .badge-rejected {
    background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
    color: #b91c1c;
  }

  .badge-warehouse {
    background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
    color: #475569;
  }

  .cell-actions {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .btn-icon-sm {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.625rem 1.125rem;
    border: none;
    border-radius: 8px;
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .btn-icon-sm.success {
    background: linear-gradient(135deg, var(--success) 0%, #059669 100%);
    color: white;
    box-shadow: 0 2px 8px rgba(16, 185, 129, 0.2);
  }

  .btn-icon-sm.info {
    background: linear-gradient(135deg, var(--info) 0%, #2563eb 100%);
    color: white;
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.2);
  }

  .btn-icon-sm.danger {
    background: linear-gradient(135deg, var(--danger) 0%, #dc2626 100%);
    color: white;
    box-shadow: 0 2px 8px rgba(239, 68, 68, 0.2);
  }

  .btn-icon-sm.secondary {
    background: var(--bg-secondary);
    color: var(--text-muted);
    border: 1px solid var(--border);
  }

  .btn-icon-sm:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }

  /* Empty State */
  .empty-state {
    text-align: center;
    padding: 5rem 2rem;
    background: linear-gradient(135deg, var(--bg-card) 0%, var(--bg-secondary) 100%);
  }

  .empty-state-icon {
    width: 80px;
    height: 80px;
    margin: 0 auto 1.5rem;
    color: var(--accent-light);
    opacity: 0.8;
  }

  .empty-state-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--text-main);
    margin-bottom: 0.75rem;
  }

  .empty-state-text {
    font-size: 1rem;
    color: var(--text-muted);
  }

  /* Loading State */
  .loading-container {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4rem 2rem;
    background: linear-gradient(135deg, var(--bg-card) 0%, var(--bg-secondary) 100%);
  }

  .spinner {
    width: 56px;
    height: 56px;
    border: 4px solid var(--border);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  /* Modal Overlay */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background-color: rgba(15, 23, 42, 0.6);
    backdrop-filter: blur(4px);
    z-index: 50;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    animation: fadeIn 0.3s ease-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .modal-content {
    background-color: var(--bg-card);
    border-radius: var(--radius-xl);
    width: 100%;
    max-width: 650px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: var(--shadow-xl);
    animation: slideUp 0.3s ease-out;
    border: 1.5px solid var(--border);
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.75rem;
    border-bottom: 1.5px solid var(--border);
    position: sticky;
    top: 0;
    background: linear-gradient(135deg, var(--bg-card) 0%, var(--bg-secondary) 100%);
    z-index: 10;
  }

  .modal-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--text-main);
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .modal-title svg {
    color: var(--accent);
  }

  .modal-close {
    background: none;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    padding: 0.625rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-md);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .modal-close:hover {
    background-color: var(--bg-main);
    color: var(--text-main);
  }

  .modal-body {
    padding: 1.75rem;
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  .form-group:last-child {
    margin-bottom: 0;
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.25rem;
  }

  .form-label {
    display: block;
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--text-main);
    margin-bottom: 0.625rem;
    display: flex;
    align-items: center;
    gap: 0.375rem;
  }

  .form-label svg {
    color: var(--accent);
    width: 16px;
    height: 16px;
  }

  .form-label.required::after {
    content: '*';
    color: var(--danger);
    font-weight: 700;
  }

  .form-input, .form-select, .form-textarea {
    width: 100%;
    padding: 0.875rem 1rem;
    border: 1.5px solid var(--border);
    border-radius: var(--radius-md);
    font-size: 0.95rem;
    color: var(--text-main);
    background-color: var(--bg-card);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    font-family: inherit;
  }

  .form-input:focus, .form-select:focus, .form-textarea:focus {
    outline: none;
    border-color: var(--accent);
    box-shadow: 0 0 0 4px rgba(249, 115, 22, 0.15);
  }

  .item-row {
    display: grid;
    grid-template-columns: 1fr 120px 48px;
    gap: 1rem;
    align-items: flex-start;
    margin-bottom: 1rem;
    padding: 1rem;
    background-color: var(--bg-secondary);
    border-radius: var(--radius-md);
    border: 1px solid var(--border-light);
  }

  .modal-footer {
    display: flex;
    gap: 1rem;
    padding: 1.75rem;
    border-top: 1.5px solid var(--border);
    background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-main) 100%);
    position: sticky;
    bottom: 0;
  }

  .btn-secondary {
    flex: 1;
    padding: 0.875rem 1.5rem;
    background-color: var(--bg-card);
    color: var(--text-main);
    border: 1.5px solid var(--border);
    border-radius: var(--radius-md);
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .btn-secondary:hover {
    background-color: var(--bg-main);
    border-color: var(--text-muted);
    transform: translateY(-2px);
  }

  .btn-primary-full {
    flex: 1;
    padding: 0.875rem 1.5rem;
    background: linear-gradient(135deg, var(--accent) 0%, var(--accent-light) 100%);
    color: white;
    border: none;
    border-radius: var(--radius-md);
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 15px rgba(249, 115, 22, 0.3);
  }

  .btn-primary-full:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(249, 115, 22, 0.4);
  }

  /* Responsive */
  @media (max-width: 768px) {
    .transfers-container {
      padding: 1.5rem 1rem;
    }
    .page-header {
      flex-direction: column;
      align-items: stretch;
      gap: 1.5rem;
    }
    .page-title {
      font-size: 2rem;
    }
    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
    }
    .data-table th, .data-table td {
      padding: 0.875rem 1rem;
      font-size: 0.8rem;
    }
    .item-row {
      grid-template-columns: 1fr;
    }
    .modal-footer {
      flex-direction: column;
    }
  }

  @media (max-width: 480px) {
    .stats-grid {
      grid-template-columns: 1fr;
    }
  }
`;

const Transfers = () => {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { data: transfers = [], isLoading } = useQuery({
    queryKey: ['transfers'],
    queryFn: async () => {
      const res = await axios.get('/api/transfers')
      return res.data
    }
  })

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const res = await axios.get('/api/projects')
      return res.data
    }
  })

  const { data: materials = [] } = useQuery({
    queryKey: ['materials'],
    queryFn: async () => {
      const res = await axios.get('/api/materials')
      return res.data
    }
  })

  const createTransfer = useMutation({
    mutationFn: (data) => axios.post('/api/transfers', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['transfers'])
      toast.success('Transfer request created')
      setIsModalOpen(false)
      reset()
    }
  })

  const approveTransfer = useMutation({
    mutationFn: ({ id, action }) => axios.put(`/api/transfers/${id}/approve`, { action }),
    onSuccess: () => {
      queryClient.invalidateQueries(['transfers'])
      toast.success('Transfer status updated')
    }
  })

  const executeTransfer = useMutation({
    mutationFn: (id) => axios.put(`/api/transfers/${id}/execute`),
    onSuccess: () => {
      queryClient.invalidateQueries(['transfers'])
      queryClient.invalidateQueries(['inventory'])
      toast.success('Transfer executed and inventory updated')
    }
  })

  const { register, control, handleSubmit, reset } = useForm({
    defaultValues: {
      from_project_id: '',
      to_project_id: '',
      notes: '',
      items: [{ material_id: '', quantity: '' }]
    }
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'items' })

  // Calculate statistics
  const stats = useMemo(() => {
    return {
      total: transfers.length,
      pending: transfers.filter(t => t.status === 'pending').length,
      approved: transfers.filter(t => t.status === 'approved').length,
      completed: transfers.filter(t => t.status === 'completed').length
    }
  }, [transfers])

  return (
    <div className="transfers-container">
      <style>{transfersStyles}</style>
      <div className="transfers-inner">
        {/* Header */}
        <div className="page-header">
          <div className="header-left">
            <h1 className="page-title">Material Transfers</h1>
            <p className="page-subtitle">Manage inter-project and warehouse transfers</p>
          </div>
          {(user?.role === 'Administrator' || user?.role === 'Project Manager' || user?.role === 'Site Engineer') && (
            <button className="btn-primary" onClick={() => { setIsModalOpen(true); reset(); }}>
              <Plus size={20} />
              <span>New Transfer</span>
            </button>
          )}
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-icon info">
                <Send size={24} />
              </div>
              <div className="stat-label">Total Requests</div>
              <div className="stat-value">{stats.total}</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-icon warning">
                <Clock size={24} />
              </div>
              <div className="stat-label">Pending Approval</div>
              <div className="stat-value">{stats.pending}</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-icon success">
                <CheckCircle size={24} />
              </div>
              <div className="stat-label">Approved</div>
              <div className="stat-value">{stats.approved}</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-icon info">
                <Package size={24} />
              </div>
              <div className="stat-label">Completed</div>
              <div className="stat-value">{stats.completed}</div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="table-card">
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Status</th>
                  <th>Requested By</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="6">
                      <div className="loading-container">
                        <div className="spinner"></div>
                      </div>
                    </td>
                  </tr>
                ) : transfers.length === 0 ? (
                  <tr>
                    <td colSpan="6">
                      <div className="empty-state">
                        <Send className="empty-state-icon" />
                        <div className="empty-state-title">No transfers recorded</div>
                        <div className="empty-state-text">Create your first transfer request to get started</div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  transfers.map(t => (
                    <tr key={t.id}>
                      <td className="cell-transfer-id">TRF-{String(t.id).padStart(4, '0')}</td>
                      <td>
                        <span className={`badge ${!t.from_project_id ? 'badge-warehouse' : ''}`}>
                          {t.from_project_name || 'Warehouse'}
                        </span>
                      </td>
                      <td className="cell-project">{t.to_project_name}</td>
                      <td>
                        <span className={`badge badge-${t.status}`}>
                          {t.status}
                        </span>
                      </td>
                      <td>{t.requested_by_name}</td>
                      <td className="cell-actions">
                        {t.status === 'pending' && (user?.role === 'Administrator' || user?.role === 'Project Manager') && (
                          <>
                            <button className="btn-icon-sm success" onClick={() => approveTransfer.mutate({ id: t.id, action: 'approve' })}>
                              <Check size={14} /> Approve
                            </button>
                            <button className="btn-icon-sm danger" onClick={() => approveTransfer.mutate({ id: t.id, action: 'reject' })}>
                              <X size={14} /> Reject
                            </button>
                          </>
                        )}
                        {t.status === 'approved' && (user?.role === 'Administrator' || user?.role === 'Warehouse Manager') && (
                          <button className="btn-icon-sm info" onClick={() => executeTransfer.mutate(t.id)}>
                            <ArrowRight size={14} /> Execute Transfer
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">
                  <Send size={24} />
                  Create Transfer Request
                </h2>
                <button className="modal-close" onClick={() => setIsModalOpen(false)}>
                  <X size={22} />
                </button>
              </div>
              <form onSubmit={handleSubmit(data => createTransfer.mutate(data))}>
                <div className="modal-body">
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">
                        <Package size={16} />
                        From Project
                      </label>
                      <select className="form-select" {...register('from_project_id')}>
                        <option value="">Warehouse (Default)</option>
                        {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                      <p className="helper-text">Leave empty to transfer from Warehouse</p>
                    </div>
                    <div className="form-group">
                      <label className="form-label required">
                        <ArrowRight size={16} />
                        To Project
                      </label>
                      <select className="form-select" {...register('to_project_id', { required: true })}>
                        <option value="">Select Destination</option>
                        {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <div className="field-array-header">
                      <label className="field-array-label">
                        <Package size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                        Transfer Items
                      </label>
                      <button type="button" className="add-item-btn" onClick={() => append({ material_id: '', quantity: '' })}>
                        <Plus size={16} /> Add Item
                      </button>
                    </div>
                    {fields.map((field, index) => (
                      <div key={field.id} className="item-row">
                        <select className="form-select" {...register(`items.${index}.material_id`, { required: true })}>
                          <option value="">Select Material</option>
                          {materials.map(m => <option key={m.id} value={m.id}>{m.name} ({m.unit})</option>)}
                        </select>
                        <input type="number" step="0.01" className="form-input" placeholder="Qty" {...register(`items.${index}.quantity`, { required: true })} />
                        <button type="button" className="remove-btn" onClick={() => remove(index)}>
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <FileText size={16} />
                      Notes
                    </label>
                    <textarea className="form-textarea" placeholder="Reason for transfer or additional instructions..." {...register('notes')} />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn-primary-full" disabled={createTransfer.isPending}>
                    {createTransfer.isPending ? 'Submitting...' : 'Submit Request'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Transfers