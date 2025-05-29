/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { RussianRuble, Wallet, Target, User, Plus, Trash2 } from 'lucide-react';
import { accountAPI, categoryAPI, FamilyBalances, transactionAPI, TransactionData, userAPI, goalAPI } from '../api/client';
import { Link } from 'react-router-dom';
import TransactionForm from './TransactiomForm';
import StatusBar from "../components/StatusBar";

const Dashboard = () => {
  const [userName, setUserName] = useState('');
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState('');
  const [balances, setBalances] = useState<FamilyBalances>({});
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isParent, setIsParent] = useState(true);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalGoals, setTotalGoals] = useState(0);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [dateFrom, setDateFrom] = useState<string>(''); // формат 'yyyy-mm-dd'
  const [dateTo, setDateTo] = useState<string>('');     // формат 'yyyy-mm-dd'

  const filteredTransactions = transactions.filter(t => {
  // Фильтр по категории
  if (selectedCategoryId && t.category_id !== selectedCategoryId) {
    return false;
  }
  
  // Фильтр по дате
  const tDate = new Date(t.created_at);
  
  if (dateFrom) {
    const fromDate = new Date(dateFrom);
    if (tDate < fromDate) return false;
  }
  if (dateTo) {
    const toDate = new Date(dateTo);
    // Чтобы включить весь день dateTo, прибавим 1 день - 1 мс
    toDate.setHours(23, 59, 59, 999);
    if (tDate > toDate) return false;
  }
  
  return true;
});


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

  const handleExport = async () => {
    try {
      const response = await transactionAPI.exportTransactions();

      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'transactions.xlsx';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Ошибка при экспорте:', error);
      alert('Не удалось экспортировать файл');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        
        
        // Fetch family members

        const balancesResponse = await accountAPI.fetchFamilyBalances();
        setBalances(balancesResponse.data.balances);
        
        const transactionsResponse = await transactionAPI.getTransactions();
        setTransactions(transactionsResponse.data);
        const userResponse = await userAPI.getCurrentUser();
        setUserName(`${userResponse.data.last_name} ${userResponse.data.first_name}`);
        setIsParent(userResponse.data.is_parent);
        await fetchCategories();

        const incomeResponse = await transactionAPI.getTotalIncome();
        setTotalIncome(incomeResponse.data.total_income);

        const expenseResponse = await transactionAPI.getTotalExpense();
        setTotalExpense(expenseResponse.data.total_expense);

        const goalResponse = await goalAPI.getTotalGoals();
        setTotalGoals(goalResponse.data.total_amount);

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
        <div className="flex gap-6">
           <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow p-4 sticky top-24">
              <h3 className="font-semibold text-lg mb-4 flex justify-between items-center cursor-pointer" onClick={() => setIsCategoriesOpen(prev => !prev)}>
                  <span>Категории</span>
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

          
            
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 items-stretch">
                <Link to="/accounts" className="h-full">
                  <div className="bg-white rounded-lg shadow p-6 h-full flex flex-col justify-center hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                    <div className="flex items-start">
                      <Wallet className="h-8 w-8 text-blue-500 mt-1" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Денег всего</p>
                        {balances.RUB !== undefined && (
                          <p className="text-xl font-semibold text-gray-900">{balances.RUB.toFixed(2)} ₽</p>
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
                <Link to="/goals" className="h-full">
                  <div className="bg-white rounded-lg shadow p-6 h-full flex flex-col justify-center hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                    <div className="flex items-start">
                      <Target className="h-8 w-8 text-purple-500 mt-1" />
                      <div className="ml-4">
                        <p className="text-xs font-medium text-gray-500">Плановые расходы</p>
                        <p className="text-xl font-semibold text-gray-900">{totalGoals.toFixed(2)} ₽</p>
                      </div>
                    </div>
                  </div>
                </Link>        
                <Link to="/savings" className="h-full">
                  <div className="bg-white rounded-lg shadow p-6 h-full flex flex-col justify-center hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                    <div className="flex items-start">
                      <RussianRuble className="h-8 w-8 text-green-500 mt-1" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Итоговый доход</p>
                        <p className="text-xl font-semibold text-gray-900">{totalIncome.toFixed(2)} ₽</p>
                      </div>
                    </div>
                  </div>
                </Link>
                
                <Link to="/family" className="h-full">
                  <div className="bg-white rounded-lg shadow p-6 h-full flex flex-col justify-center hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                    <div className="flex items-start">
                      <RussianRuble className="h-8 w-8 text-red-500 mt-1" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Итоговый расход</p>
                         <p className="text-xl font-semibold text-gray-900">{totalExpense.toFixed(2)} ₽</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 mr-1">Финансовая активность</h2>
            <div className="flex  justify-between items-center mb-4">
              

              <div className="flex gap-4">
                  {/* Фильтр по категории */}
                  <select
                    value={selectedCategoryId ?? ''}
                    onChange={(e) => setSelectedCategoryId(e.target.value ? Number(e.target.value) : null)}
                    className="border border-gray-300 rounded bg-indigo-600 text-white px-4 py-2 hover:bg-indigo-700 pr-10 appearance-none"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg fill='white' height='20' viewBox='0 0 24 24' width='20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 0.75rem center',
                      backgroundSize: '1em',
                    }}
                  >
                    <option value="">Все категории</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>

                  {/* Фильтр по дате: с */}
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="border border-gray-300 rounded bg-indigo-600 text-white px-4 py-2  hover:bg-indigo-700"
                    placeholder="Дата с"
                  />

                  {/* Фильтр по дате: по */}
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="border border-gray-300 rounded bg-indigo-600 text-white px-4 py-2  hover:bg-indigo-700"
                    placeholder="Дата по"
                  />
              </div>
              <button
                onClick={() => setIsFormOpen(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                Добавить транзакцию
              </button>

              <button
              onClick={handleExport}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                Экспорт в Excel
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
                filteredTransactions.map((transaction) => (
                  
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