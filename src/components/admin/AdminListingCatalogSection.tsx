import React from 'react';
import { Listing } from '../../types';
import { Sliders, Search, Trash2 } from 'lucide-react';

interface AdminListingCatalogSectionProps {
  filteredListings: Listing[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onDeleteListing?: (listingId: string) => void;
  addAuditLog: (action: string, level: 'INFO' | 'WARN' | 'CRITICAL', details: string) => void;
}

export const AdminListingCatalogSection: React.FC<AdminListingCatalogSectionProps> = ({
  filteredListings,
  searchQuery,
  setSearchQuery,
  onDeleteListing,
  addAuditLog
}) => {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-purple-600" /> Marketplace Catalog Governance
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Audit active listings, enforce pricing guidelines, and take down policy violations.</p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search listing, seller, category..."
            className="w-full text-xs pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      <div className="space-y-2">
        {filteredListings.map((l) => (
          <div key={l.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <img src={l.images[0]} alt="" className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0" />
              <div className="min-w-0">
                <h4 className="font-bold text-xs text-slate-900 truncate">{l.title}</h4>
                <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                  <span className="font-semibold text-slate-700">{l.sellerName}</span>
                  <span>•</span>
                  <span className="bg-indigo-50 text-indigo-700 px-1.5 py-0.2 rounded font-bold uppercase">{l.category.replace('_', ' ')}</span>
                  <span>•</span>
                  <span className="font-mono font-bold text-slate-900">${l.price.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  onDeleteListing?.(l.id);
                  addAuditLog('LISTING_TAKEDOWN', 'WARN', `Listing #${l.id} (${l.title}) removed by Admin`);
                }}
                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Take Down
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
