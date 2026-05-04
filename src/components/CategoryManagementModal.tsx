/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Plus, Trash2, Tag, Edit2, AlertCircle } from 'lucide-react';
import { useStore } from '../store/StoreContext';
import { cn } from '../lib/utils';
import { CategoryFormModal } from './CategoryFormModal';
import { Category } from '../types';

interface CategoryManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CategoryManagementModal: React.FC<CategoryManagementModalProps> = ({ isOpen, onClose }) => {
  const { categories, deleteCategory } = useStore();
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);

  if (!isOpen) return null;

  const handleAdd = () => {
    setEditingCat(null);
    setFormModalOpen(true);
  };

  const handleEdit = (cat: Category) => {
    setEditingCat(cat);
    setFormModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this category?')) {
      deleteCategory(id);
    }
  };

  return (
    <div className="fixed inset-0 z-[55] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-[#141414] border border-white/10 w-full max-w-2xl rounded-[2.5rem] shadow-2xl flex flex-col max-h-[80vh] overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 flex items-center justify-between border-b border-white/5">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Manage Categories</h2>
            <p className="text-xs text-zinc-500 font-medium mt-1 uppercase tracking-widest">Organize your classification system</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleAdd}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-600/20"
            >
              <Plus className="w-4 h-4" />
              Add New
            </button>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/5 rounded-full text-zinc-500 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 pt-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {categories.map((cat) => (
              <div 
                key={cat.id} 
                className="bg-[#0a0a0a] p-4 rounded-2xl border border-white/5 flex items-center justify-between group hover:border-white/10 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                    style={{ backgroundColor: cat.color }}
                  >
                    <Tag className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-tight">{cat.name}</h3>
                    <span className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.1em]">{cat.type}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleEdit(cat)}
                    className="p-2 hover:bg-white/5 rounded-lg text-zinc-500 hover:text-white"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(cat.id)}
                    className="p-2 hover:bg-red-500/10 rounded-lg text-zinc-500 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {categories.length === 0 && (
            <div className="py-20 flex flex-col items-center justify-center text-zinc-700">
              <AlertCircle className="w-10 h-10 opacity-20 mb-3" />
              <p className="text-xs font-bold uppercase tracking-[0.2em]">List Empty</p>
            </div>
          )}
        </div>
      </div>

      <CategoryFormModal 
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        initialData={editingCat}
      />
    </div>
  );
};
