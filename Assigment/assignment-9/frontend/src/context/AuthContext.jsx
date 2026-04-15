import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL
}); 

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

    const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
    delete API.defaults.headers.common['Authorization'];
  };

    const login = async (email, password, role) => {
     try {
      let res;

      if (role === 'Admin') {
        res = await API.post('/auth/login', { email, password });
      } else if (role === 'Visitor') {
        res = await API.post('/visitors/login', { email, password });
      }
      const data = res.data;
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));

      API.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

      return data;

    } catch (error) {
      throw error.response?.data?.message || 'Login failed';
    }
  };
  
  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const parsed = JSON.parse(userInfo)
      setUser(parsed);

      API.defaults.headers.common['Authorization'] = `Bearer ${parsed.token}`;
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const requestInterceptor = API.interceptors.request.use(
      (config) => {
        if (user?.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = API.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          logout();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      API.interceptors.request.eject(requestInterceptor);
      API.interceptors.response.eject(responseInterceptor);
    };
  }, [user]);
  



  return (
    <AuthContext.Provider value={{ user, login, logout, loading, setUser, API }}>
      {children}
    </AuthContext.Provider>
  );
};
