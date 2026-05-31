import React, { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useForm, useFieldArray } from 'react-hook-form'
import { Plus, Trash2, ChevronDown, ChevronUp, X, Info, ClipboardList, CheckCircle, Clock, Search, Download, Eye, Package, FileText, Calendar, AlertCircle, Truck } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { format, isValid } from 'date-fns'

const mrStyles = `
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

  .mr-container {
    background: linear-gradient(135deg, var(--bg-main) 0%, #f8fbfc 100%);
    min-height: 100vh;
    padding: 2rem 2.5rem;
    font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
    color: var(--text-main);
    position: relative;
    overflow-x: hidden;
    width: 100%;
  }

  .mr-container::before {
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

  .mr-inner {
    max-width: 1700px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
    animation: fadeInMR 0.8s cubic-bezier(0.2, 0, 0.2, 1);
  }

  @keyframes fadeInMR {
    from { 
      opacity: 0; 
      transform: translateY(20px); 
    }
    to { 
      opacity: 1; 
      transform: translateY(0); 
    }
  }

  @keyframes slideInMR {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes scaleInMR {
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
    animation: slideInMR 0.6s cubic-bezier(0.2, 0, 0.2, 1);
  }

  .header-left {
    flex: 1;
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

  /* Toolbar */
  .toolbar {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
    align-items: center;
    flex-wrap: wrap;
    animation: slideInMR 0.7s cubic-bezier(0.2, 0, 0.2, 1);
  }

  .search-box {
    flex: 1;
    min-width: 250px;
    position: relative;
  }

  .search-box input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 2.75rem;
    border: 1.5px solid var(--border);
    border-radius: 12px;
    font-size: 0.95rem;
    font-family: inherit;
    transition: all 0.3s ease;
    background: var(--bg-card);
  }

  .search-box input:focus {
    outline: none;
    border-color: var(--accent);
    box-shadow: 0 0 0 4px var(--accent-soft);
  }

  .search-icon {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-dim);
    pointer-events: none;
  }

  .filter-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.25rem;
    background: var(--bg-card);
    border: 1.5px solid var(--border);
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 600;
    color: var(--text-main);
    font-family: inherit;
  }

  .filter-btn:hover {
    border-color: var(--accent);
    background: var(--accent-soft);
    color: var(--accent);
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
    animation: scaleInMR 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
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

  .stat-change {
    font-size: 0.8rem;
    margin-top: 0.5rem;
    color: var(--text-muted);
  }

  /* Table Card */
  .table-card {
    background: var(--bg-card);
    border: 1.5px solid var(--border);
    border-radius: var(--radius-xl);
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: var(--shadow-sm);
    animation: scaleInMR 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .table-card:hover {
    border-color: var(--accent-light);
    box-shadow: var(--shadow-2xl);
    transform: translateY(-4px);
  }

  .table-header {
    padding: 1.5rem;
    border-bottom: 1.5px solid var(--border);
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: linear-gradient(135deg, var(--bg-main) 0%, var(--bg-secondary) 100%);
  }

  .table-title {
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--text-main);
  }

  .table-actions {
    display: flex;
    gap: 0.75rem;
  }

  .table-action-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: var(--bg-main);
    border: 1.5px solid var(--border);
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.3s ease;
    color: var(--text-muted);
  }

  .table-action-btn:hover {
    background: var(--accent);
    border-color: var(--accent);
    color: white;
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

  .cell-mr-id {
    font-family: 'IBM Plex Mono', 'Courier New', monospace;
    font-weight: 700;
    color: var(--accent);
    letter-spacing: 0.05em;
  }

  .cell-project {
    font-weight: 700;
    color: var(--text-main);
  }

  .cell-date {
    color: var(--text-muted);
    font-size: 0.9rem;
  }

  .badge {
    display: inline-flex;
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

  .badge-rejected {
    background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
    color: #b91c1c;
  }

  .badge-completed {
    background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
    color: #1d4ed8;
  }

  .cell-actions {
    display: flex;
    gap: 0.75rem;
  }

  .btn-icon-sm {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.625rem 1rem;
    font-size: 0.8rem;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 1.5px solid;
    font-weight: 700;
    font-family: inherit;
  }

  .btn-icon-sm.success {
    background: var(--success-soft);
    color: var(--success);
    border-color: var(--success-soft);
  }

  .btn-icon-sm.success:hover {
    background: var(--success);
    color: white;
  }

  .btn-icon-sm.danger {
    background: var(--danger-soft);
    color: var(--danger);
    border-color: var(--danger-soft);
  }

  .btn-icon-sm.danger:hover {
    background: var(--danger);
    color: white;
  }

  .btn-icon-sm.secondary {
    background: var(--bg-main);
    color: var(--accent);
    border-color: var(--border);
  }

  .btn-icon-sm.secondary:hover {
    background: var(--accent);
    color: white;
    border-color: var(--accent);
  }

  .expand-btn {
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--accent);
    transition: all 0.3s ease;
    border-radius: 8px;
    width: 40px;
    height: 40px;
  }

  .expand-btn:hover {
    background: var(--accent-soft);
    transform: scale(1.1);
  }

  .expanded-row {
    background: linear-gradient(135deg, rgba(249, 115, 22, 0.04) 0%, rgba(249, 115, 22, 0.02) 100%);
    border-top: 2px solid var(--accent);
  }

  .expanded-content {
    padding: 2rem;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    animation: slideInMR 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .expanded-section {
    background: var(--bg-main);
    padding: 1.5rem;
    border-radius: var(--radius-md);
    border: 1px solid var(--border-light);
    transition: all 0.3s ease;
  }

  .expanded-section:hover {
    border-color: var(--accent-light);
    background: linear-gradient(135deg, var(--bg-main) 0%, rgba(249, 115, 22, 0.02) 100%);
  }

  .expanded-section-title {
    font-size: 0.95rem;
    font-weight: 700;
    color: var(--text-main);
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .expanded-item {
    font-size: 0.9rem;
    color: var(--text-main);
    margin-bottom: 0.75rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid var(--border-light);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .expanded-item:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }

  /* Modal Overlay */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background-color: rgba(15, 23, 42, 0.6);
    backdrop-filter: blur(4px);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    animation: fadeInMR 0.3s ease-out;
  }

  .modal-content {
    background-color: var(--bg-card);
    border-radius: var(--radius-xl);
    width: 100%;
    max-width: 650px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: var(--shadow-xl);
    animation: slideUpMR 0.3s ease-out;
    border: 1.5px solid var(--border);
  }

  @keyframes slideUpMR {
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
    content: ' *';
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

  .field-array-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.25rem;
    padding-bottom: 1rem;
    border-bottom: 1.5px solid var(--border-light);
  }

  .field-array-label {
    font-size: 1rem;
    font-weight: 700;
    color: var(--text-main);
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .add-item-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: var(--accent-soft);
    color: var(--accent);
    border: 1.5px solid var(--accent);
    border-radius: 10px;
    font-size: 0.85rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .add-item-btn:hover {
    background: var(--accent);
    color: white;
  }

  .field-row {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
    align-items: flex-start;
    animation: slideInMR 0.3s ease-out;
  }

  .remove-btn {
    background: var(--danger-soft);
    color: var(--danger);
    border: none;
    padding: 0.75rem;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .remove-btn:hover {
    background: var(--danger);
    color: white;
  }

  .modal-footer {
    padding: 1.75rem;
    border-top: 1.5px solid var(--border);
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    background: var(--bg-secondary);
    position: sticky;
    bottom: 0;
  }

  .btn-secondary {
    padding: 0.75rem 1.5rem;
    background: var(--bg-card);
    border: 1.5px solid var(--border);
    border-radius: 12px;
    font-size: 0.95rem;
    font-weight: 700;
    color: var(--text-muted);
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .btn-secondary:hover {
    background: var(--bg-main);
    color: var(--text-main);
    border-color: var(--text-dim);
  }

  .btn-primary-full {
    flex: 1;
    max-width: 200px;
    padding: 0.75rem 1.5rem;
    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 0.95rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(15, 23, 42, 0.15);
  }

  .btn-primary-full:hover {
    background: linear-gradient(135deg, var(--accent) 0%, var(--accent-light) 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(249, 115, 22, 0.3);
  }

  .error-message {
    color: var(--danger);
    font-size: 0.75rem;
    font-weight: 600;
    margin-top: 0.375rem;
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  @media (max-width: 768px) {
    .mr-container {
      padding: 1rem;
    }

    .page-header {
      flex-direction: column;
      align-items: flex-start;
      margin-bottom: 2rem;
    }

    .page-title {
      font-size: 2rem;
    }

    .form-row {
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    .modal-content {
      max-width: 100%;
      border-radius: var(--radius-lg);
    }

    .field-row {
      flex-direction: column;
      gap: 0.75rem;
    }

    .field-row select,
    .field-row input {
      width: 100%;
    }

    .modal-header, .modal-body, .modal-footer {
      padding: 1.5rem;
    }

    .btn-secondary, .btn-primary-full {
      width: 100%;
    }
  }
`;

const MaterialRequests = () => {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [modal, setModal] = useState(false)
  const [expandedId, setExpandedId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const { data: mrs = [], isLoading } = useQuery({
    queryKey: ['mrs'],
    queryFn: () => axios.get('/api/mr').then(r => r.data || [])
  })

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: () => axios.get('/api/projects').then(r => r.data || [])
  })

  const { data: materials = [] } = useQuery({
    queryKey: ['materials'],
    queryFn: () => axios.get('/api/materials').then(r => r.data || [])
  })

  const createMr = useMutation({
    mutationFn: (data) => {
      // Backend expects: project_id, date_needed, notes, items
      const payload = {
        project_id: parseInt(data.project_id),
        date_needed: data.date_needed,
        notes: data.notes || '',
        items: (data.items || []).map(item => ({
          material_id: parseInt(item.material_id),
          quantity: parseFloat(item.quantity)
        }))
      }
      return axios.post('/api/mr', payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mrs'] })
      setModal(false)
      mrForm.reset()
      toast.success('Material Request submitted!')
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Error creating MR'),
  })

  const approveMr = useMutation({
    mutationFn: ({ id, action }) => axios.put(`/api/mr/${id}/approve`, { action }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['mrs'] })
      toast.success(`MR ${variables.action === 'approve' ? 'approved' : 'rejected'}`)
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Error updating MR'),
  })

  const mrForm = useForm({
    defaultValues: { project_id: '', date_needed: '', notes: '', items: [{ material_id: '', quantity: 1 }] }
  })
  const { fields, append, remove } = useFieldArray({ control: mrForm.control, name: 'items' })

  const stats = useMemo(() => {
    const safeMrs = Array.isArray(mrs) ? mrs : []
    return {
      total: safeMrs.length,
      pending: safeMrs.filter(m => m?.status === 'pending' || m?.status === 'pending_procurement').length,
      approved: safeMrs.filter(m => m?.status === 'approved' || m?.status === 'fulfilled').length,
      completed: safeMrs.filter(m => m?.status === 'completed').length
    }
  }, [mrs])

  const filteredMrs = useMemo(() => {
    const safeMrs = Array.isArray(mrs) ? mrs : []
    return safeMrs.filter(mr => {
      if (!mr) return false
      const matchesSearch = (mr.project_name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                           String(mr.id || '').includes(searchTerm)
      const matchesStatus = filterStatus === 'all' || mr.status === filterStatus
      return matchesSearch && matchesStatus
    })
  }, [mrs, searchTerm, filterStatus])

  const onSubmit = (data) => {
    createMr.mutate(data)
  }

  const onError = (errors) => {
    console.error('Form Errors:', errors)
    toast.error('Please fill in all required fields correctly.')
  }

  const formatDateSafe = (dateStr) => {
    if (!dateStr) return 'N/A'
    const date = new Date(dateStr)
    return isValid(date) ? format(date, 'MMM d, yyyy') : 'Invalid Date'
  }

  return (
    <div className="mr-container">
      <style>{mrStyles}</style>
      <div className="mr-inner">
        <div className="page-header">
          <div className="header-left">
            <h1 className="page-title">Material Requests</h1>
            <p className="page-subtitle">Request and track materials for your projects</p>
          </div>
          {(user?.role === 'Administrator' || user?.role === 'Site Engineer') && (
            <button className="btn-primary" onClick={() => setModal(true)}>
              <Plus size={20} />
              <span>New Request</span>
            </button>
          )}
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-icon info"><ClipboardList size={24} /></div>
              <div className="stat-label">Total Requests</div>
              <div className="stat-value">{stats.total}</div>
              <div className="stat-change">All time</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-icon warning"><Clock size={24} /></div>
              <div className="stat-label">Pending</div>
              <div className="stat-value">{stats.pending}</div>
              <div className="stat-change">Awaiting approval</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-icon success"><CheckCircle size={24} /></div>
              <div className="stat-label">Approved/Fulfilled</div>
              <div className="stat-value">{stats.approved}</div>
              <div className="stat-change">Ready for procurement</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-icon info"><Info size={24} /></div>
              <div className="stat-label">Completed</div>
              <div className="stat-value">{stats.completed}</div>
              <div className="stat-change">Fully delivered</div>
            </div>
          </div>
        </div>

        <div className="toolbar">
          <div className="search-box">
            <Search className="search-icon" size={18} />
            <input 
              type="text" 
              placeholder="Search by project or MR ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="filter-btn"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="pending_procurement">Pending Procurement</option>
            <option value="fulfilled">Fulfilled</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="table-card">
          <div className="table-header">
            <div className="table-title">Material Requests List</div>
            <div className="table-actions">
              <button className="table-action-btn" title="Download Report"><Download size={18} /></button>
            </div>
          </div>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th></th>
                  <th>MR ID</th>
                  <th>Project</th>
                  <th>Needed Date</th>
                  <th>Items</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan="7" style={{ textAlign: 'center', padding: '3rem' }}>Loading...</td></tr>
                ) : filteredMrs.length === 0 ? (
                  <tr><td colSpan="7" style={{ textAlign: 'center', padding: '3rem' }}>No requests found</td></tr>
                ) : (
                  filteredMrs.map(mr => (
                    <React.Fragment key={mr.id}>
                      <tr>
                        <td>
                          <button 
                            className="expand-btn"
                            onClick={() => setExpandedId(expandedId === mr.id ? null : mr.id)}
                          >
                            {expandedId === mr.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                          </button>
                        </td>
                        <td className="cell-mr-id">MR-{String(mr.id || '').padStart(5, '0')}</td>
                        <td className="cell-project">{mr.project_name || 'N/A'}</td>
                        <td className="cell-date">{formatDateSafe(mr.date_needed)}</td>
                        <td>{(mr.items || []).length} items</td>
                        <td>
                          <span className={`badge badge-${mr.status || 'pending'}`}>
                            {(mr.status || 'pending').replace('_', ' ')}
                          </span>
                        </td>
                        <td className="cell-actions">
                          {mr.status === 'pending' && (user?.role === 'Administrator' || user?.role === 'Project Manager') && (
                            <>
                              <button 
                                className="btn-icon-sm success"
                                onClick={() => approveMr.mutate({ id: mr.id, action: 'approve' })}
                              >
                                Approve
                              </button>
                              <button 
                                className="btn-icon-sm danger"
                                onClick={() => approveMr.mutate({ id: mr.id, action: 'reject' })}
                              >
                                Reject
                              </button>
                            </>
                          )}
                          <button className="table-action-btn" title="View Details"><Eye size={18} /></button>
                        </td>
                      </tr>
                      {expandedId === mr.id && (
                        <tr className="expanded-row">
                          <td colSpan="7">
                            <div className="expanded-content">
                              <div className="expanded-section">
                                <div className="expanded-section-title">
                                  <Package size={18} /> Requested Materials
                                </div>
                                {(mr.items || []).map((item, idx) => (
                                  <div key={idx} className="expanded-item">
                                    <span>{item.material_name || 'Unknown Material'}</span>
                                    <span style={{ fontWeight: 700 }}>{item.quantity || 0} {item.unit || ''}</span>
                                  </div>
                                ))}
                              </div>
                              <div className="expanded-section">
                                <div className="expanded-section-title">
                                  <Info size={18} /> Request Details
                                </div>
                                <div className="expanded-item">
                                  <span>Requested By</span>
                                  <span>{mr.requested_by_name || 'Unknown'}</span>
                                </div>
                                <div className="expanded-item">
                                  <span>Notes</span>
                                  <span>{mr.notes || 'No notes'}</span>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {modal && (
          <div className="modal-overlay" onClick={() => setModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title"><ClipboardList size={24} /> New Material Request</h2>
                <button className="modal-close" onClick={() => setModal(false)}><X size={22} /></button>
              </div>
              <form onSubmit={mrForm.handleSubmit(onSubmit, onError)}>
                <div className="modal-body">
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label required"><Truck size={16} /> Project</label>
                      <select className="form-select" {...mrForm.register('project_id', { required: 'Project is required' })}>
                        <option value="">Select Project</option>
                        {(projects || []).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                      {mrForm.formState.errors.project_id && (
                        <span className="error-message"><AlertCircle size={12} /> {mrForm.formState.errors.project_id.message}</span>
                      )}
                    </div>
                    <div className="form-group">
                      <label className="form-label required"><Calendar size={16} /> Needed Date</label>
                      <input type="date" className="form-input" {...mrForm.register('date_needed', { required: 'Date is required' })} />
                      {mrForm.formState.errors.date_needed && (
                        <span className="error-message"><AlertCircle size={12} /> {mrForm.formState.errors.date_needed.message}</span>
                      )}
                    </div>
                  </div>

                  <div className="form-group">
                    <div className="field-array-header">
                      <label className="field-array-label"><Package size={16} style={{ display: 'inline', marginRight: '0.5rem' }} /> Requested Items</label>
                      <button type="button" className="add-item-btn" onClick={() => append({ material_id: '', quantity: 1 })}>
                        <Plus size={16} /> <span>Add Item</span>
                      </button>
                    </div>
                    {fields.map((field, i) => (
                      <div key={field.id}>
                        <div className="field-row">
                          <div style={{ flex: 2 }}>
                            <select className="form-select" {...mrForm.register(`items.${i}.material_id`, { required: 'Material is required' })}>
                              <option value="">Select Material</option>
                              {(materials || []).map(m => <option key={m.id} value={m.id}>{m.name} ({m.unit})</option>)}
                            </select>
                          </div>
                          <div style={{ flex: 1 }}>
                            <input type="number" step="0.01" className="form-input" placeholder="Qty" {...mrForm.register(`items.${i}.quantity`, { required: 'Qty is required', min: { value: 0.01, message: 'Min 0.01' } })} />
                          </div>
                          {fields.length > 1 && (
                            <button type="button" className="remove-btn" onClick={() => remove(i)}><Trash2 size={18} /></button>
                          )}
                        </div>
                        {(mrForm.formState.errors.items?.[i]?.material_id || mrForm.formState.errors.items?.[i]?.quantity) && (
                          <div className="error-message" style={{ marginBottom: '1rem' }}>
                            <AlertCircle size={12} /> 
                            {mrForm.formState.errors.items[i].material_id?.message || mrForm.formState.errors.items[i].quantity?.message}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="form-group">
                    <label className="form-label"><FileText size={16} /> Notes (Optional)</label>
                    <textarea className="form-textarea" placeholder="Any specific instructions or details..." {...mrForm.register('notes')} />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn-secondary" onClick={() => setModal(false)}>Cancel</button>
                  <button type="submit" className="btn-primary-full" disabled={createMr.isPending}>
                    {createMr.isPending ? 'Submitting...' : 'Submit Request'}
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

export default MaterialRequests