"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, Role } from "./types";
import { DEMO_ACCOUNTS } from "./mock-data";

type AuthView = "login" | "register" | "forgot";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  authView: AuthView;
  setAuthView: (v: AuthView) => void;
  login: (email: string, password: string) => { ok: boolean; message?: string };
  loginAs: (role: Role) => void;
  register: (data: { name: string; email: string; phone: string; password: string }) => { ok: boolean; message?: string };
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      authView: "login",
      setAuthView: (v) => set({ authView: v }),
      login: (email, password) => {
        const acc = DEMO_ACCOUNTS.find(
          (a) => a.email.toLowerCase() === email.toLowerCase() && a.password === password,
        );
        if (acc) {
          const user: User = {
            id: "u-" + acc.role,
            name: acc.name,
            email: acc.email,
            role: acc.role,
            status: "active",
            createdAt: "2024-01-01",
            lastLogin: new Date().toISOString().slice(0, 16).replace("T", " "),
          };
          set({ user, isAuthenticated: true, authView: "login" });
          return { ok: true };
        }
        // Allow any login → default operator (for demo flexibility)
        if (email && password.length >= 4) {
          const user: User = {
            id: "u-guest",
            name: email.split("@")[0] || "Pengguna",
            email,
            role: "operator",
            status: "active",
            createdAt: "2024-01-01",
            lastLogin: new Date().toISOString().slice(0, 16).replace("T", " "),
          };
          set({ user, isAuthenticated: true });
          return { ok: true };
        }
        return { ok: false, message: "Email atau password salah." };
      },
      loginAs: (role) => {
        const acc = DEMO_ACCOUNTS.find((a) => a.role === role)!;
        const user: User = {
          id: "u-" + role,
          name: acc.name,
          email: acc.email,
          role,
          status: "active",
          createdAt: "2024-01-01",
          lastLogin: new Date().toISOString().slice(0, 16).replace("T", " "),
        };
        set({ user, isAuthenticated: true });
      },
      register: (data) => {
        if (!data.email.includes("@")) return { ok: false, message: "Email tidak valid." };
        if (data.password.length < 6) return { ok: false, message: "Password minimal 6 karakter." };
        const user: User = {
          id: "u-" + Date.now(),
          name: data.name,
          email: data.email,
          phone: data.phone,
          role: "operator",
          status: "active",
          createdAt: new Date().toISOString().slice(0, 10),
          lastLogin: new Date().toISOString().slice(0, 16).replace("T", " "),
        };
        set({ user, isAuthenticated: true });
        return { ok: true };
      },
      logout: () => set({ user: null, isAuthenticated: false, authView: "login" }),
    }),
    { name: "propertiku-auth" },
  ),
);
