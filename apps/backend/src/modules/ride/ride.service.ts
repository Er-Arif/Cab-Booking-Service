import { appConfig } from "../../../../../packages/shared-config/src";
import type { PaymentMethod, RideStatus } from "../../../../../packages/shared-types/src";

import { PlatformRepository } from "../../db/repository";
import type { PushNotificationProvider } from "../../domain/providers/types";
import { ValidationError } from "../../lib/errors";
import { PricingService } from "../pricing/pricing.service";

const allowedTransitions: Record<string, RideStatus[]> = {
  driver_assigned: ["driver_arriving", "cancelled_by_driver", "cancelled_by_admin"],
  driver_arriving: ["driver_arrived", "cancelled_by_driver", "cancelled_by_admin"],
  driver_arrived: ["trip_started", "cancelled_by_user", "cancelled_by_admin"],
  trip_started: ["trip_completed", "cancelled_by_admin"],
  trip_completed: ["payment_completed"],
  searching_driver: ["driver_assigned", "cancelled_by_user", "cancelled_by_admin"],
  payment_completed: [],
};

export class RideService {
  constructor(
    private readonly pricingService: PricingService,
    private readonly repository: PlatformRepository,
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

    const drivers = await this.repository.getEligibleDrivers(input.categoryKey);
    const assignedDriver = drivers.sort((a: (typeof drivers)[number], b: (typeof drivers)[number]) => {
      const aDistance =
        Math.abs(a.currentLocation.latitude - input.pickup.latitude) +
        Math.abs(a.currentLocation.longitude - input.pickup.longitude);
      const bDistance =
        Math.abs(b.currentLocation.latitude - input.pickup.latitude) +
        Math.abs(b.currentLocation.longitude - input.pickup.longitude);
      return aDistance - bDistance;
    })[0];

    const ride = await this.repository.createRide({
      customerId: input.customerId,
      driverId: assignedDriver?.id,
      categoryKey: input.categoryKey,
      pickupAddress: input.pickupAddress,
      dropAddress: input.dropAddress,
      pickupNote: input.pickupNote,
      dropNote: input.dropNote,
      pickupLatitude: input.pickup.latitude,
      pickupLongitude: input.pickup.longitude,
      dropLatitude: input.drop.latitude,
      dropLongitude: input.drop.longitude,
      estimatedDistanceKm: fare.distanceKm,
      estimatedFare: fare.estimatedFare,
      paymentMethod: input.paymentMethod,
      status: assignedDriver ? "driver_assigned" : "searching_driver",
      acceptedAt: assignedDriver ? new Date() : undefined,
    });

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

  async listRides() {
    return this.repository.listRides();
  }

  async updateRideStatus(rideId: string, status: RideStatus) {
    const ride = await this.repository.getRideById(rideId);
    const permitted = allowedTransitions[ride.status] ?? [];
    if (!permitted.includes(status)) {
      throw new ValidationError(`Cannot move ride from ${ride.status} to ${status}`);
    }

    return this.repository.updateRideStatus(rideId, status);
  }

  async markPaymentComplete(rideId: string) {
    const ride = await this.repository.getRideById(rideId);
    if (ride.status !== "trip_completed") {
      throw new ValidationError("Ride must be trip_completed before payment completion");
    }
    return this.repository.recordPaymentCompletion(rideId, ride.driverId);
  }
}
