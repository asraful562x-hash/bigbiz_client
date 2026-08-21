'use client';

import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MarketplaceCategory } from '../../types';

interface HeaderCategoryChipsProps {
  categories: Array<{ id: string; label: string }>;
  selectedCategory: MarketplaceCategory | 'all';
  setSelectedCategory: (cat: MarketplaceCategory | 'all') => void;
}

export const HeaderCategoryChips: React.FC<HeaderCategoryChipsProps> = ({
  categories,
  selectedCategory,
  setSelectedCategory,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const step = 200;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -step : step,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="hidden md:flex items-center relative max-w-full px-2 py-1 bg-slate-50/80 rounded-2xl border border-slate-200/60">
      <button
        type="button"
        onClick={() => scroll('left')}
        className="p-1 rounded-lg hover:bg-white text-slate-400 hover:text-slate-700 transition-colors shrink-0"
        aria-label="Scroll left"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
      </button>

      <div
        ref={scrollRef}
        className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth px-1"
      >
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id as MarketplaceCategory | 'all')}
              className={`px-3 py-1 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-white hover:text-slate-900'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => scroll('right')}
        className="p-1 rounded-lg hover:bg-white text-slate-400 hover:text-slate-700 transition-colors shrink-0"
        aria-label="Scroll right"
      >
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
