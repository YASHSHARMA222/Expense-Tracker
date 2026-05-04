/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState } from 'react';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Trash2, 
  Edit2, 
  ArrowUpRight, 
  ArrowDownRight,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useStore } from '../store/StoreContext';
import { formatCurrency, cn } from '../lib/utils';
import { format } from 'date-fns';

export const TransactionList: React.FC<{ onEdit: (tx: any) => void }> = ({ onEdit }) => {
  const { transactions, categories, accounts, deleteTransaction } = useStore();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'expense' | 'income'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter(tx => {
        const matchesSearch = tx.description.toLowerCase().includes(search.toLowerCase());
        const matchesType = filterType === 'all' || tx.type === filterType;
        return matchesSearch && matchesType;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, search, filterType]);

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="space-y-1">
          <span className="text-[10px] text-zinc-500 uppercase font-black tracking-[0.3em] ml-1">Ledger History</span>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Transaction Feed</h1>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
            <input 
              type="text"
              placeholder="Search history..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-[#141414] border border-white/5 rounded-2xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-blue-600/50 transition-all w-full placeholder:text-zinc-700 font-medium"
            />
          </div>
          <div className="flex bg-[#141414] p-1.5 rounded-2xl border border-white/5">
            {['all', 'expense', 'income'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type as any)}
                className={cn(
                  "px-6 py-2 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest",
                  filterType === type ? "bg-white text-black shadow-lg" : "text-zinc-600 hover:text-zinc-400"
                )}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-[#141414] rounded-3xl border border-white/5 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Transaction</th>
                <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Category</th>
                <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Account</th>
                <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Date</th>
                <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] text-right">Amount</th>
                <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.02]">
              {paginatedTransactions.map((tx) => {
                const category = categories.find(c => c.id === tx.categoryId);
                const account = accounts.find(a => a.id === tx.accountId);
                
                return (
                  <tr key={tx.id} className="group hover:bg-white/[0.01] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300",
                          tx.type === 'income' ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                        )}>
                          {tx.type === 'income' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                        </div>
                        <span className="text-sm font-semibold text-white tracking-tight">{tx.description}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: category?.color }} />
                        <span className="text-sm text-zinc-400 font-medium">{category?.name || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs px-2 py-1 bg-white/5 rounded-md text-zinc-400 font-mono border border-white/5">
                        {account?.name || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-zinc-500 font-medium">
                      {format(new Date(tx.date), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={cn(
                        "text-sm font-bold tracking-tight px-3 py-1 rounded-full",
                        tx.type === 'income' ? "text-green-500" : "text-white"
                      )}>
                        {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => onEdit(tx)}
                          className="p-2 hover:bg-blue-500/10 text-zinc-600 hover:text-blue-500 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => deleteTransaction(tx.id)}
                          className="p-2 hover:bg-red-500/10 text-zinc-600 hover:text-red-500 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {paginatedTransactions.map((tx) => {
          const category = categories.find(c => c.id === tx.categoryId);
          const account = accounts.find(a => a.id === tx.accountId);
          
          return (
            <div key={tx.id} className="bg-[#141414] p-5 rounded-2xl border border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center",
                    tx.type === 'income' ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                  )}>
                    {tx.type === 'income' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white tracking-tight">{tx.description}</h4>
                    <p className="text-[10px] text-zinc-500 font-medium">{format(new Date(tx.date), 'MMM dd, yyyy')}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={cn(
                    "text-sm font-black",
                    tx.type === 'income' ? "text-green-500" : "text-white"
                  )}>
                    {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                  </p>
                  <p className="text-[10px] text-zinc-600 font-mono mt-0.5">{account?.name}</p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-white/[0.02]">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: category?.color }} />
                  <span className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">{category?.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => onEdit(tx)} className="p-2 bg-white/5 rounded-lg text-zinc-400"><Edit2 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => deleteTransaction(tx.id)} className="p-2 bg-red-500/10 rounded-lg text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {paginatedTransactions.length === 0 && (
        <div className="py-20 text-center text-zinc-600 bg-[#141414] rounded-3xl border border-white/5">
          <div className="flex flex-col items-center gap-3">
            <Filter className="w-10 h-10 opacity-20" />
            <span className="text-xs uppercase tracking-widest font-black">No transactions found</span>
          </div>
        </div>
      )}

      {totalPages > 1 && (
        <div className="bg-[#141414] rounded-3xl border border-white/5 overflow-hidden shadow-xl">
          <div className="px-6 py-4 flex items-center justify-between">
            <span className="text-xs text-zinc-600 font-bold tracking-tight uppercase">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 hover:bg-white/5 text-zinc-500 disabled:opacity-30 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 hover:bg-white/5 text-zinc-500 disabled:opacity-30 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
