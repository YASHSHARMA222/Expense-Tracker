/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Repeat, 
  Plus, 
  Trash2, 
  Calendar, 
  Wallet,
  TrendingUp,
  Clock,
  ArrowRight,
  Edit2
} from 'lucide-react';
import { useStore } from '../store/StoreContext';
import { formatCurrency, cn } from '../lib/utils';
import { SIPModal } from './SIPModal';

export const SIPManager: React.FC = () => {
  const { recurringInvestments = [], deleteRecurringInvestment } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSIP, setEditingSIP] = useState<any>(null);

  const handleEdit = (si: any) => {
    setEditingSIP(si);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingSIP(null);
  };

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
    mutual_funds: 'bg-indigo-500',
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
          <span className="text-[10px] text-zinc-500 uppercase font-black tracking-[0.3em] ml-1">Systematic Planning</span>
          <h1 className="text-4xl font-black text-white tracking-tighter mt-2 uppercase">SIP & RD Plans</h1>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-xl shadow-indigo-600/20 active:scale-[0.98]"
        >
          <Plus className="w-5 h-5" />
          Setup New SIP
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {recurringInvestments.map((si) => (
          <div key={si.id} className="bg-[#141414] p-6 rounded-[2rem] border border-white/5 flex flex-col group hover:border-white/10 transition-all shadow-xl">
            <div className="flex items-start justify-between mb-6">
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg",
                typeColors[si.type] || "bg-zinc-600"
              )}>
                <Repeat className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                <button 
                  onClick={() => handleEdit(si)}
                  className="p-2 hover:bg-blue-500/10 rounded-lg text-zinc-700 hover:text-blue-500 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => deleteRecurringInvestment(si.id)}
                  className="p-2 hover:bg-red-500/10 rounded-lg text-zinc-700 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-bold text-white tracking-tight">{si.name}</h4>
                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mt-1">
                  {typeLabels[si.type]} • {si.frequency}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                <div className="space-y-1">
                  <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest flex items-center gap-1">
                    <Wallet className="w-3 h-3" /> Installment
                  </span>
                  <p className="font-bold text-white">{formatCurrency(si.amount)}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Next Run
                  </span>
                  <p className="font-bold text-white text-xs">
                    {new Date(si.nextExecutionDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                  </p>
                </div>
              </div>

              <div className="mt-4 p-3 bg-white/5 rounded-xl flex items-center justify-between group-hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-zinc-500" />
                  <span className="text-[10px] text-zinc-400 font-medium">Started {new Date(si.startDate).toLocaleDateString()}</span>
                </div>
                <TrendingUp className="w-4 h-4 text-zinc-700" />
              </div>
            </div>
          </div>
        ))}

        {recurringInvestments.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-zinc-700 border-2 border-dashed border-white/5 rounded-[2.5rem]">
            <Repeat className="w-12 h-12 opacity-10 mb-4" />
            <p className="text-xs font-bold uppercase tracking-widest">No Active SIP Plans</p>
            <p className="text-[10px] text-zinc-600 mt-2 max-w-[200px] text-center">Setup automated investments to grow your wealth systematically.</p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="mt-6 text-indigo-500 font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all"
            >
              Start Your First SIP <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      <SIPModal 
        isOpen={isModalOpen}
        onClose={handleClose}
        initialData={editingSIP}
      />
    </div>
  );
};
