"use client";

import { useAdminData } from "../../components/admin-data-provider";
import { EmptyState, ErrorBanner, LoadingBanner, PageIntro } from "../../components/page-state";

export default function CustomersPage() {
  const { snapshot, isLoading, error, refresh } = useAdminData();

  return (
    <section>
      <PageIntro
        title="Customers"
        description="Track active customers, contact preferences, and the accounts currently using the service."
      />
      <div className="toolbar">
        <button className="button secondary" onClick={() => refresh()} type="button">
          Refresh customers
        </button>
      </div>
      <LoadingBanner visible={isLoading} />
      <ErrorBanner message={error} />

      {snapshot && snapshot.customers.length > 0 ? (
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Emergency contact</th>
              <th>Preferred payment</th>
            </tr>
          </thead>
          <tbody>
            {snapshot.customers.map((customer) => (
              <tr key={customer.id}>
                <td>{customer.name}</td>
                <td>{customer.phone}</td>
                <td>{customer.email ?? "Not set"}</td>
                <td>{customer.emergencyContact ?? "Not set"}</td>
                <td>{customer.preferredPaymentMethod ?? "Not set"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <EmptyState message="Customers will appear here after they authenticate into the app." />
      )}
    </section>
  );
}
