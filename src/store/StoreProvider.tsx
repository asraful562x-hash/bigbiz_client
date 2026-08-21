'use client';

import React, { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { store } from './index';

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};
