"use client";

import { useAdminData } from "../../components/admin-data-provider";
import { ErrorBanner, LoadingBanner, PageIntro } from "../../components/page-state";

export default function ReportsPage() {
  const { snapshot, isLoading, error, refresh } = useAdminData();
  const summary = snapshot?.summaryReport;

  return (
    <section>
      <PageIntro
        title="Reporting and pilot analytics"
        description="Review payment mix, category share, and live support pressure without leaving the admin console."
      />
      <div className="toolbar">
        <button className="button secondary" onClick={() => refresh()} type="button">
          Refresh reports
        </button>
      </div>
      <LoadingBanner visible={isLoading} />
      <ErrorBanner message={error} />

      <div className="card-grid">
        <article className="card">
          <span className="tag">Payment mix</span>
          <p>Cash payments: {summary?.paymentMix.cash ?? 0}</p>
          <p>UPI payments: {summary?.paymentMix.upi ?? 0}</p>
          <p>Open complaints: {summary?.complaintOpenCount ?? 0}</p>
        </article>
        <article className="card">
          <span className="tag">Operational health</span>
          <p>Drivers online: {snapshot?.reportingHealth.driversOnline ?? 0}</p>
          <p>Rides active: {snapshot?.reportingHealth.ridesActive ?? 0}</p>
          <p>Complaints open: {snapshot?.reportingHealth.complaintsOpen ?? 0}</p>
        </article>
      </div>

      <section className="section">
        <h3 className="page-title">Rides per category</h3>
        <div className="card-grid">
          {summary?.ridesPerCategory.map((report) => (
            <article key={report.category} className="card">
              <span className="tag">{report.category}</span>
              <strong>{report.rideCount}</strong>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
