import { rides } from "../../lib/mock-data";

export default function RidesPage() {
  return (
    <section>
      <h2 className="page-title">Ride Monitoring</h2>
      <p className="muted">Track active and completed rides, confirm lifecycle transitions, and review fare outcomes.</p>
      <div className="card-grid">
        {rides.map((ride) => (
          <article key={ride.id} className="card">
            <span className="tag">{ride.category}</span>
            <h3>{ride.route}</h3>
            <p className="muted">Customer: {ride.customer}</p>
            <p className="muted">Driver: {ride.driver}</p>
            <p>Status: {ride.status}</p>
            <p>Fare: {ride.fare}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
