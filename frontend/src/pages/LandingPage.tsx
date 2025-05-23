import React from 'react';
import { Link } from 'react-router-dom';
import { Wallet } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <nav className="flex justify-between items-center mb-16">
          <div className="flex items-center space-x-2">
            <Wallet className="h-8 w-8 text-indigo-600" />
            <span className="text-2xl font-bold text-indigo-600">FamilyBudget</span>
          </div>
          <div className="space-x-4">
            <Link
              to="/login"
              className="px-4 py-2 text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Войти
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200"
            >
              Регистрация
            </Link>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-8">
            Управляйте семейным бюджетом вместе
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            FamilyBudget помогает семьям эффективно планировать расходы, достигать финансовых целей и создавать надежное будущее вместе.
          </p>
          <div className="flex justify-center space-x-6">
            <Link
              to="/register"
              className="px-8 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200 text-lg font-medium"
            >
              Начать бесплатно
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 border-2 border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition duration-200 text-lg font-medium"
            >
              Войти в аккаунт
            </Link>
          </div>
        </div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Совместное управление</h3>
            <p className="text-gray-600">
              Управляйте финансами всей семьей, распределяйте бюджет и отслеживайте расходы каждого члена семьи.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Финансовые цели</h3>
            <p className="text-gray-600">
              Ставьте цели и следите за их достижением. Копите на важные покупки и путешествия вместе.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Аналитика расходов</h3>
            <p className="text-gray-600">
              Анализируйте расходы по категориям, отслеживайте динамику и оптимизируйте семейный бюджет.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;