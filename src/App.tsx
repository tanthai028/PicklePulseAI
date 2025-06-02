import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import theme from './theme'
import Dashboard from './pages/Dashboard'
import Auth from './pages/Auth'
import EmailConfirm from './pages/EmailConfirm'
import PrivateRoute from './components/PrivateRoute'

const App = () => {
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/confirm" element={<EmailConfirm />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          {/* Redirect old auth routes to combined auth page */}
          <Route path="/login" element={<Navigate to="/auth" replace />} />
          <Route path="/register" element={<Navigate to="/auth" replace />} />
        </Routes>
      </Router>
    </ChakraProvider>
  )
}

export default App
