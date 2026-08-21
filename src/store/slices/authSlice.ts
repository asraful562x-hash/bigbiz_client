import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, UserRole } from '../../types';
import { INITIAL_USERS } from '../../data/mockData';

export interface AuthState {
  currentUser: User;
  isLoggedIn: boolean;
  isAuthChecking: boolean;
  showOnboarding: boolean;
  users: User[];
}

const getInitialUser = (): User => {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('auth_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.email) {
          return parsed;
        }
      }
    } catch {}
  }
  return INITIAL_USERS[2];
};

const getInitialIsLoggedIn = (): boolean => {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('auth_user');
      const token = localStorage.getItem('auth_token');
      return Boolean(stored && token);
    } catch {}
  }
  return false;
};

const initialState: AuthState = {
  currentUser: getInitialUser(),
  isLoggedIn: getInitialIsLoggedIn(),
  isAuthChecking: true,
  showOnboarding: false,
  users: INITIAL_USERS,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
    },
    setIsLoggedIn: (state, action: PayloadAction<boolean>) => {
      state.isLoggedIn = action.payload;
    },
    setIsAuthChecking: (state, action: PayloadAction<boolean>) => {
      state.isAuthChecking = action.payload;
    },
    setShowOnboarding: (state, action: PayloadAction<boolean>) => {
      state.showOnboarding = action.payload;
    },
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
    },
    updateUserInList: (state, action: PayloadAction<User>) => {
      const index = state.users.findIndex(u => u.id === action.payload.id || u.email === action.payload.email);
      if (index !== -1) {
        state.users[index] = action.payload;
      } else {
        state.users.unshift(action.payload);
      }
    },
    updateUserRole: (state, action: PayloadAction<{ userId: string; role: UserRole }>) => {
      const user = state.users.find(u => u.id === action.payload.userId);
      if (user) {
        user.role = action.payload.role;
      }
      if (state.currentUser.id === action.payload.userId) {
        state.currentUser.role = action.payload.role;
      }
    },
    toggleUserVerification: (state, action: PayloadAction<string>) => {
      const user = state.users.find(u => u.id === action.payload);
      if (user) {
        user.isVerified = !user.isVerified;
      }
      if (state.currentUser.id === action.payload) {
        state.currentUser.isVerified = !state.currentUser.isVerified;
      }
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.showOnboarding = false;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        document.cookie = 'auth_token=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
      }
    },
  },
});

export const {
  setCurrentUser,
  setIsLoggedIn,
  setIsAuthChecking,
  setShowOnboarding,
  setUsers,
  updateUserInList,
  updateUserRole,
  toggleUserVerification,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
