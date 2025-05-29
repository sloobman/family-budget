import { useEffect, useState } from 'react';
import { Wallet, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { accountAPI, AccountResponse} from '../api/client';



const PersonalAccounts = () => {
  const [accounts, setAccounts] = useState<AccountResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await accountAPI.getAccounts();
        setAccounts(response.data);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to fetch accounts');
        setIsLoading(false);
        console.error('Error fetching accounts:', err);
      }
    };

    fetchAccounts();
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
            <Wallet className="h-8 w-8 mr-2 text-blue-500" />
            Личные счета
          </h1>             
          <Link 
            to="/add-account" 
            className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow hover:bg-gray-100 transition-colors duration-200"
          >
            <Wallet className="h-5 w-5 text-gray-600" />
            <span className="text-gray-700 font-medium">Добавить счет</span>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accounts.length > 0 ? (
              accounts.map((account) => (
                <div key={account.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow duration-200">
                  <div className="p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Wallet className="h-6 w-6 text-gray-500" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">{account.name}</h3>
                        <p className="text-sm text-gray-500 capitalize">{account.currency}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-2xl font-semibold text-gray-900">
                        {account.balance.toFixed(2)} {account.currency}
                      </p>
                      
                    </div>
                  </div>
                  
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Wallet className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">Нет счетов</h3>
                <p className="mt-1 text-sm text-gray-500">Начните с добавления вашего первого счета.</p>
                <div className="mt-6">
                  <Link
                    to="/add-account"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Wallet className="-ml-1 mr-2 h-5 w-5" />
                    Добавить счет
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalAccounts;