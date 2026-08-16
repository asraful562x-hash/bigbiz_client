import React, { useState } from 'react';
import { User } from '../types';
import { X, FileText, Send, DollarSign, ShieldCheck, CheckCircle2, Building2, Sparkles, UserCheck } from 'lucide-react';

interface CreateQuoteModalProps {
  currentUser: User;
  users: User[];
  onClose: () => void;
  onSubmitQuote: (title: string, amount: number, clientName: string, description?: string, targetUserId?: string) => void;
}

export const CreateQuoteModal: React.FC<CreateQuoteModalProps> = ({
  currentUser,
  users,
  onClose,
  onSubmitQuote
}) => {
  const otherUsers = users.filter(u => u.id !== currentUser.id);
  const [selectedUserId, setSelectedUserId] = useState<string>(otherUsers[0]?.id || '');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [clientName, setClientName] = useState(otherUsers[0]?.name || '');
  const [description, setDescription] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSelectClient = (userId: string) => {
    setSelectedUserId(userId);
    const matched = users.find(u => u.id === userId);
    if (matched) {
      setClientName(matched.name);
    }
  };

  const handleApplyTemplate = (tplTitle: string, tplAmount: string, tplDesc: string) => {
    setTitle(tplTitle);
    setAmount(tplAmount);
    setDescription(tplDesc);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount || !clientName) return;

    onSubmitQuote(title, parseFloat(amount), clientName, description, selectedUserId);
    setIsSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden font-sans text-left">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-purple-300 font-bold border border-white/10">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">Draft B2B Escrow Quote</h3>
              <p className="text-xs text-purple-200">Send verified binding contract to client</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-2xl animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-lg font-black text-slate-900">B2B Quote Dispatched to Escrow!</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Your formal quote for <strong>"{title}"</strong> (${parseFloat(amount || '0').toLocaleString()}) has been sent to <strong>{clientName}</strong> and added to your active Escrow Orders Tracker.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            
            {/* Quick Templates */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Quick Contract Presets:
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => handleApplyTemplate('Wholesale Batch (500 Units)', '4500.00', '500 units bulk packaging with custom branding. 5-day inspection period upon freight delivery.')}
                  className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl text-[11px] font-bold border border-purple-200 transition-colors cursor-pointer"
                >
                  📦 Wholesale Batch
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyTemplate('Enterprise Software Integration & SLA', '3200.00', 'Full API integration, webhook setup, and 12-month SLA maintenance with dedicated engineer.')}
                  className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-[11px] font-bold border border-indigo-200 transition-colors cursor-pointer"
                >
                  💻 Software / SLA
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyTemplate('Commercial Photography & Media Rights', '1250.00', 'Full 4K commercial photoshoot, 40 color-graded assets, full lifetime media licensing rights.')}
                  className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-[11px] font-bold border border-emerald-200 transition-colors cursor-pointer"
                >
                  📸 Media Retainer
                </button>
              </div>
            </div>

            {/* Client Picker */}
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>Select Client / Counterparty</span>
                <span className="text-[10px] font-medium text-slate-400 lowercase">select registered user or type</span>
              </label>
              {otherUsers.length > 0 && (
                <div className="flex gap-2 mb-2 overflow-x-auto pb-1">
                  {otherUsers.slice(0, 4).map(u => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => handleSelectClient(u.id)}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border shrink-0 transition-all cursor-pointer ${
                        clientName === u.name 
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs' 
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-indigo-50'
                      }`}
                    >
                      <img src={u.avatar} alt="" className="w-4 h-4 rounded-full object-cover" />
                      <span>{u.name}</span>
                    </button>
                  ))}
                </div>
              )}
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. Acme Corp / Sarah Jenkins"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                Contract / Deliverable Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Custom Enterprise Software Integration & Support"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                Total Contract Amount ($ USD)
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="number"
                  required
                  min="1"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="2500.00"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                Deliverables & Scope Terms
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe milestone deliverables, code transfer terms, or inspection period details..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              />
            </div>

            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-800 text-[11px] flex items-center gap-2 font-medium">
              <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>Funds will be held safely in BizSocial Escrow Vault upon client acceptance.</span>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-2xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Send className="w-3.5 h-3.5" /> Dispatch B2B Quote
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
