"use client";

import { useState } from "react";

import type { ComplaintRecord } from "../../../../packages/shared-types/src";
import { useAdminData } from "../../components/admin-data-provider";
import { EmptyState, ErrorBanner, LoadingBanner, PageIntro } from "../../components/page-state";

export default function ComplaintsPage() {
  const { snapshot, isLoading, error, refresh, changeComplaintStatus } = useAdminData();
  const [noteByComplaint, setNoteByComplaint] = useState<Record<string, string>>({});
  const [pendingComplaintId, setPendingComplaintId] = useState<string | null>(null);

  async function handleResolve(complaintId: string, status: ComplaintRecord["resolutionStatus"]) {
    setPendingComplaintId(complaintId);
    try {
      await changeComplaintStatus(complaintId, status, noteByComplaint[complaintId] ?? "Updated from admin panel.");
    } finally {
      setPendingComplaintId(null);
    }
  }

  return (
    <section>
      <PageIntro
        title="Complaints and disputes"
        description="Resolve ride-linked issues quickly with visible status transitions and operational notes."
      />
      <div className="toolbar">
        <button className="button secondary" onClick={() => refresh()} type="button">
          Refresh complaints
        </button>
      </div>
      <LoadingBanner visible={isLoading} />
      <ErrorBanner message={error} />

      {snapshot && snapshot.complaints.length > 0 ? (
        <div className="card-grid">
          {snapshot.complaints.map((complaint) => (
            <article key={complaint.id} className="card">
              <span className="tag">{complaint.resolutionStatus}</span>
              <h3>{complaint.complaintType}</h3>
              <p className="muted">Ride: {complaint.rideId}</p>
              <p className="muted">Raised by: {complaint.raisedByType}</p>
              <p>{complaint.description}</p>
              <textarea
                className="input textarea"
                value={noteByComplaint[complaint.id] ?? complaint.resolutionNote ?? ""}
                onChange={(event) =>
                  setNoteByComplaint((current) => ({
                    ...current,
                    [complaint.id]: event.target.value,
                  }))
                }
                rows={3}
                placeholder="Resolution note"
              />
              <div className="button-row">
                <button
                  className="button secondary"
                  disabled={pendingComplaintId === complaint.id}
                  onClick={() => handleResolve(complaint.id, "in_review")}
                  type="button"
                >
                  Mark in review
                </button>
                <button
                  className="button"
                  disabled={pendingComplaintId === complaint.id}
                  onClick={() => handleResolve(complaint.id, "resolved")}
                  type="button"
                >
                  Resolve
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState message="No complaints are open right now." />
      )}
    </section>
  );
}
