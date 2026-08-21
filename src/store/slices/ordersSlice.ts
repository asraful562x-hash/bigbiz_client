import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Order, DirectOffer, Review, Dispute, DirectOfferStatus } from '../../types';
import { INITIAL_ORDERS, INITIAL_DIRECT_OFFERS, INITIAL_REVIEWS, INITIAL_DISPUTES } from '../../data/mockData';

export interface OrdersState {
  orders: Order[];
  offers: DirectOffer[];
  reviews: Review[];
  disputes: Dispute[];
}

const initialState: OrdersState = {
  orders: INITIAL_ORDERS,
  offers: INITIAL_DIRECT_OFFERS,
  reviews: INITIAL_REVIEWS,
  disputes: INITIAL_DISPUTES,
};

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrders: (state, action: PayloadAction<Order[]>) => {
      state.orders = action.payload;
    },
    addOrder: (state, action: PayloadAction<Order>) => {
      state.orders.unshift(action.payload);
    },
    updateOrderStatus: (state, action: PayloadAction<{ orderId: string; status: Order['status']; escrowStatus?: Order['escrowStatus'] }>) => {
      const order = state.orders.find(o => o.id === action.payload.orderId);
      if (order) {
        order.status = action.payload.status;
        if (action.payload.escrowStatus) {
          order.escrowStatus = action.payload.escrowStatus;
        }
      }
    },
    setOffers: (state, action: PayloadAction<DirectOffer[]>) => {
      state.offers = action.payload;
    },
    addOffer: (state, action: PayloadAction<DirectOffer>) => {
      state.offers.unshift(action.payload);
    },
    updateOfferStatus: (state, action: PayloadAction<{ offerId: string; status: DirectOfferStatus; counterPrice?: number; note?: string }>) => {
      const offer = state.offers.find(o => o.id === action.payload.offerId);
      if (offer) {
        offer.status = action.payload.status;
        if (action.payload.counterPrice !== undefined) {
          offer.counterPrice = action.payload.counterPrice;
        }
        if (action.payload.note) {
          offer.adminNotes = action.payload.note;
        }
        offer.history = offer.history || [];
        offer.history.push({
          status: action.payload.status,
          timestamp: 'Just now',
          note: action.payload.note || `Status updated to ${action.payload.status}`
        });
      }
    },
    setReviews: (state, action: PayloadAction<Review[]>) => {
      state.reviews = action.payload;
    },
    setDisputes: (state, action: PayloadAction<Dispute[]>) => {
      state.disputes = action.payload;
    },
    updateDisputeStatus: (state, action: PayloadAction<{ disputeId: string; status: Dispute['status'] }>) => {
      const dispute = state.disputes.find(d => d.id === action.payload.disputeId);
      if (dispute) {
        dispute.status = action.payload.status;
      }
    },
  },
});

export const {
  setOrders,
  addOrder,
  updateOrderStatus,
  setOffers,
  addOffer,
  updateOfferStatus,
  setReviews,
  setDisputes,
  updateDisputeStatus,
} = ordersSlice.actions;

export default ordersSlice.reducer;
