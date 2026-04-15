import { reports } from "../../lib/mock-data";

export default function ReportsPage() {
  return (
    <section>
      <h2 className="page-title">Reporting and Pilot Analytics</h2>
      <p className="muted">Daily reporting focuses on category mix, payments, and operational reliability.</p>
      <div className="card-grid">
        {reports.map((report) => (
          <article key={report.label} className="card">
            <span className="tag">{report.label}</span>
            <strong>{report.value}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}
