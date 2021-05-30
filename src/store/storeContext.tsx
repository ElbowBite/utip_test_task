import React from 'react';
import { useLocalStore } from 'mobx-react-lite';

import { createStore, TStore } from '.';

export const StoreContext = React.createContext<TStore | null>(null);

export const StoreProvider: React.FC = ({ children }) => {
  const storeStore = useLocalStore(createStore);

  return <StoreContext.Provider value={storeStore}>{children}</StoreContext.Provider>;
};

export const useStore = () => React.useContext(StoreContext);
