import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Wallet } from 'lucide-react';
import { authAPI } from '../api/client';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await authAPI.login({ username, password });
      localStorage.setItem('token', response.data.access_token);
      navigate('/dashboard');
    } catch {
      setError('Invalid email or password');
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-sm">
        <div className="text-center">
          <Link to="/" className="flex justify-center items-center space-x-2">
            <Wallet className="h-8 w-8 text-indigo-600" />
            <span className="text-2xl font-bold text-indigo-600">FamilyBudget</span>
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Войти в аккаунт</h2>
          <p className="mt-2 text-sm text-gray-600">
            Или{' '}
            <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
              зарегистрируйтесь
            </Link>
            , если у вас нет аккаунта
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Имя пользователя
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Пароль
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          {error && (
            <div className="text-red-600 text-sm text-center">
              {error}
            </div>
          )}
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Войти
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;