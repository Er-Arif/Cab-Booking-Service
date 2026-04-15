export const appConfig = {
  city: "Madhupur",
  state: "Jharkhand",
  pilotCommissionRate: 0.15,
  dispatchStrategy: "nearest-first",
  supportPhone: "+91-90000-00000",
};

export const businessRules = {
  serviceArea: "Madhupur pilot zones only",
  cancellation: {
    customerFreeBeforeAssignment: true,
    customerAfterArrivalFee: 10,
    driverPenaltyForRepeatedNoShowRisk: true,
  },
  waiting: {
    bikeFreeMinutes: 3,
    eRickshawFreeMinutes: 5,
    chargeAfterFreeWindow: true,
  },
  payout: {
    commissionRate: 0.15,
    settlementCycle: "weekly",
  },
  complaintSla: {
    firstResponseHours: 4,
    targetResolutionHours: 24,
  },
  onboarding: {
    bikeRequiredDocuments: ["ID proof", "Profile photo", "Driving license"],
    eRickshawRequiredDocuments: ["ID proof", "Profile photo", "Vehicle document"],
  },
};

export const designTokens = {
  colors: {
    canvas: "#F5F0E5",
    surface: "#FFFAF0",
    ink: "#1C140D",
    muted: "#7A6551",
    primary: "#0E7A62",
    secondary: "#D96C06",
    danger: "#B23A2F",
    border: "#DDCDB7",
  },
  typography: {
    display: "Georgia",
    body: "Georgia",
    emphasisWeight: 700,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  radius: {
    card: 20,
    panel: 24,
    pill: 999,
  },
};

export const defaultRideCategories = [
  {
    id: "cat_bike",
    key: "bike",
    label: "Bike",
    baseFare: 20,
    minimumFare: 35,
    perKmRate: 9,
    perMinuteRate: 1,
    waitingCharge: 2,
    cancellationFee: 10,
    freeWaitingMinutes: 3,
    isActive: true,
    capacityNote: "Best for solo short-distance travel",
  },
  {
    id: "cat_erickshaw",
    key: "e_rickshaw",
    label: "E-rickshaw",
    baseFare: 30,
    minimumFare: 50,
    perKmRate: 12,
    perMinuteRate: 1,
    waitingCharge: 3,
    cancellationFee: 15,
    freeWaitingMinutes: 5,
    isActive: true,
    capacityNote: "Best for family and market travel",
  },
];

export const defaultServiceZones = [
  { id: "zone_station", name: "Railway Station", status: "active", notes: "Pilot priority zone" },
  { id: "zone_busstand", name: "Bus Stand", status: "active", notes: "High-footfall arrival point" },
  { id: "zone_market", name: "Main Market", status: "active", notes: "Dense local trips" },
  { id: "zone_hospital", name: "Hospital Area", status: "active", notes: "Care and emergency travel" },
];
