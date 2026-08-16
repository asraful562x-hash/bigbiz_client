import React from 'react';
import { User, UserRole } from '../../types';
import { Users, Search, Ban } from 'lucide-react';

interface AdminUserGovernanceSectionProps {
  filteredUsers: User[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onUpdateUserRole?: (userId: string, newRole: UserRole) => void;
  onToggleUserVerification?: (userId: string) => void;
  onToggleUserBan?: (userId: string) => void;
  addAuditLog: (action: string, level: 'INFO' | 'WARN' | 'CRITICAL', details: string) => void;
}

export const AdminUserGovernanceSection: React.FC<AdminUserGovernanceSectionProps> = ({
  filteredUsers,
  searchQuery,
  setSearchQuery,
  onUpdateUserRole,
  onToggleUserVerification,
  onToggleUserBan,
  addAuditLog
}) => {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" /> User Directory & Security Controls
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Manage user roles, merchant verification badges, and account restrictions.</p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search user, email, role..."
            className="w-full text-xs pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 text-slate-400 uppercase font-bold text-[10px]">
              <th className="py-2.5 px-3">User</th>
              <th className="py-2.5 px-3">Role</th>
              <th className="py-2.5 px-3">Subscription</th>
              <th className="py-2.5 px-3">Verification</th>
              <th className="py-2.5 px-3 text-right">Admin Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredUsers.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50">
                <td className="py-3 px-3 flex items-center gap-2.5">
                  <img src={u.avatar} alt="" className="w-8 h-8 rounded-full object-cover border border-slate-200" />
                  <div>
                    <span className="font-bold text-slate-900 block">{u.name}</span>
                    <span className="text-slate-400 text-[10px]">{u.email}</span>
                  </div>
                </td>

                <td className="py-3 px-3">
                  <select
                    value={u.role}
                    onChange={(e) => {
                      onUpdateUserRole?.(u.id, e.target.value as UserRole);
                      addAuditLog('USER_ROLE_CHANGED', 'WARN', `User ${u.name} role changed to ${e.target.value}`);
                    }}
                    className="text-[11px] font-bold bg-slate-100 border border-slate-200 rounded-lg px-2 py-1 focus:outline-none cursor-pointer"
                  >
                    <option value="buyer">Buyer</option>
                    <option value="seller_free">Seller (Free)</option>
                    <option value="seller_premium">Seller (Pro)</option>
                    <option value="procurement">Procurement</option>
                    <option value="admin">Super Admin</option>
                  </select>
                </td>

                <td className="py-3 px-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                    u.subscriptionStatus === 'premium' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {u.subscriptionStatus}
                  </span>
                </td>

                <td className="py-3 px-3">
                  <button
                    type="button"
                    onClick={() => {
                      onToggleUserVerification?.(u.id);
                      addAuditLog('MERCHANT_VERIFICATION_TOGGLED', 'INFO', `User ${u.name} verification set to ${!u.isVerified}`);
                    }}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-colors cursor-pointer border ${
                      u.isVerified 
                        ? 'bg-sky-50 text-sky-700 border-sky-300 hover:bg-sky-100' 
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {u.isVerified ? '✓ Verified Badge' : '+ Verify Merchant'}
                  </button>
                </td>

                <td className="py-3 px-3 text-right">
                  <button
                    type="button"
                    onClick={() => {
                      onToggleUserBan?.(u.id);
                      addAuditLog('USER_SECURITY_SANCTION', 'CRITICAL', `Security action applied for user ${u.name} (${u.id})`);
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Suspend User / Revoke Access"
                  >
                    <Ban className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
