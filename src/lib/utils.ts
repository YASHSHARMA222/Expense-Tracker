/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { v4 as uuidv4 } from 'uuid';
import { AppData, Category, Account } from '../types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: 'Food & Dining', icon: 'Utensils', color: '#ef4444', type: 'expense' },
  { id: '2', name: 'Transport', icon: 'Car', color: '#3b82f6', type: 'expense' },
  { id: '3', name: 'Shopping', icon: 'ShoppingBag', color: '#ec4899', type: 'expense' },
  { id: '4', name: 'Entertainment', icon: 'Film', color: '#8b5cf6', type: 'expense' },
  { id: '5', name: 'Bills & Utilities', icon: 'Zap', color: '#f59e0b', type: 'expense' },
  { id: '6', name: 'Health', icon: 'HeartPulse', color: '#10b981', type: 'expense' },
  { id: '7', name: 'Salary', icon: 'Wallet', color: '#10b981', type: 'income' },
  { id: '8', name: 'Investment', icon: 'TrendingUp', color: '#3b82f6', type: 'income' },
  { id: '9', name: 'Other', icon: 'MoreHorizontal', color: '#6b7280', type: 'expense' },
];

export const DEFAULT_ACCOUNTS: Account[] = [
  { id: 'acc-1', name: 'Main Savings', type: 'bank', balance: 50000, color: '#3b82f6' },
  { id: 'acc-2', name: 'Credit Card', type: 'card', balance: -5000, color: '#ef4444', lastFour: '4242' },
];

const STORAGE_KEY = 'ledger_data_v1';

export const loadData = (): AppData => {
  const saved = localStorage.getItem(STORAGE_KEY);
  
  const today = new Date();
  const sampleTransactions = [
    {
      id: 'tx-1',
      amount: 1250,
      description: 'Grocery Shopping',
      categoryId: '1',
      accountId: 'acc-1',
      date: today.toISOString(),
      type: 'expense' as const
    },
    {
      id: 'tx-2',
      amount: 45000,
      description: 'Salary Credit',
      categoryId: '7',
      accountId: 'acc-1',
      date: today.toISOString(),
      type: 'income' as const
    },
    {
      id: 'tx-3',
      amount: 800,
      description: 'Monthly OTT Subscription',
      categoryId: '4',
      accountId: 'acc-2',
      date: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
      type: 'expense' as const
    }
  ];

  const defaultData: AppData = {
    transactions: sampleTransactions,
    accounts: DEFAULT_ACCOUNTS,
    categories: DEFAULT_CATEGORIES,
    budgets: [],
    recurringTransactions: [],
    recurringInvestments: [],
    investments: [
      { id: 'inv-1', name: 'Nifty 50 Index Fund', type: 'mutual_funds', amount: 10000, date: new Date().toISOString(), accountId: 'acc-1' },
      { id: 'inv-2', name: 'Digital Gold', type: 'gold', amount: 5000, date: new Date().toISOString(), accountId: 'acc-1' }
    ],
    settings: {
      currency: 'INR',
      theme: 'dark',
    },
  };

  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return {
        ...defaultData,
        ...parsed,
        transactions: parsed.transactions || [],
        accounts: parsed.accounts || DEFAULT_ACCOUNTS,
        categories: parsed.categories || DEFAULT_CATEGORIES,
        budgets: parsed.budgets || [],
        recurringTransactions: parsed.recurringTransactions || [],
        recurringInvestments: parsed.recurringInvestments || [],
        investments: parsed.investments || [],
        settings: { ...defaultData.settings, ...(parsed.settings || {}) }
      };
    } catch (e) {
      console.error('Failed to parse saved data', e);
    }
  }
  
  return defaultData;
};

export const saveData = (data: AppData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const formatCurrency = (amount: number, currency: string = 'INR') => {
  const safeAmount = isNaN(amount) || amount === undefined || amount === null ? 0 : amount;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0,
  }).format(safeAmount);
};

export const generateId = () => uuidv4();
