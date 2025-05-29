// contexts/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: 1,
    name: 'Admin User',
    email: 'admin@sajanshree.com',
    role: 'Admin'
  });
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const login = (credentials) => {
    // Implement login logic
    setIsAuthenticated(true);
    setUser({
      id: 1,
      name: 'Admin User',
      email: credentials.email,
      role: 'Admin'
    });
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};