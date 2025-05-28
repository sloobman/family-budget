/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { PieChart, Wallet, Target, Users, User } from 'lucide-react';
import { accountAPI, familyAPI, FamilyBalances, transactionAPI, TransactionData, userAPI} from '../api/client';
import { Link } from 'react-router-dom';
import TransactionForm from './TransactiomForm';
import StatusBar from "../components/StatusBar";

const Dashboard = () => {
  const [userName, setUserName] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [familyMembers, setFamilyMembers] = useState(0);
  const [balances, setBalances] = useState<FamilyBalances>({});
  const [monthlySavings, setMonthlySavings] = useState(0);
  const [activeGoals, setActiveGoals] = useState(0);
  const [activities, setActivities] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const currencySymbols: Record<string, string> = {
    RUB: '₽',
    USD: '$',
    EUR: '€'
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch family members
        const membersResponse = await familyAPI.getMembers();
        setFamilyMembers(membersResponse.data.length);
        const balancesResponse = await accountAPI.fetchFamilyBalances();
        setBalances(balancesResponse.data.balances);
        
        const transactionsResponse = await transactionAPI.getTransactions();
        setTransactions(transactionsResponse.data);
        const userResponse = await userAPI.getCurrentUser();
        setUserName(`${userResponse.data.last_name} ${userResponse.data.first_name}`);
      
        // Установка текущей даты
        setCurrentDate(new Date().toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }));
        // TODO: Fetch goals and activities   
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };
    
    fetchData();
  }, []);



  return (
    
    <div className="min-h-screen bg-gray-50">
      <StatusBar 
          userName={userName}
          currentDate={currentDate}
        />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-16">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Рабочая область</h1>
            <Link 
              to="/profile" 
              className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow hover:bg-gray-100 transition-colors duration-200"
            >
              <User className="h-5 w-5 text-gray-600" />
              <span className="text-gray-700 font-medium">Личный кабинет</span>
            </Link>
          </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 items-stretch">
          <Link to="/accounts" className="h-full">
            <div className="bg-white rounded-lg shadow p-6 h-full flex flex-col justify-center hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
              <div className="flex items-start">
                <Wallet className="h-8 w-8 text-blue-500 mt-1" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Денег всего</p>
                  {balances.RUB !== undefined && (
                    <p className="text-2xl font-semibold text-gray-900">{balances.RUB.toFixed(2)} ₽</p>
                  )}
                  <div className="flex flex-wrap gap-2 mt-1">
                    {Object.entries(balances).map(([currency, amount]) => (
                      currency !== 'RUB' && (
                        <span key={currency} className="text-sm bg-gray-100 px-2 py-1 rounded">
                          {amount.toFixed(2)} {currencySymbols[currency] || currency}
                        </span>
                      )
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Link>
          <Link to="/savings" className="h-full">
            <div className="bg-white rounded-lg shadow p-6 h-full flex flex-col justify-center hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
              <div className="flex items-start">
                <PieChart className="h-8 w-8 text-green-500 mt-1" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Накопления</p>
                  <p className="text-2xl font-semibold text-gray-900">${monthlySavings.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </Link>
          <Link to="/goals" className="h-full">
            <div className="bg-white rounded-lg shadow p-6 h-full flex flex-col justify-center hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
              <div className="flex items-start">
                <Target className="h-8 w-8 text-purple-500 mt-1" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Текущие цели</p>
                  <p className="text-2xl font-semibold text-gray-900">{activeGoals.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </Link>
          <Link to="/family" className="h-full">
            <div className="bg-white rounded-lg shadow p-6 h-full flex flex-col justify-center hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
              <div className="flex items-start">
                <Users className="h-8 w-8 text-orange-500 mt-1" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Семья</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {familyMembers} {familyMembers % 100 >= 11 && familyMembers % 100 <= 14
                      ? 'человек'
                      : [2, 3, 4].includes(familyMembers % 10)
                        ? 'человека'
                        : 'человек'}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Финансовая активность</h2>
            <button
              onClick={() => setIsFormOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Добавить транзакцию
            </button>
            <TransactionForm
              isOpen={isFormOpen}
              onClose={() => setIsFormOpen(false)}
              onSuccess={() => {
                // Повторно загрузим транзакции
                transactionAPI.getTransactions().then((res) => setTransactions(res.data));
              }}
            />
          </div>
          <div className="space-y-4">
            {transactions.length > 0 ? (
              transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-0">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <Wallet className="h-5 w-5 text-gray-500" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">
                        {transaction.category || (transaction.type === 'income' ? 'Доход' : 'Расход')}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDate(transaction.created_at)}
                      </p>
                    </div>
                    
                  </div>
                  
                  <span className="text-sm text-gray-600">
                        {transaction.family_member.name} (
                          {transaction.family_member.relation}
                        )
                  </span>

                  <span className={`text-sm font-medium ${
                      transaction.type === 'income' ? 'text-green-500' : 'text-red-500'
                  }`}>
                      {transaction.type === 'income' ? '+' : '-'}
                      {transaction.amount.toFixed(2)} {transaction.currency}
                  </span>


                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">Нет данных о транзакциях</p>
            )}
          </div>
      </div>
    </div>
    
  </div>
  );
};

export default Dashboard;