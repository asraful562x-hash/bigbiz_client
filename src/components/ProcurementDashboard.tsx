'use client';

import React, { useState } from 'react';
import { DirectOffer, DirectOfferStatus, User } from '../types';
import { 
  Handshake, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  DollarSign, 
  MessageSquare, 
  AlertCircle, 
  ShieldCheck, 
  Store,
  Filter,
  Search
} from 'lucide-react';

interface ProcurementDashboardProps {
  currentUser: User;
  offers: DirectOffer[];
  onUpdateOfferStatus: (offerId: string, status: DirectOfferStatus, counterPrice?: number, adminNotes?: string) => void;
}

export const ProcurementDashboard: React.FC<ProcurementDashboardProps> = ({
  currentUser,
  offers,
  onUpdateOfferStatus
}) => {
  const [selectedOffer, setSelectedOffer] = useState<DirectOffer | null>(null);
  const [counterPriceInput, setCounterPriceInput] = useState<string>('');
  const [adminNotesInput, setAdminNotesInput] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'queue' | 'inventory'>('queue');
  const [filterPriority, setFilterPriority] = useState<boolean>(false);

  const filteredOffers = offers.filter(o => {
    if (filterPriority) return o.isPremiumSeller;
    return true;
  });

  const handleAction = (status: DirectOfferStatus) => {
    if (!selectedOffer) return;

    const counter = counterPriceInput ? Number(counterPriceInput) : undefined;
    onUpdateOfferStatus(selectedOffer.id, status, counter, adminNotesInput);

    setSelectedOffer(null);
    setCounterPriceInput('');
    setAdminNotesInput('');
  };

  const acceptedInventory = offers.filter(o => o.status === 'accepted');

  return (
    <div className="space-y-4 pb-6">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-3xl shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Handshake className="w-6 h-6 text-emerald-400" />
            <h1 className="text-xl font-extrabold">BizSocial Official Buy Desk</h1>
            <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-emerald-500/30">
              Procurement Center
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Review direct inventory buyout submissions from small businesses. Premium sellers receive fast-track priority review.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-2xl text-xs font-bold max-w-full overflow-x-auto whitespace-nowrap no-scrollbar">
          <button
            onClick={() => setActiveTab('queue')}
            className={`px-3 sm:px-4 py-2 rounded-xl transition-colors text-xs ${
              activeTab === 'queue' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:text-white'
            }`}
          >
            Review Queue ({offers.length})
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-3 sm:px-4 py-2 rounded-xl transition-colors text-xs ${
              activeTab === 'inventory' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:text-white'
            }`}
          >
            Org Inventory ({acceptedInventory.length})
          </button>
        </div>
      </div>

      {activeTab === 'queue' ? (
        <div className="space-y-4">
          
          {/* Priority filter toggle */}
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200">
            <span className="text-xs font-bold text-slate-700">Filter Submissions:</span>
            <button
              onClick={() => setFilterPriority(!filterPriority)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                filterPriority
                  ? 'bg-amber-400 text-slate-950 shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" /> Premium Seller Priority Queue
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredOffers.map((offer) => (
              <div
                key={offer.id}
                className={`bg-white rounded-3xl border overflow-hidden shadow-xs flex flex-col ${
                  offer.isPremiumSeller ? 'border-amber-300 ring-1 ring-amber-200' : 'border-slate-200'
                }`}
              >
                {/* Product image banner with badge overlays */}
                <div className="relative w-full h-44 shrink-0">
                  <img src={offer.images[0]} alt={offer.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                  {/* Status badge top-right */}
                  <span className={`absolute top-3 right-3 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wide shadow ${
                    offer.status === 'under_review'    ? 'bg-sky-500 text-white' :
                    offer.status === 'accepted'        ? 'bg-emerald-500 text-white' :
                    offer.status === 'rejected'        ? 'bg-rose-500 text-white' :
                    offer.status === 'counter_offered' ? 'bg-amber-400 text-slate-900' :
                                                        'bg-slate-700 text-white'
                  }`}>
                    {offer.status.replace(/_/g, ' ')}
                  </span>

                  {/* PRO badge top-left */}
                  {offer.isPremiumSeller && (
                    <span className="absolute top-3 left-3 bg-amber-400 text-slate-950 text-[9px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
                      <Sparkles className="w-2.5 h-2.5" /> Priority PRO
                    </span>
                  )}

                  {/* Price chip bottom-left */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-2">
                    <span className="bg-white/95 text-slate-900 font-black text-sm px-3 py-1 rounded-xl shadow">
                      ${offer.expectedPrice.toFixed(2)}
                    </span>
                    {offer.counterPrice && (
                      <span className="bg-amber-400/95 text-slate-900 font-black text-xs px-2.5 py-1 rounded-xl shadow">
                        Counter: ${offer.counterPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card body */}
                <div className="flex flex-col flex-1 p-4 gap-3">
                  {/* Seller row */}
                  <div className="flex items-center gap-2.5">
                    <img src={offer.sellerAvatar} alt={offer.sellerName} className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-slate-900 truncate">{offer.sellerName}</span>
                        {offer.isPremiumSeller && (
                          <span className="bg-amber-100 text-amber-800 text-[9px] font-black px-1.5 py-0.5 rounded border border-amber-300 shrink-0">PRO</span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">Submitted {offer.createdAt} · Expires {offer.expiresAt}</div>
                    </div>
                  </div>

                  {/* Title + description */}
                  <div className="space-y-1">
                    <h3 className="font-extrabold text-sm text-slate-900 leading-snug line-clamp-2">{offer.title}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{offer.description}</p>
                  </div>

                  {/* Footer */}
                  <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                    <p className="text-[11px] text-slate-400 italic line-clamp-2 flex-1">
                      {offer.adminNotes || 'Pending procurement decision…'}
                    </p>
                    <button
                      onClick={() => {
                        setSelectedOffer(offer);
                        setCounterPriceInput(offer.counterPrice?.toString() || '');
                        setAdminNotesInput(offer.adminNotes || '');
                      }}
                      className="shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs px-4 py-2 rounded-xl transition-colors shadow-xs"
                    >
                      Take Decision
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      ) : (
        /* Organization Owned Inventory View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {acceptedInventory.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
              <img
                src={item.images[0]}
                alt={item.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4 flex flex-col flex-1 gap-2">
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase self-start">
                  BizSocial Acquired
                </span>
                <h3 className="font-bold text-sm text-slate-900 line-clamp-2 leading-snug flex-1">{item.title}</h3>
                <div className="flex justify-between items-center text-xs font-extrabold pt-1 border-t border-slate-100">
                  <span className="text-slate-400 font-semibold">Acquired Price</span>
                  <span className="text-emerald-700 text-base">${(item.counterPrice || item.expectedPrice).toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Procurement Action Modal */}
      {selectedOffer && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Handshake className="w-5 h-5 text-indigo-600" /> Review Offer: {selectedOffer.title}
            </h3>

            <div className="bg-slate-50 p-3 rounded-2xl text-xs space-y-1 border border-slate-200">
              <div><strong>Seller:</strong> {selectedOffer.sellerName} ({selectedOffer.isPremiumSeller ? '⭐ Premium' : 'Free'})</div>
              <div><strong>Seller Expected Price:</strong> ${selectedOffer.expectedPrice.toFixed(2)}</div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Counter-Offer Price ($) (Optional)
                </label>
                <input
                  type="number"
                  value={counterPriceInput}
                  onChange={(e) => setCounterPriceInput(e.target.value)}
                  placeholder="e.g. 380.00"
                  className="w-full text-xs px-3.5 py-2 bg-slate-100 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Procurement Notes / Justification
                </label>
                <textarea
                  rows={2}
                  value={adminNotesInput}
                  onChange={(e) => setAdminNotesInput(e.target.value)}
                  placeholder="Internal notes or message sent to seller..."
                  className="w-full text-xs p-3 bg-slate-100 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                />
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2">
                <button
                  onClick={() => handleAction('accepted')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-xl shadow-xs"
                >
                  Accept at Price
                </button>
                <button
                  onClick={() => handleAction('counter_offered')}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs py-2.5 rounded-xl shadow-xs"
                >
                  Send Counter
                </button>
                <button
                  onClick={() => handleAction('rejected')}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-2.5 rounded-xl shadow-xs"
                >
                  Decline
                </button>
              </div>

              <button
                onClick={() => setSelectedOffer(null)}
                className="w-full text-xs font-bold text-slate-500 hover:bg-slate-100 py-2 rounded-xl"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
