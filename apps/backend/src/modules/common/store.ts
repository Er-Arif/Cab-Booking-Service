import { defaultRideCategories, defaultServiceZones } from "../../../../../packages/shared-config/src";
import type {
  ComplaintRecord,
  CustomerProfile,
  DriverProfile,
  Landmark,
  RideCategory,
  RideRecord,
  ServiceZone,
} from "../../../../../packages/shared-types/src";

import { seedState } from "data/seed";

export interface SessionUser {
  id: string;
  phone: string;
  role: "customer" | "driver" | "admin";
}

class InMemoryStore {
  customers: CustomerProfile[] = [...seedState.customers];
  drivers: DriverProfile[] = [...seedState.drivers];
  rides: RideRecord[] = [...seedState.rides];
  complaints: ComplaintRecord[] = [...seedState.complaints];
  rideCategories: RideCategory[] = [...defaultRideCategories] as RideCategory[];
  serviceZones: ServiceZone[] = [...defaultServiceZones] as ServiceZone[];
  landmarks: Landmark[] = [...seedState.landmarks];
  sessions: SessionUser[] = [];
}

export const store = new InMemoryStore();
