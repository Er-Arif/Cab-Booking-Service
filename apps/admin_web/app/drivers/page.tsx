import { drivers } from "../../lib/mock-data";

export default function DriversPage() {
  return (
    <section>
      <h2 className="page-title">Driver Verification and Fleet</h2>
      <p className="muted">Approve riders, monitor their online status, and review readiness for the pilot.</p>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Rating</th>
            <th>Presence</th>
          </tr>
        </thead>
        <tbody>
          {drivers.map((driver) => (
            <tr key={driver.id}>
              <td>{driver.name}</td>
              <td>{driver.category}</td>
              <td>{driver.phone}</td>
              <td>{driver.status}</td>
              <td>{driver.rating}</td>
              <td>{driver.online}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
