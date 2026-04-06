import React, { createContext, useContext, useState, useCallback } from "react";
import type { User } from "@/types";

const MOCK_USERS: User[] = [
  { id: "u1", name: "Alice Admin", email: "alice@example.com", role: "admin" },
  { id: "u2", name: "Bob User", email: "bob@example.com", role: "user" },
  { id: "u3", name: "Carol User", email: "carol@example.com", role: "user" },
];

interface AuthContextType {
  user: User | null;
  users: User[];
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback((email: string, _password: string) => {
    const found = MOCK_USERS.find((u) => u.email === email);
    if (found) {
      setUser(found);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => setUser(null), []);

  return (
    <AuthContext.Provider value={{ user, users: MOCK_USERS, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
