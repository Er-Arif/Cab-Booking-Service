import Link from "next/link";

type LegalDoc = {
  title: string;
  summary: string;
  sections: Array<{ heading: string; bullets: string[] }>;
};

const legalDocs: Record<string, LegalDoc> = {
  terms: {
    title: "Terms and Conditions",
    summary:
      "Version 1 governs access to the customer app, driver app, admin panel, and backend platform while the product operates as a controlled pilot.",
    sections: [
      {
        heading: "Scope and eligibility",
        bullets: [
          "The platform facilitates ride booking, dispatch, complaints, and operations workflows.",
          "Users must provide accurate details and use the service lawfully and respectfully.",
        ],
      },
      {
        heading: "Pilot boundaries",
        bullets: [
          "Version 1 may use mock, local, or development adapters for OTP, maps, payment tracking, notifications, and storage.",
          "Availability, ETA, and fare estimates are operational estimates rather than strict guarantees.",
        ],
      },
      {
        heading: "Suspension and misuse",
        bullets: [
          "False bookings, harassment, fraud, or unsafe behavior may lead to account restriction.",
          "The platform may cancel or reassign rides for safety or operational continuity.",
        ],
      },
    ],
  },
  privacy: {
    title: "Privacy Policy",
    summary:
      "The platform collects account, ride, location, complaint, and audit information needed to run the service and support the pilot.",
    sections: [
      {
        heading: "Data collected",
        bullets: [
          "Phone number, role, session metadata, ride history, complaint records, and admin actions may be stored.",
          "Pickup and drop landmarks, notes, and coordinates may be processed to create and manage rides.",
        ],
      },
      {
        heading: "Why data is used",
        bullets: [
          "To authenticate users, estimate fares, assign rides, manage support, and produce operational reports.",
          "To secure the platform and keep an auditable record of ride and admin activity.",
        ],
      },
      {
        heading: "Version 1 note",
        bullets: [
          "Some provider-backed flows remain on mock or local adapters during the pilot.",
          "Legal review is still required before broader commercial launch.",
        ],
      },
    ],
  },
  customer: {
    title: "Customer Agreement",
    summary:
      "Customers agree to provide accurate booking details, respect drivers, and use the platform honestly during the Version 1 pilot.",
    sections: [
      {
        heading: "Booking responsibilities",
        bullets: [
          "Customers should confirm pickup, drop, and ride category before booking.",
          "Repeated no-shows or false bookings may lead to restriction.",
        ],
      },
      {
        heading: "Payment and complaints",
        bullets: [
          "Version 1 supports cash and UPI record-tracking rather than a full payment gateway.",
          "Complaint review may require operator verification of ride and payment details.",
        ],
      },
      {
        heading: "Consent",
        bullets: [
          "By continuing, customers acknowledge the Terms and Conditions and Privacy Policy.",
        ],
      },
    ],
  },
  driver: {
    title: "Driver Agreement",
    summary:
      "Drivers agree to safe conduct, accurate ride status updates, and cooperation with pilot operations, review, and complaint handling.",
    sections: [
      {
        heading: "Operational responsibilities",
        bullets: [
          "Drivers must use accurate identity, vehicle, and availability information.",
          "False trip actions, fare manipulation, or abusive behavior may result in suspension.",
        ],
      },
      {
        heading: "Earnings and compliance",
        bullets: [
          "Version 1 uses commission-based accounting and internal payout procedures.",
          "Drivers must maintain required local compliance documents and cooperate with review requests.",
        ],
      },
      {
        heading: "Consent",
        bullets: [
          "By continuing, drivers acknowledge the Terms and Conditions, Privacy Policy, and Driver Agreement.",
        ],
      },
    ],
  },
};

export function LegalIndex() {
  return (
    <div className="legal-shell">
      <div className="hero">
        <span className="tag">Version 1 legal pack</span>
        <h2>Legal and compliance documents</h2>
        <p className="muted">
          These documents are product-ready pilot templates and should be reviewed by qualified legal counsel before a
          broader public commercial rollout.
        </p>
      </div>

      <div className="card-grid">
        <LegalCard href="/legal/terms" title="Terms and Conditions" body="Platform-wide access, conduct, and service terms." />
        <LegalCard href="/legal/privacy" title="Privacy Policy" body="Data collection, use, storage, and audit posture." />
        <LegalCard href="/legal/customer-agreement" title="Customer Agreement" body="Rider-specific booking, payment, and complaint expectations." />
        <LegalCard href="/legal/driver-agreement" title="Driver Agreement" body="Driver conduct, compliance, and earnings expectations." />
      </div>
    </div>
  );
}

function LegalCard({ href, title, body }: { href: string; title: string; body: string }) {
  return (
    <article className="card">
      <h3>{title}</h3>
      <p className="muted">{body}</p>
      <Link className="legal-link" href={href}>
        Open document
      </Link>
    </article>
  );
}

export function LegalDocument({ docKey }: { docKey: keyof typeof legalDocs }) {
  const doc = legalDocs[docKey];
  const sourcePath =
    docKey === "terms"
      ? "terms-and-conditions.md"
      : docKey === "privacy"
        ? "privacy-policy.md"
        : docKey === "customer"
          ? "customer-agreement.md"
          : "driver-agreement.md";

  return (
    <div className="legal-shell">
      <div className="hero">
        <span className="tag">Legal template</span>
        <h2>{doc.title}</h2>
        <p className="muted">{doc.summary}</p>
        <p className="muted">
          Source-of-truth template: <span className="legal-path">docs/legal/{sourcePath}</span>
        </p>
      </div>

      {doc.sections.map((section) => (
        <section className="section card" key={section.heading}>
          <h3>{section.heading}</h3>
          <ul className="plain-list legal-list">
            {section.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        </section>
      ))}

      <section className="section card">
        <h3>Version 1 legal notice</h3>
        <p className="muted">
          These texts support pilot operations and consent flows, but they still require final lawyer review before a
          broad public launch.
        </p>
        <Link className="legal-link" href="/legal">
          Back to legal index
        </Link>
      </section>
    </div>
  );
}
