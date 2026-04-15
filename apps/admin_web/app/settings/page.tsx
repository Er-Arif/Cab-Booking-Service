import { defaultRideCategories, defaultServiceZones } from "../../lib/mock-data";

export default function SettingsPage() {
  return (
    <section>
      <h2 className="page-title">Pricing, Zones, and Pilot Defaults</h2>
      <p className="muted">Admin-managed defaults keep pricing and service boundaries editable as operations evolve.</p>

      <div className="card-grid">
        {defaultRideCategories.map((category) => (
          <article key={category.id} className="card">
            <span className="tag">{category.label}</span>
            <p>Base fare: Rs {category.baseFare}</p>
            <p>Minimum fare: Rs {category.minimumFare}</p>
            <p>Per km: Rs {category.perKmRate}</p>
            <p>Cancellation fee: Rs {category.cancellationFee}</p>
          </article>
        ))}
      </div>

      <section className="section">
        <h3>Service zones</h3>
        <div className="card-grid">
          {defaultServiceZones.map((zone) => (
            <article key={zone.id} className="card">
              <span className="tag">{zone.status}</span>
              <h4>{zone.name}</h4>
              <p className="muted">{zone.notes}</p>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
