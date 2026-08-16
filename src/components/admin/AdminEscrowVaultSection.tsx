import React from 'react';
import { Dispute, Order } from '../../types';
import { AlertTriangle, CheckCircle2, DollarSign } from 'lucide-react';

interface AdminEscrowVaultSectionProps {
  disputes: Dispute[];
  orders: Order[];
  onUpdateDisputeStatus?: (disputeId: string, status: Dispute['status']) => void;
  addAuditLog: (action: string, level: 'INFO' | 'WARN' | 'CRITICAL', details: string) => void;
}

export const AdminEscrowVaultSection: React.FC<AdminEscrowVaultSectionProps> = ({
  disputes,
  orders,
  onUpdateDisputeStatus,
  addAuditLog
}) => {
  return (
    <div className="space-y-4">
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" /> Escrow Dispute Arbitration Desk
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Private mediation desk to review buyer and seller claims and execute binding financial rulings.
            </p>
          </div>
          <span className="text-xs font-bold text-slate-500">
            {disputes.length} open disputes
          </span>
        </div>

        {disputes.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <h4 className="font-bold text-xs text-slate-900">Zero Open Disputes</h4>
            <p className="text-[11px] text-slate-500">All Escrow deposits are healthy and operating normally.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {disputes.map((disp) => (
              <div key={disp.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-slate-900">#{disp.id}</span>
                      <span className="bg-rose-100 text-rose-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                        {disp.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 mt-1">
                      <strong>Buyer:</strong> {disp.buyerName} vs <strong>Seller:</strong> {disp.sellerName}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-rose-600 block">${disp.amount.toFixed(2)}</span>
                    <span className="text-[10px] text-slate-400">Escrow Locked</span>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-600">
                  <span className="font-bold text-slate-800 block text-[11px] mb-0.5">Claim Details:</span>
                  {disp.reason}
                </div>

                <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => {
                      onUpdateDisputeStatus?.(disp.id, 'resolved_refund');
                      addAuditLog('DISPUTE_RESOLVED_REFUND', 'WARN', `Dispute #${disp.id} resolved: $${disp.amount.toFixed(2)} refunded to buyer ${disp.buyerName}`);
                    }}
                    className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
                  >
                    Force Refund to Buyer
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onUpdateDisputeStatus?.(disp.id, 'resolved_payout');
                      addAuditLog('DISPUTE_RESOLVED_PAYOUT', 'INFO', `Dispute #${disp.id} resolved: $${disp.amount.toFixed(2)} payout released to seller ${disp.sellerName}`);
                    }}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
                  >
                    Release Payout to Seller
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Active Escrow Orders Master Table */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-emerald-600" /> Platform Escrow Transactions Ledger
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase font-bold text-[10px]">
                <th className="py-2.5 px-3">Order ID</th>
                <th className="py-2.5 px-3">Item / Contract</th>
                <th className="py-2.5 px-3">Buyer & Seller</th>
                <th className="py-2.5 px-3">Amount</th>
                <th className="py-2.5 px-3">Escrow Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-slate-50">
                  <td className="py-3 px-3 font-mono font-bold text-slate-900">{o.id}</td>
                  <td className="py-3 px-3 font-bold text-slate-800 truncate max-w-xs">{o.listingTitle}</td>
                  <td className="py-3 px-3 text-slate-600">
                    <span>{o.buyerName}</span> <span className="text-slate-400">→</span> <span className="font-semibold">{o.sellerName}</span>
                  </td>
                  <td className="py-3 px-3 font-black text-slate-900">${(o.totalAmount || o.price || 0).toFixed(2)}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                      o.escrowStatus === 'held'
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    }`}>
                      {o.escrowStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
