import type { Coordinates } from "../../../../../packages/shared-types/src";

import type {
  FileStorageProvider,
  MapsProvider,
  OtpProvider,
  PushNotificationProvider,
} from "./types";

const otpStore = new Map<string, string>();

export class MockOtpProvider implements OtpProvider {
  async sendOtp(phone: string): Promise<{ requestId: string; otp: string }> {
    const otp = "123456";
    otpStore.set(phone, otp);
    return { requestId: `otp_${phone}`, otp };
  }

  async verifyOtp(phone: string, otp: string): Promise<boolean> {
    return otpStore.get(phone) === otp;
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
