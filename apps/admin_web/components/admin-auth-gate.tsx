"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";

import { useAdminSession } from "./admin-provider";

export function AdminAuthGate({ children }: { children: ReactNode }) {
  const session = useAdminSession();
  const [phone, setPhone] = useState("9000000001");
  const [otp, setOtp] = useState("123456");

  if (session.isBootstrapping) {
    return (
      <div className="fullscreen-shell">
        <div className="panel-card">
          <h2>Loading admin console</h2>
          <p className="muted">Restoring the last authenticated operations session.</p>
        </div>
      </div>
    );
  }

  if (session.session) {
    return <>{children}</>;
  }

  return (
    <div className="fullscreen-shell">
      <div className="panel-card auth-card">
        <span className="tag">Phase 5 live admin access</span>
        <h2>Madhupur Control Room</h2>
        <p className="muted">
          Version 1 uses seeded admin access so the panel can run against the live backend without a third-party OTP
          service.
        </p>
        <p className="muted">
          By continuing, admins acknowledge the internal legal pack and the Version 1 pilot boundaries. Review{" "}
          <Link className="legal-link" href="/legal/terms">
            Terms
          </Link>
          ,{" "}
          <Link className="legal-link" href="/legal/privacy">
            Privacy
          </Link>
          ,{" "}
          <Link className="legal-link" href="/legal/customer-agreement">
            Customer Agreement
          </Link>
          , and{" "}
          <Link className="legal-link" href="/legal/driver-agreement">
            Driver Agreement
          </Link>
          .
        </p>

        <label className="field">
          <span>Admin phone</span>
          <input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="9000000001" />
        </label>

        {session.otpRequested ? (
          <label className="field">
            <span>OTP</span>
            <input value={otp} onChange={(event) => setOtp(event.target.value)} placeholder="123456" />
          </label>
        ) : null}

        {session.info ? <p className="status-inline status-ok">{session.info}</p> : null}
        {session.error ? <p className="status-inline status-danger">{session.error}</p> : null}

        <div className="button-row">
          <button
            className="button secondary"
            disabled={session.isBusy}
            onClick={() => session.requestOtp(phone.trim())}
            type="button"
          >
            {session.otpRequested ? "Resend OTP" : "Send OTP"}
          </button>
          <button
            className="button"
            disabled={session.isBusy || !session.otpRequested}
            onClick={() => session.verifyOtp(phone.trim(), otp.trim())}
            type="button"
          >
            Verify OTP
          </button>
        </div>
      </div>
    </div>
  );
}
