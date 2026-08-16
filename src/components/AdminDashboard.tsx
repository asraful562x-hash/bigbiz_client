'use client';

import React, { useState } from 'react';
import { User, Dispute, Order, Listing, Post, UserRole } from '../types';
import { 
  ShieldAlert, 
  DollarSign, 
  Users, 
  Sliders, 
  Settings2, 
  Terminal, 
  Activity, 
  Radio, 
  Lock, 
  Unlock, 
  Cpu, 
  Server, 
  Database, 
  ShieldCheck 
} from 'lucide-react';

import { AdminOverviewSection } from './admin/AdminOverviewSection';
import { AdminEscrowVaultSection } from './admin/AdminEscrowVaultSection';
import { AdminUserGovernanceSection } from './admin/AdminUserGovernanceSection';
import { AdminListingCatalogSection } from './admin/AdminListingCatalogSection';
import { AdminPolicyFeeSection } from './admin/AdminPolicyFeeSection';
import { AdminAuditLogsSection, AuditLogItem } from './admin/AdminAuditLogsSection';

interface AdminDashboardProps {
  currentUser: User;
  users: User[];
  disputes: Dispute[];
  orders?: Order[];
  listings?: Listing[];
  posts?: Post[];
  onUpdateDisputeStatus?: (disputeId: string, status: Dispute['status']) => void;
  onToggleUserVerification?: (userId: string) => void;
  onUpdateUserRole?: (userId: string, newRole: UserRole) => void;
  onDeleteListing?: (listingId: string) => void;
  onDeletePost?: (postId: string) => void;
  onToggleUserBan?: (userId: string) => void;
}

type AdminSection = 
  | 'overview' 
  | 'escrow_vault' 
  | 'user_control' 
  | 'listing_moderation' 
  | 'fee_settings' 
  | 'audit_logs';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  users = [],
  disputes = [],
  orders = [],
  listings = [],
  onUpdateDisputeStatus,
  onToggleUserVerification,
  onUpdateUserRole,
  onDeleteListing,
  onToggleUserBan
}) => {
  const [activeSection, setActiveSection] = useState<AdminSection>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFee, setPlatformFee] = useState('3.0');
  const [minPayout, setMinPayout] = useState('50.00');
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [isVaultLocked, setIsVaultLocked] = useState(false);
  const [feeSavedToast, setFeeSavedToast] = useState(false);

  // In-Memory Audit Logs
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([
    { id: 'log_1', timestamp: '2026-08-16 13:58:12', action: 'ESCROW_HOLD_INITIATED', admin: 'System Daemon', level: 'INFO', details: 'Order #ORD-98231 escrow deposit confirmed ($450.00)' },
    { id: 'log_2', timestamp: '2026-08-16 13:42:05', action: 'DISPUTE_FILED', admin: 'Auto-Sentinel', level: 'WARN', details: 'Dispute #disp_1 filed by Sarah Jenkins against Craft & Clay' },
    { id: 'log_3', timestamp: '2026-08-16 12:30:19', action: 'MERCHANT_BADGE_GRANTED', admin: currentUser.name, level: 'INFO', details: 'User verified status updated for Vintage Vault LLC' },
    { id: 'log_4', timestamp: '2026-08-16 11:15:44', action: 'RATE_LIMIT_ANOMALY', admin: 'Firewall Guard', level: 'WARN', details: 'IP 194.22.81.10 exceeded 120 req/sec threshold' },
    { id: 'log_5', timestamp: '2026-08-16 09:04:31', action: 'DATABASE_BACKUP_COMPLETED', admin: 'Cron Engine', level: 'INFO', details: 'Automated snapshot #snap-20260816-0900 archived to Cold Storage' }
  ]);

  const addAuditLog = (action: string, level: 'INFO' | 'WARN' | 'CRITICAL', details: string) => {
    const newLog: AuditLogItem = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      action,
      admin: currentUser.name,
      level,
      details
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const handleSavePlatformFees = (e: React.FormEvent) => {
    e.preventDefault();
    addAuditLog('COMMISSION_POLICY_UPDATED', 'WARN', `Marketplace fee adjusted to ${platformFee}% | Min payout: $${minPayout}`);
    setFeeSavedToast(true);
    setTimeout(() => setFeeSavedToast(false), 2000);
  };

  const totalEscrowVolume = orders.reduce((sum, o) => sum + (o.totalAmount || o.price || 0), 0);
  const activeHeldEscrow = orders.filter(o => o.escrowStatus === 'held').reduce((sum, o) => sum + (o.totalAmount || o.price || 0), 0);

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredListings = listings.filter(l =>
    l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.sellerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-5 pb-12 font-sans text-slate-900">
      
      {/* ── PRIVATE MISSION CONTROL TOP BANNER ── */}
      <div className="bg-gradient-to-r from-slate-950 via-purple-950 to-indigo-950 text-white p-6 rounded-3xl border border-purple-800/40 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-xl">
                <ShieldAlert className="w-5 h-5" />
              </span>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                Private Admin Mission Control
              </h1>
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Radio className="w-2.5 h-2.5 animate-pulse" /> LIVE TELEMETRY
              </span>
            </div>
            <p className="text-xs text-purple-200/80 max-w-2xl leading-relaxed">
              Restricted platform governance terminal. Manage Escrow Vault overrides, merchant verification, dispute rulings, system policies, and real-time security auditing.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-900/80 p-2 rounded-2xl border border-purple-800/50 shrink-0">
            <button
              onClick={() => {
                const next = !isVaultLocked;
                setIsVaultLocked(next);
                addAuditLog('VAULT_LOCK_TOGGLED', next ? 'CRITICAL' : 'INFO', `Escrow Vault lock state set to: ${next ? 'FROZEN' : 'ACTIVE'}`);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
                isVaultLocked
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/40'
                  : 'bg-emerald-900/60 text-emerald-300 border border-emerald-700/50 hover:bg-emerald-900'
              }`}
            >
              {isVaultLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
              <span>{isVaultLocked ? 'Escrow Vault FROZEN' : 'Vault Active'}</span>
            </button>

            <button
              onClick={() => {
                const next = !isMaintenanceMode;
                setIsMaintenanceMode(next);
                addAuditLog('MAINTENANCE_TOGGLED', next ? 'WARN' : 'INFO', `Maintenance mode set to: ${next ? 'ENABLED' : 'DISABLED'}`);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
                isMaintenanceMode
                  ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/40'
                  : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>{isMaintenanceMode ? 'Maintenance ON' : 'Platform Online'}</span>
            </button>
          </div>
        </div>

        {/* System Telemetry Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-4 border-t border-purple-900/40 text-xs">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-purple-400 shrink-0" />
            <div>
              <span className="text-[10px] text-purple-300 font-semibold block">API Engine Latency</span>
              <span className="font-mono font-bold text-white">24ms (Optimal)</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <span className="text-[10px] text-purple-300 font-semibold block">Database Connections</span>
              <span className="font-mono font-bold text-white">42 Active Pools</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-sky-400 shrink-0" />
            <div>
              <span className="text-[10px] text-purple-300 font-semibold block">Escrow Vault Held</span>
              <span className="font-mono font-bold text-emerald-400">${activeHeldEscrow.toFixed(2)}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <span className="text-[10px] text-purple-300 font-semibold block">Security Sentinel</span>
              <span className="font-mono font-bold text-amber-300">Level 4 Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── PRIVATE CONTROLLER NAVIGATION TABS ── */}
      <div className="flex items-center gap-1.5 overflow-x-auto p-1.5 bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-sm text-xs font-bold shrink-0">
        <button
          type="button"
          onClick={() => setActiveSection('overview')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
            activeSection === 'overview' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Dashboard Overview</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('escrow_vault')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
            activeSection === 'escrow_vault' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
          <span>Escrow Vault & Disputes</span>
          {disputes.length > 0 && (
            <span className="bg-rose-500 text-white text-[9px] px-1.5 py-0.2 rounded-full font-black">
              {disputes.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('user_control')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
            activeSection === 'user_control' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>User & Merchant Governance</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('listing_moderation')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
            activeSection === 'listing_moderation' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Listing Catalog Controller</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('fee_settings')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
            activeSection === 'fee_settings' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Settings2 className="w-3.5 h-3.5" />
          <span>Commission & Policies</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('audit_logs')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
            activeSection === 'audit_logs' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>Audit Logs</span>
        </button>
      </div>

      {/* ── SECTION RENDERERS ── */}
      {activeSection === 'overview' && (
        <AdminOverviewSection
          users={users}
          orders={orders}
          disputes={disputes}
          listings={listings}
          totalEscrowVolume={totalEscrowVolume}
          onNavigateSection={setActiveSection}
        />
      )}

      {activeSection === 'escrow_vault' && (
        <AdminEscrowVaultSection
          disputes={disputes}
          orders={orders}
          onUpdateDisputeStatus={onUpdateDisputeStatus}
          addAuditLog={addAuditLog}
        />
      )}

      {activeSection === 'user_control' && (
        <AdminUserGovernanceSection
          filteredUsers={filteredUsers}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onUpdateUserRole={onUpdateUserRole}
          onToggleUserVerification={onToggleUserVerification}
          onToggleUserBan={onToggleUserBan}
          addAuditLog={addAuditLog}
        />
      )}

      {activeSection === 'listing_moderation' && (
        <AdminListingCatalogSection
          filteredListings={filteredListings}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onDeleteListing={onDeleteListing}
          addAuditLog={addAuditLog}
        />
      )}

      {activeSection === 'fee_settings' && (
        <AdminPolicyFeeSection
          platformFee={platformFee}
          setPlatformFee={setPlatformFee}
          minPayout={minPayout}
          setMinPayout={setMinPayout}
          feeSavedToast={feeSavedToast}
          onSavePlatformFees={handleSavePlatformFees}
        />
      )}

      {activeSection === 'audit_logs' && (
        <AdminAuditLogsSection auditLogs={auditLogs} />
      )}

    </div>
  );
};
