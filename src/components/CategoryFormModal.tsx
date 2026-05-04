/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X, Tag, Palette, Type } from 'lucide-react';
import { useStore } from '../store/StoreContext';
import { cn } from '../lib/utils';
import { Category } from '../types';

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Category | null;
}

export const CategoryFormModal: React.FC<CategoryFormModalProps> = ({ isOpen, onClose, initialData }) => {
  const { addCategory, updateCategory } = useStore();
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'expense' as 'expense' | 'income',
    color: '#3b82f6',
    icon: 'Tag'
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        type: initialData.type,
        color: initialData.color,
        icon: initialData.icon
      });
    } else {
      setFormData({
        name: '',
        type: 'expense',
        color: '#3b82f6',
        icon: 'Tag'
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (initialData) {
      updateCategory(initialData.id, formData);
    } else {
      addCategory(formData);
    }
    onClose();
  };

  const colors = [
    '#ef4444', '#f97316', '#f59e0b', '#10b981', '#06b6d4', 
    '#3b82f6', '#6366f1', '#8b5cf6', '#d946ef', '#ec4899',
    '#6b7280', '#000000'
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-[#141414] border border-white/10 w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 pb-0 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {initialData ? 'Update Category' : 'New Category'}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-full text-zinc-500 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="flex bg-[#0a0a0a] p-1.5 rounded-2xl border border-white/5">
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, type: 'expense' }))}
              className={cn(
                "flex-1 py-3 rounded-xl text-sm font-bold tracking-tight transition-all",
                formData.type === 'expense' ? "bg-red-500/10 text-red-500 shadow-sm" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, type: 'income' }))}
              className={cn(
                "flex-1 py-3 rounded-xl text-sm font-bold tracking-tight transition-all",
                formData.type === 'income' ? "bg-green-500/10 text-green-500 shadow-sm" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              Income
            </button>
          </div>

          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest ml-1">Label Name</label>
              <div className="relative">
                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Travel, Salary, Rent..."
                  className="w-full bg-[#0a0a0a] border border-white/5 rounded-xl py-3 pl-11 pr-4 text-sm font-medium text-white focus:outline-none focus:border-blue-600 placeholder:text-zinc-700 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest ml-1">Theme Color</label>
              <div className="flex flex-wrap gap-2 p-4 bg-[#0a0a0a] rounded-2xl border border-white/5">
                {colors.map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData(p => ({ ...p, color }))}
                    className={cn(
                      "w-8 h-8 rounded-full border-2 transition-all",
                      formData.color === color ? "border-white scale-110 shadow-lg" : "border-transparent scale-100 hover:scale-105"
                    )}
                    style={{ backgroundColor: color }}
                  />
                ))}
                <div className="relative">
                  <input 
                    type="color" 
                    value={formData.color}
                    onChange={e => setFormData(p => ({ ...p, color: e.target.value }))}
                    className="w-8 h-8 rounded-full bg-transparent border-none cursor-pointer opacity-0 absolute inset-0"
                  />
                  <div 
                    className="w-8 h-8 rounded-full border-2 border-white/10 flex items-center justify-center text-zinc-500"
                    style={{ backgroundColor: colors.includes(formData.color) ? 'transparent' : formData.color }}
                  >
                    <Palette className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-white text-black py-4 rounded-2xl font-bold transition-all hover:bg-zinc-200 active:scale-[0.98] mt-4 shadow-xl shadow-white/5"
          >
            {initialData ? 'Update Category' : 'Create Category'}
          </button>
        </form>
      </div>
    </div>
  );
};
