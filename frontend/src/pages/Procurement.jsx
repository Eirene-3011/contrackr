import React, { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useForm, useFieldArray } from 'react-hook-form'
import { Plus, Trash2, Check, X, ChevronDown, ChevronUp, AlertCircle, Download, Eye, TrendingUp, FileText, Package, Calendar, Truck, CheckCircle, XCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { format } from 'date-fns'

const procurementStyles = `
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

  .procurement-container {
    background: linear-gradient(135deg, var(--bg-main) 0%, #f8fbfc 100%);
    min-height: 100vh;
    padding: 2rem 2.5rem;
    font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
    color: var(--text-main);
    position: relative;
    overflow-x: hidden;
    width: 100%;
  }

  .procurement-container::before {
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

  .procurement-inner {
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

  .stat-change {
    font-size: 0.8rem;
    margin-top: 0.5rem;
    color: var(--text-muted);
  }

  /* Tabs */
  .tabs-container {
    background: var(--bg-card);
    border: 1.5px solid var(--border);
    border-radius: var(--radius-xl);
    margin-bottom: 2rem;
    overflow: hidden;
    box-shadow: var(--shadow-sm);
    animation: scaleInProc 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .tabs-header {
    display: flex;
    border-bottom: 2px solid var(--border);
    background: linear-gradient(135deg, var(--bg-main) 0%, var(--bg-secondary) 100%);
  }

  .tab-button {
    flex: 1;
    padding: 1.25rem 1.75rem;
    background: none;
    border: none;
    font-size: 0.95rem;
    font-weight: 700;
    color: var(--text-muted);
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    font-family: inherit;
  }

  .tab-button:hover {
    color: var(--accent);
  }

  .tab-button.active {
    color: var(--accent);
  }

  .tab-button.active::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--accent), var(--accent-light));
    border-radius: 2px 2px 0 0;
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

  .cell-id {
    font-family: 'IBM Plex Mono', 'Courier New', monospace;
    font-weight: 700;
    color: var(--accent);
    letter-spacing: 0.05em;
  }

  .cell-project {
    font-weight: 700;
    color: var(--text-main);
  }

  .cell-cost {
    font-weight: 700;
    color: var(--success);
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

  .badge-approved, .badge-ready_for_po {
    background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
    color: #059669;
  }

  .badge-rejected {
    background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
    color: #b91c1c;
  }

  .badge-pending-po {
    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
    color: #92400e;
  }

  .badge-signed {
    background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
    color: #1d4ed8;
  }

  .badge-delivered {
    background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
    color: #059669;
  }

  .cell-actions {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
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
    animation: slideInProc 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
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

  .canvass-selected {
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%);
    border: 1.5px solid var(--success) !important;
    padding: 1rem !important;
    border-radius: var(--radius-md) !important;
    margin-bottom: 0.75rem !important;
  }

  .canvass-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background: var(--bg-card);
    border: 1.5px solid var(--border-light);
    border-radius: var(--radius-md);
    margin-bottom: 0.75rem;
    transition: all 0.3s ease;
  }

  .canvass-item:hover {
    border-color: var(--accent-light);
    background: linear-gradient(135deg, var(--bg-card) 0%, rgba(249, 115, 22, 0.02) 100%);
  }

  .canvass-info {
    display: flex;
    flex-direction: column;
  }

  .canvass-supplier {
    font-weight: 700;
    color: var(--text-main);
    margin-bottom: 0.25rem;
  }

  .canvass-details {
    font-size: 0.85rem;
    color: var(--text-muted);
  }

  /* Modal Overlay - EXACT REPLICATION */
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
    animation: fadeInProc 0.3s ease-out;
  }

  .modal-content {
    background-color: var(--bg-card);
    border-radius: var(--radius-xl);
    width: 100%;
    max-width: 650px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: var(--shadow-xl);
    animation: slideUpProc 0.3s ease-out;
    border: 1.5px solid var(--border);
  }

  @keyframes slideUpProc {
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
    background: none;
    -webkit-text-fill-color: initial;
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
    width: auto;
    height: auto;
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
    letter-spacing: normal;
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
    font-weight: 400;
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
    border-bottom: 1.5px solid var(--border);
  }

  .field-array-label {
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--text-main);
  }

  .add-item-btn {
    background: none;
    border: 1.5px solid var(--accent);
    color: var(--accent);
    cursor: pointer;
    font-size: 0.85rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.375rem;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    padding: 0.5rem 1rem;
    border-radius: var(--radius-md);
  }

  .add-item-btn:hover {
    background-color: var(--accent-soft);
    transform: translateY(-2px);
  }

  .field-row {
    display: flex;
    gap: 0.875rem;
    align-items: flex-start;
    margin-bottom: 1rem;
    padding: 1rem;
    background-color: var(--bg-secondary);
    border-radius: var(--radius-md);
    border: 1px solid var(--border-light);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    animation: none;
  }

  .field-row:hover {
    background-color: var(--bg-main);
    border-color: var(--border);
  }

  .field-row select,
  .field-row input {
    padding: 0.875rem 1rem;
    border: 1.5px solid var(--border);
    border-radius: var(--radius-md);
    font-size: 0.9rem;
    color: var(--text-main);
    background-color: var(--bg-card);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .field-row select:focus,
  .field-row input:focus {
    outline: none;
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.15);
  }

  .field-row select {
    flex: 1;
  }

  .field-row input {
    width: 130px;
  }

  .remove-btn {
    background: linear-gradient(135deg, var(--danger) 0%, #dc2626 100%);
    color: white;
    border: none;
    border-radius: var(--radius-md);
    padding: 0.875rem 0.875rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 2px 8px rgba(239, 68, 68, 0.2);
    flex-shrink: 0;
    width: auto;
    height: auto;
  }

  .remove-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
  }

  .remove-btn:active {
    transform: translateY(0);
  }

  .helper-text {
    font-size: 0.85rem;
    color: var(--text-dim);
    margin-top: 0.625rem;
    font-weight: 500;
  }

  .error-text {
    font-size: 0.85rem;
    color: var(--danger);
    margin-top: 0.5rem;
    font-weight: 500;
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
    font-family: inherit;
  }

  .btn-secondary:hover {
    background-color: var(--bg-main);
    border-color: var(--text-muted);
    transform: translateY(-2px);
    color: var(--text-main);
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
    font-family: inherit;
  }

  .btn-primary-full:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(249, 115, 22, 0.4);
  }

  .btn-primary-full:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .procurement-container {
      padding: 1.5rem 1rem;
    }

    .page-header {
      flex-direction: column;
      align-items: stretch;
      gap: 1.5rem;
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

// Safely parse any value to a finite number, returning 0 as fallback.
const toNum = (val) => {
  if (val === null || val === undefined || val === '') return 0
  const n = typeof val === 'number' ? val : parseFloat(String(val).replace(/,/g, ''))
  return isFinite(n) ? n : 0
}

// Format a number as a Philippine Peso string with 2 decimal places.
const formatPeso = (val) =>
  toNum(val).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

// Safely compute a PR's total cost.
// Prefers pr.total_cost if it is a valid positive number,
// otherwise sums estimated_unit_cost * quantity from items.
const getPrTotalCost = (pr) => {
  const fromApi = toNum(pr.total_cost)
  if (fromApi > 0) return fromApi
  if (!Array.isArray(pr.items) || pr.items.length === 0) return 0
  return pr.items.reduce((sum, i) => sum + toNum(i.estimated_unit_cost) * toNum(i.quantity), 0)
}

// Safely compute a PO's total cost.
// Prefers po.total_cost; falls back to summing unit_price * quantity from items.
const getPoTotalCost = (po) => {
  const fromApi = toNum(po.total_cost)
  if (fromApi > 0) return fromApi
  if (!Array.isArray(po.items) || po.items.length === 0) return 0
  return po.items.reduce((sum, i) => sum + toNum(i.unit_price) * toNum(i.quantity), 0)
}

const Procurement = () => {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState('pr')
  const [expandedId, setExpandedId] = useState(null)
  const [isPrModalOpen, setIsPrModalOpen] = useState(false)
  const [isPoModalOpen, setIsPoModalOpen] = useState(false)
  const [isCanvassModalOpen, setIsCanvassModalOpen] = useState(false)
  const [selectedPr, setSelectedPr] = useState(null)
  const [rejectModal, setRejectModal] = useState(null)
  const [rejectReason, setRejectReason] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const { data: prs = [] } = useQuery({
    queryKey: ['prs'],
    queryFn: async () => {
      try {
        const res = await axios.get('/api/procurement/pr')
        return res.data || []
      } catch (error) {
        console.error('Error fetching PRs:', error)
        return []
      }
    }
  })

  const { data: pos = [] } = useQuery({
    queryKey: ['pos'],
    queryFn: async () => {
      try {
        const res = await axios.get('/api/procurement/po')
        return res.data || []
      } catch (error) {
        console.error('Error fetching POs:', error)
        return []
      }
    }
  })

  const { data: materials = [] } = useQuery({
    queryKey: ['materials'],
    queryFn: async () => {
      try {
        const res = await axios.get('/api/materials')
        return res.data || []
      } catch (error) {
        console.error('Error fetching materials:', error)
        return []
      }
    }
  })

  const { data: suppliers = [] } = useQuery({
    queryKey: ['suppliers'],
    queryFn: async () => {
      try {
        const res = await axios.get('/api/suppliers')
        return res.data || []
      } catch (error) {
        console.error('Error fetching suppliers:', error)
        return []
      }
    }
  })

  const { data: pendingMrs = [] } = useQuery({
    queryKey: ['pending-mrs'],
    queryFn: async () => {
      try {
        const res = await axios.get('/api/mr/pending-procurement')
        return res.data || []
      } catch (error) {
        console.error('Error fetching pending MRs:', error)
        return []
      }
    }
  })

  const approvePr = useMutation({
    mutationFn: ({ id, action, reason }) => axios.put(`/api/procurement/pr/${id}/approve`, { action, reason }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['prs'] })
      toast.success(variables.action === 'approve' ? 'PR approved successfully' : 'PR rejected')
      setRejectModal(null)
      setRejectReason('')
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update PR')
  })

  const createPr = useMutation({
    mutationFn: (data) => axios.post('/api/procurement/pr', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prs'] })
      toast.success('PR created successfully')
      setIsPrModalOpen(false)
      prForm.reset()
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to create PR')
  })

  const createPo = useMutation({
    mutationFn: (data) => axios.post('/api/procurement/po', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pos'] })
      toast.success('PO created and signed successfully')
      setIsPoModalOpen(false)
      poForm.reset()
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to create PO')
  })

  const addCanvass = useMutation({
    mutationFn: (data) => axios.post('/api/procurement/canvass', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prs'] })
      toast.success('Canvass entry added')
      setIsCanvassModalOpen(false)
      canvassForm.reset()
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to add canvass')
  })

  const selectSupplier = useMutation({
    mutationFn: (id) => axios.put(`/api/procurement/canvass/${id}/select`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prs'] })
      toast.success('Supplier selected')
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to select supplier')
  })

  const signPo = useMutation({
    mutationFn: (id) => axios.put(`/api/procurement/po/${id}/sign`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pos'] })
      toast.success('PO signed successfully')
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to sign PO')
  })

  const prForm = useForm({ 
    defaultValues: { 
      mr_id: '', 
      notes: '', 
      items: [{ material_id: '', quantity: '', estimated_unit_cost: '' }] 
    } 
  })
  const prFields = useFieldArray({ control: prForm.control, name: 'items' })

  const poForm = useForm({ 
    defaultValues: { 
      pr_id: '', 
      supplier_id: '', 
      expected_delivery_date: '', 
      notes: '', 
      items: [] 
    } 
  })
  const canvassForm = useForm({ 
    defaultValues: { 
      pr_id: '', 
      supplier_id: '', 
      material_id: '', 
      unit_price: '', 
      delivery_days: '', 
      notes: '' 
    } 
  })

  const watchedPrId = poForm.watch('pr_id')
  React.useEffect(() => {
    if (watchedPrId) {
      const pr = prs?.find(p => p.id === parseInt(watchedPrId))
      const selectedCanvass = pr?.canvass?.find(c => c.is_selected)
      if (selectedCanvass) {
        poForm.setValue('supplier_id', String(selectedCanvass.supplier_id))
      }
    }
  }, [watchedPrId, prs, poForm])

  // Calculate statistics
  const stats = {
    totalPr: prs.length,
    pendingPr: prs.filter(p => p.status === 'pending').length,
    approvedPr: prs.filter(p => p.status === 'approved' || p.status === 'ready_for_po').length,
    totalPo: pos.length
  }

  // Filter PRs based on search
  const filteredPrs = useMemo(() => {
    return prs.filter(pr => 
      pr.project_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(pr.id).includes(searchTerm) ||
      pr.notes?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [prs, searchTerm])

  return (
    <div className="procurement-container">
      <style>{procurementStyles}</style>
      <div className="procurement-inner">
        {/* Page Header */}
        <div className="page-header">
          <div className="header-left">
            <h1 className="page-title">Procurement</h1>
            <p className="page-subtitle">Manage purchase requests, canvassing, and purchase orders</p>
          </div>
          {activeTab === 'pr' && (user?.role === 'Administrator' || user?.role === 'Procurement Officer') && (
            <button className="btn-primary" onClick={() => { 
              prForm.reset()
              setIsPrModalOpen(true) 
            }}>
              <Plus size={20} strokeWidth={2.5} />
              <span>New PR</span>
            </button>
          )}
          {activeTab === 'po' && (user?.role === 'Administrator' || user?.role === 'Project Manager' || user?.role === 'Procurement Officer') && (
            <button className="btn-primary" onClick={() => { 
              poForm.reset()
              setIsPoModalOpen(true) 
            }}>
              <Plus size={20} strokeWidth={2.5} />
              <span>New PO</span>
            </button>
          )}
        </div>

        {/* Statistics */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-icon info">
                <FileText size={24} />
              </div>
              <div className="stat-label">Total PRs</div>
              <div className="stat-value">{stats.totalPr}</div>
              <div className="stat-change">All time</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-icon warning">
                <AlertCircle size={24} />
              </div>
              <div className="stat-label">Pending Approval</div>
              <div className="stat-value">{stats.pendingPr}</div>
              <div className="stat-change">{stats.totalPr > 0 ? Math.round((stats.pendingPr / stats.totalPr) * 100) : 0}% of total</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-icon success">
                <Check size={24} />
              </div>
              <div className="stat-label">Approved PRs</div>
              <div className="stat-value">{stats.approvedPr}</div>
              <div className="stat-change">{stats.totalPr > 0 ? Math.round((stats.approvedPr / stats.totalPr) * 100) : 0}% of total</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-icon info">
                <Package size={24} />
              </div>
              <div className="stat-label">Total POs</div>
              <div className="stat-value">{stats.totalPo}</div>
              <div className="stat-change">All time</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs-container">
          <div className="tabs-header">
            <button 
              className={`tab-button ${activeTab === 'pr' ? 'active' : ''}`}
              onClick={() => setActiveTab('pr')}
            >
              Purchase Requests
            </button>
            <button 
              className={`tab-button ${activeTab === 'po' ? 'active' : ''}`}
              onClick={() => setActiveTab('po')}
            >
              Purchase Orders
            </button>
          </div>
        </div>

        {/* Table Card */}
        <div className="table-card">
          <div className="table-header">
            <div className="table-title">
              {activeTab === 'pr' ? 'Purchase Requests' : 'Purchase Orders'}
            </div>
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                placeholder="Search..." 
                className="form-input"
                style={{ width: '250px', padding: '0.5rem 1rem', borderRadius: '10px' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="table-wrapper">
            {activeTab === 'pr' ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th></th>
                    <th>PR ID</th>
                    <th>Project</th>
                    <th>Total Cost</th>
                    <th>Status</th>
                    <th>Created By</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPrs.length === 0 ? (
                    <tr>
                      <td colSpan="7">
                        <div className="empty-state">
                          <FileText className="empty-state-icon" strokeWidth={1.5} />
                          <div className="empty-state-title">No Purchase Requests</div>
                          <div className="empty-state-text">Create your first PR to get started</div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredPrs.map(pr => (
                      <React.Fragment key={pr.id}>
                        <tr>
                          <td>
                            <button 
                              className="expand-btn"
                              onClick={() => setExpandedId(expandedId === pr.id ? null : pr.id)}
                            >
                              {expandedId === pr.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </button>
                          </td>
                          <td className="cell-id">PR-{String(pr.id).padStart(5, '0')}</td>
                          <td className="cell-project">{pr.project_name || 'Manual PR'}</td>
                          <td className="cell-cost">₱{formatPeso(getPrTotalCost(pr))}</td>
                          <td>
                            <span className={`badge badge-${pr.status}`}>
                              {pr.status.replace(/_/g, ' ')}
                            </span>
                          </td>
                          <td>{pr.created_by_name}</td>
                          <td className="cell-actions">
                            {pr.status === 'pending' && (user?.role === 'Administrator' || user?.role === 'Project Manager') && (
                              <>
                                <button 
                                  className="btn-icon-sm success" 
                                  onClick={() => approvePr.mutate({ id: pr.id, action: 'approve' })}
                                >
                                  <Check size={14} /> Approve
                                </button>
                                <button 
                                  className="btn-icon-sm danger" 
                                  onClick={() => { setRejectModal(pr.id); setRejectReason('') }}
                                >
                                  <X size={14} /> Reject
                                </button>
                              </>
                            )}
                            {(pr.status === 'approved' || pr.status === 'ready_for_po') && (user?.role === 'Administrator' || user?.role === 'Procurement Officer') && (
                              <button 
                                className="btn-icon-sm secondary" 
                                onClick={() => { setSelectedPr(pr); setIsCanvassModalOpen(true); }}
                              >
                                <Plus size={14} /> Add Canvass
                              </button>
                            )}
                            {pr.status === 'ready_for_po' && (user?.role === 'Administrator' || user?.role === 'Procurement Officer') && (
                              <button 
                                className="btn-icon-sm success" 
                                onClick={() => { 
                                  poForm.reset({ pr_id: String(pr.id) }); 
                                  setIsPoModalOpen(true); 
                                }}
                              >
                                <Check size={14} /> Create PO
                              </button>
                            )}
                          </td>
                        </tr>
                        {expandedId === pr.id && (
                          <tr className="expanded-row">
                            <td colSpan="7">
                              <div className="expanded-content">
                                <div className="expanded-section">
                                  <div className="expanded-section-title">
                                    <Package size={18} /> Requested Items
                                  </div>
                                  {pr.items?.map((item, idx) => (
                                    <div key={idx} className="expanded-item">
                                      <span>{item.material_name}</span>
                                      <span style={{ fontWeight: 700 }}>{item.quantity} {item.unit}</span>
                                    </div>
                                  ))}
                                </div>
                                <div className="expanded-section">
                                  <div className="expanded-section-title">
                                    <TrendingUp size={18} /> Canvass Entries
                                  </div>
                                  {pr.canvass && pr.canvass.length > 0 ? (
                                    pr.canvass.map((c, idx) => (
                                      <div key={idx} className={`canvass-item ${c.is_selected ? 'canvass-selected' : ''}`}>
                                        <div className="canvass-info">
                                          <div className="canvass-supplier">{c.supplier_name}</div>
                                          <div className="canvass-details">
                                            ₱{formatPeso(c.unit_price)} • {c.delivery_days} days delivery
                                          </div>
                                        </div>
                                        <div>
                                          {c.is_selected ? (
                                            <span className="badge badge-approved">Selected</span>
                                          ) : (
                                            (user?.role === 'Administrator' || user?.role === 'Procurement Officer') && (
                                              <button 
                                                className="btn-icon-sm secondary" 
                                                onClick={() => selectSupplier.mutate(c.id)}
                                              >
                                                Select
                                              </button>
                                            )
                                          )}
                                        </div>
                                      </div>
                                    ))
                                  ) : (
                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No canvass entries</div>
                                  )}
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
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>PO ID</th>
                    <th>Supplier</th>
                    <th>Total Cost</th>
                    <th>Status</th>
                    <th>Created By</th>
                    <th>Signed By</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pos.length === 0 ? (
                    <tr>
                      <td colSpan="7">
                        <div className="empty-state">
                          <Package className="empty-state-icon" strokeWidth={1.5} />
                          <div className="empty-state-title">No Purchase Orders</div>
                          <div className="empty-state-text">Create your first PO to get started</div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    pos.map(po => (
                      <tr key={po.id}>
                        <td className="cell-id">PO-{String(po.id).padStart(5, '0')}</td>
                        <td className="cell-project">{po.supplier_name}</td>
                        <td className="cell-cost">₱{formatPeso(getPoTotalCost(po))}</td>
                        <td>
                          <span className={`badge ${po.status === 'pending' ? 'badge-pending-po' : `badge-${po.status}`}`}>
                            {po.status.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td>{po.created_by_name}</td>
                        <td>{po.signed_by_name || '—'}</td>
                        <td className="cell-actions">
                          {po.status === 'pending' && (user?.role === 'Administrator' || user?.role === 'Project Manager') && (
                            <button 
                              className="btn-icon-sm success" 
                              onClick={() => signPo.mutate(po.id)}
                            >
                              <Check size={14} /> Sign PO
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* PR Modal */}
        {isPrModalOpen && (
          <div className="modal-overlay" onClick={(e) => {
            if (e.target === e.currentTarget) setIsPrModalOpen(false)
          }}>
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title">
                  <Package size={24} />
                  Create Purchase Request
                </h2>
                <button className="modal-close" onClick={() => setIsPrModalOpen(false)}>
                  <X size={22} />
                </button>
              </div>
              <form onSubmit={prForm.handleSubmit(data => createPr.mutate(data))}>
                <div className="modal-body">
                  <div className="form-group">
                    <label className="form-label">
                      <FileText size={16} />
                      Reference MR (Optional)
                    </label>
                    <select className="form-select" {...prForm.register('mr_id')}>
                      <option value="">Manual PR (No MR)</option>
                      {pendingMrs?.map(mr => (
                        <option key={mr.id} value={mr.id}>
                          MR-{String(mr.id).padStart(5, '0')} ({mr.project_name})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <FileText size={16} />
                      Notes (Optional)
                    </label>
                    <textarea
                      className="form-textarea"
                      placeholder="Additional notes or justification for this PR..."
                      {...prForm.register('notes')}
                    ></textarea>
                  </div>

                  <div className="form-group">
                    <div className="field-array-header">
                      <label className="field-array-label">
                        <Package size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                        Requested Items
                      </label>
                      <button
                        type="button"
                        onClick={() => prFields.append({ material_id: '', quantity: '', estimated_unit_cost: '' })}
                        className="add-item-btn"
                      >
                        <Plus size={16} />
                        <span>Add Item</span>
                      </button>
                    </div>
                    <div>
                      {prFields.fields.map((field, index) => (
                        <div key={field.id} className="field-row">
                          <select 
                            className="form-select" 
                            {...prForm.register(`items.${index}.material_id`, { required: 'Material is required' })}
                          >
                            <option value="">Select Material</option>
                            {materials?.map(m => (
                              <option key={m.id} value={m.id}>{m.name}</option>
                            ))}
                          </select>
                          <input 
                            type="number" 
                            step="0.01"
                            className="form-input" 
                            placeholder="Qty" 
                            {...prForm.register(`items.${index}.quantity`, { required: 'Quantity is required' })} 
                          />
                          <input 
                            type="number" 
                            step="0.01"
                            className="form-input" 
                            placeholder="Cost" 
                            {...prForm.register(`items.${index}.estimated_unit_cost`, { required: 'Cost is required' })} 
                          />
                          {prFields.fields.length > 1 && (
                            <button 
                              type="button" 
                              className="remove-btn"
                              onClick={() => prFields.remove(index)}
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn-secondary" onClick={() => setIsPrModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary-full" disabled={createPr.isPending}>
                    {createPr.isPending ? 'Submitting...' : 'Submit PR'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* PO Modal */}
        {isPoModalOpen && (
          <div className="modal-overlay" onClick={(e) => {
            if (e.target === e.currentTarget) setIsPoModalOpen(false)
          }}>
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title">
                  <CheckCircle size={24} />
                  Create & Sign Purchase Order
                </h2>
                <button className="modal-close" onClick={() => setIsPoModalOpen(false)}>
                  <X size={22} />
                </button>
              </div>
              <form onSubmit={poForm.handleSubmit(data => {
                const pr = prs?.find(p => p.id === parseInt(data.pr_id));
                if (!pr || !pr.items) {
                  toast.error('PR details not found');
                  return;
                }
                
                const items = pr.items.map(i => {
                  const selectedCanvass = pr.canvass?.find(c => c.material_id === i.material_id && c.supplier_id === parseInt(data.supplier_id) && c.is_selected);
                  return {
                    material_id: i.material_id,
                    quantity: i.quantity,
                    unit_price: selectedCanvass ? selectedCanvass.unit_price : i.estimated_unit_cost
                  };
                });
                
                createPo.mutate({ ...data, items });
              })}>
                <div className="modal-body">
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label required">
                        <FileText size={16} />
                        Approved PR
                      </label>
                      <select className="form-select" {...poForm.register('pr_id', { required: 'PR is required' })}>
                        <option value="">Select Approved PR</option>
                        {prs?.filter(p => p.status === 'approved' || p.status === 'ready_for_po').map(p => (
                          <option key={p.id} value={p.id}>PR-{String(p.id).padStart(5, '0')}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label required">
                        <Truck size={16} />
                        Supplier
                      </label>
                      <select className="form-select" {...poForm.register('supplier_id', { required: 'Supplier is required' })}>
                        <option value="">Select Supplier</option>
                        {suppliers?.map(s => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label required">
                      <Calendar size={16} />
                      Expected Delivery Date
                    </label>
                    <input 
                      type="date" 
                      className="form-input" 
                      {...poForm.register('expected_delivery_date', { required: 'Date is required' })} 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      <FileText size={16} />
                      Notes (Optional)
                    </label>
                    <textarea
                      className="form-textarea"
                      placeholder="Additional instructions for the supplier..."
                      {...poForm.register('notes')}
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn-secondary" onClick={() => setIsPoModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary-full" disabled={createPo.isPending}>
                    {createPo.isPending ? 'Signing...' : 'Sign & Create PO'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Canvass Modal */}
        {isCanvassModalOpen && (
          <div className="modal-overlay" onClick={(e) => {
            if (e.target === e.currentTarget) setIsCanvassModalOpen(false)
          }}>
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title">
                  <TrendingUp size={24} />
                  Add Canvass Entry
                </h2>
                <button className="modal-close" onClick={() => setIsCanvassModalOpen(false)}>
                  <X size={22} />
                </button>
              </div>
              <form onSubmit={canvassForm.handleSubmit(data => {
                addCanvass.mutate({ ...data, pr_id: selectedPr.id });
              })}>
                <div className="modal-body">
                  <div className="form-group">
                    <label className="form-label required">
                      <Package size={16} />
                      Material
                    </label>
                    <select className="form-select" {...canvassForm.register('material_id', { required: 'Material is required' })}>
                      <option value="">Select Material</option>
                      {selectedPr?.items?.map(i => (
                        <option key={i.material_id} value={i.material_id}>{i.material_name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label required">
                      <Truck size={16} />
                      Supplier
                    </label>
                    <select className="form-select" {...canvassForm.register('supplier_id', { required: 'Supplier is required' })}>
                      <option value="">Select Supplier</option>
                      {suppliers?.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label required">
                        <TrendingUp size={16} />
                        Unit Price
                      </label>
                      <input 
                        type="number" 
                        step="0.01" 
                        className="form-input" 
                        placeholder="0.00"
                        {...canvassForm.register('unit_price', { required: 'Price is required' })} 
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label required">
                        <Calendar size={16} />
                        Delivery Days
                      </label>
                      <input 
                        type="number" 
                        className="form-input" 
                        placeholder="Days"
                        {...canvassForm.register('delivery_days', { required: 'Days is required' })} 
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      <FileText size={16} />
                      Notes (Optional)
                    </label>
                    <textarea
                      className="form-textarea"
                      placeholder="Supplier terms or conditions..."
                      {...canvassForm.register('notes')}
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn-secondary" onClick={() => setIsCanvassModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary-full" disabled={addCanvass.isPending}>
                    {addCanvass.isPending ? 'Adding...' : 'Add Canvass'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Rejection Reason Modal */}
        {rejectModal && (
          <div className="modal-overlay" onClick={(e) => {
            if (e.target === e.currentTarget) { setRejectModal(null); setRejectReason('') }
          }}>
            <div className="modal-content" style={{ maxWidth: '500px' }}>
              <div className="modal-header">
                <h2 className="modal-title">
                  <XCircle size={24} />
                  Reject Purchase Request
                </h2>
                <button className="modal-close" onClick={() => { setRejectModal(null); setRejectReason('') }}>
                  <X size={22} />
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label required">
                    <AlertCircle size={16} />
                    Rejection Reason
                  </label>
                  <textarea
                    className="form-textarea"
                    placeholder="Please provide a reason for rejection..."
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={() => { setRejectModal(null); setRejectReason('') }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn-primary-full"
                  style={{ background: 'linear-gradient(135deg, var(--danger) 0%, #dc2626 100%)', boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)' }}
                  disabled={!rejectReason.trim() || approvePr.isPending}
                  onClick={() => approvePr.mutate({ id: rejectModal, action: 'reject', reason: rejectReason.trim() })}
                >
                  {approvePr.isPending ? 'Rejecting...' : 'Confirm Rejection'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Procurement