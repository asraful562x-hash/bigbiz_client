'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Conversation, Message, User } from '../types';
import { 
  Send, 
  CheckCheck, 
  MessageSquare, 
  ArrowLeft, 
  DollarSign, 
  Copy, 
  Check, 
  Search, 
  ShieldCheck, 
  Tag, 
  Sparkles,
  Smile,
  Store,
  PhoneCall,
  MoreVertical,
  SlidersHorizontal,
  X,
  Bot,
  RefreshCw,
  HelpCircle,
  Package,
  CreditCard,
  UserCircle
} from 'lucide-react';

interface DirectMessagesViewProps {
  currentUser: User;
  conversations: Conversation[];
  messages: Message[];
  initialSellerId?: string | null;
  initialTab?: 'direct' | 'ai_bot';
  onSendMessage: (conversationId: string, text: string) => void;
  onOpenSellerProfile?: (id: string) => void;
}

// ─── BizBot Knowledge Base ───────────────────────────────────────────────────
interface BotRule {
  keywords: string[];
  response: string;
  followUps?: string[];
}

const BOT_RULES: BotRule[] = [
  {
    keywords: ['login', 'sign in', 'cant login', "can't login", 'password', 'forgot', 'access', 'log in'],
    response: "**Login issues?** Here's how to fix them:\n\n1. Make sure you're using the email registered with BizSocial.\n2. Try resetting your password via the **Forgot Password** link on the login page.\n3. If you use Google or Facebook login, click the OAuth button instead of the email form.\n4. Clear your browser cache and try again.\n\nStill stuck? Our support desk can assist you at support@bizsocial.com 🙌",
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
    response: "**Payment & Billing Information:**\n\n• BizSocial takes a **3% transaction fee** on completed sales.\n• Sellers receive payouts within **24–48 hours** of delivery confirmation.\n• Refunds are processed within **5–7 business days**.\n• Supported payment methods: Cards, Bank Transfer, Mobile Banking.\n\nFor billing issues, visit **Settings → Billing** or contact support.",
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
    keywords: ['contact', 'human', 'agent', 'support team', 'email support', 'talk to someone', 'real person'],
    response: "**Reach Our Support Team:**\n\n📧 **Email:** support@bizsocial.com\n📞 **Phone:** +1 (800) 249-7662 *(Mon–Fri, 9am–6pm UTC)*\n💬 **Live Chat:** Available for Premium users in Settings → Help.\n\nAverage response time: **< 2 hours** for email, **instant** for live chat (Pro+).\n\nYou can also visit our full **Help Center** in the **Help** tab!",
    followUps: ['Open a support ticket', 'Check my ticket status', 'Visit the Help Center'],
  },
  {
    keywords: ['hello', 'hi', 'hey', 'help', 'start', 'helo', 'hii'],
    response: "👋 **Hey there! I'm BizBot AI**, your 24/7 assistant.\n\nI can help you with:\n• Account & login issues\n• Creating listings\n• Orders & escrow\n• Payments & billing\n• Verification\n• Premium plans\n\nJust type your question or pick a topic below!",
    followUps: ['Login & Account', 'Orders & Escrow', 'Create a Listing', 'Payments & Billing', 'Contact Support'],
  },
];

const FALLBACK_RESPONSE = "I'm not sure about that, but I'm here to help! Could you rephrase your question, or try one of the quick topics below? You can also contact our support team at **support@bizsocial.com**.";
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

function renderMarkdown(text: string) {
  const lines = text.split('\n');
  return lines.map((line, i) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g).map((p, j) => {
      if (p.startsWith('**') && p.endsWith('**')) {
        return <strong key={j}>{p.slice(2, -2)}</strong>;
      }
      return p;
    });

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

    if (line.startsWith('• ') || line.startsWith('* ')) {
      return <div key={i} className="flex items-start gap-1.5 pl-1"><span className="text-indigo-400 mt-0.5 shrink-0">•</span><span>{parts}</span></div>;
    }

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

interface BotChatMessage {
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

const INITIAL_BOT_MESSAGE: BotChatMessage = {
  id: 'welcome',
  role: 'bot',
  text: "👋 **Welcome to BizBot AI Support!**\n\nI can help you instantly with account issues, listings, escrow orders, payments, and platform rules.\n\nAsk me anything or choose a quick topic below!",
  time: 'Just now',
  followUps: QUICK_TOPICS.map(t => t.label),
};

const CONVERSATION_PRODUCTS: Record<string, { title: string; price: number; image: string; tag: string }> = {
  'conv_1': {
    title: 'Walnut Wood MagSafe Floating Desk Stand',
    price: 89.00,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=200&auto=format&fit=crop&q=80',
    tag: 'Order #1002 • Escrow Secured'
  },
  'conv_2': {
    title: 'Handmade Stoneware Ceramic Coffee Mug',
    price: 34.00,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=200&auto=format&fit=crop&q=80',
    tag: 'Inquiry • In Stock'
  }
};

const QUICK_SUGGESTIONS = [
  "Is this still available for delivery?",
  "Can you provide wholesale volume discount?",
  "What is the best price including express shipping?",
  "Please send commercial invoice & warranty terms"
];

export const DirectMessagesView: React.FC<DirectMessagesViewProps> = ({
  currentUser,
  conversations,
  messages,
  initialSellerId,
  initialTab = 'direct',
  onSendMessage,
  onOpenSellerProfile
}) => {
  // Top Level Mode: 'direct' (Partner Chats) vs 'ai_bot' (BizBot AI)
  const [activeViewTab, setActiveViewTab] = useState<'direct' | 'ai_bot'>(initialTab);

  // Direct Chat State
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // BizBot State
  const [botMessages, setBotMessages] = useState<BotChatMessage[]>([INITIAL_BOT_MESSAGE]);
  const [botInput, setBotInput] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const botEndRef = useRef<HTMLDivElement>(null);

  const activeConv = conversations.find(c => c.id === activeConvId);
  const activeMessages = messages.filter(m => m.conversationId === activeConvId);
  const activeProduct = CONVERSATION_PRODUCTS[activeConvId] || {
    title: 'Marketplace Commercial Deal',
    price: 150.00,
    image: activeConv?.otherParticipant.avatar || '',
    tag: 'Verified Transaction'
  };

  const filteredConversations = conversations.filter(conv =>
    conv.otherParticipant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (activeViewTab === 'direct') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else {
      botEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeMessages, isTyping, botMessages, isBotTyping, activeViewTab]);

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || !activeConvId) return;

    onSendMessage(activeConvId, text.trim());
    setInputText('');

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
    }, 1800);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend();
  };

  const handleSendBotMessage = (textToSend?: string) => {
    const text = textToSend || botInput;
    if (!text.trim()) return;

    const userMsg: BotChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setBotMessages(prev => [...prev, userMsg]);
    setBotInput('');
    setIsBotTyping(true);

    const delay = 600 + Math.random() * 500;
    setTimeout(() => {
      const { response, followUps } = getBotResponse(text);
      const botMsg: BotChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'bot',
        text: response,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        followUps,
      };
      setBotMessages(prev => [...prev, botMsg]);
      setIsBotTyping(false);
    }, delay);
  };

  const handleBotFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendBotMessage();
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
    handleSend(`🏷️ B2B OFFER PROPOSAL: $${Number(offerAmount).toFixed(2)} for "${activeProduct.title}"`);
    setShowOfferModal(false);
    setOfferAmount('');
  };

  return (
    <div className="h-[calc(100vh-140px)] min-h-[560px] bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col relative">
      
      {/* ── Top Header Navigation Tabs: Direct Messages vs BizBot AI ── */}
      <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between border-b border-white/10 shrink-0">
        <div className="flex items-center gap-1.5 bg-black/40 p-1.5 rounded-2xl border border-white/10 shadow-inner backdrop-blur-md">
          <button
            type="button"
            onClick={() => setActiveViewTab('direct')}
            className={`py-2 px-3.5 rounded-xl font-extrabold text-xs transition-all flex items-center justify-center gap-2 ${
              activeViewTab === 'direct'
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-600/40 border border-indigo-400/40 scale-[1.01]'
                : 'text-slate-400 hover:text-white hover:bg-white/5 font-semibold'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>User Chats</span>
            <span className="px-1.5 py-0.2 text-[10px] font-black bg-white/20 text-white rounded-full">
              {conversations.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveViewTab('ai_bot')}
            className={`py-2 px-3.5 rounded-xl font-extrabold text-xs transition-all flex items-center justify-center gap-2 ${
              activeViewTab === 'ai_bot'
                ? 'bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-600 text-white shadow-lg shadow-purple-600/40 border border-purple-400/40 scale-[1.01]'
                : 'text-slate-400 hover:text-purple-300 hover:bg-white/5 font-semibold'
            }`}
          >
            <div className="relative flex items-center justify-center">
              <Bot className="w-4 h-4 text-purple-200" />
              <Sparkles className="w-2 h-2 text-amber-300 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <span>BizBot AI</span>
            <span className="px-1.5 py-0.2 text-[9px] font-black bg-purple-400/20 text-purple-200 rounded-full border border-purple-400/30">
              24/7
            </span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
          {activeViewTab === 'direct' ? (
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Escrow Protected Chats
            </span>
          ) : (
            <span className="flex items-center gap-1.5 font-medium text-purple-300">
              <Sparkles className="w-4 h-4 text-amber-400" /> 24/7 Automated Support
            </span>
          )}
        </div>
      </div>

      {/* ── VIEW 1: Direct User Messaging Template ── */}
      {activeViewTab === 'direct' && (
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
          {/* LEFT COLUMN: Conversations Directory */}
          <div className={`w-full md:w-80 lg:w-96 bg-slate-50/90 border-r border-slate-200/80 p-4 space-y-3.5 flex flex-col shrink-0 ${
            mobileView === 'chat' ? 'hidden md:flex' : 'flex'
          }`}>
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-600/10 text-indigo-600 flex items-center justify-center font-black">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-extrabold text-sm text-slate-900 tracking-tight">Active Partners</h2>
                  <p className="text-[11px] text-slate-500 font-medium">B2B & Customer Conversations</p>
                </div>
              </div>
              <span className="text-[10px] bg-indigo-100 text-indigo-700 font-bold px-2 py-0.5 rounded-full">
                {conversations.length} Active
              </span>
            </div>

            {/* Search bar */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search partners, orders, chats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white text-xs pl-8 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800 placeholder:text-slate-400 shadow-2xs"
              />
            </div>

            {/* Conversation List */}
            <div className="space-y-1.5 flex-1 overflow-y-auto pr-0.5 no-scrollbar">
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
                      className={`p-3 rounded-2xl cursor-pointer flex items-center gap-3 transition-all duration-150 ${
                        isActive 
                          ? 'bg-white shadow-sm border border-indigo-100 ring-2 ring-indigo-500/10' 
                          : 'hover:bg-slate-200/50'
                      }`}
                    >
                      <div className="relative shrink-0">
                        <img
                          src={conv.otherParticipant.avatar}
                          alt={conv.otherParticipant.name}
                          className="w-11 h-11 rounded-full object-cover shadow-2xs border border-slate-200/80"
                        />
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-0.5">
                          <span className={`text-xs truncate ${isActive ? 'font-black text-slate-900' : 'font-bold text-slate-800'}`}>
                            {conv.otherParticipant.name}
                          </span>
                          <span className="text-[10px] text-slate-400 shrink-0 ml-1">{conv.lastMessageTime}</span>
                        </div>
                        <p className={`text-[11px] truncate ${isActive ? 'text-indigo-600 font-semibold' : 'text-slate-500'}`}>
                          {conv.lastMessage}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12 px-4 space-y-2">
                  <MessageSquare className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-xs text-slate-500 font-medium">No conversations found</p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Active Chat Thread */}
          <div className={`flex-1 flex flex-col bg-white min-w-0 ${
            mobileView === 'list' ? 'hidden md:flex' : 'flex'
          }`}>
            {activeConv ? (
              <>
                {/* Thread Header */}
                <div className="p-3.5 px-4 border-b border-slate-100 flex items-center justify-between bg-white shadow-2xs z-10">
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      onClick={() => setMobileView('list')}
                      className="md:hidden p-2 bg-slate-100 hover:bg-slate-200 active:scale-95 rounded-xl text-slate-600 transition-all shrink-0"
                      title="Back to list"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <div 
                      className="relative shrink-0 cursor-pointer"
                      onClick={() => onOpenSellerProfile?.(activeConv.otherParticipant.id)}
                    >
                      <img
                        src={activeConv.otherParticipant.avatar}
                        alt={activeConv.otherParticipant.name}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-2xs"
                      />
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 
                          onClick={() => onOpenSellerProfile?.(activeConv.otherParticipant.id)}
                          className="font-extrabold text-sm text-slate-900 truncate hover:text-indigo-600 cursor-pointer"
                        >
                          {activeConv.otherParticipant.name}
                        </h3>
                        <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                      </div>
                      <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                        Online • Verified B2B Merchant
                      </span>
                    </div>
                  </div>

                  {/* Deal Offer CTA */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowOfferModal(true)}
                      className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-xs transition-all active:scale-95"
                    >
                      <DollarSign className="w-3.5 h-3.5" />
                      <span>Send Offer</span>
                    </button>
                  </div>
                </div>

                {/* Product Context Banner */}
                {activeProduct && (
                  <div className="bg-slate-50/80 px-4 py-2 border-b border-slate-100 flex items-center justify-between gap-3 text-xs shrink-0">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={activeProduct.image}
                        alt={activeProduct.title}
                        className="w-8 h-8 rounded-lg object-cover border border-slate-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="font-bold text-slate-800 truncate block">{activeProduct.title}</span>
                        <span className="text-[10px] text-indigo-600 font-semibold">{activeProduct.tag}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-black text-slate-900 block text-xs">${activeProduct.price.toFixed(2)}</span>
                    </div>
                  </div>
                )}

                {/* Message Bubble History */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/40 no-scrollbar">
                  {activeMessages.map((msg) => {
                    const isMe = msg.senderId === currentUser.id;
                    const msgReactions = reactions[msg.id] || [];

                    return (
                  <div
                    key={msg.id}
                    className={`flex flex-col group ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-end gap-2 max-w-[85%] sm:max-w-[75%]">
                      {!isMe && (
                        <img
                          src={activeConv.otherParticipant.avatar}
                          alt={activeConv.otherParticipant.name}
                          className="w-7 h-7 rounded-full object-cover border border-slate-200 shrink-0 mb-1"
                        />
                      )}

                      <div className="space-y-1">
                        <div
                          className={`p-3 rounded-2xl text-xs leading-relaxed break-words relative shadow-2xs ${
                            isMe
                              ? 'bg-indigo-600 text-white rounded-br-xs'
                              : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs'
                          }`}
                        >
                          <p>{msg.text}</p>
                          <div className={`flex items-center justify-end gap-1 text-[9px] mt-1 ${isMe ? 'text-indigo-200' : 'text-slate-400'}`}>
                            <span>{msg.createdAt}</span>
                            {isMe && <CheckCheck className="w-3 h-3 text-indigo-200" />}
                          </div>
                        </div>

                        {/* Reaction badges */}
                        {msgReactions.length > 0 && (
                          <div className={`flex gap-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                            {msgReactions.map((emoji, idx) => (
                              <span key={idx} className="bg-white border border-slate-200 rounded-full px-1.5 py-0.5 text-[10px] shadow-2xs">
                                {emoji}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Hover action toolbar */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 mb-2">
                        <button
                          onClick={() => handleToggleReaction(msg.id, '👍')}
                          className="p-1 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 text-[10px] shadow-2xs"
                          title="Thumbs up"
                        >
                          👍
                        </button>
                        <button
                          onClick={() => handleCopyMessage(msg.id, msg.text)}
                          className="p-1 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 shadow-2xs"
                          title="Copy text"
                        >
                          {copiedMsgId === msg.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>
                  </div>
                    );
                  })}

                  {/* Typing indicator */}
                  {isTyping && (
                    <div className="flex items-center gap-2 text-xs text-slate-500 bg-white border border-slate-200 px-3 py-2 rounded-2xl w-fit shadow-2xs">
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                      <span className="text-[11px] font-medium">{activeConv.otherParticipant.name} is typing...</span>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Suggestions */}
                <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/70 flex gap-2 overflow-x-auto no-scrollbar shrink-0">
                  {QUICK_SUGGESTIONS.map((sugg, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(sugg)}
                      className="bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-indigo-700 text-[11px] font-semibold px-3 py-1.5 rounded-full transition-all whitespace-nowrap active:scale-95 shadow-2xs"
                    >
                      {sugg}
                    </button>
                  ))}
                </div>

                {/* Input Composer */}
                <form onSubmit={handleFormSubmit} className="p-3 border-t border-slate-100 bg-white flex items-center gap-2 shrink-0">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Write a message, negotiate price, or request details..."
                    className="flex-1 bg-slate-100 hover:bg-slate-100/80 focus:bg-white text-xs text-slate-800 placeholder:text-slate-400 pl-4 pr-3 py-2.5 rounded-xl border border-transparent focus:border-indigo-300 outline-none transition-all"
                  />
                  <button
                    type="submit"
                    disabled={!inputText.trim()}
                    className="w-10 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center transition-all active:scale-95 shadow-xs shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3">
                <MessageSquare className="w-12 h-12 text-slate-300" />
                <h3 className="font-extrabold text-base text-slate-800">Select a conversation</h3>
                <p className="text-xs text-slate-500 max-w-sm">
                  Choose an existing partner chat from the directory or start inquiries directly on any marketplace item.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── VIEW 2: BizBot AI Assistant Integrated Tab ── */}
      {activeViewTab === 'ai_bot' && (
        <div className="flex-1 flex flex-col bg-slate-50/50 overflow-hidden min-h-0">
          {/* Bot Sub-Header Info */}
          <div className="bg-white px-5 py-3 border-b border-slate-200/80 flex items-center justify-between shrink-0 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-md">
                  <Bot className="w-6 h-6" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-sm text-slate-900">BizBot AI Assistant</h3>
                  <span className="text-[10px] bg-purple-100 text-purple-700 font-bold px-2 py-0.5 rounded-full border border-purple-200">
                    24/7 Live
                  </span>
                </div>
                <p className="text-xs text-slate-500">Automated help for account, orders, escrow & platform rules</p>
              </div>
            </div>

            <button
              onClick={() => setBotMessages([INITIAL_BOT_MESSAGE])}
              className="p-2 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-slate-100 transition-colors flex items-center gap-1 text-xs font-semibold"
              title="Reset conversation"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset Chat</span>
            </button>
          </div>

          {/* Bot Message History */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 no-scrollbar">
            {botMessages.map((msg) => (
              <div key={msg.id} className={`flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                {msg.role === 'bot' && (
                  <div className="flex items-center gap-1.5 mb-0.5 px-1">
                    <div className="w-5 h-5 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center">
                      <Bot className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-[11px] text-slate-500 font-bold">BizBot AI</span>
                  </div>
                )}

                <div className={`max-w-[90%] sm:max-w-[75%] px-4 py-3 rounded-2xl text-xs leading-relaxed space-y-1 shadow-2xs ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-xs'
                    : 'bg-white text-slate-800 rounded-tl-xs border border-slate-200/90'
                }`}>
                  {msg.role === 'bot' ? renderMarkdown(msg.text) : <p>{msg.text}</p>}
                  <span className={`block text-[10px] mt-1 text-right ${msg.role === 'user' ? 'text-indigo-200' : 'text-slate-400'}`}>
                    {msg.time}
                  </span>
                </div>

                {/* Follow up quick reply options */}
                {msg.role === 'bot' && msg.followUps && msg.followUps.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-1.5 max-w-[90%] sm:max-w-[75%]">
                    {msg.followUps.map((fu) => (
                      <button
                        key={fu}
                        onClick={() => handleSendBotMessage(fu)}
                        className="text-xs bg-white hover:bg-purple-50 border border-slate-200 hover:border-purple-300 text-purple-700 font-bold px-3 py-1.5 rounded-full transition-all active:scale-95 shadow-2xs flex items-center gap-1.5"
                      >
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        <span>{fu}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Bot Typing Indicator */}
            {isBotTyping && (
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="bg-white border border-slate-200 shadow-2xs px-4 py-3 rounded-2xl rounded-tl-xs flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  <span className="text-xs text-slate-500 font-medium ml-2">BizBot is thinking...</span>
                </div>
              </div>
            )}

            <div ref={botEndRef} />
          </div>

          {/* Quick Topics Grid on bottom of Bot tab */}
          {botMessages.length <= 1 && (
            <div className="px-4 sm:px-6 py-3 border-t border-slate-200/80 bg-white shrink-0">
              <p className="text-[11px] text-slate-400 font-bold mb-2 uppercase tracking-wider">Suggested Help Topics</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                {QUICK_TOPICS.map(({ label, icon: Icon }) => (
                  <button
                    key={label}
                    onClick={() => handleSendBotMessage(label)}
                    className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-slate-200 hover:border-purple-300 hover:bg-purple-50 text-center transition-all group active:scale-95 bg-slate-50/50"
                  >
                    <Icon className="w-4 h-4 text-purple-600 group-hover:scale-110 transition-transform mb-1" />
                    <span className="text-[11px] font-bold text-slate-700 group-hover:text-purple-700 leading-tight">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Bot Input Composer */}
          <form onSubmit={handleBotFormSubmit} className="p-3 sm:p-4 border-t border-slate-200/80 bg-white flex items-center gap-2 shrink-0">
            <input
              type="text"
              value={botInput}
              onChange={(e) => setBotInput(e.target.value)}
              placeholder="Ask BizBot anything about orders, verification, listings, payments..."
              className="flex-1 bg-slate-100 hover:bg-slate-100/80 focus:bg-white text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 pl-4 pr-3 py-3 rounded-2xl border border-transparent focus:border-purple-400 outline-none transition-all"
            />
            <button
              type="submit"
              disabled={!botInput.trim() || isBotTyping}
              className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center transition-all active:scale-95 shadow-md shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Direct Offer Modal */}
      {showOfferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
                  <DollarSign className="w-4 h-4" />
                </div>
                <h3 className="font-black text-sm text-slate-900">Make B2B Counter Offer</h3>
              </div>
              <button onClick={() => setShowOfferModal(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Propose a custom price for <strong className="text-slate-900">{activeProduct.title}</strong>. If accepted, transaction proceeds safely in Escrow.
            </p>

            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-black text-slate-500 text-sm">$</span>
              <input
                type="number"
                placeholder="0.00"
                value={offerAmount}
                onChange={(e) => setOfferAmount(e.target.value)}
                className="w-full bg-slate-100 text-slate-900 font-extrabold text-lg pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowOfferModal(false)}
                className="flex-1 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSendOffer}
                disabled={!offerAmount}
                className="flex-1 py-2.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs transition-all disabled:opacity-40"
              >
                Submit Offer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
