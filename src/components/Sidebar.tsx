/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  LayoutDashboard, 
  ReceiptIndianRupee, 
  Wallet, 
  PieChart, 
  Repeat, 
  Settings, 
  Download, 
  FileUp,
  Tag,
  TrendingUp,
  Calendar,
  X,
  LogOut,
  User as UserIcon
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useStore } from '../store/StoreContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onClose?: () => void;
  isOpen?: boolean;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'transactions', label: 'Expenses', icon: ReceiptIndianRupee },
  { id: 'accounts', label: 'Accounts', icon: Wallet },
  { id: 'budgets', label: 'Budgets', icon: PieChart },
  { id: 'investments', label: 'Portfolio', icon: TrendingUp },
  { id: 'sips', label: 'SIP & RD', icon: Repeat },
  { id: 'recurring', label: 'Recurring Exp.', icon: Calendar },
  { id: 'categories', label: 'Categories', icon: Tag },
  { id: 'import-export', label: 'Import / Export', icon: Download },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onClose, isOpen }) => {
  const { user, logout } = useStore();

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      <aside className={cn(
        "w-64 bg-[#0a0a0a] border-r border-white/5 flex flex-col h-screen sticky top-0 z-50 transition-transform duration-300 lg:translate-x-0 lg:flex",
        "fixed lg:sticky",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="p-6 flex items-center justify-between border-b border-white/5 lg:border-none">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Wallet className="text-white w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-white tracking-tight leading-none uppercase italic">Ledger</span>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold mt-1">Control Room</span>
            </div>
          </div>
          {onClose && (
            <button onClick={onClose} className="lg:hidden p-2 text-zinc-500 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (onClose) onClose();
              }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group text-sm font-medium",
                activeTab === item.id 
                  ? "bg-[#1a1a1a] text-white shadow-sm" 
                  : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5",
                activeTab === item.id ? "text-blue-500" : "text-zinc-600 group-hover:text-zinc-400"
              )} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 space-y-4 border-t border-white/5 mt-auto">
          {user && (
            <div className="p-4 rounded-2xl bg-[#141414] border border-white/5">
              <div className="flex items-center gap-3 mb-4">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || 'User'} className="w-10 h-10 rounded-full border border-white/10" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-500">
                    <UserIcon className="w-5 h-5" />
                  </div>
                )}
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] font-black text-white uppercase truncate leading-none">{user.displayName || 'Operator'}</span>
                  <span className="text-[8px] text-zinc-600 truncate mt-1">{user.email}</span>
                </div>
              </div>
              <button 
                onClick={() => logout()}
                className="w-full flex items-center justify-center gap-2 p-3 bg-red-500/10 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500/20 transition-all active:scale-95"
              >
                <LogOut className="w-3 h-3" />
                Dismount
              </button>
            </div>
          )}

          <div className="p-4 rounded-2xl bg-[#141414]/50 flex flex-col gap-1 border border-white/5">
            <span className="text-[10px] text-zinc-600 uppercase font-bold tracking-widest">Global Status</span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-tighter">v2.0.4-STABLE</span>
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

