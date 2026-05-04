/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Tag, 
  ChevronRight,
  Edit2,
  AlertCircle
} from 'lucide-react';
import { useStore } from '../store/StoreContext';
import { cn } from '../lib/utils';
import { CategoryFormModal } from './CategoryFormModal';
import { Category } from '../types';

export const CategoryManager: React.FC = () => {
  const { categories, deleteCategory } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);

  const handleEdit = (cat: Category) => {
    setEditingCat(cat);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingCat(null);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this category? Transactions using this category will still exist but without a category name.')) {
      deleteCategory(id);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <span className="text-[10px] text-zinc-500 uppercase font-black tracking-[0.3em] ml-1">Taxonomy Management</span>
          <h1 className="text-4xl font-black text-white tracking-tighter mt-2">Categories</h1>
        </div>
        <button 
          onClick={handleAdd}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-xl shadow-blue-600/20 active:scale-[0.98]"
        >
          <Plus className="w-5 h-5" />
          Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-[#141414] p-6 rounded-3xl border border-white/5 flex flex-col group hover:border-white/10 transition-all shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110 duration-500"
                style={{ backgroundColor: cat.color }}
              >
                <Tag className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleEdit(cat)}
                  className="p-2 hover:bg-white/5 rounded-lg text-zinc-600 hover:text-white transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(cat.id)}
                  className="p-2 hover:bg-red-500/10 rounded-lg text-zinc-600 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">{cat.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className={cn(
                  "text-[10px] uppercase font-black tracking-widest px-2 py-0.5 rounded",
                  cat.type === 'expense' ? "bg-red-500/10 text-red-500" : "bg-green-500/10 text-green-500"
                )}>
                  {cat.type}
                </span>
              </div>
            </div>
          </div>
        ))}
        {categories.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-zinc-600 border-2 border-dashed border-white/5 rounded-[2.5rem]">
            <AlertCircle className="w-12 h-12 opacity-20 mb-4" />
            <p className="text-sm font-bold uppercase tracking-widest">No categories defined</p>
          </div>
        )}
      </div>

      <CategoryFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingCat}
      />
    </div>
  );
};

