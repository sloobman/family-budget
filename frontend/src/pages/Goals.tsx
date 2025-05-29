import { useEffect, useState } from 'react';
import { Target, Home, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { goalAPI, GoalResponse } from '../api/client';

const GoalsPage = () => {
  const [goals, setGoals] = useState<GoalResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await goalAPI.getGoals();
        setGoals(response.data);
        setIsLoading(false);
      } catch (err) {
        setError('Не удалось загрузить цели');
        setIsLoading(false);
        console.error(err);
      }
    };

    fetchGoals();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <Link
            to="/dashboard"
            className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow hover:bg-gray-100 transition-colors duration-200"
          >
            <Home className="h-5 w-5 text-gray-600" />
            <span className="text-gray-700 font-medium">На главную</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Target className="h-8 w-8 mr-2 text-green-500" />
            Цели
          </h1>
          <Link
            to="/add-goal"
            className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow hover:bg-gray-100 transition-colors duration-200"
          >
            <PlusCircle className="h-5 w-5 text-gray-600" />
            <span className="text-gray-700 font-medium">Добавить цель</span>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 001.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        ) : goals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goals.map((goal) => (
              <div
                key={goal.id}
                className="bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200 p-6 relative"
              >
                <button
                  onClick={async () => {
                    try {
                      await goalAPI.deleteGoal(goal.id);
                      setGoals((prev) => prev.filter((g) => g.id !== goal.id));
                    } catch (err) {
                      console.error(err);
                      alert('Ошибка при удалении цели');
                    }
                  }}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  title="Удалить цель"
                >
                  ×
                </button>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{goal.title}</h3>
                <p className="text-2xl text-green-600 font-bold mb-2">{goal.amount.toFixed(2)} ₽</p>
                {goal.description && (
                  <p className="text-sm text-gray-600">{goal.description}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Target className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">Нет целей</h3>
            <p className="mt-1 text-sm text-gray-500">Создайте первую финансовую цель.</p>
            <div className="mt-6">
              <Link
                to="/add-goal"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
              >
                <PlusCircle className="-ml-1 mr-2 h-5 w-5" />
                Добавить цель
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalsPage;
