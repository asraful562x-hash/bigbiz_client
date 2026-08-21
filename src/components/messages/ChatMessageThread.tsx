'use client';

import React, { useRef, useEffect } from 'react';
import { Message, User, Conversation } from '../../types';
import { Send, ShieldCheck, CheckCheck } from 'lucide-react';

interface ChatMessageThreadProps {
  activeConversation: Conversation | null;
  messages: Message[];
  currentUser: User;
  messageInput: string;
  setMessageInput: (v: string) => void;
  onSendMessage: (e: React.FormEvent) => void;
  onOpenSellerProfile?: (sellerId: string) => void;
}

export const ChatMessageThread: React.FC<ChatMessageThreadProps> = ({
  activeConversation,
  messages,
  currentUser,
  messageInput,
  setMessageInput,
  onSendMessage,
  onOpenSellerProfile,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!activeConversation) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-400 space-y-3 flex-col p-8">
        <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center">
          <ShieldCheck className="w-8 h-8 text-slate-300" />
        </div>
        <div className="text-center">
          <p className="text-sm font-black text-slate-700">No conversation selected</p>
          <p className="text-xs text-slate-400 mt-1">Click a contact on the left to start chatting</p>
        </div>
      </div>
    );
  }

  const other = activeConversation.otherParticipant;

  return (
    <div className="flex flex-col h-full">
      {/* Thread Header */}
      <div className="px-5 py-3.5 border-b border-slate-200/80 bg-white flex items-center justify-between shrink-0">
        <button
          type="button"
          onClick={() => onOpenSellerProfile?.(other.id)}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity text-left group"
        >
          <img
            src={other.avatar}
            alt={other.name}
            className="w-10 h-10 rounded-2xl object-cover border border-slate-200"
          />
          <div>
            <h4 className="text-xs font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
              {other.name}
            </h4>
            <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
              Online — Click to view storefront
            </span>
          </div>
        </button>

        <div className="flex items-center gap-1.5">
          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
            <ShieldCheck className="w-3 h-3" /> Escrow Protected
          </span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 bg-slate-50/60">
        {messages.length === 0 ? (
          <div className="py-12 text-center text-slate-400 space-y-2">
            <p className="text-xs font-bold">No messages yet — send your first message below!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === currentUser.id;
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                {!isMe && (
                  <img
                    src={other.avatar}
                    alt={other.name}
                    className="w-7 h-7 rounded-full object-cover mr-2 shrink-0 border border-slate-200 self-end mb-1"
                  />
                )}
                <div className={`group max-w-[75%] space-y-0.5`}>
                  <div
                    className={`px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                      isMe
                        ? 'bg-indigo-600 text-white rounded-br-sm shadow-md shadow-indigo-600/20'
                        : 'bg-white text-slate-900 border border-slate-200 rounded-bl-sm shadow-xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <div className={`flex items-center gap-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <span className="text-[9px] text-slate-400 font-medium">{msg.createdAt}</span>
                    {isMe && <CheckCheck className="w-3 h-3 text-indigo-400" />}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Bar */}
      <form
        onSubmit={onSendMessage}
        className="px-4 py-3 bg-white border-t border-slate-200/80 flex items-center gap-2.5 shrink-0"
      >
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          placeholder={`Message ${other.name}...`}
          className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
        />
        <button
          type="submit"
          disabled={!messageInput.trim()}
          className="w-10 h-10 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center shadow-md shadow-indigo-600/30 transition-all active:scale-95"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
