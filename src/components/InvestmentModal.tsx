/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, TrendingUp, Wallet, Calendar, Type, Tag, Search } from 'lucide-react';
import { useStore } from '../store/StoreContext';
import { InvestmentType } from '../types';

interface InvestmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: any;
}

export const InvestmentModal: React.FC<InvestmentModalProps> = ({ isOpen, onClose, initialData }) => {
  const { addInvestment, updateInvestment, accounts } = useStore();
  const [formData, setFormData] = React.useState({
    name: '',
    type: 'mutual_funds' as InvestmentType,
    amount: '',
    date: new Date().toISOString().split('T')[0],
    accountId: accounts[0]?.id || '',
    notes: ''
  });

  React.useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        type: initialData.type,
        amount: initialData.amount.toString(),
        date: new Date(initialData.date).toISOString().split('T')[0],
        accountId: initialData.accountId,
        notes: initialData.notes || ''
      });
    } else {
      setFormData({
        name: '',
        type: 'mutual_funds',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        accountId: accounts[0]?.id || '',
        notes: ''
      });
    }
  }, [initialData, accounts, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      amount: parseFloat(formData.amount),
      date: new Date(formData.date).toISOString()
    };

    if (initialData?.id) {
      updateInvestment(initialData.id, payload);
    } else {
      addInvestment(payload);
    }
    onClose();
  };

  const types: { value: InvestmentType; label: string }[] = [
    { value: 'equities', label: 'Equities/Stocks' },
    { value: 'mutual_funds', label: 'Mutual Funds' },
    { value: 'gold', label: 'Gold' },
    { value: 'silver', label: 'Silver' },
    { value: 'recurring_deposit', label: 'Recurring Deposit' },
    { value: 'fixed_deposit', label: 'Fixed Deposit' },
    { value: 'crypto', label: 'Crypto' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-[#141414] border border-white/10 w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 pb-0 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {initialData ? 'Update Asset' : 'Add Investment'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-zinc-500 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest ml-1">Asset Name</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                <input
                  required
                  value={formData.name}
                  onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Apple Inc, Vanguard S&P 500..."
                  className="w-full bg-[#0a0a0a] border border-white/5 rounded-xl py-3 pl-11 pr-4 text-sm font-medium text-white focus:outline-none focus:border-blue-600 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest ml-1">Asset Type</label>
                <div className="relative">
                  <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                  <select
                    value={formData.type}
                    onChange={e => setFormData(p => ({ ...p, type: e.target.value as InvestmentType }))}
                    className="w-full bg-[#0a0a0a] border border-white/5 rounded-xl py-3 pl-11 pr-4 text-sm font-medium text-white focus:outline-none focus:border-blue-600 appearance-none"
                  >
                    {types.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
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
                    placeholder="0.00"
                    className="w-full bg-[#0a0a0a] border border-white/5 rounded-xl py-3 pl-11 pr-4 text-sm font-medium text-white focus:outline-none focus:border-blue-600 transition-all"
                  />
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
                    className="w-full bg-[#0a0a0a] border border-white/5 rounded-xl py-3 pl-11 pr-4 text-sm font-medium text-white focus:outline-none focus:border-blue-600 appearance-none"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest ml-1">Funding Account</label>
                <div className="relative">
                  <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                  <select
                    value={formData.accountId}
                    onChange={e => setFormData(p => ({ ...p, accountId: e.target.value }))}
                    className="w-full bg-[#0a0a0a] border border-white/5 rounded-xl py-3 pl-11 pr-4 text-sm font-medium text-white focus:outline-none focus:border-blue-600 appearance-none"
                  >
                    {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold transition-all hover:bg-blue-500 active:scale-[0.98] mt-4 shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2"
          >
            <TrendingUp className="w-5 h-5" />
            Commit Investment
          </button>
        </form>
      </div>
    </div>
  );
};
