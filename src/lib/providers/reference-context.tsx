import React, { createContext, useContext, ReactNode } from "react";

// Create a context for the ref
const RefContext = createContext<React.RefObject<any> | null>(
  null
);

// Custom hook to access the ref value
export function useRefContext() {
  const context = useContext(RefContext);
  if (!context) {
    throw new Error("useRefContext must be used within a RefProvider");
  }
  return context;
}

// The RefProvider component
interface RefProviderProps {
  children: ReactNode;
  myRef: React.RefObject<any>;
}

function RefProvider({ children, myRef }: RefProviderProps) {
  return <RefContext.Provider value={myRef}>{children}</RefContext.Provider>;
}

export { RefProvider };
