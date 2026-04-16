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

import type { AdminSession } from "./admin-session";

const defaultApiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

export interface SummaryReport {
  ridesPerCategory: Array<{
    category: string;
    rideCount: number;
  }>;
  paymentMix: {
    cash: number;
    upi: number;
  };
  complaintOpenCount: number;
}

export interface ReportingHealth {
  driversOnline: number;
  ridesActive: number;
  complaintsOpen: number;
}

interface JsonOptions {
  method?: "GET" | "POST" | "PATCH";
  token?: string;
  body?: object;
}

async function requestJson<T>(path: string, options: JsonOptions = {}): Promise<T> {
  const response = await fetch(`${defaultApiBaseUrl}${path}`, {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    cache: "no-store",
  });

  const data: unknown = await response.json();
  if (!response.ok) {
    const message =
      typeof data === "object" && data !== null && "message" in data && typeof data.message === "string"
        ? data.message
        : "Request failed";
    throw new Error(message);
  }

  return data as T;
}

export async function sendAdminOtp(phone: string) {
  return requestJson<{ message: string; requestId: string }>("/api/auth/send-otp", {
    method: "POST",
    body: {
      phone,
      role: "admin",
    },
  });
}

export async function verifyAdminOtp(phone: string, otp: string) {
  return requestJson<{
    accessToken: string;
    refreshToken: string;
    userId: string;
    role: string;
  }>("/api/auth/verify-otp", {
    method: "POST",
    body: {
      phone,
      otp,
      role: "admin",
    },
  });
}

export async function logoutAdmin(refreshToken: string) {
  return requestJson<{ success: boolean }>("/api/auth/logout", {
    method: "POST",
    body: { refreshToken },
  });
}

export async function getDashboard(token: string) {
  return requestJson<{ metrics: DashboardMetrics }>("/api/admin/dashboard", { token });
}

export async function getDrivers(token: string) {
  return requestJson<DriverProfile[]>("/api/admin/drivers", { token });
}

export async function getCustomers(token: string) {
  return requestJson<CustomerProfile[]>("/api/admin/customers", { token });
}

export async function getRides(token: string) {
  return requestJson<RideRecord[]>("/api/admin/rides", { token });
}

export async function getComplaints(token: string) {
  return requestJson<ComplaintRecord[]>("/api/admin/complaints", { token });
}

export async function getLandmarks(token: string) {
  return requestJson<Landmark[]>("/api/admin/landmarks", { token });
}

export async function getZones(token: string) {
  return requestJson<ServiceZone[]>("/api/admin/zones", { token });
}

export async function getCategories(token: string) {
  return requestJson<RideCategory[]>("/api/admin/categories", { token });
}

export async function updateDriverStatus(token: string, driverId: string, status: DriverProfile["status"]) {
  return requestJson<DriverProfile>(`/api/admin/drivers/${driverId}/status`, {
    method: "PATCH",
    token,
    body: { status },
  });
}

export async function updateCategory(
  token: string,
  categoryId: string,
  payload: Pick<RideCategory, "baseFare" | "minimumFare" | "perKmRate" | "perMinuteRate" | "waitingCharge" | "cancellationFee">
) {
  return requestJson<RideCategory>(`/api/admin/categories/${categoryId}`, {
    method: "PATCH",
    token,
    body: payload,
  });
}

export async function resolveComplaint(
  token: string,
  complaintId: string,
  payload: { resolutionStatus: ComplaintRecord["resolutionStatus"]; resolutionNote: string }
) {
  return requestJson<ComplaintRecord>(`/api/admin/complaints/${complaintId}`, {
    method: "PATCH",
    token,
    body: payload,
  });
}

export async function getSummaryReport(token: string) {
  return requestJson<SummaryReport>("/api/admin/reports/summary", { token });
}

export async function getReportingHealth(token: string) {
  return requestJson<ReportingHealth>("/api/reporting/health", { token });
}

export async function loadAdminSnapshot(session: AdminSession) {
  const token = session.accessToken;
  const [dashboard, drivers, customers, rides, complaints, categories, zones, landmarks, summaryReport, reportingHealth] =
    await Promise.all([
      getDashboard(token),
      getDrivers(token),
      getCustomers(token),
      getRides(token),
      getComplaints(token),
      getCategories(token),
      getZones(token),
      getLandmarks(token),
      getSummaryReport(token),
      getReportingHealth(token),
    ]);

  return {
    dashboard: dashboard.metrics,
    drivers,
    customers,
    rides,
    complaints,
    categories,
    zones,
    landmarks,
    summaryReport,
    reportingHealth,
  };
}
