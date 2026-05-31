import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { Plus, Pencil, Trash2, X, Users as UsersIcon, AlertCircle, Mail, Calendar } from 'lucide-react'
import { format } from 'date-fns'

/**
 * Enhanced User Management Component
 * 
 * Design Philosophy: Matches all components - Modern Professional
 * - Modern gradient backgrounds and glassmorphism effects
 * - Refined typography hierarchy and spacing
 * - Enhanced color palette with better contrast
 * - Smooth animations and transitions
 * - Improved visual hierarchy and component consistency
 * - Professional status indicators and badges
 * - Plus Jakarta Sans typography for premium feel
 */

const userManagementStyles = `
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
    --accent-glow: rgba(249, 115, 22, 0.4);
    --accent-soft: rgba(249, 115, 22, 0.08);
    
    --success-color: #10b981;
    --success-soft: rgba(16, 185, 129, 0.1);
    --warning-color: #f59e0b;
    --warning-soft: rgba(245, 158, 11, 0.1);
    --danger-color: #ef4444;
    --danger-soft: rgba(239, 68, 68, 0.1);
    --info-color: #3b82f6;
    --info-soft: rgba(59, 130, 246, 0.1);
    
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

  .user-management-container {
    background: linear-gradient(135deg, var(--bg-main) 0%, #f8fbfc 100%);
    min-height: 100vh;
    padding: 2rem 2.5rem;
    font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
    color: var(--text-primary);
    position: relative;
    overflow-x: hidden;
  }

  /* Decorative Background Accents */
  .user-management-container::before {
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

  .user-management-inner {
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

  .btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1.75rem;
    height: 50px;
    background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-color) 100%);
    color: white;
    border: none;
    border-radius: var(--radius-md);
    font-size: 0.95rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: var(--shadow-md);
  }

  .btn-primary:hover {
    background: linear-gradient(135deg, var(--accent-color) 0%, var(--accent-light) 100%);
    transform: translateY(-4px);
    box-shadow: var(--shadow-2xl);
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
    background-color: var(--bg-card);
    border: 1.5px solid var(--border-color);
    border-radius: var(--radius-xl);
    overflow: hidden;
    box-shadow: var(--shadow-sm);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
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

  .cell-index {
    color: var(--text-tertiary);
    font-weight: 500;
  }

  .cell-name {
    font-weight: 700;
    color: var(--primary-color);
  }

  .cell-email {
    color: var(--text-secondary);
    font-family: 'Plus Jakarta Sans', sans-serif;
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

  .badge-administrator {
    background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
    color: #b91c1c;
  }

  .badge-procurement-officer {
    background: linear-gradient(135deg, #e0f2fe 0%, #bfdbfe 100%);
    color: #1e40af;
  }

  .badge-site-engineer {
    background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
    color: #059669;
  }

  .badge-warehouse-manager {
    background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
    color: #92400e;
  }

  .badge-project-manager {
    background: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%);
    color: #6d28d9;
  }

  .cell-actions {
    display: flex;
    gap: 0.75rem;
  }

  .btn-icon-sm {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border: 1.5px solid var(--border-color);
    background: white;
    color: var(--text-secondary);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .btn-icon-sm:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  }

  .btn-icon-sm.edit:hover {
    background: var(--info-color);
    color: white;
    border-color: var(--info-color);
    box-shadow: 0 6px 15px var(--info-soft);
  }

  .btn-icon-sm.delete:hover {
    background: var(--danger-color);
    color: white;
    border-color: var(--danger-color);
    box-shadow: 0 6px 15px var(--danger-soft);
  }

  .btn-icon-sm svg {
    width: 18px;
    height: 18px;
    stroke-width: 2;
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

  .empty-state-icon {
    width: 80px;
    height: 80px;
    margin: 0 auto 1.5rem;
    color: var(--text-tertiary);
    opacity: 0.5;
  }

  .empty-state-title {
    font-size: 1.25rem;
    font-weight: 800;
    color: var(--primary-color);
    margin-bottom: 0.75rem;
  }

  .empty-state-text {
    font-size: 1rem;
    color: var(--text-secondary);
    font-weight: 500;
  }

  /* Loading State */
  .loading-container {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5rem 2rem;
    background-color: white;
    border-radius: var(--radius-xl);
    border: 1.5px solid var(--border-color);
    box-shadow: var(--shadow-sm);
  }

  .spinner {
    width: 70px;
    height: 70px;
    border: 4px solid var(--border-light);
    border-top: 4px solid var(--accent-color);
    border-radius: 50%;
    animation: spin 1.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* Modal Overlay */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 50;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    animation: fadeInOverlay 0.3s ease-out;
    backdrop-filter: blur(4px);
  }

  @keyframes fadeInOverlay {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .modal-content {
    background: white;
    border-radius: var(--radius-xl);
    width: 100%;
    max-width: 550px;
    box-shadow: var(--shadow-2xl);
    animation: slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    border: 1.5px solid var(--border-color);
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
    padding: 2rem;
    border-bottom: 1.5px solid var(--border-light);
  }

  .modal-title {
    font-size: 1.4rem;
    font-weight: 800;
    color: var(--text-primary);
  }

  .modal-close {
    background: transparent;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    padding: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-md);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .modal-close:hover {
    background-color: var(--bg-secondary);
    color: var(--primary-color);
    transform: rotate(90deg);
  }

  .modal-body {
    padding: 1.5rem 2rem;
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
    color: var(--text-primary);
    margin-bottom: 0.75rem;
  }

  .form-label.required::after {
    content: ' *';
    color: var(--danger-color);
  }

  .form-input,
  .form-select {
    width: 100%;
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

  .form-input:focus,
  .form-select:focus {
    outline: none;
    border-color: var(--accent-color);
    background-color: var(--bg-card);
    box-shadow: 0 0 0 4px var(--accent-soft);
  }

  .form-input::placeholder {
    color: var(--text-tertiary);
  }

  .form-error {
    color: var(--danger-color);
    font-size: 0.85rem;
    margin-top: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .form-error svg {
    width: 16px;
    height: 16px;
  }

  .modal-footer {
    display: flex;
    gap: 1rem;
    padding: 1.5rem 2rem;
    border-top: 1.5px solid var(--border-light);
    background-color: var(--bg-secondary);
    border-radius: 0 0 var(--radius-xl) var(--radius-xl);
  }

  .btn-secondary {
    flex: 1;
    padding: 0.75rem 1.5rem;
    background-color: var(--bg-card);
    color: var(--text-primary);
    border: 1.5px solid var(--border-color);
    border-radius: var(--radius-md);
    font-size: 0.95rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: var(--shadow-sm);
  }

  .btn-secondary:hover {
    background-color: var(--bg-tertiary);
    border-color: var(--text-secondary);
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }

  .btn-primary-full {
    flex: 1;
    padding: 0.75rem 1.5rem;
    background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-color) 100%);
    color: white;
    border: none;
    border-radius: var(--radius-md);
    font-size: 0.95rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: var(--shadow-md);
  }

  .btn-primary-full:hover {
    background: linear-gradient(135deg, var(--accent-color) 0%, var(--accent-light) 100%);
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }

  .btn-primary-full:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: var(--shadow-sm);
  }

  /* Delete Confirmation Modal */
  .confirmation-modal {
    background: white;
    border-radius: var(--radius-xl);
    width: 100%;
    max-width: 450px;
    box-shadow: var(--shadow-2xl);
    animation: slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    border: 1.5px solid var(--border-color);
  }

  .confirmation-content {
    display: flex;
    gap: 1.5rem;
    align-items: flex-start;
    padding: 2rem;
  }

  .confirmation-icon {
    color: var(--warning-color);
    flex-shrink: 0;
    margin-top: 0.25rem;
    width: 32px;
    height: 32px;
  }

  .confirmation-text {
    flex: 1;
  }

  .confirmation-title {
    font-weight: 800;
    font-size: 1.25rem;
    margin-bottom: 0.75rem;
    color: var(--primary-color);
  }

  .confirmation-message {
    font-size: 1rem;
    color: var(--text-secondary);
    line-height: 1.5;
  }

  .confirmation-footer {
    display: flex;
    gap: 1rem;
    padding: 1.5rem 2rem;
    border-top: 1.5px solid var(--border-light);
    background-color: var(--bg-secondary);
    border-radius: 0 0 var(--radius-xl) var(--radius-xl);
  }

  .btn-danger-full {
    flex: 1;
    padding: 0.75rem 1.5rem;
    background: linear-gradient(135deg, var(--danger-color) 0%, #dc2626 100%);
    color: white;
    border: none;
    border-radius: var(--radius-md);
    font-size: 0.95rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: var(--shadow-md);
  }

  .btn-danger-full:hover {
    background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }

  .btn-danger-full:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: var(--shadow-sm);
  }

  /* Responsive */
  @media (max-width: 768px) {
    .user-management-container {
      padding: 1rem;
    }

    .page-header {
      flex-direction: column;
      align-items: stretch;
    }

    .page-title {
      font-size: 1.75rem;
    }

    .data-table th,
    .data-table td {
      padding: 0.75rem 1rem;
      font-size: 0.8rem;
    }

    .modal-content {
      max-width: 100%;
    }

    .cell-actions {
      flex-direction: row; /* Keep actions in a row for small screens */
      justify-content: flex-end;
    }

    .btn-icon-sm {
      width: 36px;
      height: 36px;
    }

    .modal-footer {
      flex-direction: column;
    }

    .btn-secondary, .btn-primary-full, .btn-danger-full {
      width: 100%;
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

const roleColors = {
  'Administrator': 'badge-administrator',
  'Procurement Officer': 'badge-procurement-officer',
  'Site Engineer': 'badge-site-engineer',
  'Warehouse Manager': 'badge-warehouse-manager',
  'Project Manager': 'badge-project-manager'
}

export default function UserManagement() {
  const qc = useQueryClient()
  const [modal, setModal] = useState(null)
  const [deleteModal, setDeleteModal] = useState(null)
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm()

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => axios.get('/api/users').then(r => r.data)
  })
  const { data: roles = [] } = useQuery({
    queryKey: ['roles'],
    queryFn: () => axios.get('/api/users/roles').then(r => r.data)
  })

  const saveUser = useMutation({
    mutationFn: (data) => modal?.id ? axios.put(`/api/users/${modal.id}`, data) : axios.post('/api/users', data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] })
      setModal(null)
      reset()
      toast.success('User saved successfully!')
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Error saving user'),
  })

  const deleteUser = useMutation({
    mutationFn: (id) => axios.delete(`/api/users/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] })
      setDeleteModal(null)
      toast.success('User deleted successfully!')
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Cannot delete user'),
  })

  const handleEditClick = (user) => {
    setModal(user)
    Object.entries(user).forEach(([k, v]) => setValue(k, v))
  }

  const handleDeleteClick = (user) => {
    setDeleteModal(user)
  }

  const handleConfirmDelete = () => {
    if (deleteModal?.id) {
      deleteUser.mutate(deleteModal.id)
    }
  }

  return (
    <>
      <style>{userManagementStyles}</style>
      <div className="user-management-container">
        <div className="user-management-inner">
          {/* Header */}
          <div className="page-header">
            <div>
              <h1 className="page-title">User Management</h1>
              <p className="page-subtitle">{users.length} registered user{users.length !== 1 ? 's' : ''}</p>
            </div>
            <button
              className="btn-primary"
              onClick={() => {
                setModal({})
                reset()
              }}
            >
              <Plus size={18} />
              <span>Add User</span>
            </button>
          </div>

          {/* Table */}
          <div className="table-card">
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Joined</th>
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
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan="6">
                        <div className="empty-state">
                          <UsersIcon className="empty-state-icon" />
                          <div className="empty-state-title">No users yet</div>
                          <div className="empty-state-text">Add your first user to get started</div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    users.map((u, i) => (
                      <tr key={u.id}>
                        <td className="cell-index">{i + 1}</td>
                        <td className="cell-name">{u.name}</td>
                        <td className="cell-email">{u.email}</td>
                        <td>
                          <span className={`badge ${roleColors[u.role_name] || 'badge-gray'}`}>
                            {u.role_name}
                          </span>
                        </td>
                        <td className="cell-date">{format(new Date(u.created_at), 'MMM d, yyyy')}</td>
                        <td className="cell-actions">
                          <button
                            onClick={() => handleEditClick(u)}
                            className="btn-icon-sm edit"
                            title="Edit user"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(u)}
                            className="btn-icon-sm delete"
                            title="Delete user"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Add/Edit User Modal */}
        {modal !== null && (
          <div className="modal-overlay" onClick={() => { setModal(null); reset() }}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">{modal.id ? 'Edit User' : 'Add User'}</h2>
                <button
                  className="modal-close"
                  onClick={() => { setModal(null); reset() }}
                  aria-label="Close modal"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit(d => saveUser.mutate(d))}>
                <div className="modal-body">
                  <div className="form-group">
                    <label className="form-label required">Full Name</label>
                    <input
                      {...register('name', { required: 'Full name is required' })}
                      className="form-input"
                      placeholder="Enter full name"
                    />
                    {errors.name && <div className="form-error"><AlertCircle />{errors.name.message}</div>}
                  </div>

                  <div className="form-group">
                    <label className="form-label required">Email</label>
                    <input
                      {...register('email', { required: 'Email is required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' } })}
                      type="email"
                      className="form-input"
                      placeholder="Enter email address"
                    />
                    {errors.email && <div className="form-error"><AlertCircle />{errors.email.message}</div>}
                  </div>

                  <div className="form-group">
                    <label className="form-label required">
                      {modal.id ? 'New Password (leave blank to keep current)' : 'Password'}
                    </label>
                    <input
                      {...register('password', { required: !modal.id ? 'Password is required' : false })}
                      type="password"
                      className="form-input"
                      placeholder={modal.id ? 'Leave blank to keep current password' : 'Enter password'}
                    />
                    {errors.password && <div className="form-error"><AlertCircle />{errors.password.message}</div>}
                  </div>

                  <div className="form-group">
                    <label className="form-label required">Role</label>
                    <select
                      {...register('role_id', { required: 'Role is required' })}
                      className="form-select"
                    >
                      <option value="">Select role</option>
                      {roles.map(r => (
                        <option key={r.id} value={r.id}>{r.role_name}</option>
                      ))}
                    </select>
                    {errors.role_id && <div className="form-error"><AlertCircle />{errors.role_id.message}</div>}
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    onClick={() => { setModal(null); reset() }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saveUser.isPending}
                    className="btn-primary-full"
                  >
                    {saveUser.isPending ? 'Saving...' : 'Save User'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteModal !== null && (
          <div className="modal-overlay" onClick={() => setDeleteModal(null)}>
            <div className="confirmation-modal" onClick={e => e.stopPropagation()}>
              <div className="confirmation-content">
                <AlertCircle className="confirmation-icon" size={24} />
                <div className="confirmation-text">
                  <div className="confirmation-title">Delete User?</div>
                  <div className="confirmation-message">
                    Are you sure you want to delete <strong>{deleteModal.name}</strong>? This action cannot be undone.
                  </div>
                </div>
              </div>

              <div className="confirmation-footer">
                <button
                  type="button"
                  onClick={() => setDeleteModal(null)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  disabled={deleteUser.isPending}
                  className="btn-danger-full"
                >
                  {deleteUser.isPending ? 'Deleting...' : 'Delete User'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}