import React from 'react';
import { UserPlus, UserCheck, Clock, Check, X } from 'lucide-react';
import { useNetworkStatus } from '../hooks/useNetworkStatus';

interface MerchantNetworkButtonProps {
  currentUserId: string;
  merchantId: string;
  innerSm: string;
}

export const MerchantNetworkButton: React.FC<MerchantNetworkButtonProps> = ({
  currentUserId,
  merchantId,
  innerSm,
}) => {
  const {
    status,
    isLoading,
    sendRequest,
    acceptRequest,
    rejectRequest,
  } = useNetworkStatus(currentUserId, merchantId);

  const baseBtn = `p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 ${innerSm} transition-colors`;

  if (isLoading) {
    return <div className={baseBtn} />;
  }

  // The other person already sent YOU a request — show Accept instead of "Network"
  if (status === 'pending_received') {
    return (
      <div className="flex items-center gap-1">
        <button onClick={acceptRequest} title="Accept request" className={baseBtn}>
          <Check className="w-4 h-4" />
        </button>
        <button onClick={rejectRequest} title="Reject request" className={baseBtn}>
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // You already sent a request — same button style, just disabled + clock icon
  if (status === 'pending_sent') {
    return (
      <button disabled title="Request pending" className={`${baseBtn} cursor-default opacity-60`}>
        <Clock className="w-4 h-4" />
      </button>
    );
  }

  // Already connected
  if (status === 'connected') {
    return (
      <button disabled title="Connected" className={`${baseBtn} cursor-default`}>
        <UserCheck className="w-4 h-4" />
      </button>
    );
  }

  // status === 'none'
  return (
    <button onClick={sendRequest} title="Send network request" className={baseBtn}>
      <UserPlus className="w-4 h-4" />
    </button>
  );
};