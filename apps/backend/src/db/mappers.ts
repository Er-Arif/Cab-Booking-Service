import type {
  ComplaintRecord,
  Coordinates,
  CustomerProfile,
  DriverProfile,
  Landmark,
  RideCategory,
  RideRecord,
  ServiceZone,
} from "../../../../packages/shared-types/src";

function toCoordinates(row: { latitude?: number | string; longitude?: number | string }): Coordinates {
  return {
    latitude: Number(row.latitude),
    longitude: Number(row.longitude),
  };
}

export function mapCustomer(row: Record<string, unknown>): CustomerProfile {
  return {
    id: String(row.id),
    name: String(row.name),
    phone: String(row.phone),
    email: row.email ? String(row.email) : undefined,
    profileImageUrl: row.profile_image_url ? String(row.profile_image_url) : undefined,
    emergencyContact: row.emergency_contact ? String(row.emergency_contact) : undefined,
    preferredPaymentMethod: row.preferred_payment_method ? (String(row.preferred_payment_method) as "cash" | "upi") : undefined,
  };
}

export function mapDriver(row: Record<string, unknown>): DriverProfile {
  return {
    id: String(row.id),
    name: String(row.name),
    phone: String(row.phone),
    vehicleType: String(row.vehicle_type) as DriverProfile["vehicleType"],
    vehicleNumber: String(row.vehicle_number),
    status: String(row.status) as DriverProfile["status"],
    isOnline: Boolean(row.is_online),
    currentLocation: {
      latitude: Number(row.current_latitude ?? 0),
      longitude: Number(row.current_longitude ?? 0),
    },
    rating: Number(row.rating ?? 0),
    totalRides: Number(row.total_rides ?? 0),
    upiId: row.upi_id ? String(row.upi_id) : undefined,
  };
}

export function mapRideCategory(row: Record<string, unknown>): RideCategory {
  return {
    id: String(row.id),
    key: String(row.key) as RideCategory["key"],
    label: String(row.name),
    baseFare: Number(row.base_fare),
    minimumFare: Number(row.minimum_fare),
    perKmRate: Number(row.per_km_rate),
    perMinuteRate: Number(row.per_minute_rate),
    waitingCharge: Number(row.waiting_charge),
    cancellationFee: Number(row.cancellation_fee),
    freeWaitingMinutes: Number(row.free_waiting_minutes),
    isActive: Boolean(row.is_active),
    capacityNote: String(row.capacity_note ?? ""),
  };
}

export function mapLandmark(row: Record<string, unknown>): Landmark {
  return {
    id: String(row.id),
    name: String(row.name),
    address: String(row.address),
    zoneId: String(row.zone_id),
    status: String(row.status) as Landmark["status"],
    ...toCoordinates({
      latitude: row.latitude as number | string,
      longitude: row.longitude as number | string,
    }),
  };
}

export function mapZone(row: Record<string, unknown>): ServiceZone {
  return {
    id: String(row.id),
    name: String(row.zone_name),
    status: String(row.status) as ServiceZone["status"],
    notes: String(row.notes ?? ""),
  };
}

export function mapRide(row: Record<string, unknown>): RideRecord {
  return {
    id: String(row.id),
    customerId: String(row.customer_id),
    driverId: row.driver_id ? String(row.driver_id) : undefined,
    categoryKey: String(row.category_key) as RideRecord["categoryKey"],
    pickupAddress: String(row.pickup_address),
    dropAddress: String(row.drop_address),
    pickupNote: row.pickup_note ? String(row.pickup_note) : undefined,
    dropNote: row.drop_note ? String(row.drop_note) : undefined,
    pickup: {
      latitude: Number(row.pickup_latitude),
      longitude: Number(row.pickup_longitude),
    },
    drop: {
      latitude: Number(row.drop_latitude),
      longitude: Number(row.drop_longitude),
    },
    estimatedDistanceKm: Number(row.estimated_distance_km),
    estimatedFare: Number(row.estimated_fare),
    finalFare: row.final_fare ? Number(row.final_fare) : undefined,
    status: String(row.status) as RideRecord["status"],
    paymentMethod: String(row.payment_method) as RideRecord["paymentMethod"],
    paymentStatus: String(row.payment_status) as RideRecord["paymentStatus"],
    bookedAt: new Date(String(row.booked_at)).toISOString(),
    acceptedAt: row.accepted_at ? new Date(String(row.accepted_at)).toISOString() : undefined,
    arrivedAt: row.arrived_at ? new Date(String(row.arrived_at)).toISOString() : undefined,
    startedAt: row.started_at ? new Date(String(row.started_at)).toISOString() : undefined,
    completedAt: row.completed_at ? new Date(String(row.completed_at)).toISOString() : undefined,
    cancelledAt: row.cancelled_at ? new Date(String(row.cancelled_at)).toISOString() : undefined,
  };
}

export function mapComplaint(row: Record<string, unknown>): ComplaintRecord {
  return {
    id: String(row.id),
    rideId: String(row.ride_id),
    raisedByType: String(row.raised_by_type) as ComplaintRecord["raisedByType"],
    raisedById: String(row.raised_by_id),
    complaintType: String(row.complaint_type),
    description: String(row.description),
    resolutionStatus: String(row.resolution_status) as ComplaintRecord["resolutionStatus"],
    resolutionNote: row.resolution_note ? String(row.resolution_note) : undefined,
    createdAt: new Date(String(row.created_at)).toISOString(),
    resolvedAt: row.resolved_at ? new Date(String(row.resolved_at)).toISOString() : undefined,
  };
}
