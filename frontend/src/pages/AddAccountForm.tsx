/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { accountAPI, familyAPI } from '../api/client';

interface FamilyMember {
  id: number;
  name: string;
  age: number;
  relation: string;
}

const AddAccountForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    balance: '',
    currency: 'RUB',
    family_member_id: ''
  });
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isLoadingMembers, setIsLoadingMembers] = useState(true);

  const currencies = [
    { value: 'RUB', label: 'Рубли (₽)' },
    { value: 'USD', label: 'Доллары ($)' },
    { value: 'EUR', label: 'Евро (€)' }
  ];

  useEffect(() => {
    const fetchFamilyMembers = async () => {
      try {
        const response = await familyAPI.getMembers();
        setFamilyMembers(response.data);
        setIsLoadingMembers(false);
      } catch (err) {
        setError('Не удалось загрузить членов семьи');
        setIsLoadingMembers(false);
      }
    };

    fetchFamilyMembers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const userFamily = await familyAPI.getMyFamily();
    if (!formData.family_member_id) {
      setError('Пожалуйста, выберите члена семьи');
      return;
    }

    setIsSubmitting(true);

    try {
      await accountAPI.createAccount({
        name: formData.name,
        balance: parseFloat(formData.balance),
        currency: formData.currency as 'RUB' | 'USD' | 'EUR',
        family_id: userFamily.data.id,
        family_member_id: parseInt(formData.family_member_id)
        
      });
      navigate('/accounts');
    } catch (err) {
      setError('Ошибка при создании счета. Пожалуйста, попробуйте снова.');
      console.error('Error creating account:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Добавить новый счет</h1>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Название счета
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Например: Основная карта"
              />
            </div>

            <div>
              <label htmlFor="family_member_id" className="block text-sm font-medium text-gray-700 mb-1">
                Член семьи
              </label>
              {isLoadingMembers ? (
                <div className="animate-pulse py-2">Загрузка списка членов семьи...</div>
              ) : familyMembers.length > 0 ? (
                <select
                  id="family_member_id"
                  name="family_member_id"
                  value={formData.family_member_id}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Выберите члена семьи</option>
                  {familyMembers.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name} ({member.relation})
                    </option>
                  ))}
                </select>
              ) : (
                <div className="text-sm text-gray-500">
                  Нет членов семьи. Сначала добавьте членов семьи.
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="balance" className="block text-sm font-medium text-gray-700 mb-1">
                  Начальный баланс
                </label>
                <input
                  type="number"
                  id="balance"
                  name="balance"
                  value={formData.balance}
                  onChange={handleChange}
                  required
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
                  Валюта
                </label>
                <select
                  id="currency"
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  {currencies.map((currency) => (
                    <option key={currency.value} value={currency.value}>
                      {currency.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting || isLoadingMembers || familyMembers.length === 0}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Создание...' : 'Создать счет'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddAccountForm;