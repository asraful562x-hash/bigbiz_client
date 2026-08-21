'use client';

import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Sparkles, 
  X, 
  Send, 
  ArrowRight, 
  Bot, 
  User as UserIcon 
} from 'lucide-react';
import { Conversation, Message, User } from '../../types';
import { BizBotChatPanel } from '../messages/BizBotChatPanel';

interface HeaderMessagesDropdownProps {
  isMessagesOpen: boolean;
  onOpenMessages: () => void;
  unreadMessagesCount: number;
  conversations: Conversation[];
  messages: Message[];
  currentUser: User;
  onSendMessage?: (convId: string, text: string) => void;
  activeConversationId?: string | null;
}

export const HeaderMessagesDropdown: React.FC<HeaderMessagesDropdownProps> = ({
  isMessagesOpen,
  onOpenMessages,
  unreadMessagesCount,
  conversations,
  messages,
  currentUser,
  onSendMessage,
  activeConversationId,
}) => {
  const [overlayChatTab, setOverlayChatTab] = useState<'users' | 'bot'>('users');
  const [selectedConvId, setSelectedConvId] = useState<string | null>(conversations[0]?.id || null);
  const [quickMsgText, setQuickMsgText] = useState('');
  const [mobileChatTab, setMobileChatTab] = useState<'list' | 'chat'>('list');

  useEffect(() => {
    if (activeConversationId) {
      setSelectedConvId(activeConversationId);
      setMobileChatTab('chat');
      setOverlayChatTab('users');
    }
  }, [activeConversationId]);

  const currentConv = conversations.find(c => c.id === (selectedConvId || conversations[0]?.id));
  const activeConvMessages = messages.filter(m => m.conversationId === (selectedConvId || conversations[0]?.id));

  const handleSendQuickMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickMsgText.trim()) return;
    const targetConvId = selectedConvId || conversations[0]?.id;
    if (targetConvId && onSendMessage) {
      onSendMessage(targetConvId, quickMsgText);
      setQuickMsgText('');
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={onOpenMessages}
        className={`hidden sm:block p-2.5 rounded-2xl transition-all relative ${
          isMessagesOpen
            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
            : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-100'
        }`}
        title="Messages"
      >
        <div className="relative flex items-center justify-center">
          <MessageSquare className="w-5 h-5" />
          <Sparkles className="w-3 h-3 text-amber-400 absolute -top-1 -right-1 animate-pulse" />
        </div>
        {unreadMessagesCount > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white" />
        )}
      </button>

      {/* Messaging Overlay Modal / Dropdown */}
      {isMessagesOpen && (
        <div className="fixed sm:absolute inset-x-2 bottom-20 sm:inset-auto sm:right-0 sm:top-14 w-auto sm:w-[620px] h-[75vh] sm:h-[500px] bg-slate-950/95 backdrop-blur-2xl border border-white/10 text-white rounded-3xl p-4 sm:p-5 z-50 flex flex-col shadow-2xl animate-in fade-in zoom-in-95 font-sans">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-black shadow-md">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <span className="font-extrabold text-sm text-white block">Enterprise Messaging</span>
                <span className="text-[10px] text-slate-400">Direct negotiations & BizBot AI</span>
              </div>
            </div>
            <button
              type="button"
              onClick={onOpenMessages}
              className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Tab Switcher */}
          <div className="grid grid-cols-2 bg-black/40 p-1 rounded-xl border border-white/10 mb-3 text-xs shrink-0">
            <button
              type="button"
              onClick={() => setOverlayChatTab('users')}
              className={`py-1.5 font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                overlayChatTab === 'users' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserIcon className="w-3.5 h-3.5" />
              Direct Chats ({conversations.length})
            </button>
            <button
              type="button"
              onClick={() => setOverlayChatTab('bot')}
              className={`py-1.5 font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                overlayChatTab === 'bot' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              BizBot AI Assistant
            </button>
          </div>

          {/* Tab 1: User Conversations */}
          {overlayChatTab === 'users' && (
            <div className="flex-1 flex min-h-0 overflow-hidden gap-3">
              {/* Contact List */}
              <div className={`w-full sm:w-2/5 flex flex-col border-r border-white/10 pr-2 overflow-y-auto ${
                mobileChatTab === 'chat' ? 'hidden sm:flex' : 'flex'
              }`}>
                <div className="space-y-1">
                  {conversations.length === 0 ? (
                    <p className="text-xs text-slate-500 py-6 text-center">No active chats yet</p>
                  ) : (
                    conversations.map((c) => {
                      const isSelected = c.id === (selectedConvId || conversations[0]?.id);
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => {
                            setSelectedConvId(c.id);
                            setMobileChatTab('chat');
                          }}
                          className={`w-full p-2.5 rounded-xl text-left flex items-center gap-2.5 transition-colors ${
                            isSelected ? 'bg-indigo-600 text-white' : 'hover:bg-white/5 text-slate-300'
                          }`}
                        >
                          <img
                            src={c.otherParticipant.avatar}
                            alt={c.otherParticipant.name}
                            className="w-8 h-8 rounded-full object-cover shrink-0 border border-white/20"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                              <h5 className="text-xs font-bold truncate">{c.otherParticipant.name}</h5>
                              <span className="text-[9px] opacity-70">{c.lastMessageTime}</span>
                            </div>
                            <p className="text-[10px] opacity-80 truncate">{c.lastMessage || 'Conversation started'}</p>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Chat Thread */}
              <div className={`flex-1 flex flex-col min-h-0 overflow-hidden ${
                mobileChatTab === 'list' ? 'hidden sm:flex' : 'flex'
              }`}>
                {currentConv && (
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10 shrink-0">
                    <button
                      type="button"
                      onClick={() => setMobileChatTab('list')}
                      className="sm:hidden text-xs text-indigo-400 flex items-center gap-1 font-bold"
                    >
                      <ArrowRight className="w-3.5 h-3.5 rotate-180" /> Back
                    </button>
                    <div className="flex items-center gap-2">
                      <img
                        src={currentConv.otherParticipant.avatar}
                        alt={currentConv.otherParticipant.name}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <span className="text-xs font-bold text-white">{currentConv.otherParticipant.name}</span>
                    </div>
                  </div>
                )}

                <div className="flex-1 overflow-y-auto space-y-2 p-2 bg-slate-900/60 rounded-2xl border border-white/5 mb-2 flex flex-col justify-end">
                  {activeConvMessages.length === 0 ? (
                    <p className="text-center text-xs text-slate-500 py-6">No messages yet in this thread.</p>
                  ) : (
                    activeConvMessages.map((m) => {
                      const isMe = m.senderId === currentUser.id;
                      return (
                        <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[85%] p-2 rounded-xl text-xs ${
                            isMe ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-slate-800 text-slate-200 rounded-bl-none'
                          }`}>
                            <p>{m.text}</p>
                            <span className="text-[8px] opacity-60 block text-right mt-0.5">{m.createdAt}</span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Send input */}
                <form onSubmit={handleSendQuickMessage} className="relative flex items-center shrink-0">
                  <input
                    type="text"
                    value={quickMsgText}
                    onChange={(e) => setQuickMsgText(e.target.value)}
                    placeholder="Type your message..."
                    className="w-full pl-3 pr-10 py-2 bg-slate-900 border border-white/20 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-400"
                  />
                  <button
                    type="submit"
                    className="absolute right-1 p-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Tab 2: BizBot AI Assistant */}
          {overlayChatTab === 'bot' && (
            <div className="flex-1 min-h-0 overflow-hidden">
              <BizBotChatPanel />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
