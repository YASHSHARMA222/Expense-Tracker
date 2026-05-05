/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Wallet, 
  CreditCard, 
  TrendingUp,
  Plus
} from 'lucide-react';
import { useStore } from '../store/StoreContext';
import { formatCurrency, cn } from '../lib/utils';
import { startOfMonth, endOfMonth, eachDayOfInterval, format, subMonths, isSameDay, isSameMonth } from 'date-fns';

export const Dashboard: React.FC<{ onAddEntry: () => void }> = ({ onAddEntry }) => {
  const { transactions = [], accounts = [], categories = [], investments = [] } = useStore();

  const totalAccountBalance = useMemo(() => 
    accounts.reduce((acc, curr) => acc + curr.balance, 0), 
  [accounts]);

  const totalInvestmentBalance = useMemo(() => 
    investments.reduce((acc, curr) => acc + curr.amount, 0),
  [investments]);

  const netWorth = useMemo(() => 
    totalAccountBalance + totalInvestmentBalance,
  [totalAccountBalance, totalInvestmentBalance]);

  const monthlySpent = useMemo(() => {
    const start = startOfMonth(new Date());
    const end = endOfMonth(new Date());
    return transactions
      .filter(t => t.type === 'expense' && new Date(t.date) >= start && new Date(t.date) <= end)
      .reduce((acc, curr) => acc + curr.amount, 0);
  }, [transactions]);

  const monthlyIncome = useMemo(() => {
    const start = startOfMonth(new Date());
    const end = endOfMonth(new Date());
    return transactions
      .filter(t => t.type === 'income' && new Date(t.date) >= start && new Date(t.date) <= end)
      .reduce((acc, curr) => acc + curr.amount, 0);
  }, [transactions]);

  const averageDailySpend = useMemo(() => {
    const start = startOfMonth(new Date());
    const today = new Date();
    const daysPassed = Math.max(1, today.getDate());
    return (daysPassed > 0 ? monthlySpent / daysPassed : 0) || 0;
  }, [monthlySpent]);

  const chartData = useMemo(() => {
    const last6Months = Array.from({ length: 6 }).map((_, i) => subMonths(new Date(), 5 - i));
    return last6Months.map(month => {
      const monthTx = transactions.filter(t => isSameMonth(new Date(t.date), month));
      const income = monthTx.filter(t => t.type === 'income').reduce((a, b) => a + b.amount, 0);
      const expense = monthTx.filter(t => t.type === 'expense').reduce((a, b) => a + b.amount, 0);
      return {
        name: format(month, 'MMM yyyy'),
        income,
        expense
      };
    });
  }, [transactions]);

  const categoryData = useMemo(() => {
    const start = startOfMonth(new Date());
    const currentMonthExpenses = transactions.filter(t => t.type === 'expense' && new Date(t.date) >= start);
    
    const catMap: Record<string, number> = {};
    currentMonthExpenses.forEach(t => {
      catMap[t.categoryId] = (catMap[t.categoryId] || 0) + t.amount;
    });

    return Object.entries(catMap)
      .map(([id, amount]) => ({
        name: categories.find(c => c.id === id)?.name || 'Other',
        value: amount || 0,
        color: categories.find(c => c.id === id)?.color || '#6b7280'
      }))
      .sort((a, b) => b.value - a.value);
  }, [transactions, categories]);

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <span className="text-[10px] text-zinc-500 uppercase font-black tracking-[0.3em] ml-1">Overview</span>
          <h1 className="text-4xl font-black text-white tracking-tighter mt-2">Dashboard</h1>
        </div>
        <button 
          onClick={onAddEntry}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl font-bold transition-all active:scale-[0.98] shadow-xl shadow-blue-600/20"
        >
          <Plus className="w-5 h-5" />
          Add Entry
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          label="Net Worth" 
          value={netWorth} 
          icon={<TrendingUp className="w-5 h-5" />} 
          subtitle="Total Financial Power"
          trend={null}
        />
        <StatCard 
          label="Cash Balance" 
          value={totalAccountBalance} 
          icon={<Wallet className="w-5 h-5" />} 
          subtitle={`${accounts.length} Accounts`}
          trend={null}
        />
        <StatCard 
          label="Invested Value" 
          value={totalInvestmentBalance} 
          icon={<TrendingUp className="w-5 h-5" />} 
          subtitle={`${investments.length} Active Investments`}
          trend="income"
        />
        <StatCard 
          label="This Month Spent" 
          value={monthlySpent} 
          icon={<ArrowDownRight className="w-5 h-5" />} 
          subtitle={`${transactions.filter(t => isSameMonth(new Date(t.date), new Date())).length} txns`}
          trend="expense"
        />
        <StatCard 
          label="This Month Income" 
          value={monthlyIncome} 
          icon={<ArrowUpRight className="w-5 h-5" />} 
          subtitle={`Net: ${formatCurrency(monthlyIncome - monthlySpent)}`}
          trend="income"
        />
        <StatCard 
          label="Avg / Day" 
          value={averageDailySpend} 
          icon={<TrendingUp className="w-5 h-5" />} 
          subtitle="This month spend"
          trend={null}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-[#141414] rounded-3xl p-8 border border-white/5 shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-[10px] text-zinc-600 uppercase font-bold tracking-widest">6-Month Trend</span>
              <h2 className="text-xl font-bold text-white mt-1">Income vs Expense</h2>
            </div>
            <TrendingUp className="w-5 h-5 text-zinc-700" />
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#525252" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  dy={10}
                />
                <YAxis 
                  stroke="#525252" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(val) => `₹${val/1000}k`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#141414', border: '1px solid #ffffff10', borderRadius: '12px' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="income" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorIncome)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="expense" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorExpense)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#141414] rounded-3xl p-8 border border-white/5 shadow-xl flex flex-col">
          <div className="mb-8">
            <span className="text-[10px] text-zinc-600 uppercase font-bold tracking-widest">This Month</span>
            <h2 className="text-xl font-bold text-white mt-1">By Category</h2>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#141414', border: '1px solid #ffffff10', borderRadius: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full mt-6 space-y-3">
              {categoryData.slice(0, 4).map((cat, i) => (
                <div key={i} className="flex items-center justify-between group cursor-default">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span className="text-sm text-zinc-400 group-hover:text-zinc-200 transition-colors uppercase tracking-tight font-medium">{cat.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-white tracking-tight">{formatCurrency(cat.value)}</span>
                </div>
              ))}
              {categoryData.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-zinc-600 py-10">
                  <PieChart className="w-8 h-8 opacity-20 mb-2" />
                  <span className="text-xs uppercase tracking-widest font-bold">No Data</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon, subtitle, trend }: any) => (
  <div className="bg-[#141414] p-6 rounded-3xl border border-white/5 shadow-xl group hover:border-white/10 transition-all duration-300 relative overflow-hidden flex flex-col justify-between min-h-[160px]">
    <div className="flex items-start justify-between relative z-10 w-full">
      <div className="space-y-1">
        <span className="text-[10px] text-zinc-600 uppercase font-black tracking-[0.15em] block">{label}</span>
      </div>
      <div className={cn(
        "p-2.5 rounded-xl transition-transform group-hover:scale-110 duration-500",
        trend === 'income' ? "bg-green-500/10 text-green-500" : 
        trend === 'expense' ? "bg-red-500/10 text-red-500" :
        "bg-blue-500/10 text-blue-500"
      )}>
        {icon}
      </div>
    </div>

    <div className="relative z-10 mt-auto">
      <div className="flex items-baseline gap-1">
        <h3 className="text-3xl lg:text-4xl font-black text-white tracking-tighter">
          {formatCurrency(value)}
        </h3>
      </div>
      <p className="text-xs text-zinc-500 font-medium mt-1 truncate">{subtitle}</p>
    </div>

    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[80px] -mr-16 -mt-16 group-hover:bg-blue-500/10 transition-colors duration-700" />
  </div>
);
