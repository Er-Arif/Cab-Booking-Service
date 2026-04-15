import type { Coordinates } from "../../../../../packages/shared-types/src";

export interface OtpProvider {
  sendOtp(phone: string): Promise<{ requestId: string; code: string }>;
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
