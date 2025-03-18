import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = "http://127.0.0.1:8000/api/v1/auth";

  const getAccessToken = () => localStorage.getItem("access_token");
  const getRefreshToken = () => localStorage.getItem("refresh_token");

  const setTokens = (accessToken, refreshToken) => {
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("refresh_token", refreshToken);
  };

  const clearTokens = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  };

  const isTokenExpired = (token) => {
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch {
      return true;
    }
  };

  const refreshAccessToken = async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken || isTokenExpired(refreshToken)) {
      logout();
      return null;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/refresh_token`, {
        refresh_token: refreshToken,
      });
      const { access_token, refresh_token } = response.data;
      setTokens(access_token, refresh_token);
      return access_token;
    } catch (error) {
      console.error("Failed to refresh token:", error);
      logout();
      return null;
    }
  };

  const getValidAccessToken = async () => {
    let accessToken = getAccessToken();
    if (!accessToken || isTokenExpired(accessToken)) {
      accessToken = await refreshAccessToken();
    }

    return accessToken;
  };

  const login = async (accessToken, refreshToken) => {
    try {
      const decoded = jwtDecode(accessToken);
      setTokens(accessToken, refreshToken);
      setUser(decoded);
    } catch (error) {
      console.error("Failed to login:", error);
      logout();
    }
  };

  const logout = () => {
    clearTokens();
    setUser(null);
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const accessToken = await getValidAccessToken();
      if (accessToken) {
        const decoded = jwtDecode(accessToken);
        setUser(decoded);
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
