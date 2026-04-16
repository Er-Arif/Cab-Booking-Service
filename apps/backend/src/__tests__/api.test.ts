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

  async function authenticate(phone: string, role: "customer" | "driver" | "admin") {
    await request(app).post("/api/auth/send-otp").send({ phone, role }).expect(200);
    const response = await request(app).post("/api/auth/verify-otp").send({
      phone,
      otp: "123456",
      role,
    }).expect(200);

    return response.body as {
      accessToken: string;
      refreshToken: string;
      userId: string;
      role: string;
    };
  }

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

  it("scopes ride access and active ride endpoints by principal", async () => {
    const customerAuth = await authenticate("9000000002", "customer");
    const driverAuth = await authenticate("9000000003", "driver");
    const adminAuth = await authenticate("9000000001", "admin");

    const rideCreation = await request(app)
      .post("/api/rides")
      .set("Authorization", `Bearer ${customerAuth.accessToken}`)
      .send({
        categoryKey: "bike",
        pickupAddress: "Bus Stand",
        dropAddress: "Hospital Area",
        pickup: { latitude: 24.2712, longitude: 86.6463 },
        drop: { latitude: 24.2699, longitude: 86.6449 },
        paymentMethod: "upi",
      })
      .expect(201);

    const rideId = rideCreation.body.ride.id as string;

    const customerRides = await request(app)
      .get("/api/rides")
      .set("Authorization", `Bearer ${customerAuth.accessToken}`)
      .expect(200);
    const driverRides = await request(app)
      .get("/api/rides")
      .set("Authorization", `Bearer ${driverAuth.accessToken}`)
      .expect(200);
    const adminRides = await request(app)
      .get("/api/rides")
      .set("Authorization", `Bearer ${adminAuth.accessToken}`)
      .expect(200);

    expect(customerRides.body.some((ride: { id: string }) => ride.id === rideId)).toBe(true);
    expect(driverRides.body.some((ride: { id: string }) => ride.id === rideId)).toBe(true);
    expect(adminRides.body.some((ride: { id: string }) => ride.id === rideId)).toBe(true);

    const customerActiveRide = await request(app)
      .get("/api/customer/active-ride")
      .set("Authorization", `Bearer ${customerAuth.accessToken}`)
      .expect(200);
    const driverActiveRide = await request(app)
      .get("/api/driver/active-ride")
      .set("Authorization", `Bearer ${driverAuth.accessToken}`)
      .expect(200);

    expect(customerActiveRide.body.id).toBe(rideId);
    expect(driverActiveRide.body.id).toBe(rideId);
  });

  it("allows admin fare and driver verification updates", async () => {
    const adminAuth = await authenticate("9000000001", "admin");

    const drivers = await request(app)
      .get("/api/admin/drivers")
      .set("Authorization", `Bearer ${adminAuth.accessToken}`)
      .expect(200);
    const categories = await request(app)
      .get("/api/admin/categories")
      .set("Authorization", `Bearer ${adminAuth.accessToken}`)
      .expect(200);

    const updatedDriver = await request(app)
      .patch(`/api/admin/drivers/${drivers.body[0].id}/status`)
      .set("Authorization", `Bearer ${adminAuth.accessToken}`)
      .send({ status: "suspended" })
      .expect(200);

    expect(updatedDriver.body.status).toBe("suspended");

    const updatedCategory = await request(app)
      .patch(`/api/admin/categories/${categories.body[0].id}`)
      .set("Authorization", `Bearer ${adminAuth.accessToken}`)
      .send({
        baseFare: 42,
        minimumFare: 45,
        perKmRate: 13,
        perMinuteRate: 2,
        waitingCharge: 3,
        cancellationFee: 10,
      })
      .expect(200);

    expect(updatedCategory.body.baseFare).toBe(42);
    expect(updatedCategory.body.minimumFare).toBe(45);
  });
});
