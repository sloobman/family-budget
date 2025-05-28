// hooks/useAuth.ts
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../api/client';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const logout = async () => {
    setLoading(true);
    setError('');
    try {
      await authAPI.logout();
      localStorage.removeItem('token');
      navigate('/login');
    } catch (err) {
      setError('Не удалось выйти из системы');
      console.error('Logout error:', err);
    } finally {
      setLoading(false);
    }
  };

  return { logout, loading, error };
};