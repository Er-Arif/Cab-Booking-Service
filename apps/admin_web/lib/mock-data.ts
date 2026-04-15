import { defaultRideCategories, defaultServiceZones } from "../../../packages/shared-config/src";

export const metrics = [
  { label: "Total rides today", value: "22", tone: "status-ok" },
  { label: "Completed rides", value: "17", tone: "status-ok" },
  { label: "Cancelled rides", value: "3", tone: "status-warn" },
  { label: "Platform commission", value: "Rs 276", tone: "status-ok" },
];

export const drivers = [
  {
    id: "drv_1",
    name: "Rakesh Yadav",
    category: "Bike",
    phone: "9000000003",
    status: "Approved",
    rating: 4.7,
    online: "Online",
  },
  {
    id: "drv_2",
    name: "Sanjay Das",
    category: "E-rickshaw",
    phone: "9000000004",
    status: "Approved",
    rating: 4.5,
    online: "Online",
  },
  {
    id: "drv_3",
    name: "Pawan Singh",
    category: "Bike",
    phone: "9000000008",
    status: "Pending",
    rating: 0,
    online: "Offline",
  },
];

export const rides = [
  {
    id: "ride_1",
    route: "Railway Station -> Main Market",
    customer: "Aman Kumar",
    driver: "Rakesh Yadav",
    category: "Bike",
    status: "payment_completed",
    fare: "Rs 36",
  },
  {
    id: "ride_2",
    route: "Bus Stand -> Hospital Area",
    customer: "Neha Devi",
    driver: "Sanjay Das",
    category: "E-rickshaw",
    status: "driver_arriving",
    fare: "Rs 58",
  },
];

export const complaints = [
  {
    id: "cmp_1",
    rideId: "ride_1",
    issue: "Invoice copy request",
    raisedBy: "Customer",
    status: "Resolved",
  },
  {
    id: "cmp_2",
    rideId: "ride_2",
    issue: "Pickup delay",
    raisedBy: "Customer",
    status: "In review",
  },
];

export const reports = [
  { label: "Bike rides share", value: "61%" },
  { label: "E-rickshaw rides share", value: "39%" },
  { label: "Cash payments", value: "72%" },
  { label: "UPI payments", value: "28%" },
];

export { defaultRideCategories, defaultServiceZones };
