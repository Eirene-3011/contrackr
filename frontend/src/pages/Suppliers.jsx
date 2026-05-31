import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { Plus, Pencil, Trash2, Building2, Mail, Phone, MapPin, X, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

/**
 * Enhanced Suppliers Component - Professional Edition
 * 
 * Design Philosophy: Matches Dashboard, Projects & Materials - Modern Professional
 * - Modern gradient backgrounds and glassmorphism effects
 * - Refined typography hierarchy and spacing
 * - Enhanced color palette with better contrast
 * - Smooth animations and transitions
 * - Improved visual hierarchy and component consistency
 * - Plus Jakarta Sans typography for premium feel
 */

const suppliersStyles = `
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

  .suppliers-container {
    background: linear-gradient(135deg, var(--bg-main) 0%, #f8fbfc 100%);
    min-height: 100vh;
    padding: 2rem 2.5rem;
    font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
    color: var(--text-main);
    position: relative;
    overflow-x: hidden;
  }

  /* Decorative Background Accents */
  .suppliers-container::before {
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

  .suppliers-inner {
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
    letter-spacing: -0.06em;
    line-height: 1.2;
    padding-bottom: 0.25rem;
    background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
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

  .data-table tbody tr:last-child {
    border-bottom: none;
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
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .cell-name-icon {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background-color: var(--accent-soft);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--accent);
    flex-shrink: 0;
  }

  .cell-name-icon svg {
    width: 20px;
    height: 20px;
    stroke-width: 2;
  }

  .cell-contact {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--text-muted);
  }

  .cell-contact svg {
    color: var(--accent);
    flex-shrink: 0;
    width: 18px;
    height: 18px;
    stroke-width: 2;
  }

  .cell-address {
    color: var(--text-muted);
    max-width: 250px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .cell-actions {
    display: flex;
    gap: 0.75rem;
    justify-content: flex-end;
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

  .btn-icon svg {
    width: 18px;
    height: 18px;
    stroke-width: 2;
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

  .form-input::placeholder,
  .form-textarea::placeholder {
    color: var(--text-dim);
  }

  .form-input:focus,
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
    .suppliers-container { padding: 1.5rem; }
    .page-header { flex-direction: column; align-items: stretch; }
    .page-title { font-size: 2rem; }
    .data-table th, .data-table td { padding: 0.75rem 1rem; font-size: 0.8rem; }
    .modal-content { max-width: 100%; border-radius: var(--radius-lg); }
    .modal-footer { flex-direction: column; }
  }
`

export default function Suppliers() {
  const { hasRole } = useAuth()
  const qc = useQueryClient()
  const [modal, setModal] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm()

  const { data: suppliers = [], isLoading } = useQuery({
    queryKey: ['suppliers'],
    queryFn: () => axios.get('/api/suppliers').then(r => r.data),
  })

  const saveSupplier = useMutation({
    mutationFn: (data) => modal?.id
      ? axios.put(`/api/suppliers/${modal.id}`, data)
      : axios.post('/api/suppliers', data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['suppliers'] })
      setModal(null)
      reset()
      toast.success(modal?.id ? 'Supplier updated successfully!' : 'Supplier created successfully!')
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Error saving supplier'),
  })

  const deleteSupplier = useMutation({
    mutationFn: (id) => axios.delete(`/api/suppliers/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['suppliers'] })
      setDeleteConfirm(null)
      toast.success('Supplier deleted successfully!')
    },
    onError: () => toast.error('Cannot delete supplier with existing records'),
  })

  const openEdit = (s) => {
    setModal(s)
    Object.entries(s).forEach(([k, v]) => setValue(k, v))
  }

  const handleDelete = (id) => {
    setDeleteConfirm(id)
  }

  const confirmDelete = () => {
    if (deleteConfirm) {
      deleteSupplier.mutate(deleteConfirm)
    }
  }

  return (
    <>
      <style>{suppliersStyles}</style>
      <div className="suppliers-container">
        <div className="suppliers-inner">
          <div className="page-header">
            <div>
              <h1 className="page-title">Suppliers</h1>
              <p className="page-subtitle">{suppliers.length} total suppliers</p>
            </div>
            {hasRole('Administrator', 'Procurement Officer') && (
              <button 
                className="btn-primary" 
                onClick={() => {
                  setModal({})
                  reset()
                }}
              >
                <Plus size={20} strokeWidth={2.5} />
                <span>Add Supplier</span>
              </button>
            )}
          </div>

          <div className="table-card">
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Contact</th>
                    <th>Address</th>
                    {hasRole('Administrator', 'Procurement Officer') && <th className="cell-actions">Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={hasRole('Administrator', 'Procurement Officer') ? 6 : 5}>
                        <div className="loading-container">
                          <div className="spinner"></div>
                        </div>
                      </td>
                    </tr>
                  ) : suppliers.length === 0 ? (
                    <tr>
                      <td colSpan={hasRole('Administrator', 'Procurement Officer') ? 6 : 5}>
                        <div className="empty-state">
                          <Building2 className="empty-state-icon" strokeWidth={1.5} />
                          <div className="empty-state-title">No suppliers found</div>
                          <div className="empty-state-text">Add your first supplier to get started</div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    suppliers.map((s, i) => (
                      <tr key={s.id}>
                        <td className="cell-index">{i + 1}</td>
                        <td className="cell-name">
                          <div className="cell-name-icon">
                            <Building2 />
                          </div>
                          <span>{s.name}</span>
                        </td>
                        <td>
                          {s.email ? (
                            <div className="cell-contact">
                              <Mail />
                              <a href={`mailto:${s.email}`} style={{ color: 'var(--accent)', textDecoration: 'none' }}>
                                {s.email}
                              </a>
                            </div>
                          ) : (
                            <span style={{ color: 'var(--text-dim)' }}>—</span>
                          )}
                        </td>
                        <td>
                          {s.contact_info ? (
                            <div className="cell-contact">
                              <Phone />
                              <a href={`tel:${s.contact_info}`} style={{ color: 'var(--accent)', textDecoration: 'none' }}>
                                {s.contact_info}
                              </a>
                            </div>
                          ) : (
                            <span style={{ color: 'var(--text-dim)' }}>—</span>
                          )}
                        </td>
                        <td className="cell-address" title={s.address || 'No address'}>
                          {s.address || '—'}
                        </td>
                        {hasRole('Administrator', 'Procurement Officer') && (
                          <td className="cell-actions">
                            <button className="btn-icon" onClick={() => openEdit(s)} title="Edit supplier">
                              <Pencil strokeWidth={2} />
                            </button>
                            <button className="btn-icon danger" onClick={() => handleDelete(s.id)} title="Delete supplier">
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
                  <Building2 size={24} />
                  {modal.id ? 'Edit Supplier' : 'Add Supplier'}
                </h2>
                <button className="modal-close" onClick={() => { setModal(null); reset() }} aria-label="Close modal">
                  <X size={22} />
                </button>
              </div>

              <form onSubmit={handleSubmit(d => saveSupplier.mutate(d))}>
                <div className="modal-body">
                  <div className="form-group">
                    <label className="form-label required">
                      <Building2 size={16} />
                      Supplier Name
                    </label>
                    <input 
                      {...register('name', { required: 'Supplier name is required' })} 
                      className="form-input"
                      placeholder="Enter supplier name"
                    />
                    {errors.name && <div className="form-error"><AlertCircle size={14} />{errors.name.message}</div>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <Mail size={16} />
                      Email
                    </label>
                    <input 
                      {...register('email')} 
                      type="email" 
                      className="form-input"
                      placeholder="supplier@example.com"
                    />
                    {errors.email && <div className="form-error"><AlertCircle size={14} />{errors.email.message}</div>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <Phone size={16} />
                      Contact Info
                    </label>
                    <input 
                      {...register('contact_info')} 
                      className="form-input"
                      placeholder="Phone number or contact person"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <MapPin size={16} />
                      Address
                    </label>
                    <textarea 
                      {...register('address')} 
                      className="form-textarea"
                      placeholder="Enter supplier address"
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" onClick={() => { setModal(null); reset() }} className="btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" disabled={saveSupplier.isPending} className="btn-primary-full">
                    {saveSupplier.isPending ? 'Saving...' : 'Save Supplier'}
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
                <h2 className="modal-title">Delete Supplier</h2>
                <button className="modal-close" onClick={() => setDeleteConfirm(null)} aria-label="Close modal">
                  <X size={24} strokeWidth={2} />
                </button>
              </div>
              <div className="modal-body">
                <p style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: 500, lineHeight: 1.6 }}>
                  Are you sure you want to delete this supplier? This action cannot be undone.
                </p>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setDeleteConfirm(null)} className="btn-secondary">
                  Cancel
                </button>
                <button type="button" onClick={confirmDelete} disabled={deleteSupplier.isPending} className="btn-danger-full">
                  {deleteSupplier.isPending ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}