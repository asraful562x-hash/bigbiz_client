import React from 'react';
import { Terminal } from 'lucide-react';

export interface AuditLogItem {
  id: string;
  timestamp: string;
  action: string;
  admin: string;
  level: 'INFO' | 'WARN' | 'CRITICAL';
  details: string;
}

interface AdminAuditLogsSectionProps {
  auditLogs: AuditLogItem[];
}

export const AdminAuditLogsSection: React.FC<AdminAuditLogsSectionProps> = ({ auditLogs }) => {
  return (
    <div className="bg-slate-950 text-slate-100 p-6 rounded-3xl border border-slate-800 shadow-2xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-purple-400" />
          <h3 className="font-extrabold text-sm text-white uppercase tracking-wider">
            Immutable System Audit Trail
          </h3>
        </div>
        <span className="text-[10px] font-mono text-slate-400">SHA-256 Verified Ledger</span>
      </div>

      <div className="font-mono text-[11px] space-y-2 max-h-96 overflow-y-auto pr-2">
        {auditLogs.map((log) => (
          <div key={log.id} className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 space-y-1">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className={`px-1.5 py-0.2 rounded text-[9px] font-black ${
                  log.level === 'CRITICAL' 
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' 
                    : log.level === 'WARN' 
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                      : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                }`}>
                  {log.level}
                </span>
                <span className="font-bold text-purple-300">{log.action}</span>
              </div>
              <span className="text-[10px] text-slate-500">{log.timestamp}</span>
            </div>
            <p className="text-slate-300">{log.details}</p>
            <span className="text-[9px] text-slate-500 block">Actor: {log.admin}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
