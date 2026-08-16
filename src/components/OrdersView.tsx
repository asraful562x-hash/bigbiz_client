'use client';

import React from 'react';
import { Order, User } from '../types';
import { ShoppingBag, ShieldCheck, Truck, CheckCircle2, Package, Clock } from 'lucide-react';

interface OrdersViewProps {
  currentUser: User;
  orders: Order[];
  onConfirmReceipt?: (orderId: string) => void;
  onUpdateOrderStatus?: (orderId: string, newStatus: Order['status'], newEscrowStatus?: Order['escrowStatus']) => void;
  onOpenChat?: (sellerId: string) => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({
  currentUser,
  orders,
  onConfirmReceipt,
  onUpdateOrderStatus,
  onOpenChat
}) => {
  const userOrders = orders.filter(o => {
    if (currentUser.role.includes('seller')) {
      return o.sellerId === currentUser.id;
    }
    return o.buyerId === currentUser.id || o.sellerId === currentUser.id;
  });

  return (
    <div className="space-y-4 pb-6">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-6 rounded-3xl shadow-lg flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-indigo-400" />
            <h1 className="text-xl font-extrabold">Escrow Orders & Payout Tracker</h1>
          </div>
          <p className="text-xs text-slate-300">
            Funds are held in Escrow protection until delivery is verified and confirmed by the buyer.
          </p>
        </div>
      </div>

      {userOrders.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
          <Package className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 text-base">No Orders Found</h3>
          <p className="text-xs text-slate-500">You haven't placed or received any orders yet. Browse the marketplace to start buying!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {userOrders.map((order) => {
            const isBuyer = order.buyerId === currentUser.id;

            return (
              <div key={order.id} className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
                
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-xs text-slate-900">Order #{order.id}</span>
                    <span className="text-xs text-slate-400">• {order.createdAt}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {order.escrowStatus === 'held' ? (
                      <span className="bg-amber-100 text-amber-800 font-bold text-xs px-2.5 py-1 rounded-full flex items-center gap-1 border border-amber-300">
                        <Clock className="w-3.5 h-3.5" /> Escrow Payment Held
                      </span>
                    ) : (
                      <span className="bg-emerald-100 text-emerald-800 font-bold text-xs px-2.5 py-1 rounded-full flex items-center gap-1 border border-emerald-300">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Escrow Released & Payout Complete
                      </span>
                    )}
                  </div>
                </div>

                {/* Details */}
                <div className="flex gap-4">
                  <img src={order.listingImage} alt={order.listingTitle} className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shrink-0" />
                  <div className="space-y-1 flex-1">
                    <h3 className="font-bold text-sm text-slate-900">{order.listingTitle}</h3>
                    <p className="text-xs text-slate-500">
                      Seller: <strong>{order.sellerName}</strong> • Buyer: <strong>{order.buyerName}</strong>
                    </p>
                    <div className="pt-1 flex items-center gap-4 text-xs">
                      <span className="font-black text-slate-900">Total: ${order.totalAmount.toFixed(2)}</span>
                      {order.trackingNumber && (
                        <span className="text-indigo-600 font-medium flex items-center gap-1">
                          <Truck className="w-3.5 h-3.5" /> {order.trackingNumber}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Confirm Action for Buyer */}
                {isBuyer && order.escrowStatus === 'held' && (
                  <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-emerald-50 p-3.5 rounded-2xl">
                    <div className="text-xs text-emerald-900 space-y-0.5">
                      <span className="font-bold block">Received your item / deliverables?</span>
                      Confirming receipt will release the ${order.totalAmount ? order.totalAmount.toFixed(2) : order.price.toFixed(2)} payment from Escrow to {order.sellerName}.
                    </div>
                    <button
                      onClick={() => {
                        if (onConfirmReceipt) {
                          onConfirmReceipt(order.id);
                        } else if (onUpdateOrderStatus) {
                          onUpdateOrderStatus(order.id, 'buyer_confirmed', 'released');
                        }
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-4 py-2 rounded-xl shadow-xs transition-transform active:scale-95 shrink-0 w-full sm:w-auto text-center cursor-pointer"
                    >
                      Confirm Receipt & Release Escrow
                    </button>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
