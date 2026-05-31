import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { Plus, Pencil, Trash2, Search, Package, X, AlertCircle, FileText, Tag, Layers, Clipboard } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

/**
 * Enhanced Materials Management Component - Professional Edition
 * 
 * Design Philosophy: Matches Dashboard & Projects - Modern Professional
 * - Modern gradient backgrounds and glassmorphism effects
 * - Refined typography hierarchy and spacing
 * - Enhanced color palette with better contrast
 * - Smooth animations and transitions
 * - Improved visual hierarchy and component consistency
 * - Professional status indicators and badges
 * - Plus Jakarta Sans typography for premium feel
 */

const materialsStyles = `
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
    --warning: #f59e0b;
    --warning-soft: rgba(245, 158, 11, 0.1);
    --danger: #ef4444;
    --danger-soft: rgba(239, 68, 68, 0.1);
    --info: #3b82f6;
    --info-soft: rgba(59, 130, 246, 0.1);
    
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

  .materials-container {
    background: linear-gradient(135deg, var(--bg-main) 0%, #f8fbfc 100%);
    min-height: 100vh;
    padding: 2rem 2.5rem;
    font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
    color: var(--text-main);
    position: relative;
    overflow-x: hidden;
  }

  /* Decorative Background Accents */
  .materials-container::before {
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

  .materials-inner {
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
    border-bottom: 1.5px solid var(--border);
  }

  .page-title {
    font-size: 2.75rem;
    font-weight: 800;
    color: var(--primary);
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

  /* Search Box */
  .search-container {
    background: var(--bg-card);
    border: 1.5px solid var(--border);
    border-radius: var(--radius-xl);
    padding: 1.5rem;
    margin-bottom: 2rem;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: var(--shadow-sm);
  }

  .search-container:hover {
    border-color: var(--accent-light);
    box-shadow: var(--shadow-2xl);
    transform: translateY(-4px);
  }

  .search-wrapper {
    position: relative;
    max-width: 500px;
  }

  .search-icon {
    position: absolute;
    left: 1.25rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-dim);
    pointer-events: none;
    width: 20px;
    height: 20px;
  }

  .search-input {
    width: 100%;
    padding: 0.875rem 1.125rem 0.875rem 3.5rem;
    border: 1.5px solid var(--border);
    border-radius: 12px;
    font-size: 0.95rem;
    color: var(--text-main);
    background: var(--bg-main);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    font-family: inherit;
    font-weight: 500;
  }

  .search-input:focus {
    outline: none;
    border-color: var(--accent);
    background: white;
    box-shadow: 0 0 0 4px var(--accent-soft);
  }

  /* Table Card */
  .table-card {
    background: var(--bg-card);
    border: 1.5px solid var(--border);
    border-radius: var(--radius-xl);
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: var(--shadow-sm);
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

  .data-table td {
    padding: 1rem 1.75rem;
    font-size: 0.95rem;
    color: var(--text-main);
    font-weight: 500;
  }

  .cell-index {
    color: var(--text-dim);
    font-size: 0.85rem;
  }

  .cell-name {
    font-weight: 700;
    color: var(--text-main);
  }

  .cell-number {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-weight: 600;
    color: var(--text-main);
    text-align: right;
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

  .badge-ok {
    background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
    color: #059669;
  }

  .badge-low-stock {
    background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
    color: #b91c1c;
  }

  .btn-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border: 1.5px solid var(--border);
    background: white;
    color: var(--text-muted);
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .btn-icon:hover {
    background: var(--accent);
    color: white;
    border-color: var(--accent);
    transform: translateY(-3px);
    box-shadow: 0 6px 15px rgba(249, 115, 22, 0.25);
  }

  .btn-icon.danger:hover {
    background: var(--danger);
    border-color: var(--danger);
    box-shadow: 0 6px 15px rgba(239, 68, 68, 0.25);
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
    animation: fadeInOverlay 0.3s ease-out;
  }

  @keyframes fadeInOverlay {
    from { opacity: 0; }
    to { opacity: 1; }
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

  .form-input,
  .form-select,
  .form-textarea {
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

  .form-input:focus,
  .form-select:focus,
  .form-textarea:focus {
    outline: none;
    border-color: var(--accent);
    box-shadow: 0 0 0 4px rgba(249, 115, 22, 0.15);
    background-color: var(--bg-card);
  }

  .form-textarea {
    resize: vertical;
    min-height: 110px;
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.25rem;
  }

  .form-error {
    color: var(--danger);
    font-size: 0.8rem;
    font-weight: 600;
    margin-top: 0.4rem;
    display: flex;
    align-items: center;
    gap: 0.375rem;
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

  .btn-danger-full {
    flex: 1;
    padding: 0.875rem 1.5rem;
    background: linear-gradient(135deg, var(--danger) 0%, #dc2626 100%);
    color: white;
    border: none;
    border-radius: var(--radius-md);
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
  }

  .btn-danger-full:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(239, 68, 68, 0.4);
  }

  @media (max-width: 768px) {
    .materials-container { padding: 1.5rem; }
    .page-header { flex-direction: column; align-items: stretch; }
    .page-title { font-size: 2rem; }
    .search-wrapper { max-width: 100%; }
    .data-table th, .data-table td { padding: 0.75rem 1rem; font-size: 0.8rem; }
    .form-row { grid-template-columns: 1fr; }
    .modal-content { max-width: 100%; border-radius: var(--radius-lg); }
    .modal-footer { flex-direction: column; }
  }
`

const MATERIAL_CATEGORIES = [
  'Cement & Concrete',
  'Steel & Metal',
  'Masonry',
  'Aggregates',
  'Wood & Lumber',
  'Fasteners',
  'Waterproofing',
  'Paint & Coatings',
  'Plumbing',
  'Electrical',
  'Others'
]

export default function Materials() {
  const { hasRole } = useAuth()
  const qc = useQueryClient()
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm()

  const { data: materials = [], isLoading } = useQuery({
    queryKey: ['materials'],
    queryFn: () => axios.get('/api/materials').then(r => r.data),
  })

  const saveMaterial = useMutation({
    mutationFn: (data) => modal?.id
      ? axios.put(`/api/materials/${modal.id}`, data)
      : axios.post('/api/materials', data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['materials'] })
      setModal(null)
      reset()
      toast.success(modal?.id ? 'Material updated successfully!' : 'Material created successfully!')
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Error saving material'),
  })

  const deleteMaterial = useMutation({
    mutationFn: (id) => axios.delete(`/api/materials/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['materials'] })
      setDeleteConfirm(null)
      toast.success('Material deleted successfully!')
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Cannot delete material'),
  })

  const openEdit = (mat) => {
    setModal(mat)
    Object.entries(mat).forEach(([k, v]) => setValue(k, v))
  }

  const handleDelete = (id) => {
    setDeleteConfirm(id)
  }

  const confirmDelete = () => {
    if (deleteConfirm) {
      deleteMaterial.mutate(deleteConfirm)
    }
  }

  const filtered = materials.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    (m.category || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <style>{materialsStyles}</style>
      <div className="materials-container">
        <div className="materials-inner">
          <div className="page-header">
            <div>
              <h1 className="page-title">Materials Management</h1>
              <p className="page-subtitle">{materials.length} total materials</p>
            </div>
            {hasRole('Administrator', 'Warehouse Manager') && (
              <button 
                className="btn-primary" 
                onClick={() => {
                  setModal({})
                  reset()
                }}
              >
                <Plus size={20} strokeWidth={2.5} />
                <span>Add Material</span>
              </button>
            )}
          </div>

          <div className="search-container">
            <div className="search-wrapper">
              <Search className="search-icon" strokeWidth={2} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search materials by name or category..."
                className="search-input"
                aria-label="Search materials"
              />
            </div>
          </div>

          <div className="table-card">
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Unit</th>
                    <th className="cell-number">Reorder Level</th>
                    <th className="cell-number">Warehouse Stock</th>
                    <th className="cell-number">Project Stock</th>
                    <th className="cell-status">Status</th>
                    {hasRole('Administrator', 'Warehouse Manager') && <th className="cell-actions">Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={hasRole('Administrator', 'Warehouse Manager') ? 9 : 8}>
                        <div className="loading-container">
                          <div className="spinner"></div>
                        </div>
                      </td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={hasRole('Administrator', 'Warehouse Manager') ? 9 : 8}>
                        <div className="empty-state">
                          <Package className="empty-state-icon" strokeWidth={1.5} />
                          <div className="empty-state-title">No materials found</div>
                          <div className="empty-state-text">Add your first material to get started</div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filtered.map((m, i) => (
                      <tr key={m.id}>
                        <td className="cell-index">{i + 1}</td>
                        <td className="cell-name">{m.name}</td>
                        <td className="cell-category">{m.category || '—'}</td>
                        <td className="cell-unit">{m.unit}</td>
                        <td className="cell-number">{parseFloat(m.reorder_level).toLocaleString()}</td>
                        <td className="cell-number">{parseFloat(m.warehouse_stock || 0).toLocaleString()}</td>
                        <td className="cell-number">{parseFloat(m.project_stock || 0).toLocaleString()}</td>
                        <td className="cell-status">
                          {parseFloat(m.warehouse_stock || 0) <= parseFloat(m.reorder_level)
                            ? <span className="badge badge-low-stock">Low Stock</span>
                            : <span className="badge badge-ok">OK</span>
                          }
                        </td>
                        {hasRole('Administrator', 'Warehouse Manager') && (
                          <td className="cell-actions">
                            <button className="btn-icon" onClick={() => openEdit(m)} title="Edit material">
                              <Pencil strokeWidth={2} />
                            </button>
                            <button className="btn-icon danger" onClick={() => handleDelete(m.id)} title="Delete material">
                              <Trash2 strokeWidth={2} />
                            </button>
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {modal !== null && (
          <div className="modal-overlay" onClick={() => { setModal(null); reset() }}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">
                  <Package size={24} />
                  {modal.id ? 'Edit Material' : 'Add Material'}
                </h2>
                <button className="modal-close" onClick={() => { setModal(null); reset() }} aria-label="Close modal">
                  <X size={22} />
                </button>
              </div>

              <form onSubmit={handleSubmit(d => saveMaterial.mutate(d))}>
                <div className="modal-body">
                  <div className="form-group">
                    <label className="form-label required">
                      <Tag size={16} />
                      Material Name
                    </label>
                    <input 
                      {...register('name', { required: 'Material name is required' })} 
                      className="form-input"
                      placeholder="e.g. Portland Cement"
                    />
                    {errors.name && <div className="form-error"><AlertCircle size={14} />{errors.name.message}</div>}
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label required">
                        <Layers size={16} />
                        Unit
                      </label>
                      <input 
                        {...register('unit', { required: 'Unit is required' })} 
                        className="form-input"
                        placeholder="e.g. bag, pc, kg"
                      />
                      {errors.unit && <div className="form-error"><AlertCircle size={14} />{errors.unit.message}</div>}
                    </div>
                    <div className="form-group">
                      <label className="form-label">
                        <Clipboard size={16} />
                        Reorder Level
                      </label>
                      <input 
                        {...register('reorder_level')} 
                        type="number" 
                        step="0.01" 
                        defaultValue="0" 
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <Layers size={16} />
                      Category
                    </label>
                    <select {...register('category')} className="form-select">
                      <option value="">Select category</option>
                      {MATERIAL_CATEGORIES.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <FileText size={16} />
                      Description
                    </label>
                    <textarea 
                      {...register('description')} 
                      className="form-textarea"
                      placeholder="Optional description..."
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" onClick={() => { setModal(null); reset() }} className="btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" disabled={saveMaterial.isPending} className="btn-primary-full">
                    {saveMaterial.isPending ? 'Saving...' : 'Save Material'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {deleteConfirm !== null && (
          <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">Delete Material</h2>
                <button className="modal-close" onClick={() => setDeleteConfirm(null)} aria-label="Close modal">
                  <X size={24} strokeWidth={2} />
                </button>
              </div>
              <div className="modal-body">
                <p style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: 500, lineHeight: 1.6 }}>
                  Are you sure you want to delete this material? This action cannot be undone.
                </p>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setDeleteConfirm(null)} className="btn-secondary">
                  Cancel
                </button>
                <button type="button" onClick={confirmDelete} disabled={deleteMaterial.isPending} className="btn-danger-full">
                  {deleteMaterial.isPending ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}