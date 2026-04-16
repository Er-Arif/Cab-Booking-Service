"use client";

import { useState } from "react";

import { useAdminData } from "../../components/admin-data-provider";
import { EmptyState, ErrorBanner, LoadingBanner, PageIntro } from "../../components/page-state";

export default function DriversPage() {
  const { snapshot, isLoading, error, refresh, changeDriverStatus } = useAdminData();
  const [pendingDriverId, setPendingDriverId] = useState<string | null>(null);

  async function handleStatusChange(driverId: string, status: "pending" | "approved" | "rejected" | "suspended") {
    setPendingDriverId(driverId);
    try {
      await changeDriverStatus(driverId, status);
    } finally {
      setPendingDriverId(null);
    }
  }

  return (
    <section>
      <PageIntro
        title="Driver Verification and Fleet"
        description="Approve drivers, monitor live presence, and keep launch readiness visible from backend state."
      />
      <div className="toolbar">
        <button className="button secondary" onClick={() => refresh()} type="button">
          Refresh drivers
        </button>
      </div>
      <LoadingBanner visible={isLoading} />
      <ErrorBanner message={error} />

      {snapshot && snapshot.drivers.length > 0 ? (
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Rating</th>
              <th>Presence</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {snapshot.drivers.map((driver) => (
              <tr key={driver.id}>
                <td>{driver.name}</td>
                <td>{driver.vehicleType === "e_rickshaw" ? "E-rickshaw" : "Bike"}</td>
                <td>{driver.phone}</td>
                <td>{driver.status}</td>
                <td>{driver.rating.toFixed(1)}</td>
                <td>{driver.isOnline ? "Online" : "Offline"}</td>
                <td>
                  <select
                    className="input"
                    defaultValue={driver.status}
                    disabled={pendingDriverId === driver.id}
                    onChange={(event) =>
                      handleStatusChange(driver.id, event.target.value as "pending" | "approved" | "rejected" | "suspended")
                    }
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <EmptyState message="Driver records will appear here when the fleet is seeded or onboarded." />
      )}
    </section>
  );
}
