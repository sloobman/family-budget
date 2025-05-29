/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { transactionAPI, accountAPI, userAPI, categoryAPI } from "../api/client";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const TransactionForm = ({ isOpen, onClose, onSuccess }: Props) => {
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [accounts, setAccounts] = useState<{id: number; name: string}[]>([]);
  const [amount, setAmount] = useState(0);
  const [type, setType] = useState<'income' | 'expense'>('income');
  const [accountId, setAccountId] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
   const [errorMessage, setErrorMessage] = useState<string>("");
  useEffect(() => { 
    const fetchAccounts = async () => {
      try {
        const response = await accountAPI.getAccounts(); // пример запроса
        setAccounts(response.data);
      } catch (error) {
        console.error("Ошибка загрузки счетов:", error);
      }
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

    fetchAccounts();
    fetchCategories();
  }, []);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    if (!accountId) {
      alert("Пожалуйста, выберите счёт");
      return;
    }
    if (categoryId === null) {
      alert("Выберите категорию");
      return;
    }
    try {
      await transactionAPI.createTransaction({
          type,
          amount,
          category_id: categoryId,
          account_id: accountId
          
      });
      onSuccess();
      onClose();
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.detail) {
        setErrorMessage(error.response.data.detail);
      } else if (error.message) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Произошла неизвестная ошибка");
      }
    } finally {

      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md bg-white p-6 rounded-xl shadow-xl">
          <Dialog.Title className="text-lg font-semibold mb-4">Добавить транзакцию</Dialog.Title>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Сумма</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value))}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Тип</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as 'income' | 'expense')}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg fill='gray' height='20' viewBox='0 0 24 24' width='20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 0.75rem center',
                  backgroundSize: '1em',
                }}
                >
                <option value="income">Доход</option>
                <option value="expense">Расход</option>
            </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Категория</label>
              <select
                value={categoryId ?? ""}
                onChange={(e) => setCategoryId(Number(e.target.value))}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg fill='gray' height='20' viewBox='0 0 24 24' width='20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 0.75rem center',
                  backgroundSize: '1em',
                }}
              >
                <option value="">Выберите категорию</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>

            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Выберите счёт</label>
                <select
                    value={accountId}
                    onChange={(e) => setAccountId(Number(e.target.value))}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500  appearance-none"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg fill='gray' height='20' viewBox='0 0 24 24' width='20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 0.75rem center',
                      backgroundSize: '1em',
                    }}
                    >
                    <option value="">Выберите счёт</option>
                    {accounts.map((acc) => (
                        <option key={acc.id} value={acc.id}>
                        {acc.name}
                        </option>
                    ))}
                </select>

            </div>
            {errorMessage && (
              <div className="text-red-600 text-sm font-medium">
                {errorMessage}
              </div>
            )}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                {loading ? "Сохранение..." : "Сохранить"}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default TransactionForm;
