"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import type { AdminSession } from "../lib/admin-session";
import { adminSessionStorageKey } from "../lib/admin-session";
import { logoutAdmin, sendAdminOtp, verifyAdminOtp } from "../lib/admin-api";

interface AdminContextValue {
  session: AdminSession | null;
  isBootstrapping: boolean;
  isBusy: boolean;
  otpRequested: boolean;
  error: string | null;
  info: string | null;
  requestOtp: (phone: string) => Promise<void>;
  verifyOtp: (phone: string, otp: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AdminContext = createContext<AdminContextValue | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AdminSession | null>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [isBusy, setIsBusy] = useState(false);
  const [otpRequested, setOtpRequested] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    const raw = window.localStorage.getItem(adminSessionStorageKey);
    if (raw) {
      try {
        setSession(JSON.parse(raw) as AdminSession);
      } catch {
        window.localStorage.removeItem(adminSessionStorageKey);
      }
    }
    setIsBootstrapping(false);
  }, []);

  const value = useMemo<AdminContextValue>(
    () => ({
      session,
      isBootstrapping,
      isBusy,
      otpRequested,
      error,
      info,
      async requestOtp(phone: string) {
        setIsBusy(true);
        setError(null);
        setInfo(null);
        try {
          await sendAdminOtp(phone);
          setOtpRequested(true);
          setInfo("OTP sent. Use seeded admin phone 9000000001 with OTP 123456 in Version 1.");
        } catch (requestError) {
          setError(requestError instanceof Error ? requestError.message : "Failed to send OTP");
        } finally {
          setIsBusy(false);
        }
      },
      async verifyOtp(phone: string, otp: string) {
        setIsBusy(true);
        setError(null);
        setInfo(null);
        try {
          const response = await verifyAdminOtp(phone, otp);
          const nextSession: AdminSession = {
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            role: response.role,
            userId: response.userId,
            phone,
          };
          window.localStorage.setItem(adminSessionStorageKey, JSON.stringify(nextSession));
          setSession(nextSession);
          setOtpRequested(false);
          setInfo("Admin session ready.");
        } catch (requestError) {
          setError(requestError instanceof Error ? requestError.message : "Failed to verify OTP");
        } finally {
          setIsBusy(false);
        }
      },
      async logout() {
        const currentSession = session;
        setIsBusy(true);
        setError(null);
        setInfo(null);
        try {
          if (currentSession) {
            await logoutAdmin(currentSession.refreshToken);
          }
        } catch {
          // Local logout should still proceed in Version 1.
        } finally {
          window.localStorage.removeItem(adminSessionStorageKey);
          setSession(null);
          setOtpRequested(false);
          setIsBusy(false);
        }
      },
    }),
    [error, info, isBootstrapping, isBusy, otpRequested, session]
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdminSession() {
  const value = useContext(AdminContext);
  if (!value) {
    throw new Error("useAdminSession must be used within AdminProvider");
  }
  return value;
}
