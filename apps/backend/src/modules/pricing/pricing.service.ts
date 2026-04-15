import type { Coordinates, RideCategoryKey } from "../../../../../packages/shared-types/src";

import type { MapsProvider } from "domain/providers/types";
import { store } from "modules/common/store";

export class PricingService {
  constructor(private readonly mapsProvider: MapsProvider) {}

  async estimateFare(params: {
    pickup: Coordinates;
    drop: Coordinates;
    categoryKey: RideCategoryKey;
  }) {
    const category = store.rideCategories.find((item) => item.key === params.categoryKey);
    if (!category) {
      throw new Error("Ride category not found");
    }

    const distanceKm = await this.mapsProvider.estimateDistanceKm(params.pickup, params.drop);
    const calculated = category.baseFare + distanceKm * category.perKmRate;
    return {
      category,
      distanceKm,
      estimatedFare: Math.max(category.minimumFare, Math.round(calculated)),
    };
  }
}
