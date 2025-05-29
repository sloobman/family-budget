import { useEffect, useState } from 'react';
import { User, Mail, User as UserIcon, Users, Edit, Home } from 'lucide-react';
import { familyAPI, userAPI } from '../api/client';
import { Link } from 'react-router-dom';
// В начале компонента
import { useAuth } from '../hooks/useAuth';
import { LogOut } from 'lucide-react'; // Импортируем иконку выхода

interface UserData {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_parent: boolean;
  family_id: number | null;
}

interface FamilyData {
  id: number;
  name: string;
}

const Profile = () => {
  const { logout, loading: logoutLoading, error: logoutError } = useAuth();
  const [user, setUser] = useState<UserData | null>(null);
  const [family, setFamily] = useState<FamilyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Получаем данные текущего пользователя
        
        const userResponse = await userAPI.getCurrentUser();
        setUser(userResponse.data);
        //console.log(userResponse);
        // Если у пользователя есть семья, получаем её данные
        if (userResponse.data.family_id) {
          const familyResponse = await familyAPI.getMyFamily();
          setFamily(familyResponse.data);
        }
      } catch (err) {
        setError('Не удалось загрузить данные профиля');
        console.error('Error fetching profile data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow rounded-lg p-6">
            <p>Загрузка...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow rounded-lg p-6">
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
           <Link
              to="/dashboard"
              className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow hover:bg-gray-100 transition-colors duration-200"
            >
              <Home className="h-5 w-5 text-gray-600" />
              <span className="text-gray-700 font-medium">На главную</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Личный кабинет</h1>
          <Link
            to="/profile/edit"
            className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow hover:bg-gray-100 transition-colors duration-200"
          >
            <Edit className="h-5 w-5 text-gray-600" />
            <span className="text-gray-700 font-medium">Редактировать</span>
          </Link>
           <button
            onClick={logout}
            disabled={logoutLoading}
            className="flex items-center space-x-2 bg-red-50 px-4 py-2 rounded-lg shadow hover:bg-red-100 transition-colors duration-200 text-red-600"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Выйти</span>
          </button>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex items-center space-x-6 mb-8">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
                <UserIcon className="h-10 w-10 text-gray-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {user?.first_name} {user?.last_name}
                </h2>
                <p className="text-gray-600">{user?.is_parent ? 'Родитель' : 'Ребёнок'}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Основная информация</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Имя пользователя</p>
                      <p className="font-medium">{user?.username}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{user?.email}</p>
                    </div>
                  </div>
                </div>
              </div>

              {family && (
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Семья</h3>
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Название семьи</p>
                      <p className="font-medium">{family.name}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Link
                      to={`/family`}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Перейти к управлению семьёй →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {logoutError && (
          <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg">
            {logoutError}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;