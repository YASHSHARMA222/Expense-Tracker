/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  Plus, 
  PieChart, 
  ArrowUpRight, 
  Trash2, 
  Edit2,
  Briefcase,
  AlertCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { useStore } from '../store/StoreContext';
import { formatCurrency, cn } from '../lib/utils';
import { InvestmentModal } from './InvestmentModal';

export const InvestmentTracker: React.FC = () => {
  const { investments = [], deleteInvestment } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInvestment, setEditingInvestment] = useState<any>(null);

  const handleEdit = (inv: any) => {
    setEditingInvestment(inv);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingInvestment(null);
  };

  const stats = useMemo(() => {
    const total = investments.reduce((acc, curr) => acc + curr.amount, 0);
    const byType = investments.reduce((acc, curr) => {
      const amount = Number(curr.amount) || 0;
      acc[curr.type] = (acc[curr.type] || 0) + amount;
      return acc;
    }, {} as Record<string, number>);

    return { total, byType };
  }, [investments]);

  const typeLabels: Record<string, string> = {
    equities: 'Stocks',
    mutual_funds: 'Mutual Funds',
    fixed_deposit: 'Fixed Deposits',
    gold: 'Gold',
    silver: 'Silver',
    recurring_deposit: 'Recurring Deposit',
    crypto: 'Crypto',
    other: 'Other'
  };

  const typeColors: Record<string, string> = {
    equities: 'bg-blue-500',
    mutual_funds: 'bg-purple-500',
    fixed_deposit: 'bg-amber-500',
    gold: 'bg-yellow-500',
    silver: 'bg-zinc-400',
    recurring_deposit: 'bg-emerald-500',
    crypto: 'bg-orange-500',
    other: 'bg-zinc-500'
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <span className="text-[10px] text-zinc-500 uppercase font-black tracking-[0.3em] ml-1">Portfolio Tracker</span>
          <h1 className="text-4xl font-black text-white tracking-tighter mt-2 uppercase">Investments</h1>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-xl shadow-blue-600/20 active:scale-[0.98]"
        >
          <Plus className="w-5 h-5" />
          Add Asset
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 bg-[#141414] p-8 rounded-[2.5rem] border border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Net Worth (Invested)</span>
            <div className="p-2 bg-blue-500/10 rounded-xl text-blue-500">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-8">
            <h2 className="text-5xl font-black text-white tracking-tighter">
              {formatCurrency(stats.total)}
            </h2>
            <p className="text-zinc-500 text-sm mt-2 flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              Portfolio tracking started {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>

        <div className="bg-[#141414] p-8 rounded-[2.5rem] border border-white/5">
          <div className="flex items-center justify-between mb-8">
            <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Distribution</span>
            <PieChart className="w-4 h-4 text-zinc-600" />
          </div>
          <div className="space-y-4">
            {Object.entries(stats.byType).map(([type, amountValue]) => {
              const amount = Number(amountValue);
              const percentage = stats.total > 0 ? (amount / stats.total) * 100 : 0;
              return (
                <div key={type} className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest items-center">
                    <span className="text-zinc-400">{typeLabels[type] || type}</span>
                    <span className="text-white">{Math.round(percentage)}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
                    <div 
                      className={cn("h-full rounded-full", typeColors[type] || "bg-zinc-500")}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {investments.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8 text-zinc-700">
                <AlertCircle className="w-8 h-8 opacity-20 mb-2" />
                <p className="text-[10px] font-bold uppercase">No data</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest ml-1">Asset Inventory</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {investments.map((inv) => (
            <div key={inv.id} className="bg-[#0a0a0a] p-6 rounded-3xl border border-white/5 flex flex-col group hover:border-white/10 transition-all shadow-xl">
              <div className="flex items-start justify-between mb-6">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110",
                  typeColors[inv.type] || "bg-zinc-600"
                )}>
                  <ArrowUpRight className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                  <button 
                    onClick={() => handleEdit(inv)}
                    className="p-2 hover:bg-blue-500/10 rounded-lg text-zinc-700 hover:text-blue-500 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => deleteInvestment(inv.id)}
                    className="p-2 hover:bg-red-500/10 rounded-lg text-zinc-700 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-bold text-white tracking-tight">{inv.name}</h4>
                  <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest mt-1">
                    {typeLabels[inv.type]}
                  </p>
                </div>
                <div className="pt-4 border-t border-white/5 flex items-end justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Invested Value</span>
                    <p className="text-xl font-black text-white">{formatCurrency(inv.amount)}</p>
                  </div>
                  <div className="p-2 bg-white/5 rounded-lg text-zinc-500">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          ))}
          {investments.length === 0 && (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-zinc-700 border-2 border-dashed border-white/5 rounded-[2.5rem]">
              <TrendingUp className="w-12 h-12 opacity-10 mb-4" />
              <p className="text-xs font-bold uppercase tracking-widest">Empty Portfolio</p>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="mt-6 text-blue-500 font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all"
              >
                Buy your first asset <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>

      <InvestmentModal 
        isOpen={isModalOpen}
        onClose={handleClose}
        initialData={editingInvestment}
      />
    </div>
  );
};
