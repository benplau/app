import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("userAuth");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = (userInfo) => {
    setUser(userInfo);
    localStorage.setItem("userAuth", JSON.stringify(userInfo));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("userAuth");
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("userAuth");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const value = {
    user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
