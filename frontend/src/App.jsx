import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Materials from './pages/Materials'
import Projects from './pages/Projects'
import MaterialRequests from './pages/MaterialRequests'
import Procurement from './pages/Procurement'
import Inventory from './pages/Inventory'
import Deliveries from './pages/Deliveries'
import Transfers from './pages/Transfers'
import Reports from './pages/Reports'
import Users from './pages/Users'
import Suppliers from './pages/Suppliers'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="materials" element={<Materials />} />
          <Route path="projects" element={<Projects />} />
          <Route path="material-requests" element={<MaterialRequests />} />
          <Route path="procurement" element={<Procurement />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="deliveries" element={<Deliveries />} />
          <Route path="transfers" element={<Transfers />} />
          <Route path="reports" element={<Reports />} />
          <Route path="users" element={<Users />} />
          <Route path="suppliers" element={<Suppliers />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  )
}
