import Link from "next/link";
import type { ReactNode } from "react";

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="layout">
      <aside className="sidebar">
        <span className="tag">Pilot Control Room</span>
        <h1>Madhupur Rides</h1>
        <p>Operations-first dashboard for the local launch.</p>
        <nav className="nav">
          <Link href="/">Dashboard</Link>
          <Link href="/drivers">Drivers</Link>
          <Link href="/rides">Rides</Link>
          <Link href="/complaints">Complaints</Link>
          <Link href="/reports">Reports</Link>
          <Link href="/settings">Settings</Link>
        </nav>
      </aside>
      <main className="main">{children}</main>
    </div>
  );
}
