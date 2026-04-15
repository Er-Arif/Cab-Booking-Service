import type { Coordinates, RideCategoryKey } from "../../../../../packages/shared-types/src";

import type { MapsProvider } from "../../domain/providers/types";
import { PlatformRepository } from "../../db/repository";

export class PricingService {
  constructor(
    private readonly mapsProvider: MapsProvider,
    private readonly repository: PlatformRepository
  ) {}

  async estimateFare(params: {
    pickup: Coordinates;
    drop: Coordinates;
    categoryKey: RideCategoryKey;
  }) {
    const category = await this.repository.getRideCategoryByKey(params.categoryKey);
    const distanceKm = await this.mapsProvider.estimateDistanceKm(params.pickup, params.drop);
    const calculated = category.baseFare + distanceKm * category.perKmRate;
    return {
      category,
      distanceKm,
      estimatedFare: Math.max(category.minimumFare, Math.round(calculated)),
    };
  }
}
