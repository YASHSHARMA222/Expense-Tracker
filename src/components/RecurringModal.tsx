import React, { useState, useEffect } from 'react';
import { X, Calendar, Wallet, Tag, Search, Repeat } from 'lucide-react';
import { useStore } from '../store/StoreContext';
import { format } from 'date-fns';

interface RecurringModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: any;
}

export const RecurringModal: React.FC<RecurringModalProps> = ({ isOpen, onClose, initialData }) => {
  const { addRecurringTransaction, updateRecurringTransaction, categories, accounts } = useStore();
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    categoryId: '',
    accountId: '',
    type: 'expense' as 'expense' | 'income',
    frequency: 'monthly' as const,
    startDate: format(new Date(), 'yyyy-MM-dd'),
    nextExecutionDate: format(new Date(), 'yyyy-MM-dd')
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        amount: initialData.amount.toString(),
        description: initialData.description,
        categoryId: initialData.categoryId,
        accountId: initialData.accountId,
        type: initialData.type,
        frequency: initialData.frequency,
        startDate: format(new Date(initialData.startDate), 'yyyy-MM-dd'),
        nextExecutionDate: format(new Date(initialData.nextExecutionDate), 'yyyy-MM-dd')
      });
    } else {
      setFormData({
        amount: '',
        description: '',
        categoryId: categories[0]?.id || '',
        accountId: accounts[0]?.id || '',
        type: 'expense',
        frequency: 'monthly',
        startDate: format(new Date(), 'yyyy-MM-dd'),
        nextExecutionDate: format(new Date(), 'yyyy-MM-dd')
      });
    }
  }, [initialData, categories, accounts, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      amount: parseFloat(formData.amount),
      startDate: new Date(formData.startDate).toISOString(),
      nextExecutionDate: initialData ? initialData.nextExecutionDate : new Date(formData.startDate).toISOString()
    };

    if (initialData?.id) {
      await updateRecurringTransaction(initialData.id, payload);
    } else {
      await addRecurringTransaction(payload);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-[#141414] border border-white/10 w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 pb-0 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {initialData ? 'Update Schedule' : 'New Schedule'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-zinc-500 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest ml-1">Type</label>
                <select
                  value={formData.type}
                  onChange={e => setFormData(p => ({ ...p, type: e.target.value as any }))}
                  className="w-full bg-[#0a0a0a] border border-white/5 rounded-xl py-3 px-4 text-sm font-medium text-white appearance-none focus:outline-none focus:border-blue-600"
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest ml-1">Frequency</label>
                <select
                  value={formData.frequency}
                  onChange={e => setFormData(p => ({ ...p, frequency: e.target.value as any }))}
                  className="w-full bg-[#0a0a0a] border border-white/5 rounded-xl py-3 px-4 text-sm font-medium text-white appearance-none focus:outline-none focus:border-blue-600"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest ml-1">Amount</label>
              <div className="relative">
                <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                <input
                  type="number"
                  required
                  step="0.01"
                  value={formData.amount}
                  onChange={e => setFormData(p => ({ ...p, amount: e.target.value }))}
                  className="w-full bg-[#0a0a0a] border border-white/5 rounded-xl py-3 pl-11 pr-4 text-sm font-medium text-white focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest ml-1">Description</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                <input
                  required
                  value={formData.description}
                  onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                  placeholder="Rent, Netflix, Salary..."
                  className="w-full bg-[#0a0a0a] border border-white/5 rounded-xl py-3 pl-11 pr-4 text-sm font-medium text-white focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest ml-1">Category</label>
                <select
                  required
                  value={formData.categoryId}
                  onChange={e => setFormData(p => ({ ...p, categoryId: e.target.value }))}
                  className="w-full bg-[#0a0a0a] border border-white/5 rounded-xl py-3 px-4 text-sm font-medium text-white focus:outline-none focus:border-blue-600"
                >
                  {categories.filter(c => c.type === formData.type).map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest ml-1">Account</label>
                <select
                  required
                  value={formData.accountId}
                  onChange={e => setFormData(p => ({ ...p, accountId: e.target.value }))}
                  className="w-full bg-[#0a0a0a] border border-white/5 rounded-xl py-3 px-4 text-sm font-medium text-white focus:outline-none focus:border-blue-600"
                >
                  {accounts.map(acc => (
                    <option key={acc.id} value={acc.id}>{acc.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest ml-1">Start Date</label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={e => setFormData(p => ({ ...p, startDate: e.target.value }))}
                className="w-full bg-[#0a0a0a] border border-white/5 rounded-xl py-3 px-4 text-sm font-medium text-white focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold transition-all hover:bg-blue-500 active:scale-[0.98] mt-4 shadow-xl shadow-blue-600/20"
          >
            {initialData ? 'Update Schedule' : 'Start Schedule'}
          </button>
        </form>
      </div>
    </div>
  );
};
