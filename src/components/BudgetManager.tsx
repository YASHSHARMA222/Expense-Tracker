/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Trash2, 
  PieChart, 
  AlertTriangle,
  CheckCircle2,
  TrendingDown
} from 'lucide-react';
import { useStore } from '../store/StoreContext';
import { formatCurrency, cn } from '../lib/utils';
import { startOfMonth } from 'date-fns';

export const BudgetManager: React.FC = () => {
  const { budgets = [], categories = [], transactions = [], addBudget, deleteBudget } = useStore();
  const [isAdding, setIsAdding] = useState(false);
  const [newBudget, setNewBudget] = useState({
    categoryId: categories[0]?.id || '',
    limit: 0,
    period: 'monthly' as const
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addBudget(newBudget);
    setIsAdding(false);
  };

  const budgetStats = useMemo(() => {
    const start = startOfMonth(new Date());
    return budgets.map(b => {
      const spent = transactions
        .filter(t => t.categoryId === b.categoryId && t.type === 'expense' && new Date(t.date) >= start)
        .reduce((acc, curr) => acc + curr.amount, 0);
      const category = categories.find(c => c.id === b.categoryId);
      const rawPercent = (spent / b.limit) * 100;
      return { ...b, spent, category, rawPercent, percent: Math.min(100, rawPercent) };
    });
  }, [budgets, transactions, categories]);

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <span className="text-[10px] text-zinc-500 uppercase font-black tracking-[0.3em] ml-1">Financial Discipline</span>
          <h1 className="text-4xl font-black text-white tracking-tighter mt-2">Monthly Budgets</h1>
        </div>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl font-bold transition-all active:scale-[0.98] shadow-xl shadow-blue-600/20"
          >
            <Plus className="w-5 h-5" />
            Set Budget
          </button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-[#141414] p-8 rounded-[2rem] border border-white/5 animate-in slide-in-from-top-4 duration-500 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest ml-1">Category</label>
              <select
                required
                value={newBudget.categoryId}
                onChange={e => setNewBudget(p => ({ ...p, categoryId: e.target.value }))}
                className="w-full bg-[#0a0a0a] border border-white/5 rounded-xl py-3 px-4 text-sm font-medium text-white appearance-none focus:outline-none focus:border-blue-600"
              >
                {categories.filter(c => c.type === 'expense').map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest ml-1">Monthly Limit (INR)</label>
              <input
                type="number"
                required
                value={newBudget.limit}
                onChange={e => setNewBudget(p => ({ ...p, limit: parseFloat(e.target.value) }))}
                className="w-full bg-[#0a0a0a] border border-white/5 rounded-xl py-3 px-4 text-sm font-medium text-white focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>
          <div className="flex gap-4 justify-end">
            <button type="button" onClick={() => setIsAdding(false)} className="px-6 py-3 font-bold text-zinc-500 hover:text-white transition-colors">Cancel</button>
            <button type="submit" className="w-full sm:w-auto bg-white text-black px-10 py-4 rounded-2xl font-black transition-all hover:bg-zinc-200 active:scale-[0.98] shadow-xl shadow-white/5">Start Budget</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {budgetStats.map((b) => (
          <div key={b.id} className={cn(
            "p-8 rounded-[2.5rem] border transition-all space-y-6 group relative overflow-hidden",
            b.rawPercent >= 100 
              ? "bg-red-500/5 border-red-500/20 hover:border-red-500/40" 
              : b.rawPercent >= 85 
                ? "bg-amber-500/5 border-amber-500/20 hover:border-amber-500/40"
                : "bg-[#141414] border-white/5 hover:border-white/10"
          )}>
            <div className="flex items-start justify-between relative z-10">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white tracking-tight">{b.category?.name}</h3>
                  <div className={cn(
                    "px-2 py-0.5 rounded-full text-[10px] font-black tracking-tight",
                    b.rawPercent >= 100 ? "bg-red-500 text-white" : 
                    b.rawPercent >= 85 ? "bg-amber-500 text-black" : "bg-blue-600 text-white"
                  )}>
                    {Math.round(b.rawPercent)}%
                  </div>
                </div>
                <p className="text-xs text-zinc-500 font-medium">Monthly Threshold: {formatCurrency(b.limit)}</p>
              </div>
              <button 
                onClick={() => deleteBudget(b.id)}
                className="p-2 opacity-0 group-hover:opacity-100 hover:bg-red-500/10 text-zinc-600 hover:text-red-500 rounded-lg transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 relative z-10">
              <div className="flex justify-between items-end">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-zinc-600 uppercase font-black tracking-widest">Spent So Far</span>
                  <p className="text-xl font-bold text-white tracking-tighter">{formatCurrency(b.spent)}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-zinc-600 uppercase font-black tracking-widest">Remaining</span>
                  <p className={cn(
                    "text-xl font-bold tracking-tighter",
                    b.limit - b.spent < 0 ? "text-red-500" : "text-green-500"
                  )}>
                    {formatCurrency(b.limit - b.spent)}
                  </p>
                </div>
              </div>

              <div className="h-3 w-full bg-black/40 rounded-full overflow-hidden border border-white/5 p-0.5">
                <div 
                  className={cn(
                    "h-full rounded-full transition-all duration-1000 shadow-sm",
                    b.rawPercent >= 100 ? "bg-red-500 shadow-red-500/20" : 
                    b.rawPercent >= 85 ? "bg-amber-500 shadow-amber-500/20" : "bg-blue-500 shadow-blue-500/20"
                  )} 
                  style={{ width: `${b.percent}%` }} 
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                {b.rawPercent >= 100 ? (
                  <div className="flex items-center gap-1.5 text-red-500 text-[10px] font-black uppercase tracking-widest bg-red-500/10 px-2 py-1 rounded">
                    <AlertTriangle className="w-3 h-3" />
                    Limit Exceeded
                  </div>
                ) : b.rawPercent >= 85 ? (
                  <div className="flex items-center gap-1.5 text-amber-500 text-[10px] font-black uppercase tracking-widest bg-amber-500/10 px-2 py-1 rounded">
                    <AlertTriangle className="w-3 h-3" />
                    Near Limit
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-zinc-500 text-[10px] font-black uppercase tracking-widest bg-white/5 px-2 py-1 rounded">
                    <CheckCircle2 className="w-3 h-3" />
                    Within Limit
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
