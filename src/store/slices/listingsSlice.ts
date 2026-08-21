import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Listing, MarketplaceCategory } from '../../types';
import { INITIAL_LISTINGS } from '../../data/mockData';

export interface ListingsState {
  listings: Listing[];
  selectedListing: Listing | null;
  selectedCategory: MarketplaceCategory | 'all';
  searchQuery: string;
}

const initialState: ListingsState = {
  listings: INITIAL_LISTINGS,
  selectedListing: null,
  selectedCategory: 'all',
  searchQuery: '',
};

export const listingsSlice = createSlice({
  name: 'listings',
  initialState,
  reducers: {
    setListings: (state, action: PayloadAction<Listing[]>) => {
      state.listings = action.payload;
    },
    addListing: (state, action: PayloadAction<Listing>) => {
      state.listings.unshift(action.payload);
    },
    updateListing: (state, action: PayloadAction<{ id: string; updates: Partial<Listing> }>) => {
      const idx = state.listings.findIndex(l => l.id === action.payload.id);
      if (idx !== -1) {
        state.listings[idx] = { ...state.listings[idx], ...action.payload.updates };
      }
      if (state.selectedListing && state.selectedListing.id === action.payload.id) {
        state.selectedListing = { ...state.selectedListing, ...action.payload.updates };
      }
    },
    removeListing: (state, action: PayloadAction<string>) => {
      state.listings = state.listings.filter(l => l.id !== action.payload);
      if (state.selectedListing && state.selectedListing.id === action.payload) {
        state.selectedListing = null;
      }
    },
    setSelectedListing: (state, action: PayloadAction<Listing | null>) => {
      state.selectedListing = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<MarketplaceCategory | 'all'>) => {
      state.selectedCategory = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
  },
});

export const {
  setListings,
  addListing,
  updateListing,
  removeListing,
  setSelectedListing,
  setSelectedCategory,
  setSearchQuery,
} = listingsSlice.actions;

export default listingsSlice.reducer;
