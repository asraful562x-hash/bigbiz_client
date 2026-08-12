'use client';

import React from 'react';
import { DirectOffer, DirectOfferStatus, User } from '../types';
import { 
  Handshake, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  ArrowRight, 
  Sparkles, 
  Store,
  DollarSign,
  ShieldCheck
} from 'lucide-react';

interface SellToUsTrackerProps {
  currentUser: User;
  offers: DirectOffer[];
  onOpenNewOfferModal: () => void;
  onAcceptCounter: (offerId: string) => void;
  onAutoListPublic: (offerId: string) => void;
}

export const SellToUsTracker: React.FC<SellToUsTrackerProps> = ({
  currentUser,
  offers,
  onOpenNewOfferModal,
  onAcceptCounter,
  onAutoListPublic
}) => {
  const userOffers = offers.filter(o => o.sellerId === currentUser.id);

  const getStatusStepIndex = (status: DirectOfferStatus) => {
    switch (status) {
      case 'submitted': return 1;
      case 'under_review': return 2;
      case 'counter_offered': return 3;
      case 'accepted': return 4;
      case 'rejected': return 4;
      case 'auto_listed_public': return 4;
      default: return 1;
    }
  };

  const getStatusBadge = (status: DirectOfferStatus) => {
    switch (status) {
      case 'submitted':
        return <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full text-xs font-bold border border-slate-300">Submitted</span>;
      case 'under_review':
        return <span className="bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full text-xs font-bold border border-blue-300 animate-pulse">Under Review</span>;
      case 'counter_offered':
        return <span className="bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full text-xs font-bold border border-amber-300">Counter-Offer Made</span>;
      case 'accepted':
        return <span className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full text-xs font-bold border border-emerald-300">Accepted & Payout Scheduled</span>;
      case 'rejected':
        return <span className="bg-rose-100 text-rose-800 px-2.5 py-1 rounded-full text-xs font-bold border border-rose-300">Offer Declined</span>;
      case 'auto_listed_public':
        return <span className="bg-purple-100 text-purple-800 px-2.5 py-1 rounded-full text-xs font-bold border border-purple-300">Listed on Public Marketplace</span>;
    }
  };

  return (
    <div className="space-y-4 pb-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 text-white p-6 rounded-3xl shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Handshake className="w-6 h-6 text-emerald-400" />
            <h1 className="text-xl font-extrabold">"Sell to Us" Direct Offer Pipeline</h1>
          </div>
          <p className="text-xs text-slate-300">
            Track status, counter-offers, and payouts for items submitted directly to the BizSocial Procurement Team.
          </p>
        </div>

        <button
          onClick={onOpenNewOfferModal}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-md transition-transform active:scale-95 flex items-center gap-2"
        >
          <Handshake className="w-4 h-4" /> Submit New Direct Offer
        </button>
      </div>

      {/* Offer Submissions List */}
      {userOffers.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-4">
          <Handshake className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 text-base">No Direct Offers Submitted Yet</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Instead of listing publicly and waiting for individual buyers, submit your overstock or used items directly to our official Buy Desk!
          </p>
          <button
            onClick={onOpenNewOfferModal}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-colors"
          >
            Submit First Offer to Buy Desk
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {userOffers.map((offer) => {
            const stepIdx = getStatusStepIndex(offer.status);

            return (
              <div 
                key={offer.id}
                className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-6"
              >
                {/* Header info */}
                <div className="flex flex-col gap-3 pb-4 border-b border-slate-100">
                  {/* Top row: image + text */}
                  <div className="flex items-start gap-3 min-w-0">
                    <img
                      src={offer.images[0]}
                      alt={offer.title}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                    <div className="flex flex-col gap-1.5 min-w-0 flex-1">
                      {/* Offer ID — its own line */}
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                        Offer #{offer.id}
                      </span>
                      {/* Status badge — its own line so it never wraps under ID */}
                      <div className="self-start">{getStatusBadge(offer.status)}</div>
                      <h3 className="font-bold text-sm text-slate-900 leading-snug line-clamp-2">{offer.title}</h3>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span className="shrink-0">Ask: <strong className="text-slate-900">${offer.expectedPrice.toFixed(2)}</strong></span>
                        {offer.counterPrice && (
                          <span className="text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200 shrink-0">
                            Counter: ${offer.counterPrice.toFixed(2)}
                          </span>
                        )}
                        <span className="text-slate-400 shrink-0">{offer.createdAt}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons row — always below, never squeezes text */}
                  {(offer.status === 'counter_offered' || offer.status === 'rejected') && (
                    <div className="flex flex-wrap items-center gap-2">
                      {offer.status === 'counter_offered' && (
                        <button
                          onClick={() => onAcceptCounter(offer.id)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-4 py-2 rounded-xl shadow-xs transition-transform active:scale-95 flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Accept Counter ${offer.counterPrice?.toFixed(2)}
                        </button>
                      )}
                      <button
                        onClick={() => onAutoListPublic(offer.id)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs px-4 py-2 rounded-xl shadow-xs transition-transform active:scale-95 flex items-center gap-1.5"
                      >
                        <Store className="w-3.5 h-3.5" /> List on Marketplace
                      </button>
                    </div>
                  )}
                </div>

                {/* Status Tracker Timeline Step Bar */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Pipeline Progress
                  </span>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-semibold relative">
                    
                    <div className={`p-3 rounded-2xl border transition-colors ${
                      stepIdx >= 1 ? 'bg-indigo-50 text-indigo-900 border-indigo-200' : 'bg-slate-50 text-slate-400 border-slate-200'
                    }`}>
                      <div className="text-base mb-1">1️⃣</div>
                      <span>Submitted</span>
                    </div>

                    <div className={`p-3 rounded-2xl border transition-colors ${
                      stepIdx >= 2 ? 'bg-indigo-50 text-indigo-900 border-indigo-200' : 'bg-slate-50 text-slate-400 border-slate-200'
                    }`}>
                      <div className="text-base mb-1">2️⃣</div>
                      <span>Under Review</span>
                    </div>

                    <div className={`p-3 rounded-2xl border transition-colors ${
                      stepIdx >= 3 ? 'bg-indigo-50 text-indigo-900 border-indigo-200' : 'bg-slate-50 text-slate-400 border-slate-200'
                    }`}>
                      <div className="text-base mb-1">3️⃣</div>
                      <span>Offer / Counter</span>
                    </div>

                    <div className={`p-3 rounded-2xl border transition-colors ${
                      stepIdx >= 4 ? 'bg-indigo-50 text-indigo-900 border-indigo-200' : 'bg-slate-50 text-slate-400 border-slate-200'
                    }`}>
                      <div className="text-base mb-1">4️⃣</div>
                      <span>
                        {offer.status === 'accepted' ? 'Accepted ✅' : offer.status === 'auto_listed_public' ? 'Public Listed 🏬' : 'Finalized'}
                      </span>
                    </div>

                  </div>
                </div>

                {/* Audit History Timeline Log */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                  <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Review History & Buy Desk Notes
                  </h4>
                  <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                    {offer.history.map((h, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs text-slate-700 bg-white p-2 rounded-xl border border-slate-200">
                        <div className="flex items-center gap-2">
                          <span className="font-bold capitalize text-slate-900">{h.status.replace('_', ' ')}</span>
                          {h.note && <span className="text-slate-500">— {h.note}</span>}
                        </div>
                        <span className="text-[10px] text-slate-400">{new Date(h.timestamp).toLocaleTimeString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
