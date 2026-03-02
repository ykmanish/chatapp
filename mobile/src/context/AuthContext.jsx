import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authAPI } from "../utils/api";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadStoredAuth(); }, []);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem("token");
      const storedUser = await AsyncStorage.getItem("user");
      if (storedToken && storedUser) { setToken(storedToken); setUser(JSON.parse(storedUser)); }
    } catch (error) { console.error("Error loading auth:", error); }
    finally { setLoading(false); }
  };

  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });
      const { token: newToken, ...userData } = response.data;
      setUser(userData); setToken(newToken);
      await AsyncStorage.setItem("token", newToken);
      await AsyncStorage.setItem("user", JSON.stringify(userData));
      return { success: true };
    } catch (error) { return { success: false, message: error.response?.data?.message || "Login failed" }; }
  };

  const register = async (fullName, email, password) => {
    try {
      const response = await authAPI.register({ fullName, email, password });
      const { token: newToken, ...userData } = response.data;
      setUser(userData); setToken(newToken);
      await AsyncStorage.setItem("token", newToken);
      await AsyncStorage.setItem("user", JSON.stringify(userData));
      return { success: true };
    } catch (error) { return { success: false, message: error.response?.data?.message || "Registration failed" }; }
  };

  const logout = async () => {
    setUser(null); setToken(null);
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
  };

  const updateUser = async (updates) => {
    try {
      const response = await authAPI.updateProfile(updates);
      const updatedUser = { ...user, ...response.data };
      setUser(updatedUser);
      await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
      return { success: true };
    } catch (error) { return { success: false, message: error.response?.data?.message || "Update failed" }; }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateUser, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};