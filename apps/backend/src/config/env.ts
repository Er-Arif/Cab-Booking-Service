import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: z.string().min(1).default("postgresql://postgres:postgres@localhost:5432/madhupur_rides"),
  JWT_SECRET: z.string().min(10).default("change-me-production-secret"),
  JWT_ISSUER: z.string().default("madhupur-rides-api"),
  JWT_AUDIENCE: z.string().default("madhupur-rides-clients"),
  ACCESS_TOKEN_TTL_MINUTES: z.coerce.number().int().positive().default(30),
  REFRESH_TOKEN_TTL_DAYS: z.coerce.number().int().positive().default(14),
  ADMIN_WEB_ORIGIN: z.string().default("http://localhost:3000"),
  OTP_PROVIDER: z.string().default("mock"),
  MAPS_PROVIDER: z.string().default("mock"),
  PUSH_PROVIDER: z.string().default("mock"),
  FILE_STORAGE_PROVIDER: z.string().default("mock"),
  MOCK_OTP_CODE: z.string().default("123456"),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(15 * 60 * 1000),
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().int().positive().default(200),
  AUTH_RATE_LIMIT_MAX_REQUESTS: z.coerce.number().int().positive().default(30),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  throw new Error(`Invalid environment configuration: ${parsed.error.message}`);
}

export const env = {
  nodeEnv: parsed.data.NODE_ENV,
  port: parsed.data.PORT,
  databaseUrl: parsed.data.DATABASE_URL,
  jwtSecret: parsed.data.JWT_SECRET,
  jwtIssuer: parsed.data.JWT_ISSUER,
  jwtAudience: parsed.data.JWT_AUDIENCE,
  accessTokenTtlMinutes: parsed.data.ACCESS_TOKEN_TTL_MINUTES,
  refreshTokenTtlDays: parsed.data.REFRESH_TOKEN_TTL_DAYS,
  adminWebOrigin: parsed.data.ADMIN_WEB_ORIGIN,
  otpProvider: parsed.data.OTP_PROVIDER,
  mapsProvider: parsed.data.MAPS_PROVIDER,
  pushProvider: parsed.data.PUSH_PROVIDER,
  fileStorageProvider: parsed.data.FILE_STORAGE_PROVIDER,
  mockOtpCode: parsed.data.MOCK_OTP_CODE,
  rateLimitWindowMs: parsed.data.RATE_LIMIT_WINDOW_MS,
  rateLimitMaxRequests: parsed.data.RATE_LIMIT_MAX_REQUESTS,
  authRateLimitMaxRequests: parsed.data.AUTH_RATE_LIMIT_MAX_REQUESTS,
  isProduction: parsed.data.NODE_ENV === "production",
  isTest: parsed.data.NODE_ENV === "test",
};
