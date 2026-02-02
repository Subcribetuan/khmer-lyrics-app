import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import SongPage from './pages/SongPage';
import AddSongPage from './pages/AddSongPage';
import EditSongPage from './pages/EditSongPage';

// Auth Context
const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

// Theme Context
const ThemeContext = createContext(null);

export const useTheme = () => useContext(ThemeContext);

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState('light');

  // Check authentication on mount
  useEffect(() => {
    const authStatus = localStorage.getItem('khmer-lyrics-auth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  // Theme management
  useEffect(() => {
    const savedTheme = localStorage.getItem('khmer-lyrics-theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('khmer-lyrics-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const login = (username, password) => {
    // Simple authentication - you can change these credentials
    // In production, use proper authentication!
    if (username === 'admin' && password === 'khmer2024') {
      setIsAuthenticated(true);
      localStorage.setItem('khmer-lyrics-auth', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('khmer-lyrics-auth');
  };

  if (isLoading) {
    return (
      <div className="login-page">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="login-logo"
        >
          🎵
        </motion.div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <Router>
          <AnimatePresence mode="wait">
            <Routes>
              <Route 
                path="/login" 
                element={
                  isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />
                } 
              />
              <Route 
                path="/" 
                element={
                  isAuthenticated ? <HomePage /> : <Navigate to="/login" replace />
                } 
              />
              <Route 
                path="/song/:id" 
                element={
                  isAuthenticated ? <SongPage /> : <Navigate to="/login" replace />
                } 
              />
              <Route 
                path="/add" 
                element={
                  isAuthenticated ? <AddSongPage /> : <Navigate to="/login" replace />
                } 
              />
              <Route 
                path="/edit/:id" 
                element={
                  isAuthenticated ? <EditSongPage /> : <Navigate to="/login" replace />
                } 
              />
            </Routes>
          </AnimatePresence>
        </Router>
      </ThemeContext.Provider>
    </AuthContext.Provider>
  );
}

export default App;
