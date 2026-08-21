'use client';

import React from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { MarketplaceCategory } from '../../types';

interface HeaderSearchBarProps {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  selectedCategory: MarketplaceCategory | 'all';
  setSelectedCategory: (cat: MarketplaceCategory | 'all') => void;
  categories: Array<{ id: string; label: string }>;
  showCategoryDropdown: boolean;
  setShowCategoryDropdown: (v: boolean | ((prev: boolean) => boolean)) => void;
  categoryLabels: Record<string, string>;
}

export const HeaderSearchBar: React.FC<HeaderSearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  categories,
  showCategoryDropdown,
  setShowCategoryDropdown,
  categoryLabels,
}) => {
  return (
    <div className="flex-1 max-w-xl mx-2 sm:mx-4">
      <div className="relative flex items-center">
        <div className="relative w-full flex items-center">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search verified products, services, SaaS licenses, B2B vendors..."
            className="w-full pl-10 pr-28 sm:pr-32 py-2 bg-slate-100/90 border border-slate-200/80 rounded-2xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 focus:bg-white transition-all shadow-inner"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />

          {/* Category Dropdown inside search */}
          <div className="absolute right-1.5 flex items-center">
            <button
              type="button"
              onClick={() => setShowCategoryDropdown(prev => !prev)}
              className="flex items-center gap-1 px-2 py-1 text-[11px] font-bold text-slate-600 bg-white/80 hover:bg-white border border-slate-200/80 rounded-xl shadow-xs transition-all max-w-[110px] sm:max-w-[130px] truncate"
            >
              <span className="truncate">{categoryLabels[selectedCategory] || 'Category'}</span>
              <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
            </button>
          </div>
        </div>

        {/* Category Menu Popover */}
        {showCategoryDropdown && (
          <div className="absolute right-0 top-12 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-50 text-left animate-in fade-in zoom-in-95">
            <div className="px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400">
              Filter by Category
            </div>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat.id as MarketplaceCategory | 'all');
                  setShowCategoryDropdown(false);
                }}
                className={`w-full px-3 py-2 text-xs font-semibold text-left flex items-center justify-between hover:bg-indigo-50/70 hover:text-indigo-600 transition-colors ${
                  selectedCategory === cat.id ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-700'
                }`}
              >
                <span>{cat.label}</span>
                {selectedCategory === cat.id && <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
