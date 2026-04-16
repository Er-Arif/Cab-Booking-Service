"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { AdminAuthGate } from "./admin-auth-gate";
import { AdminDataProvider } from "./admin-data-provider";
import { AdminProvider, useAdminSession } from "./admin-provider";

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/drivers", label: "Drivers" },
  { href: "/customers", label: "Customers" },
  { href: "/rides", label: "Rides" },
  { href: "/complaints", label: "Complaints" },
  { href: "/reports", label: "Reports" },
  { href: "/settings", label: "Settings" },
];

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <AdminProvider>
      <AdminAuthGate>
        <AdminDataProvider>
          <AuthenticatedLayout>{children}</AuthenticatedLayout>
        </AdminDataProvider>
      </AdminAuthGate>
    </AdminProvider>
  );
}

function AuthenticatedLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { logout, session, isBusy } = useAdminSession();

  return (
    <div className="layout">
      <aside className="sidebar">
        <span className="tag">Pilot Control Room</span>
        <h1>Madhupur Rides</h1>
        <p>Operations-first dashboard for the local launch.</p>
        <p className="muted sidebar-meta">
          Signed in as {session?.phone}
          <br />
          Role: {session?.role}
        </p>
        <nav className="nav">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={pathname === item.href ? "nav-link active" : "nav-link"}>
              {item.label}
            </Link>
          ))}
        </nav>
        <button className="button secondary sidebar-button" disabled={isBusy} onClick={() => logout()} type="button">
          Logout
        </button>
      </aside>
      <main className="main">{children}</main>
    </div>
  );
}
