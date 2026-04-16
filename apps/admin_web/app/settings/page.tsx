"use client";

import { useEffect, useState } from "react";

import type { RideCategory } from "../../../../packages/shared-types/src";
import { useAdminData } from "../../components/admin-data-provider";
import { ErrorBanner, LoadingBanner, PageIntro } from "../../components/page-state";

type CategoryDrafts = Record<
  string,
  Pick<RideCategory, "baseFare" | "minimumFare" | "perKmRate" | "perMinuteRate" | "waitingCharge" | "cancellationFee">
>;

export default function SettingsPage() {
  const { snapshot, isLoading, error, refresh, saveCategory } = useAdminData();
  const [drafts, setDrafts] = useState<CategoryDrafts>({});
  const [pendingCategoryId, setPendingCategoryId] = useState<string | null>(null);

  useEffect(() => {
    if (!snapshot) {
      return;
    }

    const nextDrafts = snapshot.categories.reduce<CategoryDrafts>((accumulator, category) => {
      accumulator[category.id] = {
        baseFare: category.baseFare,
        minimumFare: category.minimumFare,
        perKmRate: category.perKmRate,
        perMinuteRate: category.perMinuteRate,
        waitingCharge: category.waitingCharge,
        cancellationFee: category.cancellationFee,
      };
      return accumulator;
    }, {});

    setDrafts(nextDrafts);
  }, [snapshot]);

  async function handleSave(categoryId: string) {
    if (!drafts[categoryId]) {
      return;
    }

    setPendingCategoryId(categoryId);
    try {
      await saveCategory(categoryId, drafts[categoryId]);
    } finally {
      setPendingCategoryId(null);
    }
  }

  return (
    <section>
      <PageIntro
        title="Pricing, zones, and pilot defaults"
        description="Edit live fare configuration and review the seeded Madhupur operating geography from the admin console."
      />
      <div className="toolbar">
        <button className="button secondary" onClick={() => refresh()} type="button">
          Refresh settings
        </button>
      </div>
      <LoadingBanner visible={isLoading} />
      <ErrorBanner message={error} />

      <section className="card-grid">
        {snapshot?.categories.map((category) => {
          const draft = drafts[category.id];
          return (
            <article key={category.id} className="card">
              <span className="tag">{category.label}</span>
              <div className="form-grid">
                {draft
                  ? (
                      [
                        ["baseFare", "Base fare"],
                        ["minimumFare", "Minimum fare"],
                        ["perKmRate", "Per km rate"],
                        ["perMinuteRate", "Per minute rate"],
                        ["waitingCharge", "Waiting charge"],
                        ["cancellationFee", "Cancellation fee"],
                      ] as const
                    ).map(([field, label]) => (
                      <label key={field} className="field">
                        <span>{label}</span>
                        <input
                          className="input"
                          type="number"
                          value={draft[field]}
                          onChange={(event) =>
                            setDrafts((current) => ({
                              ...current,
                              [category.id]: {
                                ...current[category.id],
                                [field]: Number(event.target.value),
                              },
                            }))
                          }
                        />
                      </label>
                    ))
                  : null}
              </div>
              <div className="button-row">
                <button
                  className="button"
                  disabled={pendingCategoryId === category.id}
                  onClick={() => handleSave(category.id)}
                  type="button"
                >
                  Save pricing
                </button>
              </div>
            </article>
          );
        })}
      </section>

      <section className="section">
        <h3 className="page-title">Service zones</h3>
        <div className="card-grid">
          {snapshot?.zones.map((zone) => (
            <article key={zone.id} className="card">
              <span className="tag">{zone.status}</span>
              <h4>{zone.name}</h4>
              <p className="muted">{zone.notes}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <h3 className="page-title">Launch landmarks</h3>
        <div className="card-grid">
          {snapshot?.landmarks.map((landmark) => (
            <article key={landmark.id} className="card">
              <span className="tag">{landmark.status}</span>
              <h4>{landmark.name}</h4>
              <p className="muted">{landmark.address}</p>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
