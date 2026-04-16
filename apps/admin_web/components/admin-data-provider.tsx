"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import type {
  ComplaintRecord,
  CustomerProfile,
  DashboardMetrics,
  DriverProfile,
  Landmark,
  RideCategory,
  RideRecord,
  ServiceZone,
} from "../../../packages/shared-types/src";
import {
  getDashboard,
  getReportingHealth,
  getSummaryReport,
  loadAdminSnapshot,
  resolveComplaint,
  updateCategory,
  updateDriverStatus,
  type ReportingHealth,
  type SummaryReport,
} from "../lib/admin-api";
import { useAdminSession } from "./admin-provider";

interface AdminSnapshot {
  dashboard: DashboardMetrics;
  drivers: DriverProfile[];
  customers: CustomerProfile[];
  rides: RideRecord[];
  complaints: ComplaintRecord[];
  categories: RideCategory[];
  zones: ServiceZone[];
  landmarks: Landmark[];
  summaryReport: SummaryReport;
  reportingHealth: ReportingHealth;
  dataErrors?: string[];
}

interface AdminDataContextValue {
  snapshot: AdminSnapshot | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  changeDriverStatus: (driverId: string, status: DriverProfile["status"]) => Promise<void>;
  changeComplaintStatus: (complaintId: string, status: ComplaintRecord["resolutionStatus"], note: string) => Promise<void>;
  saveCategory: (
    categoryId: string,
    payload: Pick<RideCategory, "baseFare" | "minimumFare" | "perKmRate" | "perMinuteRate" | "waitingCharge" | "cancellationFee">
  ) => Promise<void>;
}

const AdminDataContext = createContext<AdminDataContextValue | null>(null);

const initialSnapshot: AdminSnapshot = {
  dashboard: {
    totalRidesToday: 0,
    completedRides: 0,
    cancelledRides: 0,
    activeDrivers: 0,
    activeCustomers: 0,
    grossRevenue: 0,
    platformCommission: 0,
    topRoutes: [],
    peakBookingHours: [],
  },
  drivers: [],
  customers: [],
  rides: [],
  complaints: [],
  categories: [],
  zones: [],
  landmarks: [],
  summaryReport: {
    ridesPerCategory: [],
    paymentMix: { cash: 0, upi: 0 },
    complaintOpenCount: 0,
  },
  reportingHealth: {
    complaintsOpen: 0,
    driversOnline: 0,
    ridesActive: 0,
  },
};

export function AdminDataProvider({ children }: { children: ReactNode }) {
  const { session } = useAdminSession();
  const [snapshot, setSnapshot] = useState<AdminSnapshot | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session) {
      setSnapshot(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    void refreshSnapshot(session);
  }, [session]);

  async function refreshSnapshot(currentSession = session) {
    if (!currentSession) {
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const nextSnapshot = await loadAdminSnapshot(currentSession);
      setSnapshot(nextSnapshot);
      setError(nextSnapshot.dataErrors?.length ? nextSnapshot.dataErrors.join(" | ") : null);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load admin data");
      setSnapshot((existing) => existing ?? initialSnapshot);
    } finally {
      setIsLoading(false);
    }
  }

  const value = useMemo<AdminDataContextValue>(
    () => ({
      snapshot,
      isLoading,
      error,
      async refresh() {
        await refreshSnapshot();
      },
      async changeDriverStatus(driverId, status) {
        if (!session) {
          return;
        }
        await updateDriverStatus(session.accessToken, driverId, status);
        const [drivers, dashboard] = await Promise.all([
          loadAdminSnapshot(session).then((data) => data.drivers),
          getDashboard(session.accessToken).then((data) => data.metrics),
        ]);
        setSnapshot((existing) =>
          existing
            ? {
                ...existing,
                drivers,
                dashboard,
              }
            : existing
        );
      },
      async changeComplaintStatus(complaintId, status, note) {
        if (!session) {
          return;
        }
        await resolveComplaint(session.accessToken, complaintId, {
          resolutionStatus: status,
          resolutionNote: note,
        });
        const [complaints, summaryReport, reportingHealth] = await Promise.all([
          loadAdminSnapshot(session).then((data) => data.complaints),
          getSummaryReport(session.accessToken),
          getReportingHealth(session.accessToken),
        ]);
        setSnapshot((existing) =>
          existing
            ? {
                ...existing,
                complaints,
                summaryReport,
                reportingHealth,
              }
            : existing
        );
      },
      async saveCategory(categoryId, payload) {
        if (!session) {
          return;
        }
        await updateCategory(session.accessToken, categoryId, payload);
        const categories = await loadAdminSnapshot(session).then((data) => data.categories);
        setSnapshot((existing) =>
          existing
            ? {
                ...existing,
                categories,
              }
            : existing
        );
      },
    }),
    [error, isLoading, session, snapshot]
  );

  return <AdminDataContext.Provider value={value}>{children}</AdminDataContext.Provider>;
}

export function useAdminData() {
  const value = useContext(AdminDataContext);
  if (!value) {
    throw new Error("useAdminData must be used within AdminDataProvider");
  }
  return value;
}
