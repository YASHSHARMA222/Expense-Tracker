/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AppData, Transaction, Account, Budget, RecurringTransaction, Category, Investment, RecurringInvestment } from '../types';
import { loadData, saveData, generateId } from '../lib/utils';

interface StoreContextType extends AppData {
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, tx: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  addAccount: (acc: Omit<Account, 'id'>) => void;
  updateAccount: (id: string, acc: Partial<Account>) => void;
  deleteAccount: (id: string) => void;
  addBudget: (budget: Omit<Budget, 'id'>) => void;
  updateBudget: (id: string, budget: Partial<Budget>) => void;
  deleteBudget: (id: string) => void;
  addRecurringTransaction: (rt: Omit<RecurringTransaction, 'id'>) => void;
  deleteRecurringTransaction: (id: string) => void;
  addCategory: (cat: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, cat: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  recurringInvestments: RecurringInvestment[];
  addRecurringInvestment: (ri: Omit<RecurringInvestment, 'id'>) => void;
  deleteRecurringInvestment: (id: string) => void;
  investments: Investment[];
  addInvestment: (inv: Omit<Investment, 'id'>) => void;
  deleteInvestment: (id: string) => void;
  importData: (data: Partial<AppData>) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<AppData>(loadData());

  useEffect(() => {
    saveData(data);
  }, [data]);

  const getNextExecutionDate = useCallback((current: string, frequency: string) => {
    const date = new Date(current);
    switch (frequency) {
      case 'daily': date.setDate(date.getDate() + 1); break;
      case 'weekly': date.setDate(date.getDate() + 7); break;
      case 'monthly': date.setMonth(date.getMonth() + 1); break;
      case 'yearly': date.setFullYear(date.getFullYear() + 1); break;
    }
    return date.toISOString();
  }, []);

  useEffect(() => {
    const now = new Date();
    let hasChanges = false;
    let nextData = { ...data };

    // Process Recurring Transactions
    const updatedRTs = (nextData.recurringTransactions || []).map(rt => {
      let currentRT = { ...rt };
      let rtHasChanges = false;
      while (new Date(currentRT.nextExecutionDate) <= now) {
        const txId = generateId();
        nextData.transactions = [
          {
            id: txId,
            amount: currentRT.amount,
            description: currentRT.description,
            accountId: currentRT.accountId,
            categoryId: currentRT.categoryId,
            date: currentRT.nextExecutionDate,
            type: currentRT.type,
            isRecurring: true
          },
          ...(nextData.transactions || [])
        ];

        nextData.accounts = (nextData.accounts || []).map(acc => {
          if (acc.id === currentRT.accountId) {
            return {
              ...acc,
              balance: acc.balance + (currentRT.type === 'income' ? currentRT.amount : -currentRT.amount)
            };
          }
          return acc;
        });

        currentRT.nextExecutionDate = getNextExecutionDate(currentRT.nextExecutionDate, currentRT.frequency);
        rtHasChanges = true;
      }
      if (rtHasChanges) hasChanges = true;
      return currentRT;
    });

    // Process Recurring Investments (SIPs)
    const updatedRIs = (nextData.recurringInvestments || []).map(ri => {
      let currentRI = { ...ri };
      let riHasChanges = false;
      while (new Date(currentRI.nextExecutionDate) <= now) {
        const invId = generateId();
        nextData.investments = [
          {
            id: invId,
            name: currentRI.name,
            type: currentRI.type,
            amount: currentRI.amount,
            date: currentRI.nextExecutionDate,
            accountId: currentRI.accountId
          },
          ...(nextData.investments || [])
        ];

        nextData.accounts = (nextData.accounts || []).map(acc => {
          if (acc.id === currentRI.accountId) {
            return { ...acc, balance: acc.balance - currentRI.amount };
          }
          return acc;
        });

        currentRI.nextExecutionDate = getNextExecutionDate(currentRI.nextExecutionDate, currentRI.frequency);
        riHasChanges = true;
      }
      if (riHasChanges) hasChanges = true;
      return currentRI;
    });

    if (hasChanges) {
      setData({
        ...nextData,
        recurringTransactions: updatedRTs,
        recurringInvestments: updatedRIs
      });
    }
  }, [data, getNextExecutionDate]);

  const addInvestment = useCallback((inv: Omit<Investment, 'id'>) => {
    setData(prev => ({
      ...prev,
      investments: [{ ...inv, id: generateId() }, ...(prev.investments || [])],
      accounts: (prev.accounts || []).map(acc => {
        if (acc.id === inv.accountId) {
          return { ...acc, balance: acc.balance - inv.amount };
        }
        return acc;
      })
    }));
  }, []);

  const deleteInvestment = useCallback((id: string) => {
    setData(prev => {
      const inv = prev.investments.find(i => i.id === id);
      if (!inv) return prev;
      return {
        ...prev,
        investments: prev.investments.filter(i => i.id !== id),
        accounts: prev.accounts.map(acc => {
          if (acc.id === inv.accountId) {
            return { ...acc, balance: acc.balance + inv.amount };
          }
          return acc;
        })
      };
    });
  }, []);

  const addTransaction = useCallback((tx: Omit<Transaction, 'id'>) => {
    setData(prev => ({
      ...prev,
      transactions: [{ ...tx, id: generateId() }, ...(prev.transactions || [])],
      accounts: (prev.accounts || []).map(acc => {
        if (acc.id === tx.accountId) {
          return {
            ...acc,
            balance: acc.balance + (tx.type === 'income' ? tx.amount : -tx.amount)
          };
        }
        return acc;
      })
    }));
  }, []);

  const updateTransaction = useCallback((id: string, updates: Partial<Transaction>) => {
    setData(prev => {
      const oldTx = prev.transactions.find(t => t.id === id);
      if (!oldTx) return prev;

      const newTx = { ...oldTx, ...updates };
      
      // Update account balances if amount or account or type changed
      let newAccounts = [...prev.accounts];
      if (oldTx.accountId !== newTx.accountId || oldTx.amount !== newTx.amount || oldTx.type !== newTx.type) {
        // Revert old tx impact
        newAccounts = newAccounts.map(acc => {
          if (acc.id === oldTx.accountId) {
            return {
              ...acc,
              balance: acc.balance - (oldTx.type === 'income' ? oldTx.amount : -oldTx.amount)
            };
          }
          return acc;
        });

        // Apply new tx impact
        newAccounts = newAccounts.map(acc => {
          if (acc.id === newTx.accountId) {
            return {
              ...acc,
              balance: acc.balance + (newTx.type === 'income' ? newTx.amount : -newTx.amount)
            };
          }
          return acc;
        });
      }

      return {
        ...prev,
        transactions: prev.transactions.map(t => t.id === id ? newTx : t),
        accounts: newAccounts
      };
    });
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setData(prev => {
      const tx = prev.transactions.find(t => t.id === id);
      if (!tx) return prev;

      return {
        ...prev,
        transactions: prev.transactions.filter(t => t.id !== id),
        accounts: prev.accounts.map(acc => {
          if (acc.id === tx.accountId) {
            return {
              ...acc,
              balance: acc.balance - (tx.type === 'income' ? tx.amount : -tx.amount)
            };
          }
          return acc;
        })
      };
    });
  }, []);

  const addAccount = useCallback((acc: Omit<Account, 'id'>) => {
    setData(prev => ({
      ...prev,
      accounts: [...prev.accounts, { ...acc, id: generateId() }]
    }));
  }, []);

  const updateAccount = useCallback((id: string, updates: Partial<Account>) => {
    setData(prev => ({
      ...prev,
      accounts: prev.accounts.map(acc => acc.id === id ? { ...acc, ...updates } : acc)
    }));
  }, []);

  const deleteAccount = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      accounts: prev.accounts.filter(acc => acc.id !== id),
      // Optionally handle transactions tied to this account
    }));
  }, []);

  const addBudget = useCallback((budget: Omit<Budget, 'id'>) => {
    setData(prev => ({
      ...prev,
      budgets: [...prev.budgets, { ...budget, id: generateId() }]
    }));
  }, []);

  const updateBudget = useCallback((id: string, updates: Partial<Budget>) => {
    setData(prev => ({
      ...prev,
      budgets: prev.budgets.map(b => b.id === id ? { ...b, ...updates } : b)
    }));
  }, []);

  const deleteBudget = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      budgets: prev.budgets.filter(b => b.id !== id)
    }));
  }, []);

  const addRecurringTransaction = useCallback((rt: Omit<RecurringTransaction, 'id'>) => {
    setData(prev => ({
      ...prev,
      recurringTransactions: [...prev.recurringTransactions, { ...rt, id: generateId() }]
    }));
  }, []);

  const deleteRecurringTransaction = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      recurringTransactions: prev.recurringTransactions.filter(rt => rt.id !== id)
    }));
  }, []);

  const addRecurringInvestment = useCallback((ri: Omit<RecurringInvestment, 'id'>) => {
    setData(prev => ({
      ...prev,
      recurringInvestments: [...(prev.recurringInvestments || []), { ...ri, id: generateId() }]
    }));
  }, []);

  const deleteRecurringInvestment = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      recurringInvestments: (prev.recurringInvestments || []).filter(ri => ri.id !== id)
    }));
  }, []);

  const addCategory = useCallback((cat: Omit<Category, 'id'>) => {
    setData(prev => ({
      ...prev,
      categories: [...prev.categories, { ...cat, id: generateId() }]
    }));
  }, []);

  const updateCategory = useCallback((id: string, updates: Partial<Category>) => {
    setData(prev => ({
      ...prev,
      categories: prev.categories.map(c => c.id === id ? { ...c, ...updates } : c)
    }));
  }, []);

  const deleteCategory = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      categories: prev.categories.filter(c => c.id !== id)
    }));
  }, []);

  const importData = useCallback((newData: Partial<AppData>) => {
    setData(prev => ({
      ...prev,
      ...newData,
      // Ensure we merge carefully if needed, but for now simple override
      settings: { ...prev.settings, ...newData.settings }
    }));
  }, []);

  return (
    <StoreContext.Provider value={{
      ...data,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      addAccount,
      updateAccount,
      deleteAccount,
      addBudget,
      updateBudget,
      deleteBudget,
      recurringInvestments: data.recurringInvestments || [],
      addRecurringInvestment,
      deleteRecurringInvestment,
      addRecurringTransaction,
      deleteRecurringTransaction,
      addCategory,
      updateCategory,
      deleteCategory,
      addInvestment,
      deleteInvestment,
      importData
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};
