import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { transactionAPI, accountAPI } from "../api/client";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const TransactionForm = ({ isOpen, onClose, onSuccess }: Props) => {
  const [accounts, setAccounts] = useState<{id: number; name: string}[]>([]);
  const [amount, setAmount] = useState(0);
  const [type, setType] = useState<'income' | 'expense'>('income');
  const [category, setCategory] = useState("");
  const [accountId, setAccountId] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await accountAPI.getAccounts(); // пример запроса
        setAccounts(response.data);
      } catch (error) {
        console.error("Ошибка загрузки счетов:", error);
      }
    };

    fetchAccounts();
  }, []);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!accountId) {
      alert("Пожалуйста, выберите счёт");
      return;
    }

    try {
      await transactionAPI.createTransaction({
          type,
          amount,
          category,
          account_id: accountId
          
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Ошибка при добавлении транзакции", error);
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
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                <option value="income">Доход</option>
                <option value="expense">Расход</option>
            </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Категория</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Выберите счёт</label>
                <select
                    value={accountId}
                    onChange={(e) => setAccountId(Number(e.target.value))}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                    <option value="">-- Выберите счёт --</option>
                    {accounts.map((acc) => (
                        <option key={acc.id} value={acc.id}>
                        {acc.name}
                        </option>
                    ))}
                </select>

            </div>
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
