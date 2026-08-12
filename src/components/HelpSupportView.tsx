'use client';

import React, { useState } from 'react';
import { 
  HelpCircle, 
  Search, 
  MessageSquare, 
  ShieldCheck, 
  FileText, 
  Send, 
  CheckCircle2, 
  ExternalLink, 
  PhoneCall, 
  LifeBuoy, 
  Sparkles, 
  ChevronDown, 
  ChevronUp,
  AlertCircle
} from 'lucide-react';

export const HelpSupportView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  
  // Ticket form
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState('orders_escrow');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketSubmitted, setTicketSubmitted] = useState(false);

  const faqs = [
    {
      q: 'How does BizSocial Escrow protection work for selling products & software?',
      a: 'When a buyer purchases your product or digital software license, the funds are held securely in BizSocial Escrow. Once the physical item is delivered or the digital software key/API is verified, funds are released directly to your business wallet within 24 hours.'
    },
    {
      q: 'Can I sell custom SaaS software or API subscriptions on BizSocial?',
      a: 'Yes! BizSocial includes dedicated software distribution tools. You can issue digital license keys, generate API access tokens, offer web app access tiers, and handle recurring buyer billing directly through our marketplace.'
    },
    {
      q: 'How do I submit a "Sell to Us" direct wholesale offer to BizSocial Buy Desk?',
      a: 'Navigate to "Sell to Us Direct" in the top menu or click the handshake icon. Fill out your inventory count, unit pricing, and product photos. Our procurement team will review and send a cash payout offer within 4 business hours.'
    },
    {
      q: 'What are the fees for listing physical items vs software SaaS tools?',
      a: 'Basic sellers enjoy 0% listing fees up to 10 products. PRO Business members ($49/mo) get unlimited physical & software listings with a reduced flat 1.5% escrow payout fee.'
    },
    {
      q: 'How do I request a verified B2B Trust Badge for my business profile?',
      a: 'Go to Settings & Privacy -> Business Profile and submit your company registration number or tax ID. Our verification team validates your status within 24 hours to award the B2B Verified badge.'
    }
  ];

  const filteredFaqs = faqs.filter(f => 
    f.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
    f.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketMessage) return;
    setTicketSubmitted(true);
    setTimeout(() => {
      setTicketSubmitted(false);
      setTicketSubject('');
      setTicketMessage('');
    }, 4000);
  };

  return (
    <div className="space-y-4 pb-6 font-sans text-slate-800">
      
      {/* Header Banner */}
      <div className="mb-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden text-left">
        <div className="absolute right-0 top-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 bg-indigo-500/20 text-indigo-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-indigo-400/20 mb-2">
            <LifeBuoy className="w-3.5 h-3.5 text-indigo-400" />
            <span>24/7 BUSINESS SUPPORT CENTER</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">How can we help your business today?</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Search our knowledge base, submit a high-priority support ticket, or check real-time system escrow status.
          </p>

          {/* Search Box */}
          <div className="mt-5 relative max-w-2xl">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search help articles (e.g. escrow payouts, SaaS licensing, B2B quotes)..."
              className="w-full pl-11 pr-4 py-3 bg-white/10 hover:bg-white/15 focus:bg-white text-xs sm:text-sm text-white focus:text-slate-900 placeholder-slate-400 focus:placeholder-slate-400 rounded-2xl border border-white/20 focus:outline-none transition-all shadow-inner"
            />
          </div>
        </div>
      </div>

      {/* System Operational Status Strip */}
      <div className="mb-8 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-emerald-950 text-left">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping shrink-0" />
          <div>
            <span className="text-xs font-black text-emerald-900">All BizSocial Platform Systems Operational</span>
            <p className="text-[11px] text-emerald-700">Escrow Payout API • SaaS Software Delivery • Chat Messaging (Latency 12ms)</p>
          </div>
        </div>
        <span className="text-[10px] font-bold bg-emerald-200/80 text-emerald-900 px-2.5 py-1 rounded-lg shrink-0">
          Status 100% OK
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
        
        {/* Left Column: FAQ Accordion */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-indigo-600" />
              <span>Frequently Asked Questions</span>
            </h2>
            <span className="text-xs text-slate-500">{filteredFaqs.length} articles found</span>
          </div>

          <div className="space-y-3">
            {filteredFaqs.map((faq, index) => (
              <div 
                key={index}
                className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full p-4 text-left font-bold text-xs sm:text-sm text-slate-900 flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <span className="pr-4">{faq.q}</span>
                  {openFaq === index ? (
                    <ChevronUp className="w-4 h-4 text-indigo-600 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>

                {openFaq === index && (
                  <div className="px-4 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3 bg-slate-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Submit Support Ticket Form & Quick Channels */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Submit Support Ticket Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Open a Business Ticket</h3>
                <p className="text-[11px] text-slate-500">Average response time under 15 minutes</p>
              </div>
            </div>

            {ticketSubmitted ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-2 py-6">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="text-xs font-bold text-emerald-900">Support Ticket Created!</h4>
                <p className="text-[11px] text-emerald-700">Ticket #BS-{Math.floor(100000 + Math.random() * 900000)} has been sent to our priority queue.</p>
              </div>
            ) : (
              <form onSubmit={handleTicketSubmit} className="space-y-3 mt-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Issue Category</label>
                  <select
                    value={ticketCategory}
                    onChange={(e) => setTicketCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 rounded-xl text-xs text-slate-800 focus:outline-none"
                  >
                    <option value="orders_escrow">Orders & Escrow Payouts</option>
                    <option value="software_saas">Software Licensing & SaaS API</option>
                    <option value="sell_to_us">Sell To Us Wholesale Offer</option>
                    <option value="account_verification">Business Verification & Badge</option>
                    <option value="other">General Technical Support</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    placeholder="Brief description of your issue"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 rounded-xl text-xs text-slate-800 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Detailed Message</label>
                  <textarea
                    rows={4}
                    required
                    value={ticketMessage}
                    onChange={(e) => setTicketMessage(e.target.value)}
                    placeholder="Provide order IDs, transaction hashes, or steps to reproduce..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 rounded-xl text-xs text-slate-800 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Ticket to Priority Desk</span>
                </button>
              </form>
            )}
          </div>

          {/* Quick Contact Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white text-left hover:border-indigo-300 transition-all">
              <PhoneCall className="w-5 h-5 text-indigo-600 mb-1.5" />
              <h4 className="text-xs font-bold text-slate-900">VIP Phone Desk</h4>
              <p className="text-[10px] text-slate-500">+1 (800) 555-BIZSO</p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-white text-left hover:border-indigo-300 transition-all">
              <FileText className="w-5 h-5 text-purple-600 mb-1.5" />
              <h4 className="text-xs font-bold text-slate-900">API Documentation</h4>
              <p className="text-[10px] text-slate-500">docs.bizsocial.com</p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
