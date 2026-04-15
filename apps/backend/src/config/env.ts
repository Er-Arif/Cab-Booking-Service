import dotenv from "dotenv";

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 4000),
  jwtSecret: process.env.JWT_SECRET ?? "change-me",
  adminWebOrigin: process.env.ADMIN_WEB_ORIGIN ?? "http://localhost:3000",
  otpProvider: process.env.OTP_PROVIDER ?? "mock",
  mapsProvider: process.env.MAPS_PROVIDER ?? "mock",
  pushProvider: process.env.PUSH_PROVIDER ?? "mock",
  fileStorageProvider: process.env.FILE_STORAGE_PROVIDER ?? "mock",
};
