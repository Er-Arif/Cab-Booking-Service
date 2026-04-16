"use client";

import { useMemo } from "react";

import { EmptyState, ErrorBanner, LoadingBanner, PageIntro } from "../components/page-state";
import { useAdminData } from "../components/admin-data-provider";

export default function DashboardPage() {
  const { snapshot, isLoading, error, refresh } = useAdminData();

  const metrics = useMemo(() => {
    if (!snapshot) {
      return [];
    }

    return [
      { label: "Total rides today", value: snapshot.dashboard.totalRidesToday, tone: "status-ok" },
      { label: "Completed rides", value: snapshot.dashboard.completedRides, tone: "status-ok" },
      { label: "Cancelled rides", value: snapshot.dashboard.cancelledRides, tone: "status-warn" },
      { label: "Active drivers", value: snapshot.dashboard.activeDrivers, tone: "status-ok" },
      { label: "Platform commission", value: `Rs ${snapshot.dashboard.platformCommission.toFixed(0)}`, tone: "status-ok" },
      { label: "Open complaints", value: snapshot.reportingHealth.complaintsOpen, tone: "status-danger" },
    ];
  }, [snapshot]);

  return (
    <>
      <section className="hero">
        <span className="tag">Launch dashboard</span>
        <PageIntro
          title="Small-city operations, visible at a glance"
          description="This control room is now backed by live backend data for dispatch, support, driver approval, and fare operations."
        />
        <div className="toolbar">
          <button className="button secondary" onClick={() => refresh()} type="button">
            Refresh dashboard
          </button>
        </div>
        <LoadingBanner visible={isLoading} />
        <ErrorBanner message={error} />
        <div className="stats-grid">
          {metrics.map((metric) => (
            <article key={metric.label} className="stat">
              <span className={`tag ${metric.tone}`}>{metric.label}</span>
              <strong>{metric.value}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <h3 className="page-title">Live ride board</h3>
        {snapshot && snapshot.rides.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>Ride</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Fare</th>
                <th>Booked at</th>
              </tr>
            </thead>
            <tbody>
              {snapshot.rides.slice(0, 8).map((ride) => (
                <tr key={ride.id}>
                  <td>
                    <strong>{ride.pickupAddress}</strong>
                    <div className="muted">{ride.dropAddress}</div>
                  </td>
                  <td>{formatStatus(ride.status)}</td>
                  <td>{ride.paymentMethod.toUpperCase()} / {ride.paymentStatus}</td>
                  <td>Rs {(ride.finalFare ?? ride.estimatedFare).toFixed(0)}</td>
                  <td>{formatDate(ride.bookedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <EmptyState message="Rides will appear here as soon as bookings are created from the mobile apps." />
        )}
      </section>

      <section className="section card-grid">
        <article className="card">
          <span className="tag">Reporting health</span>
          <p>Drivers online: {snapshot?.reportingHealth.driversOnline ?? 0}</p>
          <p>Rides active: {snapshot?.reportingHealth.ridesActive ?? 0}</p>
          <p>Complaints open: {snapshot?.reportingHealth.complaintsOpen ?? 0}</p>
        </article>
        <article className="card">
          <span className="tag">Top routes</span>
          {snapshot?.dashboard.topRoutes.length ? (
            <ul className="plain-list">
              {snapshot.dashboard.topRoutes.map((route) => (
                <li key={route}>{route}</li>
              ))}
            </ul>
          ) : (
            <p className="muted">Top routes will populate after live dispatch activity grows.</p>
          )}
        </article>
      </section>
    </>
  );
}

function formatStatus(value: string) {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatDate(value: string) {
  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}
