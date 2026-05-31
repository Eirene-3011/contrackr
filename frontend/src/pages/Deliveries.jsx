import React, { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useForm, useFieldArray } from 'react-hook-form'
import { Plus, Trash2, Check, X, Truck, AlertCircle, Package, Calendar, FileText, TrendingUp, Clock, CheckCircle, XCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { format } from 'date-fns'

/**
 * Enhanced Deliveries Component - Professional Edition
 * 
 * Design Philosophy: Modern Professional with Enhanced UX
 * - Consistent with Procurement component styling
 * - Gradient accents and refined visual hierarchy
 * - Improved spacing and typography for better readability
 * - Enhanced interactive elements with better feedback
 * - Consistent design language throughout
 * - Optimized for both desktop and mobile experiences
 */

const deliveriesStyles = `
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

  .deliveries-container {
    background: linear-gradient(135deg, var(--bg-main) 0%, #f8fbfc 100%);
    min-height: 100vh;
    padding: 2rem 2.5rem;
    font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
    color: var(--text-main);
    position: relative;
    overflow-x: hidden;
    width: 100%;
  }

  .deliveries-container::before {
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

  .deliveries-inner {
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

  .cell-del-id {
    font-family: 'IBM Plex Mono', 'Courier New', monospace;
    font-weight: 700;
    color: var(--accent);
    letter-spacing: 0.05em;
  }

  .cell-po-id {
    font-family: 'IBM Plex Mono', 'Courier New', monospace;
    font-weight: 700;
    color: var(--accent);
    letter-spacing: 0.05em;
  }

  .cell-supplier {
    font-weight: 700;
    color: var(--text-main);
  }

  .cell-date {
    color: var(--text-muted);
    font-weight: 500;
  }

  .cell-received-by {
    color: var(--text-muted);
    font-weight: 500;
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

  .badge-received {
    background: linear-gradient(135deg, #fed7aa 0%, #fdba74 100%);
    color: #92400e;
  }

  .badge-confirmed {
    background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
    color: #059669;
  }

  .badge-rejected {
    background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
    color: #b91c1c;
  }

  .cell-actions {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .btn-confirm {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.625rem 1.125rem;
    background: linear-gradient(135deg, var(--success) 0%, #059669 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 2px 8px rgba(16, 185, 129, 0.2);
  }

  .btn-confirm:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  }

  .btn-confirm:active {
    transform: translateY(0);
  }

  .confirmed-text {
    font-size: 0.8rem;
    color: var(--text-dim);
    font-weight: 500;
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

  .btn-secondary:active {
    transform: translateY(0);
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

  .btn-primary-full:active {
    transform: translateY(0);
  }

  .btn-primary-full:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  .confirm-message {
    display: flex;
    gap: 1rem;
    align-items: flex-start;
    padding: 1.25rem;
    background: var(--info-soft);
    border-radius: var(--radius-md);
    border: 1px solid var(--info-lighter);
    margin-bottom: 1rem;
  }

  .confirm-message svg {
    color: var(--info);
    flex-shrink: 0;
    margin-top: 0.25rem;
  }

  .confirm-message-content p {
    margin: 0;
    line-height: 1.6;
  }

  .confirm-message-content p:first-child {
    font-weight: 600;
    color: var(--text-main);
    margin-bottom: 0.5rem;
  }

  .confirm-message-content p:last-child {
    font-size: 0.95rem;
    color: var(--text-muted);
  }

  /* Responsive */
  @media (max-width: 768px) {
    .deliveries-container {
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

    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }

    .stat-card {
      padding: 1.25rem;
    }

    .stat-icon {
      width: 40px;
      height: 40px;
      margin-bottom: 0.75rem;
    }

    .stat-value {
      font-size: 1.5rem;
    }

    .data-table th,
    .data-table td {
      padding: 0.875rem 1rem;
      font-size: 0.8rem;
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

    .cell-actions {
      flex-direction: column;
      gap: 0.5rem;
    }

    .btn-confirm {
      width: 100%;
      justify-content: center;
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

    .btn-secondary,
    .btn-primary-full {
      width: 100%;
    }
  }

  @media (max-width: 480px) {
    .deliveries-container {
      padding: 1rem 0.75rem;
    }

    .page-title {
      font-size: 1.5rem;
    }

    .stats-grid {
      grid-template-columns: 1fr;
    }

    .data-table th,
    .data-table td {
      padding: 0.75rem 0.5rem;
      font-size: 0.75rem;
    }

    .cell-del-id,
    .cell-po-id {
      font-size: 0.75rem;
    }

    .btn-primary {
      width: 100%;
      justify-content: center;
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
  pending: 'badge-pending',
  received: 'badge-received',
  confirmed: 'badge-confirmed',
  rejected: 'badge-rejected'
}

export default function Deliveries() {
  const { hasRole } = useAuth()
  const qc = useQueryClient()
  const [modal, setModal] = useState(false)
  const [confirmModal, setConfirmModal] = useState(null)
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm({
    defaultValues: { items: [{ material_id: '', quantity_ordered: 1, quantity_received: 0 }] }
  })
  const { fields, append, remove } = useFieldArray({ control, name: 'items' })

  const { data: deliveries = [], isLoading } = useQuery({
    queryKey: ['deliveries'],
    queryFn: () => axios.get('/api/deliveries').then(r => r.data)
  })
  const { data: pos = [] } = useQuery({
    queryKey: ['pos'],
    queryFn: () => axios.get('/api/procurement/po').then(r => r.data)
  })
  const { data: materials = [] } = useQuery({
    queryKey: ['materials'],
    queryFn: () => axios.get('/api/materials').then(r => r.data)
  })

  const createDelivery = useMutation({
    mutationFn: (data) => axios.post('/api/deliveries', data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['deliveries'] })
      setModal(false)
      reset()
      toast.success('Delivery recorded successfully!')
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Error recording delivery'),
  })

  const confirmDelivery = useMutation({
    mutationFn: (id) => axios.put(`/api/deliveries/${id}/confirm`, {}),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['deliveries'] })
      qc.invalidateQueries({ queryKey: ['inventory'] })
      setConfirmModal(null)
      toast.success('Delivery confirmed! Inventory updated.')
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Error confirming delivery'),
  })

  const handleConfirmClick = (id) => {
    setConfirmModal(id)
  }

  const handleConfirmDelivery = () => {
    if (confirmModal) {
      confirmDelivery.mutate(confirmModal)
    }
  }

  // Calculate delivery statistics
  const stats = useMemo(() => {
    if (!deliveries || deliveries.length === 0) {
      return { total: 0, pending: 0, confirmed: 0, rejected: 0 }
    }
    
    return {
      total: deliveries.length,
      pending: deliveries.filter(d => d.status === 'pending').length,
      confirmed: deliveries.filter(d => d.status === 'confirmed').length,
      rejected: deliveries.filter(d => d.status === 'rejected').length
    }
  }, [deliveries])

  return (
    <>
      <style>{deliveriesStyles}</style>
      <div className="deliveries-container">
        <div className="deliveries-inner">
          {/* Header */}
          <div className="page-header">
            <div className="header-left">
              <h1 className="page-title">Deliveries</h1>
              <p className="page-subtitle">Track and confirm material deliveries</p>
            </div>
            {hasRole('Administrator', 'Warehouse Manager') && (
              <button 
                className="btn-primary" 
                onClick={() => {
                  setModal(true)
                  reset()
                }}
              >
                <Plus size={20} />
                <span>Record Delivery</span>
              </button>
            )}
          </div>

          {/* Stats Panels */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-content">
                <div className="stat-icon info">
                  <Truck size={24} />
                </div>
                <div className="stat-label">Total Deliveries</div>
                <div className="stat-value">{stats.total}</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-content">
                <div className="stat-icon warning">
                  <Clock size={24} />
                </div>
                <div className="stat-label">Pending</div>
                <div className="stat-value">{stats.pending}</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-content">
                <div className="stat-icon success">
                  <CheckCircle size={24} />
                </div>
                <div className="stat-label">Confirmed</div>
                <div className="stat-value">{stats.confirmed}</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-content">
                <div className="stat-icon danger">
                  <XCircle size={24} />
                </div>
                <div className="stat-label">Rejected</div>
                <div className="stat-value">{stats.rejected}</div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="table-card">
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Del #</th>
                    <th>PO #</th>
                    <th>Supplier</th>
                    <th>Delivery Date</th>
                    <th>Received By</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan="7">
                        <div className="loading-container">
                          <div className="spinner"></div>
                        </div>
                      </td>
                    </tr>
                  ) : deliveries.length === 0 ? (
                    <tr>
                      <td colSpan="7">
                        <div className="empty-state">
                          <Truck className="empty-state-icon" />
                          <div className="empty-state-title">No deliveries recorded</div>
                          <div className="empty-state-text">Record your first delivery to get started</div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    deliveries.map(d => (
                      <tr key={d.id}>
                        <td className="cell-del-id">DEL-{String(d.id).padStart(4, '0')}</td>
                        <td className="cell-po-id">PO-{String(d.po_id).padStart(4, '0')}</td>
                        <td className="cell-supplier">{d.supplier_name}</td>
                        <td className="cell-date">{format(new Date(d.delivery_date), 'MMM d, yyyy')}</td>
                        <td className="cell-received-by">{d.received_by_name || '—'}</td>
                        <td>
                          <span className={`badge ${statusBadgeMap[d.status] || 'badge-pending'}`}>
                            {d.status}
                          </span>
                        </td>
                        <td className="cell-actions">
                          {d.status === 'pending' && hasRole('Administrator', 'Site Engineer', 'Warehouse Manager') && (
                            <button 
                              onClick={() => handleConfirmClick(d.id)}
                              className="btn-confirm"
                              title="Confirm delivery"
                            >
                              <Check size={16} />
                              <span>Confirm</span>
                            </button>
                          )}
                          {d.confirmed_by_name && (
                            <span className="confirmed-text">By {d.confirmed_by_name}</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Record Delivery Modal */}
        {modal && (
          <div className="modal-overlay" onClick={() => { setModal(false); reset() }}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">
                  <Package size={24} />
                  Record Delivery
                </h2>
                <button 
                  className="modal-close" 
                  onClick={() => { setModal(false); reset() }}
                  aria-label="Close modal"
                >
                  <X size={22} />
                </button>
              </div>

              <form onSubmit={handleSubmit(d => createDelivery.mutate(d))}>
                <div className="modal-body">
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label required">
                        <FileText size={16} />
                        Purchase Order
                      </label>
                      <select 
                        {...register('po_id', { required: 'PO is required' })} 
                        className="form-select"
                      >
                        <option value="">Select PO</option>
                        {pos.filter(p => ['pending', 'signed'].includes(p.status)).map(p => (
                          <option key={p.id} value={p.id}>
                            PO-{String(p.id).padStart(4, '0')} - {p.supplier_name}
                          </option>
                        ))}
                      </select>
                      {errors.po_id && <div className="error-text"><AlertCircle size={14} />{errors.po_id.message}</div>}
                    </div>
                    <div className="form-group">
                      <label className="form-label required">
                        <Calendar size={16} />
                        Delivery Date
                      </label>
                      <input 
                        {...register('delivery_date', { required: 'Delivery date is required' })} 
                        type="date" 
                        className="form-input"
                      />
                      {errors.delivery_date && <div className="error-text"><AlertCircle size={14} />{errors.delivery_date.message}</div>}
                    </div>
                  </div>

                  <div className="form-group">
                    <div className="field-array-header">
                      <label className="field-array-label">
                        <Package size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                        Delivery Items
                      </label>
                      <button
                        type="button"
                        onClick={() => append({ material_id: '', quantity_ordered: 1, quantity_received: 0 })}
                        className="add-item-btn"
                      >
                        <Plus size={16} />
                        <span>Add Item</span>
                      </button>
                    </div>
                    <div>
                      {fields.map((field, i) => (
                        <div key={field.id} className="field-row">
                          <select
                            {...register(`items.${i}.material_id`, { required: 'Material is required' })}
                            className="form-select"
                          >
                            <option value="">Select material</option>
                            {materials.map(m => (
                              <option key={m.id} value={m.id}>{m.name} ({m.unit})</option>
                            ))}
                          </select>
                          <input
                            {...register(`items.${i}.quantity_ordered`, { required: 'Quantity ordered is required', min: 0.01 })}
                            type="number"
                            step="0.01"
                            min="0.01"
                            placeholder="Ordered"
                            className="form-input"
                          />
                          <input
                            {...register(`items.${i}.quantity_received`, { required: 'Quantity received is required', min: 0 })}
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="Received"
                            className="form-input"
                          />
                          {fields.length > 1 && (
                            <button
                              type="button"
                              onClick={() => remove(i)}
                              className="remove-btn"
                              title="Remove item"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <p className="helper-text">Enter quantity ordered and quantity actually received</p>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <FileText size={16} />
                      Notes
                    </label>
                    <textarea 
                      {...register('notes')} 
                      className="form-textarea"
                      placeholder="Optional notes or observations..."
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    onClick={() => { setModal(false); reset() }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createDelivery.isPending}
                    className="btn-primary-full"
                  >
                    {createDelivery.isPending ? 'Recording...' : 'Record Delivery'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Confirm Delivery Modal */}
        {confirmModal !== null && (
          <div className="modal-overlay" onClick={() => setConfirmModal(null)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">
                  <Check size={24} />
                  Confirm Delivery
                </h2>
                <button 
                  className="modal-close" 
                  onClick={() => setConfirmModal(null)}
                  aria-label="Close modal"
                >
                  <X size={22} />
                </button>
              </div>

              <div className="modal-body">
                <div className="confirm-message">
                  <AlertCircle size={24} />
                  <div className="confirm-message-content">
                    <p>Confirm this delivery?</p>
                    <p>This will update the inventory with the received quantities. This action cannot be undone.</p>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button 
                  type="button" 
                  onClick={() => setConfirmModal(null)} 
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  onClick={handleConfirmDelivery}
                  disabled={confirmDelivery.isPending}
                  className="btn-primary-full"
                >
                  {confirmDelivery.isPending ? 'Confirming...' : 'Confirm Delivery'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
