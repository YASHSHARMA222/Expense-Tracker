/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Repeat, 
  ArrowRight,
  Calendar,
  Clock
} from 'lucide-react';
import { useStore } from '../store/StoreContext';
import { formatCurrency, cn } from '../lib/utils';
import { format } from 'date-fns';

export const RecurringManager: React.FC = () => {
  const { recurringTransactions = [], categories = [], accounts = [], addRecurringTransaction, deleteRecurringTransaction } = useStore();
  const [isAdding, setIsAdding] = useState(false);
  const [newRT, setNewRT] = useState({
    amount: 0,
    description: '',
    categoryId: categories[0]?.id || '',
    accountId: accounts[0]?.id || '',
    type: 'expense' as const,
    frequency: 'monthly' as const,
    startDate: format(new Date(), 'yyyy-MM-dd'),
    nextExecutionDate: format(new Date(), 'yyyy-MM-dd')
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addRecurringTransaction(newRT);
    setIsAdding(false);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <span className="text-[10px] text-zinc-500 uppercase font-black tracking-[0.3em] ml-1">Automation</span>
          <h1 className="text-4xl font-black text-white tracking-tighter mt-2">Recurring Items</h1>
        </div>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-xl shadow-blue-600/20 active:scale-[0.98]"
          >
            <Plus className="w-5 h-5" />
            Add Schedule
          </button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-[#141414] p-8 rounded-[2rem] border border-white/5 animate-in slide-in-from-top-4 duration-500 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest ml-1">Amount</label>
              <input
                type="number"
                required
                value={newRT.amount}
                onChange={e => setNewRT(p => ({ ...p, amount: parseFloat(e.target.value) }))}
                className="w-full bg-[#0a0a0a] border border-white/5 rounded-xl py-3 px-4 text-sm font-medium text-white focus:outline-none focus:border-blue-600"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest ml-1">Frequency</label>
              <select
                value={newRT.frequency}
                onChange={e => setNewRT(p => ({ ...p, frequency: e.target.value as any }))}
                className="w-full bg-[#0a0a0a] border border-white/5 rounded-xl py-3 px-4 text-sm font-medium text-white appearance-none focus:outline-none focus:border-blue-600"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest ml-1">Description</label>
              <input
                required
                value={newRT.description}
                onChange={e => setNewRT(p => ({ ...p, description: e.target.value }))}
                placeholder="Netflix, Gym, Rent..."
                className="w-full bg-[#0a0a0a] border border-white/5 rounded-xl py-3 px-4 text-sm font-medium text-white focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>
          <div className="flex gap-4 justify-end">
            <button type="button" onClick={() => setIsAdding(false)} className="px-6 py-3 font-bold text-zinc-500 hover:text-white transition-colors">Cancel</button>
            <button type="submit" className="w-full sm:w-auto bg-white text-black px-10 py-4 rounded-2xl font-black transition-all hover:bg-zinc-200 active:scale-[0.98] shadow-xl shadow-white/5">Start Schedule</button>
          </div>
        </form>
      )}

      {/* Desktop Table */}
      <div className="hidden lg:block bg-[#141414] rounded-3xl border border-white/5 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5">
              <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Subscription</th>
              <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Frequency</th>
              <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Next Due</th>
              <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] text-right">Amount</th>
              <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.02]">
            {recurringTransactions.map((rt) => (
              <tr key={rt.id} className="group hover:bg-white/[0.01] transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                      <Repeat className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-white tracking-tight">{rt.description}</span>
                      <p className="text-[10px] text-zinc-600 font-bold uppercase mt-0.5 tracking-widest">{categories.find(c => c.id === rt.categoryId)?.name}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs px-2 py-1 bg-white/5 rounded-md text-zinc-400 font-mono border border-white/5 uppercase tracking-tighter">
                    Every {rt.frequency}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs text-zinc-500 font-medium">
                  {format(new Date(rt.nextExecutionDate), 'MMM dd, yyyy')}
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-sm font-bold text-white tracking-tight">
                    {formatCurrency(rt.amount)}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <button 
                    onClick={() => deleteRecurringTransaction(rt.id)}
                    className="p-2 opacity-0 group-hover:opacity-100 hover:bg-red-500/10 text-zinc-600 hover:text-red-500 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4">
        {recurringTransactions.map((rt) => (
          <div key={rt.id} className="bg-[#141414] p-6 rounded-[2rem] border border-white/5 space-y-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                  <Repeat className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-black text-white tracking-tight leading-tight">{rt.description}</h4>
                  <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mt-0.5">{rt.frequency}ly</p>
                </div>
              </div>
              <p className="text-lg font-black text-white tracking-tighter">{formatCurrency(rt.amount)}</p>
            </div>
            <div className="flex items-center justify-between pt-5 border-t border-white/[0.05]">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-zinc-600" />
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Next: {format(new Date(rt.nextExecutionDate), 'MMM dd')}</span>
              </div>
              <button 
                onClick={() => deleteRecurringTransaction(rt.id)}
                className="p-3 bg-red-500/10 rounded-xl text-red-500 active:scale-95 transition-transform"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {recurringTransactions.length === 0 && (
        <div className="py-20 text-center text-zinc-600 bg-[#141414] rounded-3xl border border-white/5">
          <p className="text-xs uppercase tracking-widest font-black opacity-30">No recurring items</p>
        </div>
      )}
    </div>
  );
};
