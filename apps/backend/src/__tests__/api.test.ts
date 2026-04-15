import { beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { newDb } from "pg-mem";

describe("Madhupur backend API", () => {
  let app: Awaited<ReturnType<typeof import("../app").createApp>>["app"];

  beforeAll(async () => {
    const db = newDb({ autoCreateForeignKeyIndices: true });
    const adapter = db.adapters.createPg();
    const pool = new adapter.Pool();

    const appModule = await import("../app");
    const built = await appModule.createApp({ db: pool, bootstrap: true });
    app = built.app;
  });

  it("authenticates a customer with OTP and returns access and refresh tokens", async () => {
    await request(app).post("/api/auth/send-otp").send({
      phone: "9000000002",
      role: "customer",
    }).expect(200);

    const verifyResponse = await request(app).post("/api/auth/verify-otp").send({
      phone: "9000000002",
      otp: "123456",
      role: "customer",
    }).expect(200);

    expect(verifyResponse.body.accessToken).toBeTruthy();
    expect(verifyResponse.body.refreshToken).toBeTruthy();
  });

  it("runs the full happy-path ride flow and records payment", async () => {
    await request(app).post("/api/auth/send-otp").send({ phone: "9000000002", role: "customer" });
    await request(app).post("/api/auth/send-otp").send({ phone: "9000000003", role: "driver" });
    await request(app).post("/api/auth/send-otp").send({ phone: "9000000001", role: "admin" });

    const customerAuth = await request(app).post("/api/auth/verify-otp").send({
      phone: "9000000002",
      otp: "123456",
      role: "customer",
    });
    const driverAuth = await request(app).post("/api/auth/verify-otp").send({
      phone: "9000000003",
      otp: "123456",
      role: "driver",
    });
    const adminAuth = await request(app).post("/api/auth/verify-otp").send({
      phone: "9000000001",
      otp: "123456",
      role: "admin",
    });

    const rideCreation = await request(app)
      .post("/api/rides")
      .set("Authorization", `Bearer ${customerAuth.body.accessToken}`)
      .send({
        categoryKey: "bike",
        pickupAddress: "Madhupur Railway Station",
        dropAddress: "Main Market",
        pickup: { latitude: 24.2733, longitude: 86.6467 },
        drop: { latitude: 24.2714, longitude: 86.6395 },
        paymentMethod: "cash",
      })
      .expect(201);

    const rideId = rideCreation.body.ride.id as string;
    expect(rideCreation.body.assignedDriver.id).toBeTruthy();

    for (const status of ["driver_arriving", "driver_arrived", "trip_started", "trip_completed"]) {
      await request(app)
        .patch(`/api/rides/${rideId}/status`)
        .set("Authorization", `Bearer ${driverAuth.body.accessToken}`)
        .send({ status })
        .expect(200);
    }

    const payment = await request(app)
      .patch(`/api/rides/${rideId}/payment`)
      .set("Authorization", `Bearer ${driverAuth.body.accessToken}`)
      .send({})
      .expect(200);

    expect(payment.body.driverEarning).toBeGreaterThan(0);
    expect(payment.body.platformCommission).toBeGreaterThan(0);

    const dashboard = await request(app)
      .get("/api/admin/dashboard")
      .set("Authorization", `Bearer ${adminAuth.body.accessToken}`)
      .expect(200);

    expect(dashboard.body.metrics.totalRidesToday).toBeGreaterThan(0);
  });

  it("creates and resolves a complaint", async () => {
    await request(app).post("/api/auth/send-otp").send({ phone: "9000000002", role: "customer" });
    await request(app).post("/api/auth/send-otp").send({ phone: "9000000001", role: "admin" });

    const customerAuth = await request(app).post("/api/auth/verify-otp").send({
      phone: "9000000002",
      otp: "123456",
      role: "customer",
    });
    const adminAuth = await request(app).post("/api/auth/verify-otp").send({
      phone: "9000000001",
      otp: "123456",
      role: "admin",
    });

    const rides = await request(app)
      .get("/api/customer/rides/history")
      .set("Authorization", `Bearer ${customerAuth.body.accessToken}`)
      .expect(200);

    const complaint = await request(app)
      .post("/api/customer/complaints")
      .set("Authorization", `Bearer ${customerAuth.body.accessToken}`)
      .send({
        rideId: rides.body[0].id,
        complaintType: "overcharge",
        description: "Need fare clarification for this ride.",
      })
      .expect(201);

    const resolved = await request(app)
      .patch(`/api/admin/complaints/${complaint.body.id}`)
      .set("Authorization", `Bearer ${adminAuth.body.accessToken}`)
      .send({
        resolutionStatus: "resolved",
        resolutionNote: "Fare verified and clarified to customer.",
      })
      .expect(200);

    expect(resolved.body.resolutionStatus).toBe("resolved");
  });
});
