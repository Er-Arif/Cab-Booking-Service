import { metrics, rides } from "../lib/mock-data";

export default function DashboardPage() {
  return (
    <>
      <section className="hero">
        <span className="tag">Launch dashboard</span>
        <h2>Small-city operations, visible at a glance</h2>
        <p className="muted">
          This MVP dashboard keeps dispatch, driver verification, fare control, and support workflows in one place
          for Madhupur operations staff.
        </p>
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
        <table className="table">
          <thead>
            <tr>
              <th>Ride</th>
              <th>Customer</th>
              <th>Driver</th>
              <th>Status</th>
              <th>Fare</th>
            </tr>
          </thead>
          <tbody>
            {rides.map((ride) => (
              <tr key={ride.id}>
                <td>{ride.route}</td>
                <td>{ride.customer}</td>
                <td>{ride.driver}</td>
                <td>{ride.status}</td>
                <td>{ride.fare}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}
