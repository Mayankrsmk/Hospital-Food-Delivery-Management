import { Routes, Route, Navigate } from 'react-router-dom'
import { createContext, useContext, useState } from 'react'
import LoginPage from './pages/auth/LoginPage'
import ManagerDashboard from './pages/manager/ManagerDashboard'

// Create Auth Context
export const AuthContext = createContext(null)

// Auth Provider Component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  const login = (userData) => {
    setUser(userData)
  }

  const logout = () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Protected Route Component
function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useContext(AuthContext)
  
  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return children
}

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          {/* Root route - redirect based on auth status */}
          <Route 
            path="/" 
            element={
              <RootRedirect />
            } 
          />

          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* Protected routes */}
          <Route
            path="/manager/*"
            element={
              <ProtectedRoute allowedRoles={['manager']}>
                <ManagerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pantry/*"
            element={
              <ProtectedRoute allowedRoles={['pantry']}>
                <div>Pantry Dashboard</div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/delivery/*"
            element={
              <ProtectedRoute allowedRoles={['delivery']}>
                <div>Delivery Dashboard</div>
              </ProtectedRoute>
            }
          />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </AuthProvider>
  )
}

// Root redirect component
function RootRedirect() {
  const { user } = useContext(AuthContext)

  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Redirect based on user role
  switch (user.role) {
    case 'manager':
      return <Navigate to="/manager" replace />
    case 'pantry':
      return <Navigate to="/pantry" replace />
    case 'delivery':
      return <Navigate to="/delivery" replace />
    default:
      return <Navigate to="/login" replace />
  }
}

export default App
