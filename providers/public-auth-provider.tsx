"use client";

import { createContext, useContext, ReactNode } from "react";

interface PublicAuthContextType {
  isAuthenticated: boolean;
}

const PublicAuthContext = createContext<PublicAuthContextType>({
  isAuthenticated: false,
});

export const usePublicAuth = () => {
  const context = useContext(PublicAuthContext);
  if (!context) {
    throw new Error("usePublicAuth must be used within a PublicAuthProvider");
  }
  return context;
};

interface PublicAuthProviderProps {
  children: ReactNode;
  isAuthenticated: boolean;
}

export const PublicAuthProvider = ({
  children,
  isAuthenticated,
}: PublicAuthProviderProps) => {
  return (
    <PublicAuthContext.Provider value={{ isAuthenticated }}>
      {children}
    </PublicAuthContext.Provider>
  );
};
