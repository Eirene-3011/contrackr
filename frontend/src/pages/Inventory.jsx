import React, { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { Plus, Minus, AlertTriangle, Search, X, Package, Info, TrendingDown, Warehouse, MapPin, BarChart3, FileText, Calendar } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const inventoryStyles = `
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

  .inventory-container {
    background: linear-gradient(135deg, var(--bg-main) 0%, #f8fbfc 100%);
    min-height: 100vh;
    padding: 2rem 2.5rem;
    font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
    color: var(--text-main);
    position: relative;
    overflow-x: hidden;
    width: 100%;
  }

  .inventory-container::before {
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

  .inventory-inner {
    max-width: 1700px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
    animation: fadeInInv 0.8s cubic-bezier(0.2, 0, 0.2, 1);
  }

  @keyframes fadeInInv {
    from { 
      opacity: 0; 
      transform: translateY(20px); 
    }
    to { 
      opacity: 1; 
      transform: translateY(0); 
    }
  }

  @keyframes slideInInv {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes scaleInInv {
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
    animation: slideInInv 0.6s cubic-bezier(0.2, 0, 0.2, 1);
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

  .header-actions {
    display: flex;
    gap: 1rem;
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
    border-radius: var(--radius-md);
    font-size: 0.95rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: var(--shadow-md);
  }

  .btn-primary:hover {
    background: linear-gradient(135deg, var(--accent) 0%, var(--accent-light) 100%);
    transform: translateY(-4px);
    box-shadow: var(--shadow-2xl);
  }

  .btn-danger {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1.75rem;
    height: 50px;
    background: linear-gradient(135deg, var(--danger) 0%, #dc2626 100%);
    color: white;
    border: none;
    border-radius: var(--radius-md);
    font-size: 0.95rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: var(--shadow-md);
  }

  .btn-danger:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(239, 68, 68, 0.35);
  }

  /* Alert Box */
  .alert-box {
    background: linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(245, 158, 11, 0.04) 100%);
    border: 1.5px solid var(--warning-soft);
    border-left: 4px solid var(--warning);
    border-radius: var(--radius-lg);
    padding: 1.5rem;
    margin-bottom: 2rem;
    display: flex;
    align-items: center;
    gap: 1.25rem;
    animation: slideInInv 0.6s cubic-bezier(0.2, 0, 0.2, 1);
    box-shadow: var(--shadow-sm);
  }

  .alert-icon {
    color: var(--warning);
    flex-shrink: 0;
    width: 24px;
    height: 24px;
  }

  .alert-text {
    font-size: 0.95rem;
    color: #92400e;
    font-weight: 600;
    line-height: 1.5;
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
    animation: scaleInInv 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .stat-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, var(--accent), var(--accent-light));
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  }

  .stat-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
    border-color: var(--accent-light);
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

  /* Filters */
  .filters-container {
    background: var(--bg-card);
    border: 1.5px solid var(--border);
    border-radius: var(--radius-xl);
    padding: 1.5rem;
    margin-bottom: 2rem;
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    align-items: center;
    box-shadow: var(--shadow-sm);
    animation: slideInInv 0.7s cubic-bezier(0.2, 0, 0.2, 1);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .filters-container:hover {
    border-color: var(--accent-light);
    box-shadow: var(--shadow-2xl);
    transform: translateY(-4px);
  }

  .search-wrapper {
    position: relative;
    flex: 1;
    min-width: 250px;
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
    border-radius: var(--radius-md);
    font-size: 0.95rem;
    font-weight: 500;
    color: var(--text-main);
    background: white;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    font-family: 'Plus Jakarta Sans', inherit;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }

  .search-input:focus {
    outline: none;
    border-color: var(--accent);
    background: white;
    box-shadow: 0 0 0 4px var(--accent-soft), 0 4px 12px rgba(249, 115, 22, 0.15);
  }

  .filter-select {
    padding: 0.875rem 1.25rem;
    border: 1.5px solid var(--border);
    border-radius: var(--radius-md);
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--text-main);
    background: white;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    min-width: 200px;
    font-family: 'Plus Jakarta Sans', inherit;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }

  .filter-select:focus {
    outline: none;
    border-color: var(--accent);
    background: white;
    box-shadow: 0 0 0 4px var(--accent-soft), 0 4px 12px rgba(249, 115, 22, 0.15);
  }

  /* Table Card */
  .table-card {
    background: var(--bg-card);
    border: 1.5px solid var(--border);
    border-radius: var(--radius-xl);
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: var(--shadow-sm);
    animation: scaleInInv 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
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

  .cell-material {
    font-weight: 700;
    color: var(--text-main);
  }

  .cell-category {
    color: var(--text-muted);
    font-size: 0.9rem;
  }

  .cell-quantity {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-weight: 700;
    color: var(--text-main);
  }

  .cell-quantity.low-stock {
    color: var(--danger);
    font-weight: 800;
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
    gap: 0.375rem;
  }

  .badge-warehouse {
    background: linear-gradient(135deg, #e0f2fe 0%, #bfdbfe 100%);
    color: #1e40af;
  }

  .badge-project {
    background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
    color: #059669;
  }

  .badge-low-stock {
    background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
    color: #b91c1c;
  }

  .badge-adequate {
    background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
    color: #059669;
  }

  /* Modal Overlay - FIXED SCROLLING */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background-color: rgba(15, 23, 42, 0.6);
    backdrop-filter: blur(4px);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
    animation: fadeInOverlay 0.3s ease-out;
    overflow-y: auto;
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
    margin: auto;
    display: flex;
    flex-direction: column;
    max-height: calc(100vh - 3rem);
    box-shadow: var(--shadow-2xl);
    animation: slideUpInv 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    border: 1.5px solid var(--border);
    position: relative;
    overflow: hidden;
  }

  @keyframes slideUpInv {
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
    background: linear-gradient(135deg, var(--bg-card) 0%, var(--bg-secondary) 100%);
    flex-shrink: 0;
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
    transform: rotate(90deg);
  }

  .modal-body {
    padding: 1.75rem;
    overflow-y: auto;
    flex-grow: 1;
  }

  .form-group {
    margin-bottom: 1.5rem;
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

  .form-input:focus,
  .form-select:focus,
  .form-textarea:focus {
    outline: none;
    border-color: var(--accent);
    box-shadow: 0 0 0 4px rgba(249, 115, 22, 0.15);
  }

  .form-textarea {
    resize: vertical;
    min-height: 110px;
  }

  .form-error {
    color: var(--danger);
    font-size: 0.85rem;
    font-weight: 600;
    margin-top: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .form-error svg {
    width: 16px;
    height: 16px;
  }

  /* Info Banner */
  .info-banner {
    background: linear-gradient(135deg, rgba(249, 115, 22, 0.08) 0%, rgba(249, 115, 22, 0.04) 100%);
    border: 1.5px solid var(--accent-soft);
    border-radius: var(--radius-md);
    padding: 1.25rem;
    margin-bottom: 1.5rem;
    display: flex;
    gap: 1rem;
    color: var(--accent);
    font-size: 0.9rem;
    line-height: 1.6;
    box-shadow: var(--shadow-sm);
  }

  .info-banner-icon {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    margin-top: 2px;
  }

  .modal-footer {
    display: flex;
    gap: 1rem;
    padding: 1.75rem;
    border-top: 1.5px solid var(--border);
    background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-main) 100%);
    flex-shrink: 0;
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

  .btn-primary-full:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
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

  /* Responsive */
  @media (max-width: 1024px) {
    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 768px) {
    .inventory-container {
      padding: 1.5rem;
    }

    .page-header {
      flex-direction: column;
      align-items: stretch;
      gap: 1rem;
    }

    .page-title {
      font-size: 2rem;
    }

    .filters-container {
      flex-direction: column;
    }

    .search-wrapper {
      min-width: 100%;
    }

    .filter-select {
      min-width: 100%;
    }

    .data-table th,
    .data-table td {
      padding: 0.75rem 1rem;
      font-size: 0.8rem;
    }

    .modal-content {
      max-width: 100%;
    }

    .stats-grid {
      grid-template-columns: 1fr;
    }

    .modal-header {
      padding: 1.5rem;
    }

    .modal-body {
      padding: 1.5rem;
    }

    .modal-footer {
      padding: 1.5rem;
      flex-direction: column;
    }

    .btn-secondary, .btn-primary-full {
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
`;

const Inventory = () => {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState('')
  const [locationFilter, setLocationFilter] = useState('all')
  const [isStockOutModalOpen, setIsStockOutModalOpen] = useState(false)

  const { data: inventory = [], isLoading } = useQuery({
    queryKey: ['inventory'],
    queryFn: async () => {
      try {
        const res = await axios.get('/api/inventory')
        return res.data || []
      } catch (error) {
        console.error('Error fetching inventory:', error)
        return []
      }
    }
  })

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      try {
        const res = await axios.get('/api/projects')
        return res.data || []
      } catch (error) {
        console.error('Error fetching projects:', error)
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

  const stockOut = useMutation({
    mutationFn: (data) => axios.post('/api/inventory/out', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] })
      toast.success('Stock-out recorded successfully')
      setIsStockOutModalOpen(false)
      reset()
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Stock-out failed')
    }
  })

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({
    defaultValues: { material_id: '', project_id: '', quantity: '', notes: '' }
  })

  // Filter inventory based on search and location
  const filteredInventory = useMemo(() => {
    return inventory.filter(item => {
      const matchesSearch = item.material_name?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesLocation = locationFilter === 'all' || 
        (locationFilter === 'warehouse' && !item.project_id) || 
        (locationFilter === 'project' && item.project_id)
      return matchesSearch && matchesLocation
    })
  }, [inventory, searchTerm, locationFilter])

  // Calculate statistics
  const lowStockItems = useMemo(() => {
    return inventory.filter(i => !i.project_id && i.quantity <= i.reorder_level)
  }, [inventory])

  const stats = {
    total: inventory.length,
    warehouse: inventory.filter(i => !i.project_id).length,
    project: inventory.filter(i => i.project_id).length,
    lowStock: lowStockItems.length
  }

  return (
    <div className="inventory-container">
      <style>{inventoryStyles}</style>
      <div className="inventory-inner">
        {/* Page Header */}
        <div className="page-header">
          <div className="header-left">
            <h1 className="page-title">Inventory</h1>
            <p className="page-subtitle">Monitor and manage material stock levels across locations</p>
          </div>
          {(user?.role === 'Administrator' || user?.role === 'Warehouse Manager') && (
            <div className="header-actions">
              <button 
                className="btn-danger" 
                onClick={() => { 
                  reset()
                  setIsStockOutModalOpen(true) 
                }}
              >
                <Minus size={20} strokeWidth={2.5} />
                <span>Stock Out</span>
              </button>
            </div>
          )}
        </div>

        {/* Alert Box */}
        {lowStockItems?.length > 0 && (
          <div className="alert-box">
            <AlertTriangle className="alert-icon" size={24} strokeWidth={2} />
            <div className="alert-text">
              <strong>{lowStockItems.length} item{lowStockItems.length !== 1 ? 's' : ''}</strong> {lowStockItems.length === 1 ? 'is' : 'are'} at or below reorder level in the warehouse. Consider placing new orders.
            </div>
          </div>
        )}

        {/* Statistics */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-icon info">
                <Package size={24} />
              </div>
              <div className="stat-label">Total Materials</div>
              <div className="stat-value">{stats.total}</div>
              <div className="stat-change">All locations</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-icon success">
                <Warehouse size={24} />
              </div>
              <div className="stat-label">Warehouse Stock</div>
              <div className="stat-value">{stats.warehouse}</div>
              <div className="stat-change">{stats.total > 0 ? Math.round((stats.warehouse / stats.total) * 100) : 0}% of total</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-icon success">
                <MapPin size={24} />
              </div>
              <div className="stat-label">Project Sites</div>
              <div className="stat-value">{stats.project}</div>
              <div className="stat-change">{stats.total > 0 ? Math.round((stats.project / stats.total) * 100) : 0}% of total</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-icon danger">
                <TrendingDown size={24} />
              </div>
              <div className="stat-label">Low Stock Items</div>
              <div className="stat-value">{stats.lowStock}</div>
              <div className="stat-change">Requires attention</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-container">
          <div className="search-wrapper">
            <Search className="search-icon" size={18} />
            <input 
              type="text" 
              className="search-input" 
              placeholder="Search materials by name or category..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="filter-select"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
          >
            <option value="all">All Locations</option>
            <option value="warehouse">Warehouse Only</option>
            <option value="project">Project Sites Only</option>
          </select>
        </div>

        {/* Table Card */}
        <div className="table-card">
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Material</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Quantity</th>
                  <th>Unit</th>
                  <th>Status</th>
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
                ) : filteredInventory.length === 0 ? (
                  <tr>
                    <td colSpan="6">
                      <div className="empty-state">
                        <Package className="empty-state-icon" strokeWidth={1.5} />
                        <div className="empty-state-title">
                          {searchTerm || locationFilter !== 'all' ? 'No materials found' : 'No Inventory'}
                        </div>
                        <div className="empty-state-text">
                          {searchTerm || locationFilter !== 'all' 
                            ? 'Try adjusting your search or filter criteria' 
                            : 'No inventory items available'}
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredInventory.map((item, idx) => (
                    <tr key={idx}>
                      <td className="cell-material">{item.material_name}</td>
                      <td className="cell-category">{item.category || '—'}</td>
                      <td>
                        {item.project_name ? (
                          <span className="badge badge-project">
                            <MapPin size={12} />
                            {item.project_name}
                          </span>
                        ) : (
                          <span className="badge badge-warehouse">
                            <Warehouse size={12} />
                            Warehouse
                          </span>
                        )}
                      </td>
                      <td className={`cell-quantity ${!item.project_id && item.quantity <= item.reorder_level ? 'low-stock' : ''}`}>
                        {parseFloat(item.quantity).toLocaleString()}
                      </td>
                      <td className="cell-unit">{item.unit}</td>
                      <td>
                        {!item.project_id && item.quantity <= item.reorder_level ? (
                          <span className="badge badge-low-stock">
                            <AlertTriangle size={12} />
                            Low Stock
                          </span>
                        ) : (
                          <span className="badge badge-adequate">
                            <BarChart3 size={12} />
                            Adequate
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stock Out Modal - EXACT MATCH TO RECORD DELIVERY */}
        {isStockOutModalOpen && (
          <div className="modal-overlay" onClick={() => { setIsStockOutModalOpen(false); reset(); }}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">
                  <Minus size={24} />
                  Record Stock Out
                </h2>
                <button 
                  className="modal-close" 
                  onClick={() => { setIsStockOutModalOpen(false); reset(); }}
                  aria-label="Close modal"
                >
                  <X size={22} />
                </button>
              </div>

              <form onSubmit={handleSubmit(data => stockOut.mutate(data))} style={{ display: 'contents' }}>
                <div className="modal-body">
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label required">
                        <Package size={16} />
                        Material
                      </label>
                      <select 
                        className="form-select" 
                        {...register('material_id', { required: 'Material is required' })}
                      >
                        <option value="">Select Material</option>
                        {materials?.map(m => (
                          <option key={m.id} value={m.id}>{m.name} ({m.unit})</option>
                        ))}
                      </select>
                      {errors.material_id && <div className="form-error"><AlertTriangle size={14} />{errors.material_id.message}</div>}
                    </div>

                    <div className="form-group">
                      <label className="form-label required">
                        <MapPin size={16} />
                        Project (Destination)
                      </label>
                      <select 
                        className="form-select" 
                        {...register('project_id', { required: 'Project is required' })}
                      >
                        <option value="">Select Project</option>
                        {projects?.map(p => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                      {errors.project_id && <div className="form-error"><AlertTriangle size={14} />{errors.project_id.message}</div>}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label required">
                      <BarChart3 size={16} />
                      Quantity
                    </label>
                    <input 
                      type="number" 
                      step="0.01" 
                      className="form-input" 
                      placeholder="0.00"
                      {...register('quantity', { required: 'Quantity is required' })} 
                    />
                    {errors.quantity && <div className="form-error"><AlertTriangle size={14} />{errors.quantity.message}</div>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <FileText size={16} />
                      Notes
                    </label>
                    <textarea 
                      className="form-textarea" 
                      placeholder="Optional notes or observations..."
                      {...register('notes')}
                    ></textarea>
                  </div>
                </div>

                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn-secondary" 
                    onClick={() => { setIsStockOutModalOpen(false); reset(); }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn-primary-full" 
                    disabled={stockOut.isPending}
                  >
                    {stockOut.isPending ? 'Processing...' : 'Confirm Stock Out'}
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

export default Inventory
