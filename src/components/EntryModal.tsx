/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X, Plus, CreditCard, Tag, Calendar, Type, Settings2 } from 'lucide-react';
import { useStore } from '../store/StoreContext';
import { cn } from '../lib/utils';
import { format } from 'date-fns';
import { CategoryManagementModal } from './CategoryManagementModal';

interface EntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: any;
}

export const EntryModal: React.FC<EntryModalProps> = ({ isOpen, onClose, initialData }) => {
  const { categories, accounts, addTransaction, updateTransaction } = useStore();
  const [isCatManageOpen, setIsCatManageOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    amount: '',
    categoryId: '',
    accountId: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    description: '',
    type: 'expense' as 'expense' | 'income'
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        amount: initialData.amount.toString(),
        categoryId: initialData.categoryId,
        accountId: initialData.accountId,
        date: format(new Date(initialData.date), 'yyyy-MM-dd'),
        description: initialData.description,
        type: initialData.type
      });
    } else {
      setFormData({
        amount: '',
        categoryId: categories[0]?.id || '',
        accountId: accounts[0]?.id || '',
        date: format(new Date(), 'yyyy-MM-dd'),
        description: '',
        type: 'expense'
      });
    }
  }, [initialData, categories, accounts, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(formData.amount);
    const payload = {
      ...formData,
      amount: isNaN(amount) ? 0 : amount,
    };

    if (initialData?.id) {
      updateTransaction(initialData.id, payload);
    } else {
      addTransaction(payload);
    }
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-[#141414] border border-white/10 w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 pb-0 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {initialData ? 'Update Entry' : 'New Entry'}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-full text-zinc-500 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="flex bg-[#0a0a0a] p-1.5 rounded-2xl border border-white/5">
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, type: 'expense' }))}
              className={cn(
                "flex-1 py-3 rounded-xl text-sm font-bold tracking-tight transition-all",
                formData.type === 'expense' ? "bg-red-500/10 text-red-500 shadow-sm" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, type: 'income' }))}
              className={cn(
                "flex-1 py-3 rounded-xl text-sm font-bold tracking-tight transition-all",
                formData.type === 'income' ? "bg-green-500/10 text-green-500 shadow-sm" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              Income
            </button>
          </div>

          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest ml-1">Amount</label>
              <div className="relative group">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl font-bold text-zinc-600 group-focus-within:text-blue-500 transition-colors tracking-tighter">₹</span>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.amount}
                  onChange={e => setFormData(p => ({ ...p, amount: e.target.value }))}
                  placeholder="0.00"
                  className="w-full bg-[#0a0a0a] border border-white/5 rounded-2xl py-5 pl-12 pr-6 text-3xl font-bold text-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all placeholder:text-zinc-800 tracking-tighter"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest ml-1">Account</label>
                <div className="relative">
                  <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                  <select
                    required
                    value={formData.accountId}
                    onChange={e => setFormData(p => ({ ...p, accountId: e.target.value }))}
                    className="w-full bg-[#0a0a0a] border border-white/5 rounded-xl py-3 pl-11 pr-4 text-sm font-medium text-white appearance-none focus:outline-none focus:border-blue-600"
                  >
                    {accounts.map(acc => (
                      <option key={acc.id} value={acc.id}>{acc.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Category</label>
                  <button 
                    type="button"
                    onClick={() => setIsCatManageOpen(true)}
                    className="text-[10px] text-blue-500 hover:text-blue-400 font-black uppercase tracking-widest flex items-center gap-1 transition-colors"
                  >
                    <Settings2 className="w-3 h-3" />
                    Manage
                  </button>
                </div>
                <div className="relative">
                  <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                  <select
                    required
                    value={formData.categoryId}
                    onChange={e => setFormData(p => ({ ...p, categoryId: e.target.value }))}
                    className="w-full bg-[#0a0a0a] border border-white/5 rounded-xl py-3 pl-11 pr-4 text-sm font-medium text-white appearance-none focus:outline-none focus:border-blue-600"
                  >
                    {categories
                      .filter(c => c.type === formData.type)
                      .map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))
                    }
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest ml-1">Date</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={e => setFormData(p => ({ ...p, date: e.target.value }))}
                    className="w-full bg-[#0a0a0a] border border-white/5 rounded-xl py-3 pl-11 pr-4 text-sm font-medium text-white focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest ml-1">Description</label>
                <div className="relative">
                  <Type className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                  <input
                    type="text"
                    required
                    value={formData.description}
                    onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                    placeholder="Lunch, Salary, Fuel..."
                    className="w-full bg-[#0a0a0a] border border-white/5 rounded-xl py-3 pl-11 pr-4 text-sm font-medium text-white focus:outline-none focus:border-blue-600 placeholder:text-zinc-700"
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-white text-black py-4 rounded-2xl font-bold transition-all hover:bg-zinc-200 active:scale-[0.98] mt-4 shadow-xl shadow-white/5"
          >
            {initialData ? 'Update Transaction' : 'Save Transaction'}
          </button>
        </form>
      </div>
    </div>
    <CategoryManagementModal 
      isOpen={isCatManageOpen}
      onClose={() => setIsCatManageOpen(false)}
    />
  </>
);
};
