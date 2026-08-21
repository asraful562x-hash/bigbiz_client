// hooks/useDirectMessages.ts
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Conversation, Message } from '../types';
import {
  fetchConversations,
  fetchMessages,
  sendMessageToBackend,
  createOrGetConversation,
  markThreadRead,
} from '../../lib/api/chat-api';

const MESSAGE_POLL_MS = 4000;
const CONVERSATION_POLL_MS = 15000;

export function useDirectMessages(currentUserId: string, initialSellerId?: string | null) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messagesByConv, setMessagesByConv] = useState<Record<string, Message[]>>({});
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const didInitSelectionRef = useRef(false);

  useEffect(() => {
    if (!currentUserId) return;
    let cancelled = false;

    const load = async (isFirst: boolean) => {
      try {
        if (isFirst) setIsLoadingConversations(true);
        const rows = await fetchConversations(currentUserId);
        if (cancelled) return rows;
        setConversations(rows);
        setError(null);
        return rows;
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load conversations');
        }
        return [] as Conversation[];
      } finally {
        if (!cancelled && isFirst) setIsLoadingConversations(false);
      }
    };

    (async () => {
      const rows = await load(true);
      if (cancelled || didInitSelectionRef.current) return;
      didInitSelectionRef.current = true;

      if (initialSellerId) {
        const match = rows.find(c => c.otherParticipant.id === initialSellerId);
        if (match) {
          setActiveConvId(match.id);
          return;
        }
        try {
          await createOrGetConversation(currentUserId, initialSellerId);
          const refreshed = await load(false);
          const created = refreshed.find(c => c.otherParticipant.id === initialSellerId);
          if (created) setActiveConvId(created.id);
        } catch (err) {
          if (!cancelled) {
            setError(err instanceof Error ? err.message : 'Failed to start conversation');
          }
        }
      } else if (rows[0]) {
        setActiveConvId(rows[0].id);
      }
    })();

    const interval = setInterval(() => load(false), CONVERSATION_POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [currentUserId, initialSellerId]);

  useEffect(() => {
    if (!activeConvId) return;
    let cancelled = false;

    const load = async (isFirst: boolean) => {
      try {
        if (isFirst) setIsLoadingMessages(true);
        const rows = await fetchMessages(activeConvId);
        if (!cancelled) {
          setMessagesByConv(prev => ({ ...prev, [activeConvId]: rows }));
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load messages');
        }
      } finally {
        if (!cancelled && isFirst) setIsLoadingMessages(false);
      }
    };

    load(true);
    if (currentUserId) {
      markThreadRead(activeConvId, currentUserId).catch(() => {});
    }
    const interval = setInterval(() => load(false), MESSAGE_POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [activeConvId, currentUserId]);

  const selectConversation = useCallback((conversationId: string) => {
    setActiveConvId(conversationId);
  }, []);

  const sendMessage = useCallback(
    async (conversationId: string, text: string) => {
      // ── TEMP DEBUG LOGGING ──────────────────────────────────────
      console.log('sendMessage called with', { conversationId, text, conversations });

      const conv = conversations.find(c => c.id === conversationId);

      if (!conv || !text.trim()) {
        console.log('sendMessage EXITED EARLY', {
          conversationIdPassedIn: conversationId,
          foundConv: conv,
          textTrimmed: text.trim(),
          allConversationIds: conversations.map(c => c.id),
        });
        return;
      }
      console.log('sendMessage proceeding, about to call backend', { conv });
      // ── END TEMP DEBUG LOGGING ──────────────────────────────────

      const tempId = `optimistic-${Date.now()}`;
      const optimistic: Message = {
        id: tempId,
        conversationId,
        senderId: currentUserId,
        text,
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      } as Message;

      setMessagesByConv(prev => ({
        ...prev,
        [conversationId]: [...(prev[conversationId] ?? []), optimistic],
      }));
      setConversations(prev =>
        prev.map(c =>
          c.id === conversationId ? { ...c, lastMessage: text, lastMessageTime: 'Just now' } : c
        )
      );

      try {
        console.log('calling sendMessageToBackend with', {
          conversationId,
          senderId: currentUserId,
          receiverId: conv.otherParticipant.id,
          text,
        });

        const saved = await sendMessageToBackend({
          conversationId,
          senderId: currentUserId,
          receiverId: conv.otherParticipant.id,
          text,
        });

        console.log('sendMessageToBackend SUCCEEDED', saved);

        setMessagesByConv(prev => ({
          ...prev,
          [conversationId]: (prev[conversationId] ?? [])
            .filter(m => m.id !== tempId)
            .concat(saved),
        }));
      } catch (err) {
        console.log('sendMessageToBackend FAILED', err);
        setError(err instanceof Error ? err.message : 'Failed to send message');
        setMessagesByConv(prev => ({
          ...prev,
          [conversationId]: (prev[conversationId] ?? []).filter(m => m.id !== tempId),
        }));
      }
    },
    [conversations, currentUserId]
  );

  return {
    conversations,
    activeConvId,
    activeMessages: activeConvId ? messagesByConv[activeConvId] ?? [] : [],
    isLoadingConversations,
    isLoadingMessages,
    selectConversation,
    sendMessage,
    error,
  };
}