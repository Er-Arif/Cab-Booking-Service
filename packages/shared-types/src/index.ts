export type RideCategoryKey = "bike" | "e_rickshaw";

export type RideStatus =
  | "requested"
  | "searching_driver"
  | "driver_assigned"
  | "driver_arriving"
  | "driver_arrived"
  | "trip_started"
  | "trip_completed"
  | "cancelled_by_user"
  | "cancelled_by_driver"
  | "cancelled_by_admin"
  | "payment_pending"
  | "payment_completed";

export type PaymentMethod = "cash" | "upi";
export type PaymentStatus = "pending" | "recorded" | "completed" | "failed";
export type VerificationStatus = "pending" | "approved" | "rejected" | "suspended";
export type ComplaintStatus = "open" | "in_review" | "resolved" | "closed";
export type UserRole = "customer" | "driver" | "admin";

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Landmark extends Coordinates {
  id: string;
  name: string;
  address: string;
  zoneId: string;
  status: "active" | "inactive";
}

export interface ServiceZone {
  id: string;
  name: string;
  status: "active" | "inactive";
  notes: string;
}

export interface RideCategory {
  id: string;
  key: RideCategoryKey;
  label: string;
  baseFare: number;
  minimumFare: number;
  perKmRate: number;
  perMinuteRate: number;
  waitingCharge: number;
  cancellationFee: number;
  freeWaitingMinutes: number;
  isActive: boolean;
  capacityNote: string;
}

export interface CustomerProfile {
  id: string;
  name: string;
  phone: string;
  email?: string;
  profileImageUrl?: string;
  emergencyContact?: string;
  preferredPaymentMethod?: PaymentMethod;
}

export interface DriverProfile {
  id: string;
  name: string;
  phone: string;
  vehicleType: RideCategoryKey;
  vehicleNumber: string;
  status: VerificationStatus;
  isOnline: boolean;
  currentLocation: Coordinates;
  rating: number;
  totalRides: number;
  upiId?: string;
}

export interface RideRecord {
  id: string;
  customerId: string;
  driverId?: string;
  categoryKey: RideCategoryKey;
  pickupAddress: string;
  dropAddress: string;
  pickupNote?: string;
  dropNote?: string;
  pickup: Coordinates;
  drop: Coordinates;
  estimatedDistanceKm: number;
  estimatedFare: number;
  finalFare?: number;
  status: RideStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  bookedAt: string;
  acceptedAt?: string;
  arrivedAt?: string;
  startedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
}

export interface ComplaintRecord {
  id: string;
  rideId: string;
  raisedByType: "customer" | "driver";
  raisedById: string;
  complaintType: string;
  description: string;
  resolutionStatus: ComplaintStatus;
  resolutionNote?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface DashboardMetrics {
  totalRidesToday: number;
  completedRides: number;
  cancelledRides: number;
  activeDrivers: number;
  activeCustomers: number;
  grossRevenue: number;
  platformCommission: number;
  topRoutes: string[];
  peakBookingHours: string[];
}

export interface RealtimeEventMap {
  "driver.request.received": {
    rideId: string;
    driverId: string;
    expiresInSeconds: number;
  };
  "driver.request.expired": {
    rideId: string;
    driverId: string;
  };
  "ride.assigned": {
    rideId: string;
    driverId: string;
  };
  "ride.location.updated": {
    rideId: string;
    driverId: string;
    location: Coordinates;
  };
  "ride.status.changed": {
    rideId: string;
    status: RideStatus;
  };
  "ride.cancelled": {
    rideId: string;
    status: Extract<RideStatus, "cancelled_by_user" | "cancelled_by_driver" | "cancelled_by_admin">;
  };
}
