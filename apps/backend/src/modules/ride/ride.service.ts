import { appConfig } from "../../../../../packages/shared-config/src";
import type { PaymentMethod, RideRecord, RideStatus } from "../../../../../packages/shared-types/src";

import type { PushNotificationProvider } from "domain/providers/types";
import { store } from "modules/common/store";
import { PricingService } from "modules/pricing/pricing.service";

export class RideService {
  constructor(
    private readonly pricingService: PricingService,
    private readonly pushProvider: PushNotificationProvider
  ) {}

  async createBooking(input: {
    customerId: string;
    categoryKey: "bike" | "e_rickshaw";
    pickupAddress: string;
    dropAddress: string;
    pickupNote?: string;
    dropNote?: string;
    pickup: { latitude: number; longitude: number };
    drop: { latitude: number; longitude: number };
    paymentMethod: PaymentMethod;
  }) {
    const fare = await this.pricingService.estimateFare({
      pickup: input.pickup,
      drop: input.drop,
      categoryKey: input.categoryKey,
    });

    const candidateDrivers = store.drivers
      .filter((driver) => driver.status === "approved" && driver.isOnline && driver.vehicleType === input.categoryKey)
      .sort((a, b) => {
        const aDistance =
          Math.abs(a.currentLocation.latitude - input.pickup.latitude) +
          Math.abs(a.currentLocation.longitude - input.pickup.longitude);
        const bDistance =
          Math.abs(b.currentLocation.latitude - input.pickup.latitude) +
          Math.abs(b.currentLocation.longitude - input.pickup.longitude);
        return aDistance - bDistance;
      });

    const assignedDriver = candidateDrivers[0];
    const now = new Date().toISOString();
    const ride: RideRecord = {
      id: `ride_${Date.now()}`,
      customerId: input.customerId,
      driverId: assignedDriver?.id,
      categoryKey: input.categoryKey,
      pickupAddress: input.pickupAddress,
      dropAddress: input.dropAddress,
      pickupNote: input.pickupNote,
      dropNote: input.dropNote,
      pickup: input.pickup,
      drop: input.drop,
      estimatedDistanceKm: fare.distanceKm,
      estimatedFare: fare.estimatedFare,
      status: assignedDriver ? "driver_assigned" : "searching_driver",
      paymentMethod: input.paymentMethod,
      paymentStatus: "pending",
      bookedAt: now,
      acceptedAt: assignedDriver ? now : undefined,
    };

    store.rides.unshift(ride);

    if (assignedDriver) {
      await this.pushProvider.sendNotification(
        assignedDriver.id,
        "New ride assigned",
        `Pickup at ${input.pickupAddress}`
      );
    }

    return {
      ride,
      dispatchStrategy: appConfig.dispatchStrategy,
      assignedDriver,
    };
  }

  listRides() {
    return store.rides;
  }

  getRideById(rideId: string) {
    return store.rides.find((ride) => ride.id === rideId);
  }

  updateRideStatus(rideId: string, status: RideStatus) {
    const ride = this.getRideById(rideId);
    if (!ride) {
      throw new Error("Ride not found");
    }

    ride.status = status;
    if (status === "driver_arrived") {
      ride.arrivedAt = new Date().toISOString();
    }
    if (status === "trip_started") {
      ride.startedAt = new Date().toISOString();
    }
    if (status === "trip_completed") {
      ride.completedAt = new Date().toISOString();
      ride.paymentStatus = "recorded";
      ride.finalFare = ride.estimatedFare;
    }
    if (status.startsWith("cancelled")) {
      ride.cancelledAt = new Date().toISOString();
    }

    return ride;
  }

  markPaymentComplete(rideId: string) {
    const ride = this.getRideById(rideId);
    if (!ride) {
      throw new Error("Ride not found");
    }

    ride.paymentStatus = "completed";
    ride.status = "payment_completed";
    ride.finalFare = ride.finalFare ?? ride.estimatedFare;

    return {
      ride,
      driverEarning: Number((ride.finalFare * (1 - appConfig.pilotCommissionRate)).toFixed(2)),
      platformCommission: Number((ride.finalFare * appConfig.pilotCommissionRate).toFixed(2)),
    };
  }
}
