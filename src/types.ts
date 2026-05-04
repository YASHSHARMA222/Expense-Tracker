/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Currency = 'INR' | 'USD' | 'EUR';

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: 'expense' | 'income';
}

export interface Account {
  id: string;
  name: string;
  type: 'bank' | 'card' | 'cash' | 'wallet';
  balance: number;
  color: string;
  lastFour?: string;
}

export interface Transaction {
  id: string;
  amount: number;
  categoryId: string;
  accountId: string;
  date: string; // ISO string
  description: string;
  type: 'expense' | 'income';
  isRecurring?: boolean;
}

export interface Budget {
  id: string;
  categoryId: string;
  limit: number;
  period: 'monthly' | 'weekly';
}

export interface RecurringTransaction {
  id: string;
  amount: number;
  categoryId: string;
  accountId: string;
  description: string;
  type: 'expense' | 'income';
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: string;
  nextExecutionDate: string;
}

export type InvestmentType = 'equities' | 'mutual_funds' | 'fixed_deposit' | 'gold' | 'silver' | 'recurring_deposit' | 'crypto' | 'other';

export interface Investment {
  id: string;
  name: string;
  type: InvestmentType;
  amount: number;
  date: string;
  accountId: string;
  notes?: string;
}

export interface RecurringInvestment {
  id: string;
  name: string;
  type: InvestmentType;
  amount: number;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  accountId: string;
  startDate: string;
  nextExecutionDate: string;
}

export interface AppData {
  transactions: Transaction[];
  accounts: Account[];
  categories: Category[];
  budgets: Budget[];
  recurringTransactions: RecurringTransaction[];
  recurringInvestments: RecurringInvestment[];
  investments: Investment[];
  settings: {
    currency: Currency;
    theme: 'dark' | 'light';
  };
}
