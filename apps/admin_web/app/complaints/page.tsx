import { complaints } from "../../lib/mock-data";

export default function ComplaintsPage() {
  return (
    <section>
      <h2 className="page-title">Complaints and Disputes</h2>
      <p className="muted">Resolve ride-linked issues quickly with visible status tracking for support staff.</p>
      <table className="table">
        <thead>
          <tr>
            <th>Complaint</th>
            <th>Ride</th>
            <th>Raised by</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {complaints.map((complaint) => (
            <tr key={complaint.id}>
              <td>{complaint.issue}</td>
              <td>{complaint.rideId}</td>
              <td>{complaint.raisedBy}</td>
              <td>{complaint.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
