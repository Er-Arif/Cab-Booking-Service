import { seededAdmin } from "data/seed";
import type { OtpProvider } from "domain/providers/types";
import { signJwt } from "modules/common/auth";
import { store } from "modules/common/store";

export class AuthService {
  constructor(private readonly otpProvider: OtpProvider) {}

  async sendOtp(phone: string) {
    return this.otpProvider.sendOtp(phone);
  }

  async verifyOtp(phone: string, otp: string, role: "customer" | "driver" | "admin") {
    const isValid = await this.otpProvider.verifyOtp(phone, otp);
    if (!isValid) {
      throw new Error("Invalid OTP");
    }

    const userId =
      role === "customer"
        ? (store.customers.find((item) => item.phone === phone) ?? store.customers[0]).id
        : role === "driver"
          ? (store.drivers.find((item) => item.phone === phone) ?? store.drivers[0]).id
          : seededAdmin.id;

    return {
      token: signJwt({ id: userId, phone, role }),
      role,
      userId,
    };
  }
}
