import React from 'react';
import { ProductOptionSection, ProductOptionItem } from '../../types';
import { Layers, Plus, Trash2, CheckCircle2, DollarSign } from 'lucide-react';

interface OptionSectionBuilderProps {
  optionSections: ProductOptionSection[];
  setOptionSections: React.Dispatch<React.SetStateAction<ProductOptionSection[]>>;
}

export const OptionSectionBuilder: React.FC<OptionSectionBuilderProps> = ({
  optionSections,
  setOptionSections
}) => {
  const addOptionSection = () => {
    const newSec: ProductOptionSection = {
      id: `sec_${Date.now()}`,
      title: '',
      type: 'single',
      isRequired: false,
      items: [
        { id: `opt_${Date.now()}_1`, name: '', priceDelta: 0, isDefault: true }
      ]
    };
    setOptionSections(prev => [...prev, newSec]);
  };

  const removeOptionSection = (secId: string) => {
    setOptionSections(prev => prev.filter(s => s.id !== secId));
  };

  const updateSectionMeta = (secId: string, updates: Partial<ProductOptionSection>) => {
    setOptionSections(prev => prev.map(s => s.id === secId ? { ...s, ...updates } : s));
  };

  const addOptionItem = (secId: string) => {
    const newItem: ProductOptionItem = {
      id: `opt_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      name: '',
      priceDelta: 0,
      isDefault: false
    };
    setOptionSections(prev => prev.map(s => {
      if (s.id === secId) {
        return { ...s, items: [...s.items, newItem] };
      }
      return s;
    }));
  };

  const removeOptionItem = (secId: string, itemId: string) => {
    setOptionSections(prev => prev.map(s => {
      if (s.id === secId) {
        return { ...s, items: s.items.filter(i => i.id !== itemId) };
      }
      return s;
    }));
  };

  const updateOptionItem = (secId: string, itemId: string, updates: Partial<ProductOptionItem>) => {
    setOptionSections(prev => prev.map(s => {
      if (s.id === secId) {
        // If setting isDefault to true in a single-select section, unset other defaults in the section
        let updatedItems = s.items.map(i => i.id === itemId ? { ...i, ...updates } : i);
        if (s.type === 'single' && updates.isDefault === true) {
          updatedItems = updatedItems.map(i => i.id === itemId ? { ...i, isDefault: true } : { ...i, isDefault: false });
        }
        return { ...s, items: updatedItems };
      }
      return s;
    }));
  };

  return (
    <div className="space-y-4 pt-2">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-indigo-600" /> Custom Option & Selection Sections
          </h4>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Create custom choice sections (e.g., Size, Crust, Add-ons, Packaging) with optional ± price adjustments & seller default selections.
          </p>
        </div>
        <button
          type="button"
          onClick={addOptionSection}
          className="text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl border border-indigo-200 transition-colors flex items-center gap-1 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Add Section
        </button>
      </div>

      {optionSections.length === 0 ? (
        <div className="p-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-center space-y-1">
          <p className="text-xs text-slate-500 font-medium">No custom selection sections added yet.</p>
          <p className="text-[10px] text-slate-400">Click &quot;Add Section&quot; to give buyers radio or checkbox choices with price adjustments.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {optionSections.map((sec, secIdx) => (
            <div key={sec.id} className="p-4 rounded-2xl border border-indigo-100 bg-indigo-50/30 space-y-3.5 relative">
              {/* Section Header Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="flex-1 flex items-center gap-2">
                  <span className="text-[10px] font-black text-indigo-700 bg-indigo-100 px-2 py-1 rounded-md">
                    #{secIdx + 1}
                  </span>
                  <input
                    type="text"
                    value={sec.title}
                    onChange={(e) => updateSectionMeta(sec.id, { title: e.target.value })}
                    placeholder="e.g. Pizza Size, Crust Style, Extra Toppings..."
                    className="flex-1 text-xs font-bold px-3 py-1.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={sec.type}
                    onChange={(e) => updateSectionMeta(sec.id, { type: e.target.value as 'single' | 'multiple' })}
                    className="text-[11px] font-bold bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 focus:outline-none"
                  >
                    <option value="single">Single Choice (Radio)</option>
                    <option value="multiple">Multiple Choice (Checkboxes)</option>
                  </select>

                  <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 cursor-pointer bg-white px-2.5 py-1.5 rounded-xl border border-slate-200">
                    <input
                      type="checkbox"
                      checked={!!sec.isRequired}
                      onChange={(e) => updateSectionMeta(sec.id, { isRequired: e.target.checked })}
                      className="rounded accent-indigo-600 w-3.5 h-3.5"
                    />
                    <span>Required</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => removeOptionSection(sec.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete Section"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Items List Inside Section */}
              <div className="space-y-2 pl-2 sm:pl-4 border-l-2 border-indigo-200">
                <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider block">
                  Option Items ({sec.items.length})
                </span>

                {sec.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200 shadow-2xs">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => updateOptionItem(sec.id, item.id, { name: e.target.value })}
                      placeholder="Item name (e.g. 12-inch Medium, Garlic Herb Crust...)"
                      className="flex-1 text-xs px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                    />

                    <div className="flex items-center gap-1 shrink-0 w-28">
                      <span className="text-[10px] text-slate-400 font-bold">$±</span>
                      <input
                        type="number"
                        step="0.5"
                        value={item.priceDelta}
                        onChange={(e) => updateOptionItem(sec.id, item.id, { priceDelta: Number(e.target.value) })}
                        placeholder="0.00"
                        className="w-full text-xs font-bold px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none text-right"
                      />
                    </div>

                    {/* Default Selection Indicator */}
                    <button
                      type="button"
                      onClick={() => updateOptionItem(sec.id, item.id, { isDefault: !item.isDefault })}
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all shrink-0 cursor-pointer ${
                        item.isDefault
                          ? 'bg-amber-100 text-amber-800 border border-amber-300 shadow-2xs'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                      title={item.isDefault ? 'Selected by default for buyers' : 'Set as default choice'}
                    >
                      {item.isDefault ? '⭐ Default' : 'Set Default'}
                    </button>

                    <button
                      type="button"
                      onClick={() => removeOptionItem(sec.id, item.id)}
                      disabled={sec.items.length <= 1}
                      className="p-1 text-slate-300 hover:text-rose-500 disabled:opacity-30 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => addOptionItem(sec.id)}
                  className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 hover:underline flex items-center gap-1 pt-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3" /> Add Choice Item
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
