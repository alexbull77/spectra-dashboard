import { Instance } from "mobx-state-tree";
import React, { createContext, ReactNode, useContext } from "react";
import {
  NetworkRequestsStore,
  NetworkRequestsStoreInstance,
} from "./NetworkRequests.store";

const NetworkRequestsContext = createContext<Instance<
  typeof NetworkRequestsStore
> | null>(null);

export const NetworkRequestsProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  return (
    <NetworkRequestsContext.Provider value={NetworkRequestsStoreInstance}>
      {children}
    </NetworkRequestsContext.Provider>
  );
};

export const useNetworkRequestsStore = () => {
  const context = useContext(NetworkRequestsContext);
  if (!context) throw new Error("Store not found in context");
  return context;
};
