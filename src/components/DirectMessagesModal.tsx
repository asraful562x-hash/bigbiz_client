'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Conversation, Message, User } from '../types';
import { X, Send, CheckCheck, MessageSquare, ArrowLeft, Image, Paperclip, Smile, DollarSign, Copy, Check, Search, ShieldCheck, Tag } from 'lucide-react';

interface DirectMessagesModalProps {
  currentUser: User;
  conversations: Conversation[];
  messages: Message[];
  initialSellerId?: string;
  onClose: () => void;
  onSendMessage: (conversationId: string, text: string) => void;
}

// Sample product contexts per seller for high realism
const CONVERSATION_PRODUCTS: Record<string, { title: string; price: number; image: string; tag: string }> = {
  'conv_1': {
    title: 'Walnut Wood MagSafe Floating Desk Stand',
    price: 89.00,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=200&auto=format&fit=crop&q=80',
    tag: 'Order #1002 • Delivered'
  },
  'conv_2': {
    title: 'Handmade Stoneware Ceramic Coffee Mug',
    price: 34.00,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=200&auto=format&fit=crop&q=80',
    tag: 'Inquiry • In Stock'
  }
};

const QUICK_SUGGESTIONS = [
  "Is this still available?",
  "Can you ship via express?",
  "What's the best price you can offer?",
  "Is local pickup available?"
];

export const DirectMessagesModal: React.FC<DirectMessagesModalProps> = ({
  currentUser,
  conversations,
  messages,
  initialSellerId,
  onClose,
  onSendMessage
}) => {
  // Find conversation matching initialSellerId if provided
  const initialConv = initialSellerId
    ? conversations.find(c => c.otherParticipant.id === initialSellerId)
    : conversations[0];

  const [activeConvId, setActiveConvId] = useState<string>(initialConv?.id || conversations[0]?.id || '');
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [mobileView, setMobileView] = useState<'list' | 'chat'>(initialSellerId ? 'chat' : 'list');
  const [reactions, setReactions] = useState<Record<string, string[]>>({
    'm1': ['❤️', '👍'],
    'm2': ['🔥']
  });
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerAmount, setOfferAmount] = useState('');

  const activeConv = conversations.find(c => c.id === activeConvId);
  const activeMessages = messages.filter(m => m.conversationId === activeConvId);
  const activeProduct = CONVERSATION_PRODUCTS[activeConvId] || {
    title: 'Marketplace Inquiry',
    price: 0,
    image: activeConv?.otherParticipant.avatar || '',
    tag: 'Direct Chat'
  };

  const filteredConversations = conversations.filter(conv =>
    conv.otherParticipant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || !activeConvId) return;

    onSendMessage(activeConvId, text.trim());
    setInputText('');

    // Simulate seller typing response after 1.5s
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
    }, 2000);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend();
  };

  const handleToggleReaction = (msgId: string, emoji: string) => {
    setReactions(prev => {
      const current = prev[msgId] || [];
      if (current.includes(emoji)) {
        return { ...prev, [msgId]: current.filter(e => e !== emoji) };
      } else {
        return { ...prev, [msgId]: [...current, emoji] };
      }
    });
  };

  const handleCopyMessage = (msgId: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedMsgId(msgId);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  const handleSendOffer = () => {
    if (!offerAmount || isNaN(Number(offerAmount))) return;
    handleSend(`🏷️ CUSTOM OFFER: $${Number(offerAmount).toFixed(2)} proposed for "${activeProduct.title}"`);
    setShowOfferModal(false);
    setOfferAmount('');
  };

  return (
    <>
      {/* Full screen blurred backdrop */}
      <div 
        className="fixed inset-0 z-40 bg-white/50 backdrop-blur-md animate-fade-in-backdrop"
        onClick={onClose}
      />

      {/* Modal Container with slide-up-from-bottom translate transition */}
      <div 
        className="fixed inset-0 z-50 pointer-events-none flex items-end sm:items-center justify-center p-0 sm:p-4"
      >
        <div 
          onClick={(e) => e.stopPropagation()}
          className="pointer-events-auto bg-white rounded-t-3xl sm:rounded-3xl max-w-3xl w-full h-[88vh] sm:h-[620px] border border-slate-200/90 shadow-2xl overflow-hidden flex flex-col sm:flex-row relative animate-slide-up-bottom"
        >
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-30 bg-slate-100 hover:bg-slate-200 active:scale-95 p-1.5 rounded-full text-slate-600 transition-all shadow-xs"
          title="Close messages"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Sidebar: Conversations List */}
        <div className={`w-full sm:w-1/3 bg-slate-50/90 border-r border-slate-200/80 p-3 space-y-3 overflow-y-auto flex flex-col ${
          mobileView === 'chat' ? 'hidden sm:flex' : 'flex'
        }`}>
          <div className="flex items-center gap-2 pt-1 px-1">
            <MessageSquare className="w-5 h-5 text-indigo-600 shrink-0" />
            <h3 className="font-extrabold text-sm text-slate-900 tracking-tight">Direct Messages</h3>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search chat or seller..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white text-xs pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800 placeholder:text-slate-400"
            />
          </div>

          {/* Conversation items */}
          <div className="space-y-1.5 flex-1 overflow-y-auto pr-0.5">
            {filteredConversations.length > 0 ? (
              filteredConversations.map((conv) => {
                const isActive = conv.id === activeConvId;
                return (
                  <div
                    key={conv.id}
                    onClick={() => {
                      setActiveConvId(conv.id);
                      setMobileView('chat');
                    }}
                    className={`p-2.5 rounded-2xl cursor-pointer flex items-center gap-3 transition-all duration-150 ${
                      isActive 
                        ? 'bg-white shadow-xs border border-indigo-100 ring-1 ring-indigo-500/10' 
                        : 'hover:bg-slate-200/60'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <img
                        src={conv.otherParticipant.avatar}
                        alt={conv.otherParticipant.name}
                        className="w-10 h-10 rounded-full object-cover shadow-xs border border-slate-200/80"
                      />
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <span className={`text-xs truncate ${isActive ? 'font-black text-slate-900' : 'font-bold text-slate-800'}`}>
                          {conv.otherParticipant.name}
                        </span>
                        <span className="text-[10px] text-slate-400 shrink-0 ml-1">{conv.lastMessageTime}</span>
                      </div>
                      <p className={`text-[11px] truncate mt-0.5 ${isActive ? 'text-indigo-600 font-medium' : 'text-slate-500'}`}>
                        {conv.lastMessage}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-slate-400 text-center py-6">No conversations found</p>
            )}
          </div>
        </div>

        {/* Right Chat Thread */}
        <div className={`flex-1 flex flex-col bg-white ${
          mobileView === 'list' ? 'hidden sm:flex' : 'flex'
        }`}>
          {activeConv ? (
            <>
              {/* Chat Header */}
              <div className="p-3 border-b border-slate-100 flex items-center justify-between bg-white pr-12 shadow-2xs z-10">
                <div className="flex items-center gap-2.5 min-w-0">
                  <button
                    onClick={() => setMobileView('list')}
                    className="sm:hidden p-1.5 bg-slate-100 hover:bg-slate-200 active:scale-95 rounded-xl text-slate-600 transition-all shrink-0"
                    title="Back to conversations"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <div className="relative shrink-0">
                    <img
                      src={activeConv.otherParticipant.avatar}
                      alt={activeConv.otherParticipant.name}
                      className="w-9 h-9 rounded-full object-cover border border-slate-200 shadow-xs"
                    />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1">
                      <h4 className="font-extrabold text-xs text-slate-900 truncate">{activeConv.otherParticipant.name}</h4>
                      <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    </div>
                    <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                      Online • Verified Seller
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setShowOfferModal(true)}
                  className="hidden xs:flex items-center gap-1 text-[11px] font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 active:scale-95 px-2.5 py-1.5 rounded-xl transition-all border border-indigo-200/60 shrink-0"
                >
                  <Tag className="w-3.5 h-3.5" />
                  Make Offer
                </button>
              </div>

              {/* Product Context Card Bar */}
              {activeProduct.price > 0 && (
                <div className="px-3.5 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img 
                      src={activeProduct.image} 
                      alt={activeProduct.title} 
                      className="w-8 h-8 rounded-lg object-cover border border-slate-200 shrink-0 shadow-2xs"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-slate-800 text-[11px] truncate">{activeProduct.title}</p>
                      <span className="text-[10px] font-black text-indigo-600">${activeProduct.price.toFixed(2)}</span>
                      <span className="text-[9px] text-slate-400 ml-2 font-medium">{activeProduct.tag}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Chat Messages Body */}
              <div className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-4 bg-slate-50/40">
                {activeMessages.map((msg) => {
                  const isMe = msg.senderId === currentUser.id;
                  const msgReactions = reactions[msg.id] || [];

                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-2 group ${isMe ? 'flex-row-reverse items-end' : 'flex-row items-end'}`}
                    >
                      {/* Avatar */}
                      <img
                        src={isMe ? currentUser.avatar : activeConv.otherParticipant.avatar}
                        alt="Avatar"
                        className="w-6 h-6 rounded-full object-cover shrink-0 mb-1 border border-slate-200 shadow-2xs"
                      />

                      <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[85%] sm:max-w-md`}>
                        {/* Sender Label */}
                        <span className="text-[9px] font-semibold text-slate-400 px-1 mb-0.5">
                          {isMe ? 'You' : msg.senderName}
                        </span>

                        {/* Message Bubble Container */}
                        <div className="relative group/bubble">
                          <div
                            className={`p-3 rounded-2xl text-xs leading-relaxed space-y-1.5 shadow-xs transition-all ${
                              isMe
                                ? 'bg-indigo-600 text-white rounded-br-none shadow-indigo-500/10'
                                : 'bg-white text-slate-800 border border-slate-200/90 rounded-bl-none'
                            }`}
                          >
                            <p className="break-words whitespace-pre-wrap">{msg.text}</p>
                            
                            {/* Timestamp & Read Status */}
                            <div className={`flex items-center justify-end gap-1.5 text-[9px] ${
                              isMe ? 'text-indigo-200' : 'text-slate-400'
                            }`}>
                              <span>{msg.createdAt}</span>
                              {isMe && (
                                <span title="Read by seller">
                                  <CheckCheck className="w-3.5 h-3.5 text-sky-300" />
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Hover Actions Bar (Copy & React) */}
                          <div className={`absolute top-1/2 -translate-y-1/2 opacity-0 group-hover/bubble:opacity-100 transition-opacity duration-150 flex items-center gap-1 bg-white border border-slate-200 shadow-md rounded-full px-1.5 py-1 z-10 ${
                            isMe ? '-left-20' : '-right-20'
                          }`}>
                            <button
                              onClick={() => handleCopyMessage(msg.id, msg.text)}
                              className="p-1 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
                              title="Copy text"
                            >
                              {copiedMsgId === msg.id ? (
                                <Check className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                            <button
                              onClick={() => handleToggleReaction(msg.id, '❤️')}
                              className="p-0.5 hover:scale-125 transition-transform"
                              title="React with ❤️"
                            >
                              ❤️
                            </button>
                            <button
                              onClick={() => handleToggleReaction(msg.id, '👍')}
                              className="p-0.5 hover:scale-125 transition-transform"
                              title="React with 👍"
                            >
                              👍
                            </button>
                          </div>
                        </div>

                        {/* Reactions List below bubble */}
                        {msgReactions.length > 0 && (
                          <div className={`flex items-center gap-1 mt-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                            {msgReactions.map((emoji, idx) => (
                              <span
                                key={idx}
                                onClick={() => handleToggleReaction(msg.id, emoji)}
                                className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-white border border-slate-200 text-[10px] shadow-2xs cursor-pointer hover:bg-slate-50 active:scale-95 transition-all"
                              >
                                {emoji}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Animated Typing Indicator */}
                {isTyping && (
                  <div className="flex items-center gap-2">
                    <img
                      src={activeConv.otherParticipant.avatar}
                      alt="Typing..."
                      className="w-6 h-6 rounded-full object-cover shrink-0 border border-slate-200"
                    />
                    <div className="bg-white border border-slate-200/90 rounded-2xl rounded-bl-none px-3.5 py-2 shadow-2xs flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" />
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Prompt Pills */}
              <div className="px-3 py-1.5 bg-slate-50 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                {QUICK_SUGGESTIONS.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(suggestion)}
                    className="whitespace-nowrap text-[10px] font-medium bg-white hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 text-slate-600 border border-slate-200 px-2.5 py-1 rounded-full transition-all shrink-0 active:scale-95"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>

              {/* Chat Input Bar */}
              <form onSubmit={handleFormSubmit} className="p-3 border-t border-slate-200/80 flex items-center gap-2 bg-white">
                <button
                  type="button"
                  onClick={() => setShowOfferModal(true)}
                  className="p-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-all shrink-0"
                  title="Make an Offer"
                >
                  <DollarSign className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleSend("📸 [Attached Product Inspection Photo]")}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all shrink-0"
                  title="Attach Image"
                >
                  <Paperclip className="w-4 h-4" />
                </button>
                <input
                  type="text"
                  placeholder="Type your message or offer..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 text-xs px-3.5 py-2.5 bg-slate-100/80 border border-slate-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-slate-800 placeholder:text-slate-400 min-w-0"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white p-2.5 rounded-xl transition-all active:scale-95 shrink-0 shadow-xs"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-xs text-slate-400 p-4 text-center">
              <MessageSquare className="w-8 h-8 text-slate-300 mb-2" />
              Select a conversation to start chatting
            </div>
          )}
        </div>
      </div>

      {/* Quick Offer Popup Modal */}
      {showOfferModal && (
        <div className="fixed inset-0 z-60 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-indigo-600" />
                Propose Price Offer
              </h4>
              <button onClick={() => setShowOfferModal(false)} className="p-1 rounded-full hover:bg-slate-100 text-slate-500">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Submit a direct price proposal to <strong className="text-slate-800">{activeConv?.otherParticipant.name}</strong> for {activeProduct.title}.
            </p>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400">$</span>
              <input
                type="number"
                placeholder="Enter offer price"
                value={offerAmount}
                onChange={(e) => setOfferAmount(e.target.value)}
                className="w-full text-sm font-bold pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-slate-900"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowOfferModal(false)}
                className="flex-1 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSendOffer}
                disabled={!offerAmount}
                className="flex-1 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-xl transition-all shadow-xs"
              >
                Send Offer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  </>
);
};

