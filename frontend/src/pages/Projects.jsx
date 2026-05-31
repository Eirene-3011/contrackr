import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { Plus, Pencil, Trash2, MapPin, Calendar, X, AlertCircle, FolderOpen, Zap, FileText, Activity, Info } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { format } from 'date-fns'

/**
 * Enhanced Projects Component - Professional Edition
 * 
 * Design Philosophy: Matches Dashboard - Modern Professional
 * - Modern gradient backgrounds and glassmorphism effects
 * - Refined typography hierarchy and spacing
 * - Enhanced color palette with better contrast
 * - Smooth animations and transitions
 * - Improved visual hierarchy and component consistency
 * - Professional status indicators and badges
 * - Plus Jakarta Sans typography for premium feel
 */

const projectsStyles = `
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

  .projects-container {
    background: linear-gradient(135deg, var(--bg-main) 0%, #f8fbfc 100%);
    min-height: 100vh;
    padding: 2rem 2.5rem;
    font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
    color: var(--text-main);
    position: relative;
    overflow-x: hidden;
    width: 100%;
  }

  /* Decorative Background Accents */
  .projects-container::before {
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

  .projects-inner {
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

  .btn-primary:active {
    transform: translateY(-2px);
  }

  .btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  /* Loading State */
  .loading-container {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5rem 2rem;
    background-color: white;
    border-radius: var(--radius-xl);
    border: 1.5px solid var(--border);
    box-shadow: var(--shadow-sm);
  }

  .spinner {
    width: 70px;
    height: 70px;
    border: 4px solid var(--border-light);
    border-top: 4px solid var(--accent);
    border-radius: 50%;
    animation: spin 1.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* Projects Grid */
  .projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 2rem;
  }

  @media (max-width: 768px) {
    .projects-grid {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
  }

  /* Project Card */
  .project-card {
    background: white;
    border: 1.5px solid var(--border);
    border-radius: var(--radius-xl);
    padding: 2rem;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: default;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: var(--shadow-sm);
  }

  .project-card::before {
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

  .project-card:hover {
    border-color: var(--accent-light);
    box-shadow: var(--shadow-2xl);
    transform: translateY(-12px);
  }

  .project-card:hover::before {
    opacity: 1;
  }

  .project-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .project-name {
    font-size: 1.2rem;
    font-weight: 800;
    color: var(--text-main);
    flex: 1;
    line-height: 1.4;
  }

  .project-status {
    flex-shrink: 0;
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

  .badge-active {
    background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
    color: #059669;
  }

  .badge-completed {
    background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
    color: #2563eb;
  }

  .badge-on-hold {
    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
    color: #92400e;
  }

  .project-details {
    flex: 1;
    margin-bottom: 1.5rem;
  }

  .project-detail-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.95rem;
    color: var(--text-muted);
    margin-bottom: 1rem;
    font-weight: 500;
  }

  .project-detail-item:last-child {
    margin-bottom: 0;
  }

  .project-detail-item svg {
    flex-shrink: 0;
    color: var(--accent);
    width: 18px;
    height: 18px;
  }

  .project-description {
    font-size: 0.9rem;
    color: var(--text-dim);
    line-height: 1.6;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    margin-top: 1rem;
  }

  .project-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 1.5rem;
    border-top: 1.5px solid var(--border-light);
  }

  .project-meta {
    font-size: 0.85rem;
    color: var(--text-dim);
    font-weight: 600;
  }

  .project-actions {
    display: flex;
    gap: 0.75rem;
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
    border: 1.5px solid var(--border);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    max-height: 90vh;
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
    padding: 1.75rem 2rem;
    border-bottom: 1.5px solid var(--border-light);
    background: white;
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .modal-title {
    font-size: 1.4rem;
    font-weight: 800;
    color: var(--text-main);
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .modal-title svg {
    color: var(--accent);
  }

  .modal-close {
    background: transparent;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    padding: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    transition: all 0.2s;
  }

  .modal-close:hover {
    background: var(--bg-main);
    color: var(--text-main);
  }

  .modal-body {
    padding: 1.75rem 2rem;
    overflow-y: auto;
    flex: 1;
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
    display: flex;
    align-items: center;
    gap: 0.375rem;
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--text-main);
    margin-bottom: 0.625rem;
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
    font-weight: 500;
  }

  .form-input::placeholder,
  .form-select::placeholder,
  .form-textarea::placeholder {
    color: var(--text-dim);
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

  .form-error {
    color: var(--danger);
    font-size: 0.85rem;
    font-weight: 500;
    margin-top: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.375rem;
  }

  .modal-footer {
    display: flex;
    gap: 1rem;
    padding: 1.75rem 2rem;
    border-top: 1.5px solid var(--border-light);
    background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-main) 100%);
    position: sticky;
    bottom: 0;
    z-index: 10;
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
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 15px rgba(249, 115, 22, 0.2);
  }

  .btn-primary-full:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(249, 115, 22, 0.35);
  }

  .btn-primary-full:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  .btn-danger-full {
    flex: 1;
    padding: 0.875rem 1.5rem;
    background: linear-gradient(135deg, var(--danger) 0%, #dc2626 100%);
    color: white;
    border: none;
    border-radius: var(--radius-md);
    font-size: 0.95rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 15px rgba(239, 68, 68, 0.2);
  }

  .btn-danger-full:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(239, 68, 68, 0.35);
  }

  /* Empty State */
  .empty-state {
    text-align: center;
    padding: 5rem 2rem;
    background: white;
    border-radius: var(--radius-xl);
    border: 1.5px solid var(--border);
    box-shadow: var(--shadow-sm);
  }

  .empty-state-icon {
    width: 80px;
    height: 80px;
    margin: 0 auto 1.5rem;
    color: var(--text-dim);
    opacity: 0.5;
  }

  .empty-state-title {
    font-size: 1.25rem;
    font-weight: 800;
    color: var(--text-main);
    margin-bottom: 0.75rem;
  }

  .empty-state-text {
    font-size: 1rem;
    color: var(--text-muted);
    font-weight: 500;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .projects-container {
      padding: 1.5rem;
    }

    .page-header {
      flex-direction: column;
      align-items: stretch;
    }

    .page-title {
      font-size: 2rem;
    }

    .modal-content {
      max-width: 100%;
    }

    .form-row {
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

const statusBadgeMap = {
  active: 'badge-active',
  completed: 'badge-completed',
  on_hold: 'badge-on-hold'
}

export default function Projects() {
  const { hasRole } = useAuth()
  const qc = useQueryClient()
  const [modal, setModal] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm()

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => axios.get('/api/projects').then(r => r.data),
  })

  const saveProject = useMutation({
    mutationFn: (data) => modal?.id ? axios.put(`/api/projects/${modal.id}`, data) : axios.post('/api/projects', data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['projects'] })
      setModal(null)
      reset()
      toast.success('Project saved successfully!')
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Error saving project'),
  })

  const deleteProject = useMutation({
    mutationFn: (id) => axios.delete(`/api/projects/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['projects'] })
      setDeleteConfirm(null)
      toast.success('Project deleted successfully!')
    },
    onError: () => toast.error('Cannot delete project with existing records'),
  })

  const openEdit = (p) => {
    setModal(p)
    Object.entries(p).forEach(([k, v]) => setValue(k, v))
  }

  const handleDelete = (id) => {
    setDeleteConfirm(id)
  }

  const confirmDelete = () => {
    if (deleteConfirm) {
      deleteProject.mutate(deleteConfirm)
    }
  }

  return (
    <>
      <style>{projectsStyles}</style>
      <div className="projects-container">
        <div className="projects-inner">
          {/* Header */}
          <div className="page-header">
            <div>
              <h1 className="page-title">Projects</h1>
              <p className="page-subtitle">{projects.length} total projects</p>
            </div>
            {hasRole('Administrator', 'Project Manager') && (
              <button 
                className="btn-primary" 
                onClick={() => {
                  setModal({})
                  reset()
                }}
              >
                <Plus size={20} strokeWidth={2.5} />
                <span>New Project</span>
              </button>
            )}
          </div>

          {/* Projects List */}
          {isLoading ? (
            <div className="loading-container">
              <div className="spinner"></div>
            </div>
          ) : projects.length === 0 ? (
            <div className="empty-state">
              <FolderOpen className="empty-state-icon" strokeWidth={1.5} />
              <div className="empty-state-title">No projects yet</div>
              <div className="empty-state-text">Create your first project to get started</div>
            </div>
          ) : (
            <div className="projects-grid">
              {projects.map(p => (
                <div key={p.id} className="project-card">
                  <div className="project-header">
                    <h3 className="project-name">{p.name}</h3>
                    <div className="project-status">
                      <span className={`badge ${statusBadgeMap[p.status] || 'badge-active'}`}>
                        {p.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  <div className="project-details">
                    <div className="project-detail-item">
                      <MapPin size={18} strokeWidth={2} />
                      <span>{p.location}</span>
                    </div>
                    
                    {p.start_date && (
                      <div className="project-detail-item">
                        <Calendar size={18} strokeWidth={2} />
                        <span>
                          {format(new Date(p.start_date), 'MMM d, yyyy')} – {p.end_date ? format(new Date(p.end_date), 'MMM d, yyyy') : 'Ongoing'}
                        </span>
                      </div>
                    )}

                    {p.description && (
                      <div className="project-description">{p.description}</div>
                    )}
                  </div>

                  <div className="project-footer">
                    <span className="project-meta">{p.mr_count || 0} material requests</span>
                    {hasRole('Administrator', 'Project Manager') && (
                      <div className="project-actions">
                        <button 
                          className="btn-icon" 
                          onClick={() => openEdit(p)}
                          title="Edit project"
                        >
                          <Pencil strokeWidth={2} />
                        </button>
                        <button 
                          className="btn-icon danger" 
                          onClick={() => handleDelete(p.id)}
                          title="Delete project"
                        >
                          <Trash2 strokeWidth={2} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Edit/Create Modal */}
        {modal !== null && (
          <div className="modal-overlay" onClick={() => { setModal(null); reset() }}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">
                  <Zap size={24} strokeWidth={2.5} />
                  {modal.id ? 'Edit Project' : 'New Project'}
                </h2>
                <button 
                  className="modal-close" 
                  onClick={() => { setModal(null); reset() }}
                  aria-label="Close modal"
                >
                  <X size={24} strokeWidth={2} />
                </button>
              </div>

              <form onSubmit={handleSubmit(d => saveProject.mutate(d))}>
                <div className="modal-body">
                  <div className="form-group">
                    <label className="form-label required">
                      <FileText size={16} />
                      Project Name
                    </label>
                    <input 
                      {...register('name', { required: 'Project name is required' })} 
                      className="form-input"
                      placeholder="Enter project name"
                    />
                    {errors.name && (
                      <span className="form-error">
                        <AlertCircle size={14} />
                        {errors.name.message}
                      </span>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label required">
                      <MapPin size={16} />
                      Location
                    </label>
                    <input 
                      {...register('location', { required: 'Location is required' })} 
                      className="form-input"
                      placeholder="Enter project location"
                    />
                    {errors.location && (
                      <span className="form-error">
                        <AlertCircle size={14} />
                        {errors.location.message}
                      </span>
                    )}
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">
                        <Calendar size={16} />
                        Start Date
                      </label>
                      <input 
                        {...register('start_date')} 
                        type="date" 
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">
                        <Calendar size={16} />
                        End Date
                      </label>
                      <input 
                        {...register('end_date')} 
                        type="date" 
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <Activity size={16} />
                      Status
                    </label>
                    <select {...register('status')} className="form-select">
                      <option value="active">Active</option>
                      <option value="on_hold">On Hold</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <Info size={16} />
                      Description
                    </label>
                    <textarea 
                      {...register('description')} 
                      className="form-textarea"
                      placeholder="Enter project description"
                    />
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
                    disabled={saveProject.isPending} 
                    className="btn-primary-full"
                  >
                    {saveProject.isPending ? 'Saving...' : 'Save Project'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm !== null && (
          <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">
                  <AlertCircle size={24} strokeWidth={2.5} />
                  Delete Project
                </h2>
                <button 
                  className="modal-close" 
                  onClick={() => setDeleteConfirm(null)}
                  aria-label="Close modal"
                >
                  <X size={24} strokeWidth={2} />
                </button>
              </div>

              <div className="modal-body">
                <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '1rem', fontWeight: 500, lineHeight: 1.6 }}>
                  Are you sure you want to delete this project? This action cannot be undone.
                </p>
              </div>

              <div className="modal-footer">
                <button 
                  type="button" 
                  onClick={() => setDeleteConfirm(null)} 
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  onClick={confirmDelete}
                  disabled={deleteProject.isPending}
                  className="btn-danger-full"
                >
                  {deleteProject.isPending ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}