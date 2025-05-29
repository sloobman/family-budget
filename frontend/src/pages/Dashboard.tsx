/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { PieChart, Wallet, Target, Users, User, Plus, Trash2 } from 'lucide-react';
import { accountAPI, categoryAPI, familyAPI, FamilyBalances, transactionAPI, TransactionData, userAPI} from '../api/client';
import { Link } from 'react-router-dom';
import TransactionForm from './TransactiomForm';
import StatusBar from "../components/StatusBar";

const Dashboard = () => {
  const [userName, setUserName] = useState('');
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState('');
  const [familyMembers, setFamilyMembers] = useState(0);
  const [balances, setBalances] = useState<FamilyBalances>({});
  const [monthlySavings, setMonthlySavings] = useState(0);
  const [activeGoals, setActiveGoals] = useState(0);
  const [activities, setActivities] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isParent, setIsParent] = useState(true);
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
  const fetchCategories = async () => {
    try {
      const userResponse = await userAPI.getCurrentUser();
      const familyId = userResponse.data.family_id;
      const response = await categoryAPI.getCategories(familyId);
      console.log(response.data);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      await categoryAPI.createCategory({ name: newCategoryName });
      setNewCategoryName('');
      await fetchCategories();
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };
  const handleDeleteCategory = async (id: number) => {
    try {
      await categoryAPI.deleteCategory(id);
      await fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
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
        setIsParent(userResponse.data.is_parent);
        await fetchCategories();
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-16">
        <div className="flex gap-6">
           <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow p-4 sticky top-24">
              <h3 className="font-semibold text-lg mb-4 flex justify-between items-center cursor-pointer" onClick={() => setIsCategoriesOpen(prev => !prev)}>
                  <span>Категории расходов</span>
                  <button
                    type="button"
                    className="text-gray-500 hover:text-gray-700 focus:outline-none"
                    aria-expanded={isCategoriesOpen}
                    aria-label={isCategoriesOpen ? 'Свернуть категории' : 'Развернуть категории'}
                  >
                    {isCategoriesOpen ? '−' : '+'}
                  </button>
                </h3>

              
              {isCategoriesOpen && (
                <div className="space-y-2 mb-4">
                  {categories.map(category => (
                    <div key={category.id} className="flex justify-between items-center p-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 rounded">
                      <span>{category.name}</span>
                      {isParent && (
                        <button 
                          onClick={() => handleDeleteCategory(category.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {isParent && isCategoriesOpen && (
               <div className="mt-4">
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Новая категория"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    style={{ height: '38px' }} // задаём фиксированную высоту, чтобы совпадала с кнопкой
                  />
                  <button
                    onClick={handleAddCategory}
                    className="bg-blue-600 text-white px-3 rounded-md hover:bg-blue-700 flex items-center justify-center"
                    style={{ height: '38px' }} // такая же фиксированная высота
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              )}
            </div>
          </div>
          <div className="flex-1">

          
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
            <div className="divide-y divide-gray-200">
              {transactions.length > 0 ? (
                transactions.map((transaction) => (
                  
                  <div key={transaction.id} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-0  hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                        <Wallet className="h-5 w-5 text-gray-500" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">
                          {categories.find(cat => cat.id === transaction.category_id)?.name || (transaction.type === 'income' ? 'Доход' : 'Расход')}
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
  </div>
  </div>
  );
};

export default Dashboard;