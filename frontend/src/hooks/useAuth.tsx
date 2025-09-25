// lib/hooks/useAuth.ts
"use client";

import { useState, useEffect } from "react";
import { login as loginService, saveToken, getToken, logout as logoutService,
    register as registerService
 } from "../services/auth";

export function useAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedToken = getToken();
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (username: string, password: string) => {
    const data = await loginService(username, password);
    if (data.success && data.token) {
      saveToken(data.token);
      setToken(data.token);
      setIsAuthenticated(true);
    } else {
      throw new Error("Ungültige Login-Daten");
    }
  };

  const register = async (username: string, email: string, password: string) => {
    const data = await registerService(username, email, password);
    if (data.success && data.token) {
        saveToken(data.token);
        setToken(data.token);
        setIsAuthenticated(true);
    } else {
        throw new Error("Registrierung fehlgeschlagen");
    }
    };

  const logout = () => {
    logoutService();
    setToken(null);
    setIsAuthenticated(false);
  };

  return { token, isAuthenticated, login, register, logout };
}
