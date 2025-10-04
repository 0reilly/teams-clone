import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import styled, { createGlobalStyle } from 'styled-components'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { SocketProvider } from './contexts/SocketContext'

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: #f5f5f5;
    color: #333;
  }

  #root {
    height: 100vh;
  }
`

const AppContainer = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
`

function AppRoutes() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Loading Teams Clone...
      </div>
    )
  }

  return (
    <Routes>
      <Route 
        path="/login" 
        element={!user ? <Login /> : <Navigate to="/" />} 
      />
      <Route 
        path="/" 
        element={user ? <Dashboard /> : <Navigate to="/login" />} 
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

function App() {
  return (
    <Router>
      <GlobalStyle />
      <AuthProvider>
        <SocketProvider>
          <AppContainer>
            <AppRoutes />
          </AppContainer>
        </SocketProvider>
      </AuthProvider>
    </Router>
  )
}

export default App