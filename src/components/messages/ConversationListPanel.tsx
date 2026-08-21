'use client';

import React from 'react';
import { Conversation } from '../../types';
import { Search, MessageSquare, CheckCircle2 } from 'lucide-react';

interface ConversationListPanelProps {
  conversations: Conversation[];
  activeConvId: string | null;
  onSelectConversation: (convId: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isLoading?: boolean;
}

export const ConversationListPanel: React.FC<ConversationListPanelProps> = ({
  conversations,
  activeConvId,
  onSelectConversation,
  searchQuery,
  setSearchQuery,
  isLoading = false,
}) => {
  const filteredConversations = conversations.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.otherParticipant?.name?.toLowerCase().includes(q) ||
      c.lastMessage?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex flex-col h-full bg-white border-r border-slate-200/80">
      {/* Search Filter Header */}
      <div className="p-3.5 border-b border-slate-100 shrink-0">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Conversations Scroll List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {isLoading ? (
          <div className="py-12 text-center text-slate-400 text-xs font-bold">
            Loading conversations...
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="py-12 text-center text-slate-400 space-y-2">
            <MessageSquare className="w-8 h-8 mx-auto text-slate-300" />
            <p className="text-xs font-bold">No conversations found</p>
          </div>
        ) : (
          filteredConversations.map((conv) => {
            const isActive = conv.id === activeConvId;
            return (
              <button
                key={conv.id}
                type="button"
                onClick={() => onSelectConversation(conv.id)}
                className={`w-full p-3 rounded-2xl text-left flex items-center gap-3 transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="relative shrink-0">
                  <img
                    src={conv.otherParticipant.avatar}
                    alt={conv.otherParticipant.name}
                    className="w-11 h-11 rounded-2xl object-cover border border-slate-200"
                  />
                  <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white absolute -bottom-0.5 -right-0.5" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className={`text-xs font-black truncate ${isActive ? 'text-white' : 'text-slate-900'}`}>
                      {conv.otherParticipant.name}
                    </h4>
                    <span className={`text-[10px] shrink-0 ${isActive ? 'text-indigo-200' : 'text-slate-400'}`}>
                      {conv.lastMessageTime}
                    </span>
                  </div>

                  <p className={`text-xs truncate mt-0.5 ${isActive ? 'text-indigo-100' : 'text-slate-500'}`}>
                    {conv.lastMessage || 'Conversation started'}
                  </p>
                </div>

                {conv.unreadCount > 0 && !isActive && (
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-black flex items-center justify-center shrink-0">
                    {conv.unreadCount}
                  </span>
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};
