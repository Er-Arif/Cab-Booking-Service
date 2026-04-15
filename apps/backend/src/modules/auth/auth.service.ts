import crypto from "crypto";

import { env } from "../../config/env";
import { PlatformRepository } from "../../db/repository";
import type { OtpProvider } from "../../domain/providers/types";
import { AuthenticationError, NotFoundError } from "../../lib/errors";
import { signAccessToken, signRefreshToken, verifyToken } from "../common/auth";
import { addDays, addMinutes } from "../common/date";

export class AuthService {
  constructor(
    private readonly otpProvider: OtpProvider,
    private readonly repository: PlatformRepository
  ) {}

  async sendOtp(phone: string, role: "customer" | "driver" | "admin") {
    const { requestId, code } = await this.otpProvider.sendOtp(phone);
    await this.repository.createOtpRequest(phone, role, code, addMinutes(new Date(), 10));
    return { requestId };
  }

  async verifyOtp(phone: string, otp: string, role: "customer" | "driver" | "admin") {
    const isValid = await this.repository.consumeOtpRequest(phone, role, otp);
    if (!isValid) {
      throw new AuthenticationError("Invalid or expired OTP");
    }

    const principal = await this.resolvePrincipal(phone, role);
    const sessionId = crypto.randomUUID();
    const accessToken = signAccessToken({
      id: principal.id,
      phone,
      role,
    });
    const refreshToken = signRefreshToken({
      id: principal.id,
      phone,
      role,
      sessionId,
    });

    await this.repository.createRefreshToken(principal.id, role, sessionId, addDays(new Date(), env.refreshTokenTtlDays));

    return {
      token: accessToken,
      accessToken,
      refreshToken,
      role,
      userId: principal.id,
    };
  }

  async refreshSession(refreshToken: string) {
    const decoded = verifyToken(refreshToken);
    if (decoded.tokenType !== "refresh" || !decoded.sessionId) {
      throw new AuthenticationError("Refresh token required");
    }

    const session = await this.repository.getRefreshToken(decoded.sessionId);
    if (!session || session.revoked_at || new Date(session.expires_at).getTime() < Date.now()) {
      throw new AuthenticationError("Refresh token expired or revoked");
    }

    const accessToken = signAccessToken({
      id: decoded.id,
      phone: decoded.phone,
      role: decoded.role,
    });

    return { accessToken };
  }

  async logout(refreshToken: string) {
    const decoded = verifyToken(refreshToken);
    if (decoded.sessionId) {
      await this.repository.revokeRefreshToken(decoded.sessionId);
    }
    return { success: true };
  }

  private async resolvePrincipal(phone: string, role: "customer" | "driver" | "admin") {
    if (role === "customer") {
      return this.repository.findOrCreateCustomerByPhone(phone);
    }

    if (role === "driver") {
      const driver = await this.repository.findDriverByPhone(phone);
      if (!driver) {
        throw new NotFoundError("Driver account not found");
      }
      return driver;
    }

    const admin = await this.repository.findAdminByPhone(phone);
    if (!admin) {
      throw new NotFoundError("Admin account not found");
    }
    return admin;
  }
}
