/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Wallet, 
  CreditCard, 
  Building2, 
  Smartphone,
  Banknote
} from 'lucide-react';
import { useStore } from '../store/StoreContext';
import { formatCurrency, cn } from '../lib/utils';

export const AccountManager: React.FC = () => {
  const { accounts, addAccount, updateAccount, deleteAccount } = useStore();
  const [isAdding, setIsAdding] = useState(false);
  const [newAccount, setNewAccount] = useState({
    name: '',
    type: 'bank' as const,
    balance: 0,
    color: '#3b82f6',
    lastFour: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addAccount(newAccount);
    setIsAdding(false);
    setNewAccount({ name: '', type: 'bank', balance: 0, color: '#3b82f6', lastFour: '' });
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'bank': return Building2;
      case 'card': return CreditCard;
      case 'cash': return Banknote;
      case 'wallet': return Smartphone;
      default: return Wallet;
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <span className="text-[10px] text-zinc-500 uppercase font-black tracking-[0.3em] ml-1">Liquid Assets</span>
          <h1 className="text-4xl font-black text-white tracking-tighter mt-2">Accounts</h1>
        </div>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl font-bold transition-all active:scale-[0.98] shadow-xl shadow-blue-600/20"
          >
            <Plus className="w-5 h-5" />
            Add Account
          </button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-[#141414] p-8 rounded-[2rem] border border-white/5 animate-in slide-in-from-top-4 duration-500 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest ml-1">Account Name</label>
              <input
                required
                value={newAccount.name}
                onChange={e => setNewAccount(p => ({ ...p, name: e.target.value }))}
                placeholder="HDFC Bank, Amex..."
                className="w-full bg-[#0a0a0a] border border-white/5 rounded-xl py-3 px-4 text-sm font-medium text-white focus:outline-none focus:border-blue-600 transition-all placeholder:text-zinc-800"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest ml-1">Type</label>
              <select
                value={newAccount.type}
                onChange={e => setNewAccount(p => ({ ...p, type: e.target.value as any }))}
                className="w-full bg-[#0a0a0a] border border-white/5 rounded-xl py-3 px-4 text-sm font-medium text-white appearance-none focus:outline-none focus:border-blue-600"
              >
                <option value="bank">Bank Account</option>
                <option value="card">Credit Card</option>
                <option value="cash">Physical Cash</option>
                <option value="wallet">Digital Wallet</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest ml-1">Initial Balance</label>
              <input
                type="number"
                value={newAccount.balance}
                onChange={e => setNewAccount(p => ({ ...p, balance: parseFloat(e.target.value) }))}
                className="w-full bg-[#0a0a0a] border border-white/5 rounded-xl py-3 px-4 text-sm font-medium text-white focus:outline-none focus:border-blue-600"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest ml-1">Last 4 Digits</label>
              <input
                value={newAccount.lastFour}
                onChange={e => setNewAccount(p => ({ ...p, lastFour: e.target.value }))}
                placeholder="Optional"
                className="w-full bg-[#0a0a0a] border border-white/5 rounded-xl py-3 px-4 text-sm font-medium text-white focus:outline-none focus:border-blue-600 transition-all placeholder:text-zinc-800"
              />
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <button 
              type="button" 
              onClick={() => setIsAdding(false)}
              className="px-6 py-3 rounded-xl font-bold text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="bg-white text-black px-8 py-3 rounded-xl font-bold hover:bg-zinc-200 transition-all active:scale-95"
            >
              Create Account
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map((acc) => {
          const Icon = getIcon(acc.type);
          return (
            <div 
              key={acc.id}
              className="bg-[#141414] p-8 rounded-[2rem] border border-white/5 group hover:border-white/10 transition-all duration-300 relative overflow-hidden"
            >
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-start justify-between mb-8">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center",
                    acc.type === 'card' ? "bg-purple-500/10 text-purple-500" : "bg-blue-500/10 text-blue-500"
                  )}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 hover:bg-white/5 rounded-lg text-zinc-600 hover:text-zinc-400">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => deleteAccount(acc.id)}
                      className="p-2 hover:bg-red-500/5 rounded-lg text-zinc-600 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-white tracking-tight">{acc.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">{acc.type}</span>
                    {acc.lastFour && (
                      <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded font-mono text-zinc-400 border border-white/5">•••• {acc.lastFour}</span>
                    )}
                  </div>
                </div>
                <div className="mt-8 pt-6 border-t border-white/5">
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-bold text-zinc-500">Balance:</span>
                    <span className={cn(
                      "text-2xl font-black tracking-tighter",
                      acc.balance < 0 ? "text-red-500" : "text-white"
                    )}>
                      {formatCurrency(acc.balance)}
                    </span>
                  </div>
                </div>
              </div>
              <div 
                className="absolute top-0 right-0 w-32 h-32 blur-[80px] -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"
                style={{ backgroundColor: acc.color + '20' }} 
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
