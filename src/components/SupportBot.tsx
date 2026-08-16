'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  MessageCircle,
  X,
  Send,
  Bot,
  ChevronDown,
  Minimize2,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  Package,
  CreditCard,
  UserCircle,
  Store,
  HelpCircle,
} from 'lucide-react';

// ─── Bot knowledge base ────────────────────────────────────────────────────────
interface BotRule {
  keywords: string[];
  response: string;
  followUps?: string[];
}

const BOT_RULES: BotRule[] = [
  {
    keywords: ['login', 'sign in', 'cant login', "can't login", 'password', 'forgot', 'access', 'log in'],
    response: "**Login issues?** Here's how to fix them:\n\n1. Make sure you're using the email registered with BizSocial.\n2. Try resetting your password via the **Forgot Password** link on the login page.\n3. If you use Google or Facebook login, click the OAuth button instead of the email form.\n4. Clear your browser cache and try again.\n\nStill stuck? I can escalate this to our support team. 🙌",
    followUps: ['How do I reset my password?', 'I want to change my email', 'My account is locked'],
  },
  {
    keywords: ['create listing', 'add product', 'sell', 'post listing', 'new listing', 'upload product'],
    response: "**To create a listing:**\n\n1. Click the **＋ button** in the top navigation bar.\n2. Select **Create Listing**.\n3. Fill in the product name, category, price, and images.\n4. Choose between *Fixed Price* or *Negotiable*.\n5. Hit **Publish** — your listing goes live instantly!\n\n💡 *Tip: Premium sellers get priority placement in search results.*",
    followUps: ['What categories can I list in?', 'How do I add images?', 'Can I edit a listing after publishing?'],
  },
  {
    keywords: ['order', 'orders', 'escrow', 'purchase', 'buy', 'checkout', 'payment held', 'transaction'],
    response: "**About Orders & Escrow:**\n\nBizSocial uses a **secure escrow system** to protect both buyers and sellers:\n\n• Payment is held safely until you confirm delivery.\n• You can track order status under **Orders & Escrow** tab.\n• To dispute an order, click **Raise Dispute** on the order card.\n• Funds are released within 24 hours of confirmed delivery.\n\n🔒 All transactions are encrypted and secured.",
    followUps: ['How do I confirm delivery?', 'What if my order is delayed?', 'How do I raise a dispute?'],
  },
  {
    keywords: ['verify', 'verification', 'badge', 'b2b verified', 'verified seller', 'trust'],
    response: "**Verification & Trust Badges:**\n\nTo get your **B2B Verified** badge:\n\n1. Go to **Settings → Security**.\n2. Submit your business registration documents.\n3. Our team reviews within **2-3 business days**.\n4. Once approved, your profile shows a ✅ verified badge.\n\nVerified sellers get higher search rankings and more buyer trust!",
    followUps: ['What documents do I need?', 'How long does verification take?', 'Can I appeal a rejected verification?'],
  },
  {
    keywords: ['payment', 'pay', 'invoice', 'refund', 'billing', 'charge', 'fee'],
    response: "**Payment & Billing Information:**\n\n• BizSocial takes a **3% transaction fee** on completed sales.\n• Sellers receive payouts within **24–48 hours** of delivery confirmation.\n• Refunds are processed within **5–7 business days**.\n• Supported payment methods: Cards, Bank Transfer, Mobile Banking.\n\nFor billing issues, visit **Settings → Billing** or contact support below.",
    followUps: ['How do I add a payment method?', 'When will I receive my payout?', 'How do I request a refund?'],
  },
  {
    keywords: ['premium', 'upgrade', 'pro', 'subscription', 'plan', 'tier'],
    response: "**BizSocial Premium Plans:**\n\n| Plan | Price | Features |\n|------|-------|----------|\n| Free | $0/mo | 5 listings, basic analytics |\n| Pro | $29/mo | Unlimited listings, priority support |\n| Enterprise | Custom | Custom branding, API access |\n\nTo upgrade, go to **Settings → Billing** or click **Upgrade** in the left sidebar.\n\n🎁 First month free for new Premium subscribers!",
    followUps: ['What are the Pro plan benefits?', 'Can I cancel anytime?', 'Do you offer annual discounts?'],
  },
  {
    keywords: ['profile', 'account', 'username', 'bio', 'photo', 'avatar', 'edit profile'],
    response: "**Editing Your Profile:**\n\n1. Click your **avatar** in the top-right corner.\n2. Select **Settings** from the dropdown.\n3. Under **Profile**, update your name, bio, company, website, and avatar.\n4. Click **Save Changes**.\n\nYour public profile is visible to all buyers and sellers on the platform.",
    followUps: ['How do I change my profile picture?', 'Can I make my profile private?', 'How do I add my business details?'],
  },
  {
    keywords: ['delete', 'remove', 'close account', 'deactivate'],
    response: "**Account Deletion:**\n\nTo delete your account:\n\n1. Go to **Settings → Privacy**.\n2. Scroll to **Danger Zone**.\n3. Click **Delete Account** and confirm.\n\n⚠️ *This action is irreversible.* All your listings, orders, and data will be permanently removed.\n\nIf you're having issues, consider **deactivating** your account temporarily instead.",
    followUps: ['Can I recover a deleted account?', 'What happens to my active orders?', 'I want to take a break instead'],
  },
  {
    keywords: ['contact', 'human', 'agent', 'support team', 'email support', 'talk to someone', 'real person'],
    response: "**Reach Our Support Team:**\n\n📧 **Email:** support@bizsocial.com\n📞 **Phone:** +1 (800) 249-7662 *(Mon–Fri, 9am–6pm UTC)*\n💬 **Live Chat:** Available for Premium users in Settings → Help.\n\nAverage response time: **< 2 hours** for email, **instant** for live chat (Pro+).\n\nYou can also visit our full **Help Center** in the **Help** tab!",
    followUps: ['Open a support ticket', 'Check my ticket status', 'Visit the Help Center'],
  },
  {
    keywords: ['hello', 'hi', 'hey', 'help', 'start', 'helo', 'hii'],
    response: "👋 **Hey there! I'm BizBot**, your BizSocial assistant.\n\nI can help you with:\n• Account & login issues\n• Creating listings\n• Orders & payments\n• Verification\n• Premium plans\n\nJust type your question or pick a topic below!",
    followUps: ['Login & Account', 'Orders & Escrow', 'Create a Listing', 'Payments & Billing', 'Contact Support'],
  },
];

const FALLBACK_RESPONSE = "I'm not sure about that, but I'm happy to help! Could you rephrase your question, or try one of the quick topics below? You can also reach our human support team by typing **'contact support'**.";

const FALLBACK_FOLLOW_UPS = ['Login & Account', 'Orders & Escrow', 'Payments & Billing', 'Contact Support'];

function getBotResponse(input: string): { response: string; followUps: string[] } {
  const lower = input.toLowerCase();
  for (const rule of BOT_RULES) {
    if (rule.keywords.some(kw => lower.includes(kw))) {
      return { response: rule.response, followUps: rule.followUps || [] };
    }
  }
  return { response: FALLBACK_RESPONSE, followUps: FALLBACK_FOLLOW_UPS };
}

// ─── Markdown-lite renderer (bold, newlines, bullets) ─────────────────────────
function renderMarkdown(text: string) {
  const lines = text.split('\n');
  return lines.map((line, i) => {
    // Bold: **text**
    const parts = line.split(/(\*\*[^*]+\*\*)/g).map((p, j) => {
      if (p.startsWith('**') && p.endsWith('**')) {
        return <strong key={j}>{p.slice(2, -2)}</strong>;
      }
      return p;
    });

    // Table rows (simple detection)
    if (line.startsWith('|')) {
      if (line.includes('---')) return null;
      const cells = line.split('|').filter(c => c.trim() !== '');
      const isHeader = lines[i + 1]?.includes('---');
      return (
        <div key={i} className={`grid grid-cols-3 text-[11px] gap-1 py-0.5 ${isHeader ? 'font-bold border-b border-slate-300/50' : ''}`}>
          {cells.map((c, ci) => <span key={ci} className="truncate">{c.trim()}</span>)}
        </div>
      );
    }

    // Bullet points
    if (line.startsWith('• ') || line.startsWith('* ')) {
      return <div key={i} className="flex items-start gap-1.5 pl-1"><span className="text-indigo-400 mt-0.5 shrink-0">•</span><span>{parts}</span></div>;
    }

    // Numbered list
    if (/^\d+\./.test(line)) {
      const num = line.match(/^(\d+\.)/)?.[1];
      const rest = line.replace(/^\d+\.\s*/, '');
      const restParts = rest.split(/(\*\*[^*]+\*\*)/g).map((p, j) => {
        if (p.startsWith('**') && p.endsWith('**')) return <strong key={j}>{p.slice(2, -2)}</strong>;
        return p;
      });
      return <div key={i} className="flex items-start gap-1.5 pl-1"><span className="text-indigo-400 shrink-0 font-bold">{num}</span><span>{restParts}</span></div>;
    }

    if (line.trim() === '') return <div key={i} className="h-2" />;

    return <div key={i}>{parts}</div>;
  });
}

// ─── Types ─────────────────────────────────────────────────────────────────────
interface ChatMessage {
  id: string;
  role: 'user' | 'bot';
  text: string;
  time: string;
  followUps?: string[];
}

const QUICK_TOPICS = [
  { label: 'Login & Account', icon: UserCircle },
  { label: 'Create a Listing', icon: Store },
  { label: 'Orders & Escrow', icon: Package },
  { label: 'Payments & Billing', icon: CreditCard },
  { label: 'Verification', icon: ShieldCheck },
  { label: 'Contact Support', icon: HelpCircle },
];

const INITIAL_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'bot',
  text: "👋 **Hey there! I'm BizBot**, your BizSocial assistant.\n\nI can help you with account issues, listings, orders, payments, and more.\n\nJust type your question or choose a topic below!",
  time: 'Just now',
  followUps: QUICK_TOPICS.map(t => t.label),
};

function getTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// ─── Component ─────────────────────────────────────────────────────────────────
export const SupportBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 150);
      setUnreadCount(0);
    }
  }, [isOpen, isMinimized]);

  const handleOpen = () => {
    setIsOpen(true);
    setIsMinimized(false);
    setUnreadCount(0);
  };

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: text.trim(),
      time: getTime(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot "thinking"
    const delay = 800 + Math.random() * 600;
    setTimeout(() => {
      const { response, followUps } = getBotResponse(text);
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'bot',
        text: response,
        time: getTime(),
        followUps,
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
      if (!isOpen || isMinimized) {
        setUnreadCount(prev => prev + 1);
      }
    }, delay);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const handleReset = () => {
    setMessages([INITIAL_MESSAGE]);
    setInputValue('');
    setIsTyping(false);
  };

  return (
    <>
      {/* ── Floating Chat Bubble ─────────────────────────── */}
      {/* ── Floating Support Bot (Clean Bottom-Right Position) ─────────────── */}
      <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 flex flex-col items-end gap-3">

        {/* Chat Panel */}
        {isOpen && (
          <div
            className={`bg-white rounded-3xl shadow-2xl border border-slate-200/80 flex flex-col overflow-hidden transition-all duration-300 ease-out animate-tab-switch ${
              isMinimized ? 'h-14 w-72' : 'w-[340px] sm:w-[380px] h-[560px]'
            }`}
            style={{ maxHeight: 'calc(100vh - 140px)' }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 px-4 py-3 flex items-center gap-3 shrink-0">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center shadow-inner">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-indigo-700 animate-pulse" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-white text-sm tracking-tight flex items-center gap-1.5">
                  BizBot AI
                  <span className="text-[9px] bg-white/20 text-white px-1.5 py-0.5 rounded-full font-bold">24/7 Support</span>
                </div>
                <div className="text-indigo-200 text-[11px] font-medium">
                  {isTyping ? (
                    <span className="text-emerald-300 animate-pulse">Typing…</span>
                  ) : (
                    'Online · Instant automated solutions'
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleReset}
                  className="p-1.5 rounded-lg hover:bg-white/15 text-white/70 hover:text-white transition-colors"
                  title="Reset chat"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsMinimized(prev => !prev)}
                  className="p-1.5 rounded-lg hover:bg-white/15 text-white/70 hover:text-white transition-colors"
                  title={isMinimized ? 'Expand' : 'Minimize'}
                >
                  {isMinimized ? <Sparkles className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/15 text-white/70 hover:text-white transition-colors"
                  title="Close"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            {!isMinimized && (
              <>
                <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 bg-slate-50/60 scrollbar-none">
                  {messages.map(msg => (
                    <div key={msg.id} className={`flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                      {msg.role === 'bot' && (
                        <div className="flex items-center gap-1.5 mb-0.5 px-1">
                          <div className="w-5 h-5 rounded-lg bg-indigo-600 flex items-center justify-center">
                            <Bot className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-[10px] text-slate-400 font-medium">BizBot AI</span>
                        </div>
                      )}

                      <div className={`max-w-[88%] px-3 py-2.5 rounded-2xl text-xs leading-relaxed space-y-0.5 ${
                        msg.role === 'user'
                          ? 'bg-indigo-600 text-white rounded-tr-sm shadow-sm'
                          : 'bg-white text-slate-700 rounded-tl-sm border border-slate-200/80 shadow-xs'
                      }`}>
                        {msg.role === 'bot' ? renderMarkdown(msg.text) : msg.text}
                      </div>

                      <span className="text-[10px] text-slate-400 px-1">{msg.time}</span>

                      {/* Follow-up quick replies */}
                      {msg.role === 'bot' && msg.followUps && msg.followUps.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-1 max-w-[95%]">
                          {msg.followUps.map(fu => (
                            <button
                              key={fu}
                              onClick={() => sendMessage(fu)}
                              className="text-[11px] bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-indigo-700 font-semibold px-2.5 py-1 rounded-full transition-all active:scale-95 shadow-xs"
                            >
                              {fu}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex items-start gap-1.5">
                      <div className="w-5 h-5 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                        <Bot className="w-3 h-3 text-white" />
                      </div>
                      <div className="bg-white border border-slate-200/80 shadow-xs px-3 py-2.5 rounded-2xl rounded-tl-sm flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Topic Grid (only shown when few messages) */}
                {messages.length <= 1 && (
                  <div className="px-3 py-2 border-t border-slate-100 bg-white shrink-0">
                    <p className="text-[10px] text-slate-400 font-semibold mb-2 uppercase tracking-wider">Quick Help Topics</p>
                    <div className="grid grid-cols-3 gap-1.5">
                      {QUICK_TOPICS.map(({ label, icon: Icon }) => (
                        <button
                          key={label}
                          onClick={() => sendMessage(label)}
                          className="flex flex-col items-center gap-1 p-2 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 text-center transition-all group active:scale-95"
                        >
                          <Icon className="w-4 h-4 text-indigo-500 group-hover:text-indigo-700 transition-colors" />
                          <span className="text-[9px] font-bold text-slate-600 group-hover:text-indigo-700 leading-tight">{label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input Row */}
                <form onSubmit={handleSubmit} className="px-3 py-3 border-t border-slate-100 bg-white shrink-0 flex items-center gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    placeholder="Ask BizBot anything…"
                    className="flex-1 bg-slate-100 hover:bg-slate-100/80 focus:bg-white border border-transparent focus:border-indigo-300 text-xs text-slate-800 placeholder-slate-400 rounded-xl px-3 py-2.5 outline-none transition-all"
                  />
                  <button
                    type="submit"
                    disabled={!inputValue.trim() || isTyping}
                    className="w-9 h-9 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center shrink-0 transition-all active:scale-95 shadow-sm"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </>
            )}
          </div>
        )}

        {/* FAB Button with Combined Chat + AI Sparkles Icon */}
        <button
          onClick={isOpen ? () => setIsOpen(false) : handleOpen}
          className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-purple-600 text-white flex items-center justify-center shadow-xl shadow-indigo-600/40 hover:shadow-indigo-600/60 transition-all duration-300 hover:scale-105 active:scale-95 border-2 border-white/20"
          aria-label={isOpen ? 'Close AI support chat' : 'Open AI support chat'}
          title="BizBot AI Support"
        >
          {isOpen ? (
            <X className="w-6 h-6 transition-transform duration-200" />
          ) : (
            <div className="relative flex items-center justify-center">
              {/* Normal Chat Icon combined with AI Sparkles */}
              <MessageCircle className="w-6 h-6 text-white stroke-[2.2]" />
              <Sparkles className="w-3.5 h-3.5 text-amber-300 absolute -top-1.5 -right-1.5 animate-pulse filter drop-shadow-sm" />
            </div>
          )}

          {/* Unread badge */}
          {!isOpen && unreadCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center px-1 border-2 border-white shadow-sm animate-bounce">
              {unreadCount}
            </span>
          )}

          {/* Subtle Glow Ring */}
          {!isOpen && (
            <span className="absolute inset-0 rounded-2xl ring-4 ring-indigo-400/25 animate-ping pointer-events-none" style={{ animationDuration: '3s' }} />
          )}
        </button>
      </div>
    </>
  );
};
