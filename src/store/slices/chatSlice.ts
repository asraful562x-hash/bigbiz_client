import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Conversation, Message, AppNotification } from '../../types';
import { INITIAL_CONVERSATIONS, INITIAL_MESSAGES, INITIAL_NOTIFICATIONS } from '../../data/mockData';

export interface ChatState {
  conversations: Conversation[];
  messages: Message[];
  notifications: AppNotification[];
  activeChatSellerId: string | null;
}

const initialState: ChatState = {
  conversations: INITIAL_CONVERSATIONS,
  messages: INITIAL_MESSAGES,
  notifications: INITIAL_NOTIFICATIONS,
  activeChatSellerId: null,
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setConversations: (state, action: PayloadAction<Conversation[]>) => {
      state.conversations = action.payload;
    },
    addOrUpdateConversation: (state, action: PayloadAction<Conversation>) => {
      const filtered = state.conversations.filter(c => c.id !== action.payload.id);
      state.conversations = [action.payload, ...filtered];
    },
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
      const convIdx = state.conversations.findIndex(c => c.id === action.payload.conversationId);
      if (convIdx !== -1) {
        const conv = state.conversations[convIdx];
        conv.lastMessage = action.payload.text;
        conv.lastMessageTime = 'Just now';
        if (convIdx > 0) {
          const [moved] = state.conversations.splice(convIdx, 1);
          state.conversations.unshift(moved);
        }
      }
    },
    setActiveChatSellerId: (state, action: PayloadAction<string | null>) => {
      state.activeChatSellerId = action.payload;
    },
    setNotifications: (state, action: PayloadAction<AppNotification[]>) => {
      state.notifications = action.payload;
    },
    addNotification: (state, action: PayloadAction<AppNotification>) => {
      state.notifications.unshift(action.payload);
    },
    markAllNotificationsRead: (state) => {
      state.notifications.forEach(n => { n.isRead = true; });
    },
  },
});

export const {
  setConversations,
  addOrUpdateConversation,
  setMessages,
  addMessage,
  setActiveChatSellerId,
  setNotifications,
  addNotification,
  markAllNotificationsRead,
} = chatSlice.actions;

export default chatSlice.reducer;
