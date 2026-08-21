import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UIState {
  activeTab: string;
  showSellToUsModal: boolean;
  showCreateListingModal: boolean;
  showCreatePostModal: boolean;
  showCreateStoryModal: boolean;
  showCreateQuoteModal: boolean;
  showMessagesModal: boolean;
  showNotificationsModal: boolean;
  showLeftDrawer: boolean;
  showRightDrawer: boolean;
  selectedSellerId: string | null;
}

const initialState: UIState = {
  activeTab: 'feed',
  showSellToUsModal: false,
  showCreateListingModal: false,
  showCreatePostModal: false,
  showCreateStoryModal: false,
  showCreateQuoteModal: false,
  showMessagesModal: false,
  showNotificationsModal: false,
  showLeftDrawer: false,
  showRightDrawer: false,
  selectedSellerId: null,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<string>) => {
      state.activeTab = action.payload;
    },
    setShowSellToUsModal: (state, action: PayloadAction<boolean>) => {
      state.showSellToUsModal = action.payload;
    },
    setShowCreateListingModal: (state, action: PayloadAction<boolean>) => {
      state.showCreateListingModal = action.payload;
    },
    setShowCreatePostModal: (state, action: PayloadAction<boolean>) => {
      state.showCreatePostModal = action.payload;
    },
    setShowCreateStoryModal: (state, action: PayloadAction<boolean>) => {
      state.showCreateStoryModal = action.payload;
    },
    setShowCreateQuoteModal: (state, action: PayloadAction<boolean>) => {
      state.showCreateQuoteModal = action.payload;
    },
    setShowMessagesModal: (state, action: PayloadAction<boolean>) => {
      state.showMessagesModal = action.payload;
    },
    setShowNotificationsModal: (state, action: PayloadAction<boolean>) => {
      state.showNotificationsModal = action.payload;
    },
    setShowLeftDrawer: (state, action: PayloadAction<boolean>) => {
      state.showLeftDrawer = action.payload;
    },
    setShowRightDrawer: (state, action: PayloadAction<boolean>) => {
      state.showRightDrawer = action.payload;
    },
    setSelectedSellerId: (state, action: PayloadAction<string | null>) => {
      state.selectedSellerId = action.payload;
    },
  },
});

export const {
  setActiveTab,
  setShowSellToUsModal,
  setShowCreateListingModal,
  setShowCreatePostModal,
  setShowCreateStoryModal,
  setShowCreateQuoteModal,
  setShowMessagesModal,
  setShowNotificationsModal,
  setShowLeftDrawer,
  setShowRightDrawer,
  setSelectedSellerId,
} = uiSlice.actions;

export default uiSlice.reducer;
