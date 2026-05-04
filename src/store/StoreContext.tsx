/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { query } from 'firebase/firestore';
import { AppData, Transaction, Account, Budget, RecurringTransaction, Category, Investment, RecurringInvestment, Currency } from '../types';
import { generateId } from '../lib/utils';
import { auth, signInWithGoogle, signOut } from '../lib/firebase';
import { firebaseService } from '../services/firebaseService';

interface StoreContextType extends AppData {
  user: User | null;
  authLoading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  addTransaction: (tx: Omit<Transaction, 'id'>) => Promise<void>;
  updateTransaction: (id: string, tx: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  addAccount: (acc: Omit<Account, 'id'>) => Promise<void>;
  updateAccount: (id: string, acc: Partial<Account>) => Promise<void>;
  deleteAccount: (id: string) => Promise<void>;
  addBudget: (budget: Omit<Budget, 'id'>) => Promise<void>;
  updateBudget: (id: string, budget: Partial<Budget>) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;
  addRecurringTransaction: (rt: Omit<RecurringTransaction, 'id'>) => Promise<void>;
  deleteRecurringTransaction: (id: string) => Promise<void>;
  addCategory: (cat: Omit<Category, 'id'>) => Promise<void>;
  updateCategory: (id: string, cat: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  addRecurringInvestment: (ri: Omit<RecurringInvestment, 'id'>) => Promise<void>;
  updateRecurringInvestment: (id: string, ri: Partial<RecurringInvestment>) => Promise<void>;
  deleteRecurringInvestment: (id: string) => Promise<void>;
  addInvestment: (inv: Omit<Investment, 'id'>) => Promise<void>;
  updateInvestment: (id: string, inv: Partial<Investment>) => Promise<void>;
  deleteInvestment: (id: string) => Promise<void>;
  importData: (data: Partial<AppData>) => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const initialData: AppData = {
  transactions: [],
  accounts: [],
  categories: [],
  budgets: [],
  recurringTransactions: [],
  recurringInvestments: [],
  investments: [],
  settings: {
    currency: 'INR',
    theme: 'dark'
  }
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [data, setData] = useState<AppData>(initialData);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
    });
    return unsubscribe;
  }, []);

  // Subscriptions
  useEffect(() => {
    if (!user) {
      setData(initialData);
      return;
    }

    const userId = user.uid;
    const unsubscribes = [
      firebaseService.subscribe<Transaction>(`users/${userId}/transactions`, [], (transactions) => {
        const sorted = transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setData(prev => ({ ...prev, transactions: sorted }));
      }),
      firebaseService.subscribe<Account>(`users/${userId}/accounts`, [], (accounts) => {
        setData(prev => ({ ...prev, accounts }));
      }),
      firebaseService.subscribe<Category>(`users/${userId}/categories`, [], (categories) => {
        setData(prev => ({ ...prev, categories }));
      }),
      firebaseService.subscribe<Budget>(`users/${userId}/budgets`, [], (budgets) => {
        setData(prev => ({ ...prev, budgets }));
      }),
      firebaseService.subscribe<RecurringTransaction>(`users/${userId}/recurringTransactions`, [], (recurringTransactions) => {
        setData(prev => ({ ...prev, recurringTransactions }));
      }),
      firebaseService.subscribe<Investment>(`users/${userId}/investments`, [], (investments) => {
        const sorted = investments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setData(prev => ({ ...prev, investments: sorted }));
      }),
      firebaseService.subscribe<RecurringInvestment>(`users/${userId}/recurringInvestments`, [], (recurringInvestments) => {
        setData(prev => ({ ...prev, recurringInvestments }));
      }),
      firebaseService.subscribe<any>(`users/${userId}/settings`, [], (settingsArr) => {
        if (settingsArr.length > 0) {
          setData(prev => ({ ...prev, settings: settingsArr[0] }));
        }
      })
    ];

    return () => unsubscribes.forEach(unsub => unsub());
  }, [user]);

  const login = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const logout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

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

  // Process Recurring Items (Local Logic shifted to Firestore sync)
  useEffect(() => {
    if (!user) return;
    const now = new Date();
    
    // This is a simple client-side processor for recurring items.
    // In a real app, this should be a Cloud Function.
    const processRecurring = async () => {
      let hasChanged = false;
      
      // Keep track of account balance updates locally during this cycle to batch correctly
      const tempAccounts = [...data.accounts];

      for (const rt of data.recurringTransactions) {
        let currentRT = { ...rt };
        let count = 0;
        while (new Date(currentRT.nextExecutionDate) <= now && count < 12) { // Guard against infinite loop
          const newTx: Transaction = {
            id: generateId(),
            amount: currentRT.amount,
            description: currentRT.description,
            accountId: currentRT.accountId,
            categoryId: currentRT.categoryId,
            date: currentRT.nextExecutionDate,
            type: currentRT.type,
            isRecurring: true
          };
          
          await firebaseService.set(`users/${user.uid}/transactions`, newTx.id, newTx);
          
          const accIndex = tempAccounts.findIndex(a => a.id === currentRT.accountId);
          if (accIndex !== -1) {
            tempAccounts[accIndex].balance += (currentRT.type === 'income' ? currentRT.amount : -currentRT.amount);
          }

          currentRT.nextExecutionDate = getNextExecutionDate(currentRT.nextExecutionDate, currentRT.frequency);
          count++;
          hasChanged = true;
        }
        if (count > 0) {
          await firebaseService.update(`users/${user.uid}/recurringTransactions`, rt.id, { nextExecutionDate: currentRT.nextExecutionDate });
        }
      }

      for (const ri of data.recurringInvestments) {
        let currentRI = { ...ri };
        let count = 0;
        while (new Date(currentRI.nextExecutionDate) <= now && count < 12) {
          const newInv: Investment = {
            id: generateId(),
            name: currentRI.name,
            type: currentRI.type,
            amount: currentRI.amount,
            date: currentRI.nextExecutionDate,
            accountId: currentRI.accountId
          };

          await firebaseService.set(`users/${user.uid}/investments`, newInv.id, newInv);

          const accIndex = tempAccounts.findIndex(a => a.id === currentRI.accountId);
          if (accIndex !== -1) {
            tempAccounts[accIndex].balance -= currentRI.amount;
          }

          currentRI.nextExecutionDate = getNextExecutionDate(currentRI.nextExecutionDate, currentRI.frequency);
          count++;
          hasChanged = true;
        }
        if (count > 0) {
          await firebaseService.update(`users/${user.uid}/recurringInvestments`, ri.id, { nextExecutionDate: currentRI.nextExecutionDate });
        }
      }

      if (hasChanged) {
        // Sync account balances
        for (const acc of tempAccounts) {
          const original = data.accounts.find(a => a.id === acc.id);
          if (original && original.balance !== acc.balance) {
            await firebaseService.update(`users/${user.uid}/accounts`, acc.id, { balance: acc.balance });
          }
        }
      }
    };

    const timer = setTimeout(processRecurring, 5000); // Wait a bit for initial sync
    return () => clearTimeout(timer);
  }, [user, data.recurringTransactions, data.recurringInvestments, getNextExecutionDate]);

  const addTransaction = async (tx: Omit<Transaction, 'id'>) => {
    if (!user) return;
    const id = generateId();
    await firebaseService.set(`users/${user.uid}/transactions`, id, { ...tx, id });
    
    const account = data.accounts.find(a => a.id === tx.accountId);
    if (account) {
      const newBalance = account.balance + (tx.type === 'income' ? tx.amount : -tx.amount);
      await firebaseService.update(`users/${user.uid}/accounts`, account.id, { balance: newBalance });
    }
  };

  const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
    if (!user) return;
    const oldTx = data.transactions.find(t => t.id === id);
    if (!oldTx) return;

    const newTx = { ...oldTx, ...updates };
    await firebaseService.update(`users/${user.uid}/transactions`, id, updates);

    // Update account balances if amount or account or type changed
    if (updates.accountId !== undefined || updates.amount !== undefined || updates.type !== undefined) {
      // Revert old impact
      const oldAcc = data.accounts.find(a => a.id === oldTx.accountId);
      if (oldAcc) {
        const revertBalance = oldAcc.balance - (oldTx.type === 'income' ? oldTx.amount : -oldTx.amount);
        // Wait, if oldAcc and newAcc are same, we need to be careful.
        // In Firestore we should probably fetch the latest balance or do it incrementally.
        // For simplicity we'll use state-based calculation.
        
        let targetAcc = data.accounts.find(a => a.id === newTx.accountId);
        if (oldTx.accountId === newTx.accountId) {
          const adjBalance = oldAcc.balance - (oldTx.type === 'income' ? oldTx.amount : -oldTx.amount) + (newTx.type === 'income' ? newTx.amount : -newTx.amount);
          await firebaseService.update(`users/${user.uid}/accounts`, oldTx.accountId, { balance: adjBalance });
        } else {
          // Different accounts
          if (oldAcc) await firebaseService.update(`users/${user.uid}/accounts`, oldAcc.id, { balance: revertBalance });
          if (targetAcc) {
            const applyBalance = targetAcc.balance + (newTx.type === 'income' ? newTx.amount : -newTx.amount);
            await firebaseService.update(`users/${user.uid}/accounts`, targetAcc.id, { balance: applyBalance });
          }
        }
      }
    }
  };

  const deleteTransaction = async (id: string) => {
    if (!user) return;
    const tx = data.transactions.find(t => t.id === id);
    if (!tx) return;

    await firebaseService.delete(`users/${user.uid}/transactions`, id);
    const account = data.accounts.find(a => a.id === tx.accountId);
    if (account) {
      const newBalance = account.balance - (tx.type === 'income' ? tx.amount : -tx.amount);
      await firebaseService.update(`users/${user.uid}/accounts`, account.id, { balance: newBalance });
    }
  };

  const addAccount = async (acc: Omit<Account, 'id'>) => {
    if (!user) return;
    const id = generateId();
    await firebaseService.set(`users/${user.uid}/accounts`, id, { ...acc, id });
  };

  const updateAccount = async (id: string, updates: Partial<Account>) => {
    if (!user) return;
    await firebaseService.update(`users/${user.uid}/accounts`, id, updates);
  };

  const deleteAccount = async (id: string) => {
    if (!user) return;
    await firebaseService.delete(`users/${user.uid}/accounts`, id);
  };

  const addBudget = async (budget: Omit<Budget, 'id'>) => {
    if (!user) return;
    const id = generateId();
    await firebaseService.set(`users/${user.uid}/budgets`, id, { ...budget, id });
  };

  const updateBudget = async (id: string, updates: Partial<Budget>) => {
    if (!user) return;
    await firebaseService.update(`users/${user.uid}/budgets`, id, updates);
  };

  const deleteBudget = async (id: string) => {
    if (!user) return;
    await firebaseService.delete(`users/${user.uid}/budgets`, id);
  };

  const addRecurringTransaction = async (rt: Omit<RecurringTransaction, 'id'>) => {
    if (!user) return;
    const id = generateId();
    await firebaseService.set(`users/${user.uid}/recurringTransactions`, id, { ...rt, id });
  };

  const deleteRecurringTransaction = async (id: string) => {
    if (!user) return;
    await firebaseService.delete(`users/${user.uid}/recurringTransactions`, id);
  };

  const updateRecurringTransaction = async (id: string, updates: Partial<RecurringTransaction>) => {
    if (!user) return;
    await firebaseService.update(`users/${user.uid}/recurringTransactions`, id, updates);
  };

  const addRecurringInvestment = async (ri: Omit<RecurringInvestment, 'id'>) => {
    if (!user) return;
    const id = generateId();
    await firebaseService.set(`users/${user.uid}/recurringInvestments`, id, { ...ri, id });
  };

  const updateRecurringInvestment = async (id: string, updates: Partial<RecurringInvestment>) => {
    if (!user) return;
    await firebaseService.update(`users/${user.uid}/recurringInvestments`, id, updates);
  };

  const deleteRecurringInvestment = async (id: string) => {
    if (!user) return;
    await firebaseService.delete(`users/${user.uid}/recurringInvestments`, id);
  };

  const addCategory = async (cat: Omit<Category, 'id'>) => {
    if (!user) return;
    const id = generateId();
    await firebaseService.set(`users/${user.uid}/categories`, id, { ...cat, id });
  };

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    if (!user) return;
    await firebaseService.update(`users/${user.uid}/categories`, id, updates);
  };

  const deleteCategory = async (id: string) => {
    if (!user) return;
    await firebaseService.delete(`users/${user.uid}/categories`, id);
  };

  const addInvestment = async (inv: Omit<Investment, 'id'>) => {
    if (!user) return;
    const id = generateId();
    await firebaseService.set(`users/${user.uid}/investments`, id, { ...inv, id });
    
    const account = data.accounts.find(a => a.id === inv.accountId);
    if (account) {
      await firebaseService.update(`users/${user.uid}/accounts`, account.id, { balance: account.balance - inv.amount });
    }
  };

  const updateInvestment = async (id: string, updates: Partial<Investment>) => {
    if (!user) return;
    const oldInv = data.investments.find(i => i.id === id);
    if (!oldInv) return;

    await firebaseService.update(`users/${user.uid}/investments`, id, updates);

    if (updates.amount !== undefined || updates.accountId !== undefined) {
      const newInv = { ...oldInv, ...updates };
      const oldAcc = data.accounts.find(a => a.id === oldInv.accountId);
      const newAcc = data.accounts.find(a => a.id === newInv.accountId);

      if (oldInv.accountId === newInv.accountId) {
        if (oldAcc) {
          const adj = oldAcc.balance + oldInv.amount - newInv.amount;
          await firebaseService.update(`users/${user.uid}/accounts`, oldAcc.id, { balance: adj });
        }
      } else {
        if (oldAcc) await firebaseService.update(`users/${user.uid}/accounts`, oldAcc.id, { balance: oldAcc.balance + oldInv.amount });
        if (newAcc) await firebaseService.update(`users/${user.uid}/accounts`, newAcc.id, { balance: newAcc.balance - newInv.amount });
      }
    }
  };

  const deleteInvestment = async (id: string) => {
    if (!user) return;
    const inv = data.investments.find(i => i.id === id);
    if (!inv) return;

    await firebaseService.delete(`users/${user.uid}/investments`, id);
    const account = data.accounts.find(a => a.id === inv.accountId);
    if (account) {
      await firebaseService.update(`users/${user.uid}/accounts`, account.id, { balance: account.balance + inv.amount });
    }
  };

  const importData = async (newData: Partial<AppData>) => {
    if (!user) return;
    // Import logic would need to write all items to Firestore.
    // For now keep it as a mass write if needed.
  };

  const value = {
    ...data,
    user,
    authLoading,
    login,
    logout,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addAccount,
    updateAccount,
    deleteAccount,
    addBudget,
    updateBudget,
    deleteBudget,
    addRecurringTransaction,
    updateRecurringTransaction,
    deleteRecurringTransaction,
    addCategory,
    updateCategory,
    deleteCategory,
    addRecurringInvestment,
    updateRecurringInvestment,
    deleteRecurringInvestment,
    addInvestment,
    updateInvestment,
    deleteInvestment,
    importData
  };

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};
