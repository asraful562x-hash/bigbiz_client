'use client';

import React from 'react';
import { Bell, CheckCircle2, Check, Sparkles } from 'lucide-react';
import { AppNotification } from '../../types';

interface HeaderNotificationsMenuProps {
  isNotificationsOpen: boolean;
  onOpenNotifications: () => void;
  unreadNotificationsCount: number;
  notifications: AppNotification[];
  onMarkAllNotificationsRead?: () => void;
  incomingNetworkRequests?: any[];
  onAcceptNetworkRequest?: (requestId: number) => void;
  onRejectNetworkRequest?: (requestId: number) => void;
}

export const HeaderNotificationsMenu: React.FC<HeaderNotificationsMenuProps> = ({
  isNotificationsOpen,
  onOpenNotifications,
  unreadNotificationsCount,
  notifications,
  onMarkAllNotificationsRead,
  incomingNetworkRequests = [],
  onAcceptNetworkRequest,
  onRejectNetworkRequest,
}) => {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onOpenNotifications}
        className={`p-2.5 rounded-2xl transition-all relative ${
          isNotificationsOpen
            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
            : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-100'
        }`}
        title="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadNotificationsCount > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
        )}
      </button>

      {/* Notifications Popover */}
      {isNotificationsOpen && (
        <div className="fixed sm:absolute inset-x-2 bottom-20 sm:inset-auto sm:right-0 sm:top-14 w-auto sm:w-96 max-h-[460px] bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/90 p-4 z-50 text-left font-sans flex flex-col animate-in fade-in zoom-in-95">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-2 shrink-0">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-slate-900">Notifications & Alerts</span>
              {unreadNotificationsCount > 0 && (
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                  {unreadNotificationsCount} new
                </span>
              )}
            </div>
            {onMarkAllNotificationsRead && (
              <button
                type="button"
                onClick={onMarkAllNotificationsRead}
                className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
            {/* Incoming B2B Network Connection Requests */}
            {incomingNetworkRequests.length > 0 && (
              <div className="p-3 rounded-2xl bg-indigo-50/70 border border-indigo-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black text-indigo-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    Incoming B2B Connections ({incomingNetworkRequests.length})
                  </span>
                </div>
                {incomingNetworkRequests.map((req) => (
                  <div key={req.id} className="bg-white p-2.5 rounded-xl border border-indigo-100/80 space-y-2">
                    <p className="text-xs text-slate-700 font-medium">
                      User <strong>#{req.sender_id}</strong> requested a partner connection with your storefront.
                    </p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => onAcceptNetworkRequest?.(req.id)}
                        className="flex-1 py-1 px-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" /> Accept
                      </button>
                      <button
                        type="button"
                        onClick={() => onRejectNetworkRequest?.(req.id)}
                        className="py-1 px-2.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 rounded-lg text-xs font-bold transition-colors"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* General App Notifications */}
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-slate-400 space-y-1">
                <Bell className="w-8 h-8 mx-auto text-slate-300" />
                <p className="text-xs font-bold">No new notifications</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-3 rounded-2xl border transition-all ${
                    n.isRead
                      ? 'bg-slate-50 border-slate-100 text-slate-600'
                      : 'bg-indigo-50/50 border-indigo-100 text-slate-900 font-semibold'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h5 className="text-xs font-black text-slate-900 leading-snug">{n.title}</h5>
                    <span className="text-[10px] text-slate-400 shrink-0">{n.createdAt}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-normal">{n.body}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
