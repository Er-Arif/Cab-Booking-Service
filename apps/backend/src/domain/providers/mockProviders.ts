import type { Coordinates } from "../../../../../packages/shared-types/src";

import { env } from "../../config/env";
import type {
  FileStorageProvider,
  MapsProvider,
  OtpProvider,
  PushNotificationProvider,
} from "./types";

export class MockOtpProvider implements OtpProvider {
  async sendOtp(phone: string): Promise<{ requestId: string; code: string }> {
    return { requestId: `otp_${phone}`, code: env.mockOtpCode };
  }
}

export class MockMapsProvider implements MapsProvider {
  async estimateDistanceKm(pickup: Coordinates, drop: Coordinates): Promise<number> {
    const dx = pickup.latitude - drop.latitude;
    const dy = pickup.longitude - drop.longitude;
    return Math.max(1, Number.parseFloat((Math.sqrt(dx * dx + dy * dy) * 111).toFixed(2)));
  }
}

export class MockPushProvider implements PushNotificationProvider {
  async sendNotification(targetId: string, title: string, message: string): Promise<void> {
    console.log(`[push:${targetId}] ${title} :: ${message}`);
  }
}

export class MockFileStorageProvider implements FileStorageProvider {
  async storeDocument(fileName: string): Promise<{ url: string }> {
    return { url: `https://mock-storage.local/${fileName}` };
  }
}
