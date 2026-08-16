import React from 'react';
import { ProductVariant } from '../../types';
import { Tag, Plus, Trash2 } from 'lucide-react';

interface VariantManagerProps {
  variants: ProductVariant[];
  setVariants: React.Dispatch<React.SetStateAction<ProductVariant[]>>;
}

export const VariantManager: React.FC<VariantManagerProps> = ({ variants, setVariants }) => {
  const addVariant = () => {
    const newVariant: ProductVariant = {
      id: `var_${Date.now()}`,
      name: '',
      sku: '',
      priceDelta: 0,
      stockQty: 10,
      isDefault: variants.length === 0
    };
    setVariants(prev => [...prev, newVariant]);
  };

  const removeVariant = (id: string) => {
    setVariants(prev => prev.filter(v => v.id !== id));
  };

  const updateVariant = (id: string, updates: Partial<ProductVariant>) => {
    setVariants(prev => prev.map(v => {
      if (v.id === id) {
        if (updates.isDefault) {
          // If setting as default, clear others
          return { ...v, ...updates };
        }
        return { ...v, ...updates };
      }
      if (updates.isDefault) {
        return { ...v, isDefault: false };
      }
      return v;
    }));
  };

  return (
    <div className="space-y-3 pt-2">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Tag className="w-4 h-4 text-indigo-600" /> Product Variants (SKU, Size, Color)
          </h4>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Create distinct product models with customized prices and stock counts.
          </p>
        </div>
        <button
          type="button"
          onClick={addVariant}
          className="text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl border border-indigo-200 transition-colors flex items-center gap-1 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Add Variant
        </button>
      </div>

      {variants.length === 0 ? (
        <div className="p-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-center space-y-1">
          <p className="text-xs text-slate-500 font-medium">No variants added yet (Standard Single Item).</p>
          <p className="text-[10px] text-slate-400">Click &quot;Add Variant&quot; if you sell multiple sizes, colors, or specifications under one listing.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {variants.map((v) => (
            <div key={v.id} className="flex flex-wrap items-center gap-2 p-3 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <input
                type="text"
                value={v.name}
                onChange={(e) => updateVariant(v.id, { name: e.target.value })}
                placeholder="Variant Name (e.g. 500ml / Extra Large / Matte Black)"
                className="flex-1 min-w-[160px] text-xs font-bold px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
              />

              <input
                type="text"
                value={v.sku || ''}
                onChange={(e) => updateVariant(v.id, { sku: e.target.value })}
                placeholder="SKU Code"
                className="w-28 text-xs font-mono px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
              />

              <div className="flex items-center gap-1 w-28">
                <span className="text-[10px] text-slate-400 font-bold">$±</span>
                <input
                  type="number"
                  step="0.5"
                  value={v.priceDelta}
                  onChange={(e) => updateVariant(v.id, { priceDelta: Number(e.target.value) })}
                  placeholder="0.00"
                  className="w-full text-xs font-bold px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-right"
                />
              </div>

              <div className="flex items-center gap-1 w-24">
                <span className="text-[10px] text-slate-400 font-bold">Qty</span>
                <input
                  type="number"
                  value={v.stockQty || 1}
                  onChange={(e) => updateVariant(v.id, { stockQty: Number(e.target.value) })}
                  placeholder="10"
                  className="w-full text-xs font-bold px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-center"
                />
              </div>

              <button
                type="button"
                onClick={() => updateVariant(v.id, { isDefault: true })}
                className={`px-2.5 py-1.5 rounded-xl text-[10px] font-bold transition-all shrink-0 cursor-pointer ${
                  v.isDefault
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                {v.isDefault ? '⭐ Default' : 'Set Default'}
              </button>

              <button
                type="button"
                onClick={() => removeVariant(v.id)}
                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
