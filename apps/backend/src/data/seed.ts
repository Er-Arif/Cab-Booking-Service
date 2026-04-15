import { defaultRideCategories, defaultServiceZones } from "../../../../packages/shared-config/src";
import type {
  ComplaintRecord,
  CustomerProfile,
  DriverProfile,
  Landmark,
  RideRecord,
} from "../../../../packages/shared-types/src";

export const seededCustomers: CustomerProfile[] = [
  {
    id: "cust_1",
    name: "Aman Kumar",
    phone: "9000000002",
    email: "aman@example.com",
    emergencyContact: "9000000010",
    preferredPaymentMethod: "cash",
  },
];

export const seededDrivers: DriverProfile[] = [
  {
    id: "drv_1",
    name: "Rakesh Yadav",
    phone: "9000000003",
    vehicleType: "bike",
    vehicleNumber: "JH-15AB-1010",
    status: "approved",
    isOnline: true,
    currentLocation: { latitude: 24.2745, longitude: 86.6401 },
    rating: 4.7,
    totalRides: 124,
    upiId: "rakesh@upi",
  },
  {
    id: "drv_2",
    name: "Sanjay Das",
    phone: "9000000004",
    vehicleType: "e_rickshaw",
    vehicleNumber: "JH-15ER-2020",
    status: "approved",
    isOnline: true,
    currentLocation: { latitude: 24.2712, longitude: 86.6463 },
    rating: 4.5,
    totalRides: 88,
    upiId: "sanjay@upi",
  },
];

export const seededLandmarks: Landmark[] = [
  {
    id: "lm_1",
    name: "Madhupur Railway Station",
    address: "Railway Station Road, Madhupur",
    latitude: 24.2733,
    longitude: 86.6467,
    zoneId: "zone_station",
    status: "active",
  },
  {
    id: "lm_2",
    name: "Bus Stand",
    address: "Main Bus Stand, Madhupur",
    latitude: 24.2748,
    longitude: 86.6419,
    zoneId: "zone_busstand",
    status: "active",
  },
  {
    id: "lm_3",
    name: "Main Market",
    address: "Main Market Area, Madhupur",
    latitude: 24.2714,
    longitude: 86.6395,
    zoneId: "zone_market",
    status: "active",
  },
  {
    id: "lm_4",
    name: "Hospital Area",
    address: "Civil Hospital Area, Madhupur",
    latitude: 24.2691,
    longitude: 86.6441,
    zoneId: "zone_hospital",
    status: "active",
  },
];

export const seededRides: RideRecord[] = [
  {
    id: "ride_1",
    customerId: "cust_1",
    driverId: "drv_1",
    categoryKey: "bike",
    pickupAddress: "Madhupur Railway Station",
    dropAddress: "Main Market",
    pickup: { latitude: 24.2733, longitude: 86.6467 },
    drop: { latitude: 24.2714, longitude: 86.6395 },
    estimatedDistanceKm: 1.5,
    estimatedFare: 35,
    finalFare: 36,
    status: "payment_completed",
    paymentMethod: "cash",
    paymentStatus: "completed",
    bookedAt: new Date().toISOString(),
    acceptedAt: new Date().toISOString(),
    arrivedAt: new Date().toISOString(),
    startedAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
  },
];

export const seededComplaints: ComplaintRecord[] = [
  {
    id: "cmp_1",
    rideId: "ride_1",
    raisedByType: "customer",
    raisedById: "cust_1",
    complaintType: "support_follow_up",
    description: "Need invoice copy",
    resolutionStatus: "resolved",
    resolutionNote: "Invoice shared over support channel",
    createdAt: new Date().toISOString(),
    resolvedAt: new Date().toISOString(),
  },
];

export const seededAdmin = {
  id: "admin_1",
  name: "Madhupur Ops Admin",
  phone: "9000000001",
  role: "admin" as const,
};

export const seedState = {
  rideCategories: defaultRideCategories,
  serviceZones: defaultServiceZones,
  landmarks: seededLandmarks,
  customers: seededCustomers,
  drivers: seededDrivers,
  rides: seededRides,
  complaints: seededComplaints,
};
