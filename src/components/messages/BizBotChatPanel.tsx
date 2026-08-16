import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Sparkles, RefreshCw, HelpCircle, Package, CreditCard, UserCircle } from 'lucide-react';

interface BotMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  followUps?: string[];
}

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
    keywords: ['hello', 'hi', 'hey', 'help', 'start'],
    response: "👋 **Hey there! I'm BizBot AI**, your 24/7 assistant.\n\nI can help you with:\n• Account & login issues\n• Creating listings\n• Orders & escrow\n• Payments & billing\n• Verification\n• Premium plans\n\nJust type your question or pick a topic below!",
    followUps: ['Login & Account', 'Orders & Escrow', 'Create a Listing', 'Payments & Billing'],
  },
];

const FALLBACK_RESPONSE = "I'm not sure about that, but I'm here to help! Could you rephrase your question, or try one of the quick topics below? You can also contact our support team at **support@bizsocial.com**.";
const FALLBACK_FOLLOW_UPS = ['Login & Account', 'Orders & Escrow', 'Payments & Billing'];

function getBotResponse(input: string): { response: string; followUps: string[] } {
  const lower = input.toLowerCase();
  for (const rule of BOT_RULES) {
    if (rule.keywords.some(k => lower.includes(k))) {
      return { response: rule.response, followUps: rule.followUps || FALLBACK_FOLLOW_UPS };
    }
  }
  return { response: FALLBACK_RESPONSE, followUps: FALLBACK_FOLLOW_UPS };
}

export const BizBotChatPanel: React.FC = () => {
  const [botMessages, setBotMessages] = useState<BotMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: "👋 **Welcome to BizBot AI Support!**\n\nI'm available 24/7 to help you with accounts, escrow orders, listings, payments, and platform policies. Type your question below or click any quick topic!",
      timestamp: 'Just now',
      followUps: ['Login & Account', 'Orders & Escrow', 'Create a Listing', 'Payments & Billing']
    }
  ]);
  const [botInputText, setBotInputText] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const botMessagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    botMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [botMessages, isBotTyping]);

  const handleSendBotMessage = (textToSend?: string) => {
    const text = textToSend || botInputText;
    if (!text.trim()) return;

    const userMsg: BotMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setBotMessages(prev => [...prev, userMsg]);
    setBotInputText('');
    setIsBotTyping(true);

    setTimeout(() => {
      const { response, followUps } = getBotResponse(text);
      const botMsg: BotMessage = {
        id: `bot_${Date.now()}`,
        sender: 'bot',
        text: response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        followUps
      };
      setBotMessages(prev => [...prev, botMsg]);
      setIsBotTyping(false);
    }, 450);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-900 min-h-0">
      {/* Bot Chat Header */}
      <div className="p-4 bg-slate-950/90 border-b border-white/10 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-white">BizBot AI Assistant</span>
              <span className="bg-purple-500/20 text-purple-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-purple-400/30">
                24/7 Active
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Automated help desk for orders, escrow, and platform guides</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setBotMessages([{
            id: 'welcome_reset',
            sender: 'bot',
            text: "👋 Chat session cleared! How can I assist you now?",
            timestamp: 'Just now',
            followUps: ['Login & Account', 'Orders & Escrow', 'Create a Listing', 'Payments & Billing']
          }])}
          className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
          title="Reset Chat"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Bot Chat Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {botMessages.map((m) => (
          <div key={m.id} className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[85%] sm:max-w-[75%] p-3.5 rounded-2xl text-xs leading-relaxed ${
              m.sender === 'user'
                ? 'bg-indigo-600 text-white rounded-tr-none'
                : 'bg-slate-800 text-slate-100 rounded-tl-none border border-white/10 shadow-md'
            }`}>
              <p className="whitespace-pre-line">{m.text}</p>
              <span className="text-[9px] opacity-60 block text-right mt-1.5">{m.timestamp}</span>
            </div>

            {/* Follow-up suggestions */}
            {m.sender === 'bot' && m.followUps && (
              <div className="flex flex-wrap gap-1.5 mt-2 max-w-[85%]">
                {m.followUps.map((fu) => (
                  <button
                    key={fu}
                    type="button"
                    onClick={() => handleSendBotMessage(fu)}
                    className="text-[11px] bg-white/10 hover:bg-purple-600 text-purple-200 hover:text-white font-bold px-3 py-1 rounded-full border border-white/15 transition-all cursor-pointer"
                  >
                    {fu}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {isBotTyping && (
          <div className="flex items-center gap-1.5 bg-slate-800 px-3 py-2 rounded-2xl text-xs text-purple-300 w-fit">
            <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" />
            <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            <span className="text-[10px] ml-1">BizBot is typing...</span>
          </div>
        )}
        <div ref={botMessagesEndRef} />
      </div>

      {/* Bot Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendBotMessage();
        }}
        className="p-3 bg-slate-950 border-t border-white/10 flex items-center gap-2 shrink-0"
      >
        <input
          type="text"
          value={botInputText}
          onChange={(e) => setBotInputText(e.target.value)}
          placeholder="Ask BizBot anything (e.g. How does Escrow work?)..."
          className="flex-1 bg-slate-800/90 text-white text-xs px-4 py-2.5 rounded-xl border border-white/20 focus:outline-none focus:border-purple-400"
        />
        <button
          type="submit"
          disabled={!botInputText.trim() || isBotTyping}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2.5 rounded-xl transition-all disabled:opacity-40 cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
