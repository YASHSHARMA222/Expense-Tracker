import React, { useState, useEffect } from 'react';
import { X, Wallet, CreditCard, Building2, Smartphone, Banknote, Tag } from 'lucide-react';
import { useStore } from '../store/StoreContext';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: any;
}

export const AccountModal: React.FC<AccountModalProps> = ({ isOpen, onClose, initialData }) => {
  const { addAccount, updateAccount } = useStore();
  const [formData, setFormData] = useState({
    name: '',
    type: 'bank' as 'bank' | 'card' | 'cash' | 'wallet',
    balance: '',
    color: '#3b82f6',
    lastFour: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        type: initialData.type,
        balance: initialData.balance.toString(),
        color: initialData.color || '#3b82f6',
        lastFour: initialData.lastFour || ''
      });
    } else {
      setFormData({
        name: '',
        type: 'bank',
        balance: '',
        color: '#3b82f6',
        lastFour: ''
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      balance: parseFloat(formData.balance) || 0
    };

    if (initialData?.id) {
      updateAccount(initialData.id, payload);
    } else {
      addAccount(payload);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-[#141414] border border-white/10 w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 pb-0 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {initialData ? 'Update Account' : 'New Account'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-zinc-500 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest ml-1">Account Name</label>
              <input
                required
                value={formData.name}
                onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                placeholder="HDFC Bank, Salary, Petty Cash..."
                className="w-full bg-[#0a0a0a] border border-white/5 rounded-xl py-3 px-4 text-sm font-medium text-white focus:outline-none focus:border-blue-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest ml-1">Type</label>
                <select
                  value={formData.type}
                  onChange={e => setFormData(p => ({ ...p, type: e.target.value as any }))}
                  className="w-full bg-[#0a0a0a] border border-white/5 rounded-xl py-3 px-4 text-sm font-medium text-white appearance-none focus:outline-none focus:border-blue-600"
                >
                  <option value="bank">Bank Account</option>
                  <option value="card">Credit Card</option>
                  <option value="cash">Physical Cash</option>
                  <option value="wallet">Digital Wallet</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest ml-1">Balance</label>
                <input
                  type="number"
                  required
                  step="0.01"
                  value={formData.balance}
                  onChange={e => setFormData(p => ({ ...p, balance: e.target.value }))}
                  className="w-full bg-[#0a0a0a] border border-white/5 rounded-xl py-3 px-4 text-sm font-medium text-white focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest ml-1">Color</label>
                <input
                  type="color"
                  value={formData.color}
                  onChange={e => setFormData(p => ({ ...p, color: e.target.value }))}
                  className="w-full h-11 bg-[#0a0a0a] border border-white/5 rounded-xl p-1 focus:outline-none focus:border-blue-600"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest ml-1">Last 4 Digits</label>
                <input
                  value={formData.lastFour}
                  onChange={e => setFormData(p => ({ ...p, lastFour: e.target.value }))}
                  placeholder="Optional"
                  className="w-full bg-[#0a0a0a] border border-white/5 rounded-xl py-3 px-4 text-sm font-medium text-white focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold transition-all hover:bg-blue-500 active:scale-[0.98] mt-4 shadow-xl shadow-blue-600/20"
          >
            {initialData ? 'Update Account' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
};
