/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { TransactionList } from './components/TransactionList';
import { ImportExport } from './components/ImportExport';
import { AccountManager } from './components/AccountManager';
import { CategoryManager } from './components/CategoryManager';
import { BudgetManager } from './components/BudgetManager';
import { RecurringManager } from './components/RecurringManager';
import { SIPManager } from './components/SIPManager';
import { InvestmentTracker } from './components/InvestmentTracker';
import { EntryModal } from './components/EntryModal';
import { LandingPage } from './components/LandingPage';
import { StoreProvider, useStore } from './store/StoreContext';
import { Wallet, PieChart, Repeat, Tag, ShieldAlert, Menu, Loader2 } from 'lucide-react';

const AppContent = () => {
  const { user, authLoading, sendVerificationEmail } = useStore();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<any>(null);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <LandingPage />;
  }

  const handleEdit = (tx: any) => {
    setEditingTx(tx);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTx(null);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onAddEntry={() => setIsModalOpen(true)} />;
      case 'transactions':
        return <TransactionList onEdit={handleEdit} />;
      case 'accounts':
        return <AccountManager />;
      case 'budgets':
        return <BudgetManager />;
      case 'investments':
        return <InvestmentTracker />;
      case 'sips':
        return <SIPManager />;
      case 'recurring':
        return <RecurringManager />;
      case 'categories':
        return <CategoryManager />;
      case 'import-export':
        return <ImportExport />;
      default:
        return <Dashboard onAddEntry={() => setIsModalOpen(true)} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#050505] font-sans selection:bg-blue-500/30">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      <main className="flex-1 p-4 md:p-10 max-w-[1500px] mx-auto w-full overflow-x-hidden">
        {user && !user.emailVerified && user.providerData.some(p => p.providerId === 'password') && (
          <div className="mb-6 bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-500" />
              <div className="text-zinc-300 text-xs font-medium">
                Your email is not verified. Some advanced security features are restricted.
              </div>
            </div>
            <button 
              onClick={() => sendVerificationEmail()}
              className="px-4 py-2 bg-amber-500/20 text-amber-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-500/30 transition-colors shrink-0"
            >
              Send Verification Link
            </button>
          </div>
        )}

        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between mb-8 pb-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black text-white tracking-tighter uppercase leading-none">Ledger</span>
              <span className="text-[8px] text-zinc-600 uppercase tracking-[0.2em] font-bold mt-0.5">Control Room</span>
            </div>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-3 bg-[#141414] border border-white/5 rounded-2xl text-zinc-400 hover:text-white transition-all active:scale-90 shadow-xl"
            aria-label="Menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {renderContent()}
      </main>

      <EntryModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        initialData={editingTx} 
      />
    </div>
  );
};


const PlaceholderTab = ({ name }: { name: string }) => {
  const icons: Record<string, any> = {
    accounts: Wallet,
    budgets: PieChart,
    recurring: Repeat,
    categories: Tag
  };
  const Icon = icons[name] || ShieldAlert;

  return (
    <div className="h-full flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in zoom-in-95 duration-500 py-20">
      <div className="w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center border border-white/5 shadow-2xl">
        <Icon className="w-10 h-10 text-zinc-500" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-white tracking-tight uppercase">{name} Module</h2>
        <p className="text-zinc-500 max-w-sm mx-auto leading-relaxed">
          The <span className="text-zinc-300 font-semibold">{name}</span> command center is currently being calibrated. Check back soon for full operational control.
        </p>
      </div>
      <div className="px-6 py-2 bg-blue-500/10 rounded-full border border-blue-500/20">
        <span className="text-[10px] text-blue-500 font-black uppercase tracking-[0.2em]">Developer Note: v1.0.4 - Alpha</span>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
