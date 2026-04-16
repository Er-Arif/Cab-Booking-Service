"use client";

import { useAdminData } from "../../components/admin-data-provider";
import { EmptyState, ErrorBanner, LoadingBanner, PageIntro } from "../../components/page-state";

export default function RidesPage() {
  const { snapshot, isLoading, error, refresh } = useAdminData();

  return (
    <section>
      <PageIntro
        title="Ride Monitoring"
        description="Review every ride from booking through payment completion with the live database as the source of truth."
      />
      <div className="toolbar">
        <button className="button secondary" onClick={() => refresh()} type="button">
          Refresh rides
        </button>
      </div>
      <LoadingBanner visible={isLoading} />
      <ErrorBanner message={error} />

      {snapshot && snapshot.rides.length > 0 ? (
        <div className="card-grid">
          {snapshot.rides.map((ride) => (
            <article key={ride.id} className="card">
              <span className="tag">{ride.categoryKey === "e_rickshaw" ? "E-rickshaw" : "Bike"}</span>
              <h3>{ride.pickupAddress} → {ride.dropAddress}</h3>
              <p className="muted">Status: {formatStatus(ride.status)}</p>
              <p className="muted">Payment: {ride.paymentMethod.toUpperCase()} / {ride.paymentStatus}</p>
              <p>Estimated fare: Rs {ride.estimatedFare.toFixed(0)}</p>
              <p>Final fare: Rs {(ride.finalFare ?? ride.estimatedFare).toFixed(0)}</p>
              <p className="muted">Booked: {formatDate(ride.bookedAt)}</p>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState message="Ride monitoring will populate as soon as bookings are created from the apps." />
      )}
    </section>
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
