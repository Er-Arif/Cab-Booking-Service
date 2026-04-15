import type { Coordinates } from "../../../../../packages/shared-types/src";

export interface OtpProvider {
  sendOtp(phone: string): Promise<{ requestId: string; otp: string }>;
  verifyOtp(phone: string, otp: string): Promise<boolean>;
}

export interface MapsProvider {
  estimateDistanceKm(pickup: Coordinates, drop: Coordinates): Promise<number>;
}

export interface PushNotificationProvider {
  sendNotification(targetId: string, title: string, message: string): Promise<void>;
}

export interface FileStorageProvider {
  storeDocument(fileName: string): Promise<{ url: string }>;
}
