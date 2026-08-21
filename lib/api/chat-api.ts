import type { Conversation, Message, User } from '../../src/types';
import { API_CONFIG } from '../../src/config/api.config';
import {
  encodeProfileSlug,
  encodeChatSlug,
  decodeProfileSlug,
  decodeChatSlug
} from '../../src/utils/routeCrypto';

const API_BASE = API_CONFIG.BASE_URL;

// ── Raw backend shapes ───────────────────────────────────────────────────────

interface BackendInbox {
  id: number;
  initator_id: number;
  participator_id: number;
  create_date_time: string;
  update_date_time: string;
}

interface BackendInboxUser {
  id: number;
  full_name: string;
  email: string;
}

interface BackendInboxResponse extends BackendInbox {
  participator?: BackendInboxUser;
  last_message: string;
  unread_count: number;
}

interface BackendMessage {
  id: number;
  inbox_id: number;
  sender_id: number;
  receiver_id: number;
  message: string;
  list_of_attsment: string;
  is_read: boolean;
  create_date_time: string;
  update_date_time: string;
}

interface ApiEnvelope<T> {
  status: 'success' | 'error';
  message?: string;
  data: T;
  existing?: boolean;
}

class ChatApiError extends Error {}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
  });

  let body: ApiEnvelope<T> | null = null;
  try {
    body = await res.json();
  } catch {}

  if (!res.ok || (body && body.status === 'error')) {
    throw new ChatApiError(body?.message || `Request failed (${res.status})`);
  }

  return (body?.data as T) ?? (undefined as T);
}

function placeholderAvatar(name: string): string {
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name || 'U')}`;
}

function formatRelativeTime(iso?: string): string {
  if (!iso) return 'Just now';
  const date = new Date(iso);
  if (isNaN(date.getTime())) return 'Just now';
  const diffMins = Math.floor((Date.now() - date.getTime()) / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m`;
  const hours = Math.floor(diffMins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  return date.toLocaleDateString();
}

function formatClockTime(iso?: string): string {
  if (!iso) return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const date = new Date(iso);
  if (isNaN(date.getTime())) return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function toConversation(
  row: BackendInboxResponse,
  currentUserId?: string,
  allUsers?: User[]
): Conversation {
  let otherIdRaw = '';
  if (row.participator && row.participator.id) {
    otherIdRaw = String(row.participator.id);
  } else if (currentUserId) {
    const cleanCurr = decodeProfileSlug(String(currentUserId));
    otherIdRaw = String(row.initator_id) === cleanCurr
      ? String(row.participator_id)
      : String(row.initator_id);
  } else {
    otherIdRaw = String(row.participator_id);
  }

  const otherEncryptedId = encodeProfileSlug(otherIdRaw);
  const matchedUser = allUsers?.find(
    u => String(u.id) === otherIdRaw || String(u.id) === otherEncryptedId
  );
  const otherName = matchedUser?.name || row.participator?.full_name || 'Member';
  const otherAvatar = matchedUser?.avatar || (row.participator?.full_name ? placeholderAvatar(row.participator.full_name) : placeholderAvatar(otherName));
  const otherRole = matchedUser?.role || 'buyer_free';

  // otherParticipant.id stays the RAW db id — all in-state comparisons
  // (currentUser.id, sellerId) use raw ids; slugs are transport-only
  const otherParticipant = {
    id: otherIdRaw,
    name: otherName,
    avatar: otherAvatar,
    role: otherRole,
  } as unknown as User;

  return {
    id: encodeChatSlug(row.id),
    participantIds: [String(row.initator_id), String(row.participator_id)].filter(Boolean),
    otherParticipant,
    lastMessage: row.last_message || 'Conversation started',
    lastMessageTime: formatRelativeTime(row.update_date_time || row.create_date_time),
    unreadCount: row.unread_count || 0,
  } as unknown as Conversation;
}

function toMessage(row: BackendMessage): Message {
  return {
    id: String(row.id),
    conversationId: encodeChatSlug(row.inbox_id),
    // RAW sender id — must equal currentUser.id (raw) for isMe checks in the thread UI
    senderId: String(row.sender_id),
    text: row.message,
    createdAt: formatClockTime(row.create_date_time),
  } as Message;
}

/** GET /api/inbox/:user_id — every conversation the user is part of. Transmits encrypted u_... slug over network. */
export async function fetchConversations(userId: string, allUsers?: User[]): Promise<Conversation[]> {
  const encryptedUserId = encodeProfileSlug(userId);
  const rows = await apiFetch<BackendInboxResponse[]>(API_CONFIG.ENDPOINTS.INBOX.LIST(encryptedUserId));
  return (rows ?? []).map(r => toConversation(r, userId, allUsers));
}

/** GET /api/messages/:inbox_id — full message history for one thread. Transmits encrypted c_... slug over network. */
export async function fetchMessages(conversationId: string): Promise<Message[]> {
  const encryptedChatId = encodeChatSlug(conversationId);
  const rows = await apiFetch<BackendMessage[]>(API_CONFIG.ENDPOINTS.INBOX.MESSAGES(encryptedChatId));
  return (rows ?? []).map(toMessage);
}

/** POST /api/inbox — find-or-create the thread between two users. */
export async function createOrGetConversation(
  initiatorId: string | number,
  participatorId: string | number,
  targetUser?: User | Conversation['otherParticipant'] | any
): Promise<Conversation> {
  const encInit = encodeProfileSlug(initiatorId);
  const encPart = encodeProfileSlug(participatorId);

  const row = await apiFetch<BackendInbox>(API_CONFIG.ENDPOINTS.INBOX.CREATE, {
    method: 'POST',
    body: JSON.stringify({
      initator_id: encInit,
      participator_id: encPart,
    }),
  });

  const conv = toConversation(
    { ...row, last_message: 'Conversation started', unread_count: 0 },
    String(initiatorId),
    targetUser ? [targetUser as User] : undefined
  );
  if (targetUser) {
    conv.otherParticipant = targetUser;
  }
  return conv;
}

/** POST /api/messages — send a message in an existing thread. Transmits encrypted slugs over network. */
export async function sendMessageToBackend(params: {
  conversationId: string | number;
  senderId: string | number;
  receiverId: string | number;
  text: string;
  attachments?: string[];
}): Promise<Message> {
  const encChatId = encodeChatSlug(params.conversationId);
  const encSenderId = encodeProfileSlug(params.senderId);
  const encReceiverId = encodeProfileSlug(params.receiverId);

  const row = await apiFetch<BackendMessage>(API_CONFIG.ENDPOINTS.INBOX.SEND_MESSAGE, {
    method: 'POST',
    body: JSON.stringify({
      inbox_id: encChatId,
      sender_id: encSenderId,
      receiver_id: encReceiverId,
      message: params.text,
      list_of_attsment: params.attachments ?? [],
    }),
  });
  return toMessage(row);
}

/** PUT /api/messages/inbox/:inbox_id/read?receiver_id=... */
export async function markThreadRead(conversationId: string, receiverId: string): Promise<void> {
  const encChatId = encodeChatSlug(conversationId);
  const encReceiverId = encodeProfileSlug(receiverId);
  await apiFetch<null>(
    `${API_CONFIG.ENDPOINTS.INBOX.MARK_THREAD_READ(encChatId)}?receiver_id=${encodeURIComponent(encReceiverId)}`,
    { method: 'PUT' }
  );
}

/** PUT /api/messages/:id/read */
export async function markMessageRead(messageId: string): Promise<void> {
  await apiFetch<null>(API_CONFIG.ENDPOINTS.INBOX.MARK_MESSAGE_READ(messageId), { method: 'PUT' });
}

export { ChatApiError };