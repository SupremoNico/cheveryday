"use client";

import { createContext, useContext, type ReactNode } from "react";

type AuthUser = {
  name: string;
  email: string;
  image?: string | null;
};

const AuthUserContext = createContext<AuthUser | null>(null);

export function AuthUserProvider({
  user,
  children,
}: {
  user: AuthUser;
  children: ReactNode;
}) {
  return (
    <AuthUserContext.Provider value={user}>{children}</AuthUserContext.Provider>
  );
}

export function useAuthUser() {
  const user = useContext(AuthUserContext);

  if (!user) {
    throw new Error("useAuthUser must be used inside AuthUserProvider.");
  }

  return user;
}
